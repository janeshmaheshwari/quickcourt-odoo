import asyncHandler from "express-async-handler";
import Facility from "../models/Facility.js";
import Court from "../models/Court.js";
import Booking from "../models/Booking.js";

// @desc    Add new facility
// @route   POST /api/owner/facilities
// @access  Private (Owner only)
export const addFacility = asyncHandler(async (req, res) => {
  const facility = await Facility.create({
    ...req.body,
    owner: req.user._id,
    isApproved: false
  });
  
  const populatedFacility = await Facility.findById(facility._id).populate("owner", "name email");
  res.status(201).json(populatedFacility);
});

// @desc    Get owner's facilities
// @route   GET /api/owner/facilities
// @access  Private (Owner only)
export const getOwnerFacilities = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const status = req.query.status;

  const query = { owner: req.user._id };
  if (status) {
    query.isApproved = status === "approved";
  }

  const totalFacilities = await Facility.countDocuments(query);
  const totalPages = Math.ceil(totalFacilities / limit);

  const facilities = await Facility.find(query)
    .populate("owner", "name email")
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip((page - 1) * limit);

  res.json({
    facilities,
    pagination: {
      currentPage: page,
      totalPages,
      totalFacilities,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  });
});

// @desc    Get specific facility
// @route   GET /api/owner/facilities/:id
// @access  Private (Owner only)
export const getOwnerFacilityById = asyncHandler(async (req, res) => {
  const facility = await Facility.findOne({
    _id: req.params.id,
    owner: req.user._id
  }).populate("owner", "name email");

  if (!facility) {
    res.status(404);
    throw new Error("Facility not found");
  }

  res.json(facility);
});

// @desc    Update facility
// @route   PUT /api/owner/facilities/:id
// @access  Private (Owner only)
export const updateFacility = asyncHandler(async (req, res) => {
  const facility = await Facility.findById(req.params.id);
  
  if (!facility) {
    res.status(404);
    throw new Error("Facility not found");
  }
  
  if (facility.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to update this facility");
  }

  // Reset approval status when updating
  req.body.isApproved = false;
  
  Object.assign(facility, req.body);
  await facility.save();
  
  const updatedFacility = await Facility.findById(facility._id).populate("owner", "name email");
  res.json(updatedFacility);
});

// @desc    Delete facility
// @route   DELETE /api/owner/facilities/:id
// @access  Private (Owner only)
export const deleteFacility = asyncHandler(async (req, res) => {
  const facility = await Facility.findById(req.params.id);
  
  if (!facility) {
    res.status(404);
    throw new Error("Facility not found");
  }
  
  if (facility.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to delete this facility");
  }

  // Check if facility has active bookings
  const activeBookings = await Booking.find({
    facility: req.params.id,
    status: { $in: ["Confirmed", "Completed"] }
  });

  if (activeBookings.length > 0) {
    res.status(400);
    throw new Error("Cannot delete facility with active bookings. Please handle all bookings first.");
  }

  // Delete associated courts
  await Court.deleteMany({ facility: req.params.id });
  
  // Delete the facility
  await Facility.findByIdAndDelete(req.params.id);
  
  res.json({ message: "Facility deleted successfully" });
});

// @desc    Add new court
// @route   POST /api/owner/courts
// @access  Private (Owner only)
export const addCourt = asyncHandler(async (req, res) => {
  // Verify the facility belongs to the owner
  const facility = await Facility.findOne({
    _id: req.body.facility,
    owner: req.user._id
  });

  if (!facility) {
    res.status(403);
    throw new Error("Not authorized to add court to this facility");
  }

  const court = await Court.create(req.body);
  const populatedCourt = await Court.findById(court._id).populate("facility", "name");
  
  res.status(201).json(populatedCourt);
});

// @desc    Get owner's courts
// @route   GET /api/owner/courts
// @access  Private (Owner only)
export const getOwnerCourts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const facilityId = req.query.facility;

  // Get facilities owned by the user
  const userFacilities = await Facility.find({ owner: req.user._id }).select("_id");
  const facilityIds = userFacilities.map(f => f._id);

  const query = { facility: { $in: facilityIds } };
  if (facilityId) {
    query.facility = facilityId;
  }

  const totalCourts = await Court.countDocuments(query);
  const totalPages = Math.ceil(totalCourts / limit);

  const courts = await Court.find(query)
    .populate("facility", "name location")
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip((page - 1) * limit);

  res.json({
    courts,
    pagination: {
      currentPage: page,
      totalPages,
      totalCourts,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  });
});

// @desc    Get specific court
// @route   GET /api/owner/courts/:id
// @access  Private (Owner only)
export const getOwnerCourtById = asyncHandler(async (req, res) => {
  const court = await Court.findById(req.params.id).populate("facility", "name location owner");
  
  if (!court) {
    res.status(404);
    throw new Error("Court not found");
  }

  // Verify the court belongs to a facility owned by the user
  if (court.facility.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to access this court");
  }

  res.json(court);
});

// @desc    Update court
// @route   PUT /api/owner/courts/:id
// @access  Private (Owner only)
export const updateCourt = asyncHandler(async (req, res) => {
  const court = await Court.findById(req.params.id).populate("facility", "owner");
  
  if (!court) {
    res.status(404);
    throw new Error("Court not found");
  }

  if (court.facility.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to update this court");
  }

  Object.assign(court, req.body);
  await court.save();
  
  const updatedCourt = await Court.findById(court._id).populate("facility", "name location");
  res.json(updatedCourt);
});

// @desc    Delete court
// @route   DELETE /api/owner/courts/:id
// @access  Private (Owner only)
export const deleteCourt = asyncHandler(async (req, res) => {
  const court = await Court.findById(req.params.id).populate("facility", "owner");
  
  if (!court) {
    res.status(404);
    throw new Error("Court not found");
  }

  if (court.facility.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to delete this court");
  }

  // Check if court has active bookings
  const activeBookings = await Booking.find({
    court: req.params.id,
    status: { $in: ["Confirmed", "Completed"] }
  });

  if (activeBookings.length > 0) {
    res.status(400);
    throw new Error("Cannot delete court with active bookings. Please handle all bookings first.");
  }

  await Court.findByIdAndDelete(req.params.id);
  res.json({ message: "Court deleted successfully" });
});

// @desc    Set court availability
// @route   PUT /api/owner/courts/:id/availability
// @access  Private (Owner only)
export const setCourtAvailability = asyncHandler(async (req, res) => {
  const { availability } = req.body;
  
  if (!availability || !Array.isArray(availability)) {
    res.status(400);
    throw new Error("Availability array is required");
  }

  const court = await Court.findById(req.params.id).populate("facility", "owner");
  
  if (!court) {
    res.status(404);
    throw new Error("Court not found");
  }

  if (court.facility.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to update this court");
  }

  court.availability = availability;
  await court.save();
  
  res.json({ 
    message: "Availability updated successfully",
    availability: court.availability
  });
});

// @desc    Get owner bookings
// @route   GET /api/owner/bookings
// @access  Private (Owner only)
export const getOwnerBookings = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const status = req.query.status;
  const facilityId = req.query.facility;

  // Get facilities owned by the user
  const userFacilities = await Facility.find({ owner: req.user._id }).select("_id");
  const facilityIds = userFacilities.map(f => f._id);

  const query = { facility: { $in: facilityIds } };
  if (status) {
    query.status = status;
  }
  if (facilityId) {
    query.facility = facilityId;
  }

  const totalBookings = await Booking.countDocuments(query);
  const totalPages = Math.ceil(totalBookings / limit);

  const bookings = await Booking.find(query)
    .populate("court", "name sport")
    .populate("facility", "name location")
    .populate("user", "name email")
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

// @desc    Update booking status
// @route   PUT /api/owner/bookings/:id/status
// @access  Private (Owner only)
export const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  
  if (!status || !["Confirmed", "Cancelled", "Completed"].includes(status)) {
    res.status(400);
    throw new Error("Valid status is required: Confirmed, Cancelled, or Completed");
  }

  const booking = await Booking.findById(req.params.id).populate("facility", "owner");
  
  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  if (booking.facility.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to update this booking");
  }

  booking.status = status;
  await booking.save();
  
  res.json({ 
    message: "Booking status updated successfully",
    status: booking.status
  });
});

// @desc    Get owner dashboard stats
// @route   GET /api/owner/dashboard
// @access  Private (Owner only)
export const getOwnerDashboard = asyncHandler(async (req, res) => {
  // Get facilities owned by the user
  const userFacilities = await Facility.find({ owner: req.user._id }).select("_id");
  const facilityIds = userFacilities.map(f => f._id);

  // Get total courts
  const totalCourts = await Court.countDocuments({ facility: { $in: facilityIds } });

  // Get total bookings
  const totalBookings = await Booking.countDocuments({ facility: { $in: facilityIds } });

  // Get recent bookings
  const recentBookings = await Booking.find({ facility: { $in: facilityIds } })
    .populate("court", "name sport")
    .populate("facility", "name")
    .populate("user", "name")
    .sort({ createdAt: -1 })
    .limit(5);

  // Get revenue (sum of completed bookings)
  const revenue = await Booking.aggregate([
    { $match: { facility: { $in: facilityIds }, status: "Completed" } },
    { $group: { _id: null, total: { $sum: "$totalPrice" } } }
  ]);

  res.json({
    totalFacilities: userFacilities.length,
    totalCourts,
    totalBookings,
    totalRevenue: revenue[0]?.total || 0,
    recentBookings
  });
});
