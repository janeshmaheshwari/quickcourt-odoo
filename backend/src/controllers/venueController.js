import asyncHandler from "express-async-handler";
import Facility from "../models/Facility.js";
import Court from "../models/Court.js";
import Booking from "../models/Booking.js"; // Added missing import for Booking

// @desc    List all approved venues
// @route   GET /api/venues
// @access  Public
export const listVenues = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sortBy = req.query.sortBy || "createdAt";
  const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

  const query = { isApproved: true };

  const totalVenues = await Facility.countDocuments(query);
  const totalPages = Math.ceil(totalVenues / limit);

  const venues = await Facility.find(query)
    .populate("owner", "name email")
    .sort({ [sortBy]: sortOrder })
    .limit(limit)
    .skip((page - 1) * limit);

  res.json({
    venues,
    pagination: {
      currentPage: page,
      totalPages,
      totalVenues,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  });
});

// @desc    Search venues with advanced filters
// @route   GET /api/venues/search
// @access  Public
export const searchVenues = asyncHandler(async (req, res) => {
  const {
    sport,
    price,
    type,
    location,
    amenities,
    rating,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc"
  } = req.query;

  const query = { isApproved: true };

  // Sport filter
  if (sport) {
    query.sports = { $in: [sport] };
  }

  // Price filter
  if (price) {
    query.pricePerHour = { $lte: parseFloat(price) };
  }

  // Type filter (indoor/outdoor)
  if (type) {
    query.type = type;
  }

  // Location filter (case-insensitive search)
  if (location) {
    query.location = { $regex: location, $options: "i" };
  }

  // Amenities filter
  if (amenities) {
    const amenitiesArray = amenities.split(",").map(a => a.trim());
    query.amenities = { $in: amenitiesArray };
  }

  // Rating filter (if you implement rating system)
  if (rating) {
    query.rating = { $gte: parseFloat(rating) };
  }

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const totalVenues = await Facility.countDocuments(query);
  const totalPages = Math.ceil(totalVenues / limitNum);

  const venues = await Facility.find(query)
    .populate("owner", "name email")
    .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
    .limit(limitNum)
    .skip((pageNum - 1) * limitNum);

  res.json({
    venues,
    filters: {
      sport,
      price,
      type,
      location,
      amenities,
      rating
    },
    pagination: {
      currentPage: pageNum,
      totalPages,
      totalVenues,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1
    }
  });
});

// @desc    Get venue by ID with detailed information
// @route   GET /api/venues/:id
// @access  Public
export const getVenueById = asyncHandler(async (req, res) => {
  const venue = await Facility.findById(req.params.id)
    .populate("owner", "name email")
    .populate("courts");

  if (!venue) {
    res.status(404);
    throw new Error("Venue not found");
  }

  if (!venue.isApproved) {
    res.status(404);
    throw new Error("Venue not found");
  }

  // Get courts for this venue
  const courts = await Court.find({ facility: venue._id });

  // Get booking statistics for this venue
  const totalBookings = await Booking.countDocuments({ facility: venue._id });
  const completedBookings = await Booking.countDocuments({ 
    facility: venue._id, 
    status: "Completed" 
  });

  const venueData = {
    ...venue.toObject(),
    courts,
    stats: {
      totalBookings,
      completedBookings,
      completionRate: totalBookings > 0 ? (completedBookings / totalBookings * 100).toFixed(1) : 0
    }
  };

  res.json(venueData);
});

// @desc    Get venues by location (nearby search)
// @route   GET /api/venues/nearby
// @access  Public
export const getNearbyVenues = asyncHandler(async (req, res) => {
  const { latitude, longitude, radius = 10, limit = 10 } = req.query;

  if (!latitude || !longitude) {
    res.status(400);
    throw new Error("Latitude and longitude are required");
  }

  // Simple distance calculation (you might want to use geospatial queries for production)
  const venues = await Facility.find({ isApproved: true })
    .populate("owner", "name email")
    .limit(parseInt(limit));

  // Filter venues within radius (simplified - you'd use $geoNear in production)
  const nearbyVenues = venues.filter(venue => {
    // This is a simplified distance calculation
    // In production, use MongoDB's geospatial queries
    return true; // Placeholder for actual distance calculation
  });

  res.json({
    venues: nearbyVenues,
    searchParams: {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      radius: parseFloat(radius)
    }
  });
});

// @desc    Get popular venues
// @route   GET /api/venues/popular
// @access  Public
export const getPopularVenues = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;

  // Get venues with most bookings
  const popularVenues = await Facility.aggregate([
    { $match: { isApproved: true } },
    {
      $lookup: {
        from: "bookings",
        localField: "_id",
        foreignField: "facility",
        as: "bookings"
      }
    },
    {
      $addFields: {
        bookingCount: { $size: "$bookings" }
      }
    },
    { $sort: { bookingCount: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner"
      }
    },
    { $unwind: "$owner" },
    {
      $project: {
        _id: 1,
        name: 1,
        location: 1,
        description: 1,
        sports: 1,
        amenities: 1,
        images: 1,
        pricePerHour: 1,
        type: 1,
        bookingCount: 1,
        owner: {
          _id: "$owner._id",
          name: "$owner.name",
          email: "$owner.email"
        }
      }
    }
  ]);

  res.json({
    venues: popularVenues,
    total: popularVenues.length
  });
});

// @desc    Get trending venues
// @route   GET /api/venues/trending
// @access  Public
export const getTrendingVenues = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const days = parseInt(req.query.days) || 7;

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // Get venues with recent bookings
  const trendingVenues = await Facility.aggregate([
    { $match: { isApproved: true } },
    {
      $lookup: {
        from: "bookings",
        localField: "_id",
        foreignField: "facility",
        as: "recentBookings"
      }
    },
    {
      $addFields: {
        recentBookings: {
          $filter: {
            input: "$recentBookings",
            as: "booking",
            cond: { $gte: ["$$booking.createdAt", startDate] }
          }
        }
      }
    },
    {
      $addFields: {
        recentBookingCount: { $size: "$recentBookings" }
      }
    },
    { $sort: { recentBookingCount: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner"
      }
    },
    { $unwind: "$owner" },
    {
      $project: {
        _id: 1,
        name: 1,
        location: 1,
        description: 1,
        sports: 1,
        amenities: 1,
        images: 1,
        pricePerHour: 1,
        type: 1,
        recentBookingCount: 1,
        owner: {
          _id: "$owner._id",
          name: "$owner.name",
          email: "$owner.email"
        }
      }
    }
  ]);

  res.json({
    venues: trendingVenues,
    period: `${days} days`,
    total: trendingVenues.length
  });
});

// @desc    Get venue categories/sports
// @route   GET /api/venues/categories
// @access  Public
export const getVenueCategories = asyncHandler(async (req, res) => {
  const categories = await Facility.aggregate([
    { $match: { isApproved: true } },
    { $unwind: "$sports" },
    {
      $group: {
        _id: "$sports",
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } }
  ]);

  res.json({
    categories: categories.map(cat => ({
      sport: cat._id,
      venueCount: cat.count
    }))
  });
});

// @desc    Get venue amenities
// @route   GET /api/venues/amenities
// @access  Public
export const getVenueAmenities = asyncHandler(async (req, res) => {
  const amenities = await Facility.aggregate([
    { $match: { isApproved: true } },
    { $unwind: "$amenities" },
    {
      $group: {
        _id: "$amenities",
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } }
  ]);

  res.json({
    amenities: amenities.map(amenity => ({
      name: amenity._id,
      venueCount: amenity.count
    }))
  });
});
