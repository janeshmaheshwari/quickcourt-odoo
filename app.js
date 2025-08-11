// QuickCourt - Advanced Sports Facility Booking Application
// Demonstrates competitive programming algorithms and data structures

class QuickCourtApp {
    constructor() {
        this.currentUser = null;
        this.currentSection = 'landing';
        this.isAuthMode = 'login';
        this.selectedCourtForBooking = null;

        // Initialize data structures
        this.trie = new TrieSearch();
        this.bookingScheduler = new IntervalScheduler();

        // Load application data
        this.loadApplicationData();

        // Initialize components
        this.initializeEventListeners();
        this.initializeSearch();
        this.populateVenues();

        // Check for existing session
        this.checkAuthSession();

        this.initBrowserNavigation();
    }

    // Load sample data
    loadApplicationData() {
        this.venues = [
            {
                id: 1,
                name: "Elite Sports Complex",
                description: "Premium multi-sport facility with state-of-the-art equipment and professional coaching available.",
                address: "MG Road, Bangalore, Karnataka 560001",
                phone: "+91-80-12345678",
                email: "info@elitesports.com",
                latitude: 12.9716,
                longitude: 77.5946,
                rating: 4.8,
                total_reviews: 156,
                status: "approved",
                amenities: ["Parking", "Locker Room", "Cafeteria", "AC", "WiFi", "First Aid"],
                courts: [
                    {
                        id: 1,
                        name: "Badminton Court 1",
                        sport_type: "badminton",
                        price_per_hour: 800,
                        operating_start_time: "06:00",
                        operating_end_time: "22:00"
                    },
                    {
                        id: 2,
                        name: "Tennis Court A",
                        sport_type: "tennis",
                        price_per_hour: 1200,
                        operating_start_time: "06:00",
                        operating_end_time: "21:00"
                    }
                ]
            },
            {
                id: 2,
                name: "Champions Arena",
                description: "Professional sports arena hosting tournaments and providing training facilities for aspiring athletes.",
                address: "Koramangala, Bangalore, Karnataka 560034",
                phone: "+91-80-23456789",
                email: "contact@championsarena.com",
                latitude: 12.9279,
                longitude: 77.6271,
                rating: 4.6,
                total_reviews: 203,
                status: "approved",
                amenities: ["Parking", "Locker Room", "Pro Shop", "Coaching", "AC"],
                courts: [
                    {
                        id: 3,
                        name: "Football Ground",
                        sport_type: "football",
                        price_per_hour: 2000,
                        operating_start_time: "05:30",
                        operating_end_time: "23:00"
                    },
                    {
                        id: 4,
                        name: "Basketball Court 1",
                        sport_type: "basketball",
                        price_per_hour: 600,
                        operating_start_time: "06:00",
                        operating_end_time: "22:00"
                    }
                ]
            },
            {
                id: 3,
                name: "Urban Sports Hub",
                description: "Modern urban facility catering to fitness enthusiasts and casual players alike.",
                address: "Whitefield, Bangalore, Karnataka 560066",
                phone: "+91-80-34567890",
                email: "hello@urbansports.com",
                latitude: 12.9698,
                longitude: 77.7500,
                rating: 4.4,
                total_reviews: 89,
                status: "approved",
                amenities: ["Parking", "Locker Room", "Cafeteria", "Shower", "Equipment Rental"],
                courts: [
                    {
                        id: 5,
                        name: "Cricket Net 1",
                        sport_type: "cricket",
                        price_per_hour: 500,
                        operating_start_time: "06:00",
                        operating_end_time: "21:00"
                    },
                    {
                        id: 6,
                        name: "Badminton Court 2",
                        sport_type: "badminton",
                        price_per_hour: 700,
                        operating_start_time: "06:00",
                        operating_end_time: "22:00"
                    }
                ]
            },
            {
                id: 4,
                name: "Ace Tennis Academy",
                description: "Specialized tennis facility with certified coaches and tournament-standard courts.",
                address: "HSR Layout, Bangalore, Karnataka 560102",
                phone: "+91-80-45678901",
                email: "info@acetennisacademy.com",
                latitude: 12.9081,
                longitude: 77.6476,
                rating: 4.9,
                total_reviews: 267,
                status: "approved",
                amenities: ["Parking", "Pro Shop", "Coaching", "Tournament Facilities", "Physiotherapy"],
                courts: [
                    {
                        id: 7,
                        name: "Center Court",
                        sport_type: "tennis",
                        price_per_hour: 1500,
                        operating_start_time: "06:00",
                        operating_end_time: "22:00"
                    },
                    {
                        id: 8,
                        name: "Practice Court 1",
                        sport_type: "tennis",
                        price_per_hour: 1000,
                        operating_start_time: "06:00",
                        operating_end_time: "22:00"
                    }
                ]
            },
            {
                id: 5,
                name: "Power Play Sports",
                description: "Community sports center offering affordable rates for all skill levels and age groups.",
                address: "Jayanagar, Bangalore, Karnataka 560011",
                phone: "+91-80-56789012",
                email: "admin@powerplaysports.com",
                latitude: 12.9306,
                longitude: 77.5828,
                rating: 4.2,
                total_reviews: 134,
                status: "approved",
                amenities: ["Parking", "Locker Room", "Water Facility", "Basic First Aid"],
                courts: [
                    {
                        id: 9,
                        name: "Basketball Court A",
                        sport_type: "basketball",
                        price_per_hour: 400,
                        operating_start_time: "07:00",
                        operating_end_time: "21:00"
                    },
                    {
                        id: 10,
                        name: "Volleyball Court",
                        sport_type: "volleyball",
                        price_per_hour: 350,
                        operating_start_time: "07:00",
                        operating_end_time: "20:00"
                    }
                ]
            }
        ];

        this.users = [
            { id: 1, email: "admin@quickcourt.com", full_name: "Admin User", role: "admin" },
            { id: 2, email: "owner@elitesports.com", full_name: "Elite Sports Owner", role: "facility_owner" },
            { id: 3, email: "john.player@gmail.com", full_name: "John Player", role: "user" }
        ];

        this.bookings = [
            {
                id: 1,
                user_id: 3,
                court_id: 1,
                booking_date: "2025-08-12",
                start_time: "10:00",
                end_time: "11:00",
                total_price: 800,
                status: "confirmed",
                venue_name: "Elite Sports Complex",
                court_name: "Badminton Court 1",
                sport_type: "badminton"
            },
            {
                id: 2,
                user_id: 3,
                court_id: 3,
                booking_date: "2025-08-13",
                start_time: "18:00",
                end_time: "19:00",
                total_price: 2000,
                status: "confirmed",
                venue_name: "Champions Arena",
                court_name: "Football Ground",
                sport_type: "football"
            }
        ];

        // Initialize search trie with venue data
        this.venues.forEach(venue => {
            this.trie.insert(venue.name.toLowerCase(), venue);
            venue.courts.forEach(court => {
                this.trie.insert(`${venue.name} ${court.sport_type}`.toLowerCase(), venue);
                this.trie.insert(court.sport_type.toLowerCase(), venue);
            });
        });
    }

    // Initialize event listeners
    initializeEventListeners() {
        // Authentication form
        const authForm = document.getElementById('authForm');
        if (authForm) {
            authForm.addEventListener('submit', (e) => this.handleAuth(e));
        }

        // Booking form
        const bookingForm = document.getElementById('bookingForm');
        if (bookingForm) {
            const dateInput = document.getElementById('bookingDate');
            const startTimeSelect = document.getElementById('bookingStartTime');
            const durationSelect = document.getElementById('bookingDuration');

            if (dateInput) dateInput.addEventListener('change', () => this.checkAvailability());
            if (startTimeSelect) startTimeSelect.addEventListener('change', () => this.checkAvailability());
            if (durationSelect) durationSelect.addEventListener('change', () => this.checkAvailability());
        }

        // Add filter event listeners
        const sportFilter = document.getElementById('sportFilter');
        const priceFilter = document.getElementById('priceFilter');
        const ratingFilter = document.getElementById('ratingFilter');
        const distanceFilter = document.getElementById('distanceFilter');

        if (sportFilter) sportFilter.addEventListener('change', () => this.applyFilters());
        if (priceFilter) priceFilter.addEventListener('change', () => this.applyFilters());
        if (ratingFilter) ratingFilter.addEventListener('change', () => this.applyFilters());
        if (distanceFilter) distanceFilter.addEventListener('change', () => this.applyFilters());
    }

    // Initialize search functionality
    initializeSearch() {
        const searchInput = document.getElementById('venueSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.performSearch(e.target.value));
            searchInput.addEventListener('focus', () => this.showSearchSuggestions());
            searchInput.addEventListener('blur', () => {
                setTimeout(() => this.hideSearchSuggestions(), 200);
            });
        }
    }

    // Check for existing authentication session
    checkAuthSession() {
        const token = localStorage.getItem('quickcourt_token');
        const userData = localStorage.getItem('quickcourt_user');

        if (token && userData) {
            try {
                this.currentUser = JSON.parse(userData);
                this.updateUIForAuthenticatedUser();
            } catch (error) {
                console.error('Error parsing user data:', error);
                this.logout();
            }
        }
    }

    initBrowserNavigation() {
        window.addEventListener('popstate', (event) => {
            if (event.state && event.state.section) {
                this.showSection(event.state.section, event.state.data || {}, false);
            }
        });
    }

    // Show section
    showSection(section, data = {}, updateHistory = true) {
        if (updateHistory) {
            const state = { section, data };
            history.pushState(state, '', '/' + section);
        }

        console.log('Navigating to section:', section);

        // Hide all sections
        document.querySelectorAll('.section-container').forEach(sec => {
            sec.classList.add('hidden');
        });

        // Show target section
        const targetSection = document.getElementById(section);
        if (targetSection) {
            targetSection.classList.remove('hidden');
            this.currentSection = section;

            // Reset forms when switching to auth
            if (section === 'auth') {
                this.resetAuthSection();
            }
        }

        // Special handling for venues section
        if (section === 'venues') {
            setTimeout(() => this.populateVenues(), 100);
        }
    }

    // Reset auth section to initial state
    resetAuthSection() {
        document.getElementById('roleSelection').style.display = 'block';
        document.getElementById('authForm').classList.add('hidden');
        document.getElementById('otpVerification').classList.add('hidden');

        // Clear selected role
        document.querySelectorAll('.role-card').forEach(card => {
            card.classList.remove('selected');
        });

        // Clear form
        document.getElementById('authForm').reset();
    }

    // Role selection
    selectRole(role) {
        console.log('Role selected:', role);

        // Update UI
        document.querySelectorAll('.role-card').forEach(card => {
            card.classList.remove('selected');
        });

        // Find the clicked role card and mark as selected
        const roleCards = document.querySelectorAll('.role-card');
        roleCards.forEach(card => {
            const roleText = card.querySelector('h6').textContent.toLowerCase().replace(' ', '_');
            if (roleText === role ||
                (role === 'facility_owner' && roleText === 'facility_owner') ||
                (role === 'user' && roleText === 'user') ||
                (role === 'admin' && roleText === 'admin')) {
                card.classList.add('selected');
            }
        });

        // Show auth form
        document.getElementById('selectedRole').value = role;
        document.getElementById('roleSelection').style.display = 'none';
        document.getElementById('authForm').classList.remove('hidden');

        // Pre-fill demo credentials based on role
        const emailInput = document.getElementById('email');
        switch (role) {
            case 'admin':
                emailInput.value = 'admin@quickcourt.com';
                break;
            case 'facility_owner':
                emailInput.value = 'owner@elitesports.com';
                break;
            case 'user':
                emailInput.value = 'john.player@gmail.com';
                break;
        }
    }

    // Handle authentication
    async handleAuth(e) {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const role = document.getElementById('selectedRole').value;

        console.log('Authentication attempt:', { email, role });

        // Simulate authentication delay
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<div class="loading"></div> Authenticating...';
        submitBtn.disabled = true;

        setTimeout(() => {
            // Find user by email and role
            const user = this.users.find(u => u.email === email && u.role === role);

            if (user) {
                // Show OTP verification
                document.getElementById('authForm').style.display = 'none';
                document.getElementById('otpVerification').classList.remove('hidden');
                console.log('User found, showing OTP verification');
            } else {
                alert('Invalid credentials or role mismatch');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        }, 1000);
    }

    // Verify OTP (Demo: any 4-digit code works)
    verifyOTP() {
        const otpCode = document.getElementById('otpCode').value;
        const email = document.getElementById('email').value;
        const role = document.getElementById('selectedRole').value;

        console.log('OTP verification:', { otpCode, email, role });

        if (otpCode.length === 4) {
            const user = this.users.find(u => u.email === email && u.role === role);
            this.loginUser(user);
        } else {
            alert('Please enter a 4-digit OTP');
        }
    }

    // Login user
    loginUser(user) {
        console.log('User logged in:', user);
        this.currentUser = user;

        // Simulate JWT token
        const token = 'jwt_token_' + Date.now();
        localStorage.setItem('quickcourt_token', token);
        localStorage.setItem('quickcourt_user', JSON.stringify(user));

        this.updateUIForAuthenticatedUser();
        this.showDashboard();
    }

    // Update UI for authenticated user
    updateUIForAuthenticatedUser() {
        const loginBtn = document.getElementById('loginBtn');
        const userMenuDropdown = document.getElementById('userMenuDropdown');
        const userNameDisplay = document.getElementById('userNameDisplay');

        if (loginBtn) loginBtn.style.display = 'none';
        if (userMenuDropdown) userMenuDropdown.style.display = 'block';
        if (userNameDisplay) userNameDisplay.textContent = this.currentUser.full_name;
    }

    // Show appropriate dashboard based on role
    showDashboard() {
        switch (this.currentUser.role) {
            case 'user':
                this.showSection('userDashboard');
                setTimeout(() => this.loadUserDashboard(), 100);
                break;
            case 'facility_owner':
                this.showSection('ownerDashboard');
                setTimeout(() => this.loadOwnerDashboard(), 100);
                break;
            case 'admin':
                this.showSection('adminDashboard');
                setTimeout(() => this.loadAdminDashboard(), 100);
                break;
        }
    }

    // Load user dashboard
    loadUserDashboard() {
        const userBookings = this.bookings.filter(b => b.user_id === this.currentUser.id);
        const bookingsList = document.getElementById('userBookingsList');

        if (!bookingsList) return;

        if (userBookings.length === 0) {
            bookingsList.innerHTML = '<p class="text-center">No bookings found. <a href="#" onclick="window.app.showSection(\'venues\')">Book your first court!</a></p>';
        } else {
            bookingsList.innerHTML = userBookings.map(booking => `
                <div class="booking-item">
                    <div class="booking-header">
                        <div class="booking-venue">${booking.venue_name}</div>
                        <div class="status status--success">Confirmed</div>
                    </div>
                    <div class="booking-details">
                        ${booking.court_name} • ${booking.sport_type}
                    </div>
                    <div class="booking-time">
                        <i class="fas fa-calendar"></i> ${booking.booking_date} • ${booking.start_time} - ${booking.end_time}
                        <span class="float-end"><strong>₹${booking.total_price}</strong></span>
                    </div>
                </div>
            `).join('');
        }

        const totalBookingsEl = document.getElementById('userTotalBookings');
        const monthlyBookingsEl = document.getElementById('userMonthlyBookings');

        if (totalBookingsEl) totalBookingsEl.textContent = userBookings.length;
        if (monthlyBookingsEl) {
            monthlyBookingsEl.textContent = userBookings.filter(b =>
                new Date(b.booking_date).getMonth() === new Date().getMonth()
            ).length;
        }
    }

    // Load owner dashboard
    loadOwnerDashboard() {
        setTimeout(() => this.createRevenueChart(), 200);
    }

    // Load admin dashboard
    loadAdminDashboard() {
        setTimeout(() => this.createPlatformChart(), 200);
    }

    // Create revenue chart
    createRevenueChart() {
        const ctx = document.getElementById('revenueChart');
        if (ctx && ctx.getContext) {
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Revenue (₹)',
                        data: [35000, 42000, 38000, 45000, 52000, 48000],
                        borderColor: '#1FB8CD',
                        backgroundColor: 'rgba(31, 184, 205, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function (value) {
                                    return '₹' + value.toLocaleString();
                                }
                            }
                        }
                    }
                }
            });
        }
    }

    // Create platform analytics chart
    createPlatformChart() {
        const ctx = document.getElementById('platformChart');
        if (ctx && ctx.getContext) {
            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Badminton', 'Tennis', 'Football', 'Basketball', 'Cricket'],
                    datasets: [{
                        data: [35, 25, 20, 15, 5],
                        backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F'],
                        borderWidth: 2,
                        borderColor: '#ffffff'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }
    }

    // Perform search using Trie algorithm
    performSearch(query) {
        if (!query.trim()) {
            this.populateVenues();
            this.hideSearchSuggestions();
            return;
        }

        const startTime = performance.now();
        const results = this.trie.search(query.toLowerCase());
        const endTime = performance.now();

        // Update search metrics
        const searchTimeEl = document.getElementById('searchTime');
        const resultsCountEl = document.getElementById('resultsCount');

        if (searchTimeEl) searchTimeEl.textContent = `${(endTime - startTime).toFixed(1)}ms`;
        if (resultsCountEl) resultsCountEl.textContent = results.length;

        // Show results
        this.displayVenues(results);
        this.updateSearchSuggestions(query);
    }

    // Update search suggestions
    updateSearchSuggestions(query) {
        const suggestions = this.trie.getAutoComplete(query.toLowerCase(), 5);
        const suggestionsContainer = document.getElementById('searchSuggestions');

        if (!suggestionsContainer) return;

        if (suggestions.length > 0) {
            suggestionsContainer.innerHTML = suggestions.map(suggestion =>
                `<div class="search-suggestion-item" onclick="window.app.selectSuggestion('${suggestion}')">${suggestion}</div>`
            ).join('');
            suggestionsContainer.style.display = 'block';
        } else {
            suggestionsContainer.style.display = 'none';
        }
    }

    // Select search suggestion
    selectSuggestion(suggestion) {
        const searchInput = document.getElementById('venueSearch');
        if (searchInput) {
            searchInput.value = suggestion;
            this.performSearch(suggestion);
        }
        this.hideSearchSuggestions();
    }

    // Show/hide search suggestions
    showSearchSuggestions() {
        const searchInput = document.getElementById('venueSearch');
        if (searchInput) {
            const query = searchInput.value;
            if (query.trim()) {
                this.updateSearchSuggestions(query);
            }
        }
    }

    hideSearchSuggestions() {
        const suggestionsContainer = document.getElementById('searchSuggestions');
        if (suggestionsContainer) {
            suggestionsContainer.style.display = 'none';
        }
    }

    // Apply filters
    applyFilters() {
        const sportFilter = document.getElementById('sportFilter');
        const priceFilter = document.getElementById('priceFilter');
        const ratingFilter = document.getElementById('ratingFilter');

        let filteredVenues = [...this.venues];

        // Sport filter
        if (sportFilter && sportFilter.value) {
            filteredVenues = filteredVenues.filter(venue =>
                venue.courts.some(court => court.sport_type === sportFilter.value)
            );
        }

        // Price filter (using binary search concepts)
        if (priceFilter && priceFilter.value) {
            const [minPrice, maxPrice] = this.parsePriceRange(priceFilter.value);
            filteredVenues = filteredVenues.filter(venue =>
                venue.courts.some(court =>
                    court.price_per_hour >= minPrice &&
                    (maxPrice === Infinity || court.price_per_hour <= maxPrice)
                )
            );
        }

        // Rating filter
        if (ratingFilter && ratingFilter.value) {
            const minRating = parseFloat(ratingFilter.value.replace('+', ''));
            filteredVenues = filteredVenues.filter(venue => venue.rating >= minRating);
        }

        this.displayVenues(filteredVenues);

        const resultsCountEl = document.getElementById('resultsCount');
        if (resultsCountEl) resultsCountEl.textContent = filteredVenues.length;
    }

    // Parse price range for filtering
    parsePriceRange(range) {
        switch (range) {
            case '0-500': return [0, 500];
            case '501-1000': return [501, 1000];
            case '1001-1500': return [1001, 1500];
            case '1501+': return [1501, Infinity];
            default: return [0, Infinity];
        }
    }

    // Clear filters
    clearFilters() {
        const sportFilter = document.getElementById('sportFilter');
        const priceFilter = document.getElementById('priceFilter');
        const ratingFilter = document.getElementById('ratingFilter');
        const searchInput = document.getElementById('venueSearch');

        if (sportFilter) sportFilter.value = '';
        if (priceFilter) priceFilter.value = '';
        if (ratingFilter) ratingFilter.value = '';
        if (searchInput) searchInput.value = '';

        this.populateVenues();
    }

    // Populate venues
    populateVenues() {
        this.displayVenues(this.venues);

        const searchTimeEl = document.getElementById('searchTime');
        const resultsCountEl = document.getElementById('resultsCount');

        if (searchTimeEl) searchTimeEl.textContent = '0ms';
        if (resultsCountEl) resultsCountEl.textContent = this.venues.length;
    }

    // Display venues
    displayVenues(venues) {
        const venuesGrid = document.getElementById('venuesGrid');

        if (!venuesGrid) return;

        if (venues.length === 0) {
            venuesGrid.innerHTML = '<div class="col-12"><p class="text-center">No venues found matching your criteria.</p></div>';
            return;
        }

        venuesGrid.innerHTML = venues.map(venue => this.createVenueCard(venue)).join('');
    }

    // Create venue card HTML
    createVenueCard(venue) {
        const stars = '★'.repeat(Math.floor(venue.rating)) + '☆'.repeat(5 - Math.floor(venue.rating));

        return `
            <div class="col-lg-4 col-md-6">
                <div class="venue-card">
                    <div class="venue-card-body">
                        <h5 class="venue-title">${venue.name}</h5>
                        <div class="venue-rating">
                            <span class="stars">${stars}</span>
                            <span class="rating-text">${venue.rating} (${venue.total_reviews} reviews)</span>
                        </div>
                        <p class="venue-address">
                            <i class="fas fa-map-marker-alt"></i>
                            ${venue.address}
                        </p>
                        <div class="amenities-list">
                            ${venue.amenities.slice(0, 3).map(amenity =>
            `<span class="amenity-badge">${amenity}</span>`
        ).join('')}
                            ${venue.amenities.length > 3 ? `<span class="amenity-badge">+${venue.amenities.length - 3} more</span>` : ''}
                        </div>
                        <div class="courts-preview">
                            ${venue.courts.slice(0, 2).map(court => `
                                <div class="court-item">
                                    <span class="court-name">${court.name}</span>
                                    <span class="court-price">₹${court.price_per_hour}/hr</span>
                                </div>
                            `).join('')}
                        </div>
                        <div class="d-flex gap-2">
                            <button class="btn btn--outline flex-fill" onclick="window.app.showVenueDetails(${venue.id})">
                                View Details
                            </button>
                            <button class="btn btn--primary flex-fill" onclick="window.app.quickBook(${venue.id})">
                                Book Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Show venue details
    showVenueDetails(venueId) {
        const venue = this.venues.find(v => v.id === venueId);
        if (!venue) return;

        const modal = document.getElementById('venueModal');
        const modalTitle = document.getElementById('venueModalTitle');
        const modalBody = document.getElementById('venueModalBody');

        if (modalTitle) modalTitle.textContent = venue.name;
        if (modalBody) {
            modalBody.innerHTML = `
                <div class="row">
                    <div class="col-md-6">
                        <h6>About</h6>
                        <p>${venue.description}</p>
                        
                        <h6>Contact Information</h6>
                        <p><i class="fas fa-phone"></i> ${venue.phone}</p>
                        <p><i class="fas fa-envelope"></i> ${venue.email}</p>
                        <p><i class="fas fa-map-marker-alt"></i> ${venue.address}</p>
                        
                        <h6>Amenities</h6>
                        <div class="amenities-list">
                            ${venue.amenities.map(amenity =>
                `<span class="amenity-badge">${amenity}</span>`
            ).join('')}
                        </div>
                    </div>
                    <div class="col-md-6">
                        <h6>Available Courts</h6>
                        ${venue.courts.map(court => `
                            <div class="card mb-2">
                                <div class="card__body">
                                    <h6 class="mb-2">${court.name}</h6>
                                    <p class="mb-1"><small>Sport: ${court.sport_type}</small></p>
                                    <p class="mb-1"><small>Hours: ${court.operating_start_time} - ${court.operating_end_time}</small></p>
                                    <div class="d-flex justify-content-between align-items-center">
                                        <strong class="text-primary">₹${court.price_per_hour}/hour</strong>
                                        <button class="btn btn--primary btn--sm" onclick="window.app.bookCourt(${court.id}, '${venue.name}', '${court.name}', ${court.price_per_hour})">
                                            Book Court
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        if (modal && bootstrap.Modal) {
            new bootstrap.Modal(modal).show();
        }
    }

    // Quick book (first available court)
    quickBook(venueId) {
        const venue = this.venues.find(v => v.id === venueId);
        if (!venue || venue.courts.length === 0) return;

        const court = venue.courts[0];
        this.bookCourt(court.id, venue.name, court.name, court.price_per_hour);
    }

    // Book court
    bookCourt(courtId, venueName, courtName, pricePerHour) {
        if (!this.currentUser) {
            alert('Please login to book a court');
            this.showSection('auth');
            return;
        }

        this.selectedCourtForBooking = { courtId, venueName, courtName, pricePerHour };

        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        const bookingDateEl = document.getElementById('bookingDate');
        if (bookingDateEl) {
            bookingDateEl.value = today;
            bookingDateEl.min = today;
        }

        // Populate time slots
        this.populateTimeSlots();

        const modal = document.getElementById('bookingModal');
        if (modal && bootstrap.Modal) {
            new bootstrap.Modal(modal).show();
        }
    }

    // Populate time slots
    populateTimeSlots() {
        const startTimeSelect = document.getElementById('bookingStartTime');
        if (!startTimeSelect) return;

        startTimeSelect.innerHTML = '';

        // Generate time slots from 6 AM to 10 PM
        for (let hour = 6; hour <= 22; hour++) {
            const timeString = `${hour.toString().padStart(2, '0')}:00`;
            const option = document.createElement('option');
            option.value = timeString;
            option.textContent = this.formatTime(timeString);
            startTimeSelect.appendChild(option);
        }
    }

    // Format time for display
    formatTime(timeString) {
        const [hour, minute] = timeString.split(':');
        const hourNum = parseInt(hour);
        const ampm = hourNum >= 12 ? 'PM' : 'AM';
        const displayHour = hourNum > 12 ? hourNum - 12 : (hourNum === 0 ? 12 : hourNum);
        return `${displayHour}:${minute} ${ampm}`;
    }

    // Check availability using interval scheduling algorithm
    checkAvailability() {
        const date = document.getElementById('bookingDate')?.value;
        const startTime = document.getElementById('bookingStartTime')?.value;
        const duration = parseInt(document.getElementById('bookingDuration')?.value || 1);

        if (!date || !startTime || !duration || !this.selectedCourtForBooking) return;

        // Calculate end time
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const endHour = startHour + duration;
        const endTime = `${endHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`;

        // Check for conflicts using interval scheduling
        const hasConflict = this.bookingScheduler.hasConflict(
            this.selectedCourtForBooking.courtId,
            date,
            startTime,
            endTime,
            this.bookings
        );

        const resultContainer = document.getElementById('availabilityResult');
        if (resultContainer) {
            if (hasConflict) {
                resultContainer.innerHTML = `
                    <div class="availability-result availability-conflict">
                        <i class="fas fa-times-circle"></i> Time slot not available. Conflict detected!
                    </div>
                `;
            } else {
                resultContainer.innerHTML = `
                    <div class="availability-result availability-available">
                        <i class="fas fa-check-circle"></i> Time slot available!
                    </div>
                `;
            }
        }

        // Update total price
        const totalPrice = this.selectedCourtForBooking.pricePerHour * duration;
        const bookingTotalEl = document.getElementById('bookingTotal');
        if (bookingTotalEl) bookingTotalEl.textContent = totalPrice;
    }

    // Confirm booking
    confirmBooking() {
        const date = document.getElementById('bookingDate')?.value;
        const startTime = document.getElementById('bookingStartTime')?.value;
        const duration = parseInt(document.getElementById('bookingDuration')?.value || 1);

        if (!date || !startTime || !duration) {
            alert('Please fill all booking details');
            return;
        }

        // Calculate end time
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const endHour = startHour + duration;
        const endTime = `${endHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`;

        // Check for conflicts one more time
        const hasConflict = this.bookingScheduler.hasConflict(
            this.selectedCourtForBooking.courtId,
            date,
            startTime,
            endTime,
            this.bookings
        );

        if (hasConflict) {
            alert('Sorry, this time slot is no longer available');
            this.checkAvailability();
            return;
        }

        // Create booking
        const newBooking = {
            id: this.bookings.length + 1,
            user_id: this.currentUser.id,
            court_id: this.selectedCourtForBooking.courtId,
            booking_date: date,
            start_time: startTime,
            end_time: endTime,
            total_price: this.selectedCourtForBooking.pricePerHour * duration,
            status: 'confirmed',
            venue_name: this.selectedCourtForBooking.venueName,
            court_name: this.selectedCourtForBooking.courtName,
            sport_type: 'court'
        };

        this.bookings.push(newBooking);

        // Close modal and show success
        const modal = document.getElementById('bookingModal');
        if (modal && bootstrap.Modal) {
            bootstrap.Modal.getInstance(modal)?.hide();
        }

        alert('Booking confirmed successfully!');

        // Refresh dashboard if on user dashboard
        if (this.currentSection === 'userDashboard') {
            this.loadUserDashboard();
        }
    }

    // Toggle authentication mode
    toggleAuthMode() {
        this.isAuthMode = this.isAuthMode === 'login' ? 'register' : 'login';
        const nameField = document.getElementById('nameField');
        const submitBtn = document.querySelector('#authForm button[type="submit"]');
        const toggleLink = document.querySelector('#authForm a[onclick="toggleAuthMode()"]');

        if (nameField && submitBtn && toggleLink) {
            if (this.isAuthMode === 'register') {
                nameField.style.display = 'block';
                submitBtn.textContent = 'Register';
                toggleLink.textContent = 'Already have an account? Login';
            } else {
                nameField.style.display = 'none';
                submitBtn.textContent = 'Login';
                toggleLink.textContent = "Don't have an account? Register";
            }
        }
    }

    // Logout
    logout() {
        localStorage.removeItem('quickcourt_token');
        localStorage.removeItem('quickcourt_user');
        this.currentUser = null;

        const loginBtn = document.getElementById('loginBtn');
        const userMenuDropdown = document.getElementById('userMenuDropdown');

        if (loginBtn) loginBtn.style.display = 'block';
        if (userMenuDropdown) userMenuDropdown.style.display = 'none';

        this.showSection('landing');
    }
}

// Trie Search Algorithm Implementation
class TrieNode {
    constructor() {
        this.children = {};
        this.isEndOfWord = false;
        this.venues = [];
    }
}

class TrieSearch {
    constructor() {
        this.root = new TrieNode();
    }

    insert(word, venue) {
        let current = this.root;

        for (let char of word) {
            if (!current.children[char]) {
                current.children[char] = new TrieNode();
            }
            current = current.children[char];
            current.venues.push(venue);
        }

        current.isEndOfWord = true;
    }

    search(prefix) {
        let current = this.root;

        for (let char of prefix) {
            if (!current.children[char]) {
                return [];
            }
            current = current.children[char];
        }

        // Remove duplicates and return
        const uniqueVenues = [...new Map(current.venues.map(v => [v.id, v])).values()];
        return uniqueVenues;
    }

    getAutoComplete(prefix, limit = 5) {
        const suggestions = [];
        let current = this.root;

        // Navigate to prefix
        for (let char of prefix) {
            if (!current.children[char]) {
                return suggestions;
            }
            current = current.children[char];
        }

        // Collect suggestions using DFS
        this.dfsCollectWords(current, prefix, suggestions, limit);
        return suggestions.slice(0, limit);
    }

    dfsCollectWords(node, currentWord, suggestions, limit) {
        if (suggestions.length >= limit) return;

        if (node.isEndOfWord) {
            suggestions.push(currentWord);
        }

        for (let char in node.children) {
            this.dfsCollectWords(node.children[char], currentWord + char, suggestions, limit);
        }
    }
}

// Interval Scheduling Algorithm for Booking Conflicts
class IntervalScheduler {
    hasConflict(courtId, date, newStartTime, newEndTime, existingBookings) {
        // Convert time strings to minutes for easier comparison
        const newStart = this.timeToMinutes(newStartTime);
        const newEnd = this.timeToMinutes(newEndTime);

        // Filter bookings for the same court and date
        const relevantBookings = existingBookings.filter(booking =>
            booking.court_id === courtId && booking.booking_date === date
        );

        // Check for overlap with existing bookings
        for (let booking of relevantBookings) {
            const existingStart = this.timeToMinutes(booking.start_time);
            const existingEnd = this.timeToMinutes(booking.end_time);

            // Check if intervals overlap
            if (this.intervalsOverlap(newStart, newEnd, existingStart, existingEnd)) {
                return true;
            }
        }

        return false;
    }

    timeToMinutes(timeString) {
        const [hours, minutes] = timeString.split(':').map(Number);
        return hours * 60 + minutes;
    }

    intervalsOverlap(start1, end1, start2, end2) {
        return start1 < end2 && start2 < end1;
    }
}

// Global functions for HTML onclick events
window.showSection = function (sectionId) {
    if (window.app) {
        window.app.showSection(sectionId);
    }
};

window.selectRole = function (role) {
    if (window.app) {
        window.app.selectRole(role);
    }
};

window.verifyOTP = function () {
    if (window.app) {
        window.app.verifyOTP();
    }
};

window.toggleAuthMode = function () {
    if (window.app) {
        window.app.toggleAuthMode();
    }
};

window.logout = function () {
    if (window.app) {
        window.app.logout();
    }
};

window.showDashboard = function () {
    if (window.app) {
        window.app.showDashboard();
    }
};

window.applyFilters = function () {
    if (window.app) {
        window.app.applyFilters();
    }
};

window.clearFilters = function () {
    if (window.app) {
        window.app.clearFilters();
    }
};

window.confirmBooking = function () {
    if (window.app) {
        window.app.confirmBooking();
    }
};

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM loaded, initializing QuickCourt app...');
    window.app = new QuickCourtApp();
    console.log('QuickCourt app initialized:', window.app);
});