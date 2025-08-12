import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import axios from "axios";

// Dummy venues data
const DUMMY_VENUES = [
  
  {
    _id: "2",
    name: "Champions Football Ground",
    location: "Sports City, Zone A",
    sportType: "Football",
    pricePerHour: 1200,
    rating: 4.7,
    images: ["https://images.unsplash.com/photo-1459865264687-595d652de67e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"],
    amenities: ["Floodlights", "Changing Room", "Parking", "Referee"],
    available: true
  },
  {
    _id: "3",
    name: "City Tennis Club",
    location: "Downtown, Main Street",
    sportType: "Tennis",
    pricePerHour: 600,
    rating: 4.5,
    images: ["https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"],
    amenities: ["Clay Court", "Equipment Rental", "Coaching", "Parking"],
    available: true
  },
  {
    _id: "4",
    name: "Urban Basketball Arena",
    location: "North Side, Athletic Hub",
    sportType: "Basketball",
    pricePerHour: 700,
    rating: 4.6,
    images: ["https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"],
    amenities: ["Indoor Court", "Sound System", "Scoreboard", "AC"],
    available: false
  },
  {
    _id: "5",
    name: "Premier Cricket Ground",
    location: "Green Valley, Stadium Road",
    sportType: "Cricket",
    pricePerHour: 1500,
    rating: 4.9,
    images: ["https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"],
    amenities: ["Turf Wicket", "Pavilion", "Floodlights", "Equipment"],
    available: true
  },
  {
    _id: "6",
    name: "Ace Badminton Center",
    location: "Mall Road, Shopping District",
    sportType: "Badminton",
    pricePerHour: 450,
    rating: 4.3,
    images: ["https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"],
    amenities: ["AC", "Wooden Floor", "Equipment Rental", "Parking"],
    available: true
  },
  {
    _id: "7",
    name: "Volleyball Sports Hub",
    location: "Beach Side, Coastal Area",
    sportType: "Volleyball",
    pricePerHour: 550,
    rating: 4.4,
    images: ["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"],
    amenities: ["Sand Court", "Net System", "Showers", "Refreshments"],
    available: true
  },
  {
    _id: "8",
    name: "Power Tennis Academy",
    location: "Hill View, Resort Road",
    sportType: "Tennis",
    pricePerHour: 900,
    rating: 4.7,
    images: ["https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"],
    amenities: ["Hard Court", "Professional Coaching", "Equipment", "Cafe"],
    available: true
  },
  {
    _id: "9",
    name: "Metro Football Stadium",
    location: "Central Park, City Square",
    sportType: "Football",
    pricePerHour: 2000,
    rating: 4.9,
    images: ["https://images.unsplash.com/photo-1459865264687-595d652de67e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"],
    amenities: ["FIFA Standard", "VIP Lounge", "Medical Support", "Broadcasting"],
    available: true
  },
  {
    _id: "10",
    name: "Community Basketball Court",
    location: "Residential Area, Block C",
    sportType: "Basketball",
    pricePerHour: 300,
    rating: 4.1,
    images: ["https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"],
    amenities: ["Outdoor Court", "Basic Lighting", "Public Access"],
    available: true
  },
  {
    _id: "11",
    name: "Grand Cricket Stadium",
    location: "Sports Complex, Highway Road",
    sportType: "Cricket",
    pricePerHour: 2500,
    rating: 4.8,
    images: ["https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"],
    amenities: ["International Standard", "Multiple Pitches", "Media Box", "Restaurant"],
    available: false
  },
  {
    _id: "12",
    name: "Shuttle Pro Badminton",
    location: "Tech Park, Business District",
    sportType: "Badminton",
    pricePerHour: 650,
    rating: 4.6,
    images: ["https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"],
    amenities: ["Premium Courts", "Pro Shop", "Coaching", "Tournament Hosting"],
    available: true
  },
  {
    _id: "13",
    name: "Beach Volleyball Paradise",
    location: "Marina Beach, Waterfront",
    sportType: "Volleyball",
    pricePerHour: 750,
    rating: 4.5,
    images: ["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"],
    amenities: ["Beach Setting", "Professional Sand", "Beach Bar", "Equipment"],
    available: true
  },
  {
    _id: "14",
    name: "All-Star Tennis Complex",
    location: "University Area, Campus Road",
    sportType: "Tennis",
    pricePerHour: 400,
    rating: 4.2,
    images: ["https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"],
    amenities: ["Student Discount", "Group Booking", "Basic Facilities"],
    available: true
  },
  {
    _id: "15",
    name: "Indoor Football Arena",
    location: "Entertainment City, Mall Complex",
    sportType: "Football",
    pricePerHour: 1800,
    rating: 4.7,
    images: ["https://images.unsplash.com/photo-1459865264687-595d652de67e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"],
    amenities: ["Climate Controlled", "Artificial Turf", "Video Analysis", "Cafe"],
    available: true
  },
  {
    _id: "16",
    name: "Hoops Basketball Center",
    location: "Youth Hub, Recreation Zone",
    sportType: "Basketball",
    pricePerHour: 500,
    rating: 4.4,
    images: ["https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"],
    amenities: ["Youth Programs", "Coaching Available", "Equipment Rental", "Snack Bar"],
    available: true
  }
];

export default function Venues() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sportType, setSportType] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [rating, setRating] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const ITEMS_PER_PAGE = 12;

  const fetchVenues = async () => {
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      let filteredVenues = [...DUMMY_VENUES];
      
      // Apply search filter
      if (search) {
        filteredVenues = filteredVenues.filter(venue =>
          venue.name.toLowerCase().includes(search.toLowerCase()) ||
          venue.location.toLowerCase().includes(search.toLowerCase()) ||
          venue.sportType.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      // Apply sport type filter
      if (sportType) {
        filteredVenues = filteredVenues.filter(venue => venue.sportType === sportType);
      }
      
      // Apply price range filter
      if (priceRange) {
        filteredVenues = filteredVenues.filter(venue => {
          const price = venue.pricePerHour;
          switch (priceRange) {
            case "0-500":
              return price >= 0 && price <= 500;
            case "500-1000":
              return price > 500 && price <= 1000;
            case "1000-2000":
              return price > 1000 && price <= 2000;
            case "2000+":
              return price > 2000;
            default:
              return true;
          }
        });
      }
      
      // Apply rating filter
      if (rating) {
        const minRating = parseFloat(rating);
        filteredVenues = filteredVenues.filter(venue => venue.rating >= minRating);
      }
      
      // Calculate pagination
      const totalFilteredVenues = filteredVenues.length;
      const calculatedTotalPages = Math.ceil(totalFilteredVenues / ITEMS_PER_PAGE);
      setTotalPages(calculatedTotalPages);
      
      // Apply pagination
      const startIndex = (page - 1) * ITEMS_PER_PAGE;
      const paginatedVenues = filteredVenues.slice(startIndex, startIndex + ITEMS_PER_PAGE);
      
      setVenues(paginatedVenues);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching venues", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1); // Reset to page 1 when filters change
  }, [search, sportType, priceRange, rating]);

  useEffect(() => {
    fetchVenues();
  }, [search, sportType, priceRange, rating, page]);

  const clearFilters = () => {
    setSearch("");
    setSportType("");
    setPriceRange("");
    setRating("");
    setPage(1);
  };

  const sportTypes = [
    { value: "Badminton", label: "🏸 Badminton" },
    { value: "Football", label: "⚽ Football" },
    { value: "Tennis", label: "🎾 Tennis" },
    { value: "Basketball", label: "🏀 Basketball" },
    { value: "Cricket", label: "🏏 Cricket" },
    { value: "Volleyball", label: "🏐 Volleyball" }
  ];

  const priceRanges = [
    { value: "0-500", label: "₹0 - ₹500" },
    { value: "500-1000", label: "₹500 - ₹1000" },
    { value: "1000-2000", label: "₹1000 - ₹2000" },
    { value: "2000+", label: "₹2000+" }
  ];

  const ratings = [
    { value: "4", label: "4★ & up" },
    { value: "3", label: "3★ & up" },
    { value: "2", label: "2★ & up" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-4">Discover Amazing Venues</h1>
          <p className="text-xl text-blue-100 max-w-2xl">
            Find the perfect sports facility for your next game. From local courts to premium complexes, 
            we've got you covered.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search venues by name, location, or sport type..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
              </svg>
              <span>Filters</span>
            </button>

            {/* Clear Filters */}
            {(search || sportType || priceRange || rating) && (
              <button
                onClick={clearFilters}
                className="px-4 py-3 text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Sport Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sport Type</label>
                  <select
                    value={sportType}
                    onChange={(e) => setSportType(e.target.value)}
                    className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  >
                    <option value="">All Sports</option>
                    {sportTypes.map((sport) => (
                      <option key={sport.value} value={sport.value}>
                        {sport.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  >
                    <option value="">Any Price</option>
                    {priceRanges.map((range) => (
                      <option key={range.value} value={range.value}>
                        {range.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  >
                    <option value="">Any Rating</option>
                    {ratings.map((rate) => (
                      <option key={rate.value} value={rate.value}>
                        {rate.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            {loading ? "Loading..." : `${venues.length} venues found`}
          </p>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Sort by:</span>
            <select className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Relevance</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Rating</option>
              <option>Distance</option>
            </select>
          </div>
        </div>

        {/* Venues Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded-xl mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : venues.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No venues found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search criteria or filters</p>
            <button
              onClick={clearFilters}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors duration-200"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {venues.map((venue) => (
              <div key={venue._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group">
                <div className="relative overflow-hidden">
                  <img
                    src={venue.images?.[0] || "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"}
                    alt={venue.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
                    {venue.available ? "Available" : "Busy"}
                  </div>
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
                    {venue.sportType || "Multi-sport"}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-1">
                      {venue.name}
                    </h3>
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-400">★</span>
                      <span className="text-sm text-gray-600">{venue.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-600 mb-4">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm line-clamp-1">{venue.location}</span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-bold text-blue-600">
                      ₹{venue.pricePerHour}
                      <span className="text-sm text-gray-500 font-normal">/hr</span>
                    </div>
                    <div className={`text-sm font-medium ${venue.available ? 'text-green-600' : 'text-red-600'}`}>
                      {venue.available ? "Available today" : "Fully booked"}
                    </div>
                  </div>
                  
                  <Link
                    to={`/venue/${venue._id}`}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 block text-center"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, idx) => {
                const pageNum = idx + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                      page === pageNum
                        ? "bg-blue-600 text-white"
                        : "border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}