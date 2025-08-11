import asyncHandler from "express-async-handler";
import Booking from "../models/Booking.js";
import Court from "../models/Court.js";
import Facility from "../models/Facility.js";

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = asyncHandler(async (req, res) => {
  const { courtId, facilityId, date, startTime, endTime } = req.body;

  // Validate required fields
  if (!courtId || !facilityId || !date || !startTime || !endTime) {
    res.status(400);
    throw new Error("All fields are required: courtId, facilityId, date, startTime, endTime");
  }

  // Check if court exists and belongs to the facility
  const court = await Court.findById(courtId).populate("facility");
  if (!court) {
    res.status(404);
    throw new Error("Court not found");
  }

  if (court.facility._id.toString() !== facilityId) {
    res.status(400);
    throw new Error("Court does not belong to the specified facility");
  }

  // Check if facility is approved
  if (!court.facility.isApproved) {
    res.status(400);
    throw new Error("Facility is not yet approved");
  }

  // Check if the date is in the future
  const bookingDate = new Date(date);
  const now = new Date();
  if (bookingDate <= now) {
    res.status(400);
    throw new Error("Booking date must be in the future");
  }

  // Check if time slot is available
  const conflictingBooking = await Booking.findOne({
    court: courtId,
    date: bookingDate,
    status: { $in: ["Confirmed", "Completed"] },
    $or: [
      {
        startTime: { $lt: endTime },
        endTime: { $gt: startTime }
      }
    ]
  });

  if (conflictingBooking) {
    res.status(400);
    throw new Error("Time slot is already booked");
  }

  // Calculate total price
  const startHour = parseInt(startTime.split(":")[0]);
  const endHour = parseInt(endTime.split(":")[0]);
  const duration = endHour - startHour;
  const totalPrice = court.pricePerHour * duration;

  // Create booking
  const booking = await Booking.create({
    court: courtId,
    facility: facilityId,
    user: req.user._id,
    owner: court.facility.owner,
    date: bookingDate,
    startTime,
    endTime,
    totalPrice,
    status: "Confirmed"
  });

  const populatedBooking = await Booking.findById(booking._id)
    .populate("court", "name sport")
    .populate("facility", "name location")
    .populate("user", "name email")
    .populate("owner", "name email");

  res.status(201).json({
    message: "Booking created successfully",
    booking: populatedBooking
  });
});

// @desc    Get all bookings (for admin/owner)
// @route   GET /api/bookings
// @access  Private
export const getAllBookings = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const status = req.query.status;
  const facilityId = req.query.facility;
  const userId = req.query.user;

  const query = {};
  if (status) query.status = status;
  if (facilityId) query.facility = facilityId;
  if (userId) query.user = userId;

  const totalBookings = await Booking.countDocuments(query);
  const totalPages = Math.ceil(totalBookings / limit);

  const bookings = await Booking.find(query)
    .populate("court", "name sport")
    .populate("facility", "name location")
    .populate("user", "name email")
    .populate("owner", "name email")
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip((page - 1) * limit);

  res.json({
    bookings,
    pagination: {
      currentPage: page,
      totalPages,
      totalBookings,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  });
});

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
export const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate("court", "name sport")
    .populate("facility", "name location")
    .populate("user", "name email")
    .populate("owner", "name email");

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  // Check if user has access to this booking
  if (req.user.role !== "admin" && 
      req.user.role !== "owner" && 
      booking.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to access this booking");
  }

  res.json(booking);
});

// @desc    Update booking
// @route   PUT /api/bookings/:id
// @access  Private (Admin/Owner only)
export const updateBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate("facility", "owner");
  
  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  // Check authorization
  if (req.user.role !== "admin" && 
      booking.facility.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to update this booking");
  }

  // Update allowed fields
  const allowedUpdates = ["startTime", "endTime", "date", "status"];
  const updates = {};
  
  allowedUpdates.forEach(field => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  // If updating time/date, check for conflicts
  if (updates.startTime || updates.endTime || updates.date) {
    const startTime = updates.startTime || booking.startTime;
    const endTime = updates.endTime || booking.endTime;
    const date = updates.date || booking.date;

    const conflictingBooking = await Booking.findOne({
      _id: { $ne: req.params.id },
      court: booking.court,
      date: date,
      status: { $in: ["Confirmed", "Completed"] },
      $or: [
        {
          startTime: { $lt: endTime },
          endTime: { $gt: startTime }
        }
      ]
    });

    if (conflictingBooking) {
      res.status(400);
      throw new Error("Time slot conflicts with existing booking");
    }
  }

  Object.assign(booking, updates);
  await booking.save();

  const updatedBooking = await Booking.findById(booking._id)
    .populate("court", "name sport")
    .populate("facility", "name location")
    .populate("user", "name email")
    .populate("owner", "name email");

  res.json({
    message: "Booking updated successfully",
    booking: updatedBooking
  });
});

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  
  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  // Check if user can cancel this booking
  if (req.user.role !== "admin" && 
      req.user.role !== "owner" && 
      booking.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to cancel this booking");
  }

  if (booking.status === "Cancelled") {
    res.status(400);
    throw new Error("Booking is already cancelled");
  }

  if (booking.status === "Completed") {
    res.status(400);
    throw new Error("Cannot cancel completed booking");
  }

  // Check cancellation policy (24 hours before)
  const bookingDate = new Date(booking.date);
  const now = new Date();
  const hoursUntilBooking = (bookingDate - now) / (1000 * 60 * 60);

  if (hoursUntilBooking < 24) {
    res.status(400);
    throw new Error("Cannot cancel booking within 24 hours of scheduled time");
  }

  booking.status = "Cancelled";
  await booking.save();

  res.json({ message: "Booking cancelled successfully" });
});

// @desc    Complete booking
// @route   PUT /api/bookings/:id/complete
// @access  Private (Owner/Admin only)
export const completeBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate("facility", "owner");
  
  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  // Check authorization
  if (req.user.role !== "admin" && 
      booking.facility.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to complete this booking");
  }

  if (booking.status === "Completed") {
    res.status(400);
    throw new Error("Booking is already completed");
  }

  if (booking.status === "Cancelled") {
    res.status(400);
    throw new Error("Cannot complete cancelled booking");
  }

  booking.status = "Completed";
  await booking.save();

  res.json({ message: "Booking marked as completed" });
});

// @desc    Get booking statistics
// @route   GET /api/bookings/stats
// @access  Private (Admin/Owner)
export const getBookingStats = asyncHandler(async (req, res) => {
  let query = {};
  
  // If owner, only show their facilities
  if (req.user.role === "owner") {
    const userFacilities = await Facility.find({ owner: req.user._id }).select("_id");
    const facilityIds = userFacilities.map(f => f._id);
    query.facility = { $in: facilityIds };
  }

  const totalBookings = await Booking.countDocuments(query);
  const confirmedBookings = await Booking.countDocuments({ ...query, status: "Confirmed" });
  const completedBookings = await Booking.countDocuments({ ...query, status: "Completed" });
  const cancelledBookings = await Booking.countDocuments({ ...query, status: "Cancelled" });

  // Calculate revenue
  const revenue = await Booking.aggregate([
    { $match: { ...query, status: "Completed" } },
    { $group: { _id: null, total: { $sum: "$totalPrice" } } }
  ]);

  // Get recent bookings
  const recentBookings = await Booking.find(query)
    .populate("court", "name sport")
    .populate("facility", "name")
    .populate("user", "name")
    .sort({ createdAt: -1 })
    .limit(5);

  res.json({
    totalBookings,
    confirmedBookings,
    completedBookings,
    cancelledBookings,
    totalRevenue: revenue[0]?.total || 0,
    recentBookings
  });
});

// @desc    Check court availability
// @route   GET /api/bookings/availability/:courtId
// @access  Public
export const checkCourtAvailability = asyncHandler(async (req, res) => {
  const { courtId } = req.params;
  const { date } = req.query;

  if (!date) {
    res.status(400);
    throw new Error("Date parameter is required");
  }

  const court = await Court.findById(courtId).populate("facility");
  if (!court) {
    res.status(404);
    throw new Error("Court not found");
  }

  if (!court.facility.isApproved) {
    res.status(400);
    throw new Error("Facility is not approved");
  }

  const queryDate = new Date(date);
  const existingBookings = await Booking.find({
    court: courtId,
    date: queryDate,
    status: { $in: ["Confirmed", "Completed"] }
  }).sort({ startTime: 1 });

  // Generate available time slots
  const availableSlots = [];
  const startHour = 6; // 6 AM
  const endHour = 22; // 10 PM

  for (let hour = startHour; hour < endHour; hour++) {
    const timeSlot = `${hour.toString().padStart(2, '0')}:00`;
    const nextHour = `${(hour + 1).toString().padStart(2, '0')}:00`;
    
    // Check if this slot conflicts with existing bookings
    const isAvailable = !existingBookings.some(booking => {
      return (timeSlot >= booking.startTime && timeSlot < booking.endTime) ||
             (nextHour > booking.startTime && nextHour <= booking.endTime);
    });

    if (isAvailable) {
      availableSlots.push({
        startTime: timeSlot,
        endTime: nextHour,
        price: court.pricePerHour
      });
    }
  }

  res.json({
    court: {
      id: court._id,
      name: court.name,
      sport: court.sport,
      pricePerHour: court.pricePerHour
    },
    facility: {
      id: court.facility._id,
      name: court.facility.name
    },
    date: date,
    availableSlots,
    existingBookings: existingBookings.map(booking => ({
      startTime: booking.startTime,
      endTime: booking.endTime,
      status: booking.status
    }))
  });
});
