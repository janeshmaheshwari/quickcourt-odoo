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

        // Theme
        this.initializeTheme();

        // Load application data
        this.loadApplicationData();

        // Initialize components
        this.initializeEventListeners();
        this.initializeSearch();
        this.populateVenues();

        // Check for existing session
        this.checkAuthSession();

        this.initBrowserNavigation();
        
        // Initialize enhanced features
        this.initializeRatingSystem();
    }

    // Theme initialization and toggle
    initializeTheme() {
        const stored = localStorage.getItem('quickcourt_theme');
        const html = document.documentElement;
        // default to light
        const theme = stored === 'dark' ? 'dark' : 'light';
        html.setAttribute('data-color-scheme', theme);
        this.updateThemeToggleIcon(theme);
    }

    toggleTheme() {
        const html = document.documentElement;
        const current = html.getAttribute('data-color-scheme') || 'light';
        const next = current === 'light' ? 'dark' : 'light';
        html.setAttribute('data-color-scheme', next);
        localStorage.setItem('quickcourt_theme', next);
        this.updateThemeToggleIcon(next);
    }

    updateThemeToggleIcon(theme) {
        const icon = document.getElementById('themeToggleIcon');
        if (!icon) return;
        icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        const btn = document.getElementById('themeToggleBtn');
        if (btn) btn.title = theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode';
        // Refresh charts for theme contrast
        this.refreshChartsForTheme();
    }

    refreshChartsForTheme() {
        const theme = document.documentElement.getAttribute('data-color-scheme') || 'light';
        const textColor = getComputedStyle(document.documentElement).getPropertyValue('--color-text').trim() || (theme === 'dark' ? '#e5e7eb' : '#111827');
        const gridColor = getComputedStyle(document.documentElement).getPropertyValue('--color-card-border').trim() || (theme === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)');

        // Update revenue chart
        if (this._revenueChart) {
            this._revenueChart.options.scales.x.ticks.color = textColor;
            this._revenueChart.options.scales.y.ticks.color = textColor;
            this._revenueChart.options.scales.x.grid.color = gridColor;
            this._revenueChart.options.scales.y.grid.color = gridColor;
            this._revenueChart.update();
        }
        // Update peak hours chart
        if (this._peakHoursChart) {
            this._peakHoursChart.options.scales.x.ticks.color = textColor;
            this._peakHoursChart.options.scales.y.ticks.color = textColor;
            this._peakHoursChart.options.scales.x.grid.color = gridColor;
            this._peakHoursChart.options.scales.y.grid.color = gridColor;
            this._peakHoursChart.update();
        }
        // Update platform chart legend
        if (this._platformChart) {
            this._platformChart.options.plugins.legend.labels.color = textColor;
            this._platformChart.update();
        }
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
                photos: [
                    { id: 1, url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop", caption: "Main Entrance" },
                    { id: 2, url: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop", caption: "Badminton Courts" },
                    { id: 3, url: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&h=300&fit=crop", caption: "Tennis Courts" }
                ],
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
                photos: [
                    { id: 4, url: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop", caption: "Football Ground" },
                    { id: 5, url: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop", caption: "Basketball Court" }
                ],
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
                photos: [
                    { id: 6, url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop", caption: "Cricket Nets" },
                    { id: 7, url: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop", caption: "Badminton Courts" }
                ],
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
                photos: [
                    { id: 8, url: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&h=300&fit=crop", caption: "Center Court" },
                    { id: 9, url: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&h=300&fit=crop", caption: "Practice Courts" }
                ],
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
                photos: [
                    { id: 10, url: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop", caption: "Basketball Court" },
                    { id: 11, url: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop", caption: "Volleyball Court" }
                ],
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

        // Add pending facilities for admin approval
        this.pendingFacilities = [
            {
                id: 6,
                name: "New Sports Center",
                description: "New facility awaiting approval",
                address: "Electronic City, Bangalore",
                phone: "+91-80-99999999",
                email: "info@newsports.com",
                status: "pending",
                submitted_date: "2025-01-15",
                photos: [
                    { id: 12, url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop", caption: "Facility Photo" }
                ]
            }
        ];

        this.users = [
            { id: 1, email: "admin@quickcourt.com", full_name: "Admin User", role: "admin", status: "active" },
            { id: 2, email: "owner@elitesports.com", full_name: "Elite Sports Owner", role: "facility_owner", status: "active" },
            { id: 3, email: "john.player@gmail.com", full_name: "John Player", role: "user", status: "active" },
            { id: 4, email: "jane.sports@gmail.com", full_name: "Jane Sports", role: "user", status: "active" }
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

        // Add reviews data
        this.reviews = [
            {
                id: 1,
                venue_id: 1,
                user_id: 3,
                user_name: "John Player",
                rating: 5,
                title: "Excellent Facility",
                text: "Great courts and friendly staff. Highly recommended!",
                date: "2025-01-10"
            },
            {
                id: 2,
                venue_id: 1,
                user_id: 4,
                user_name: "Jane Sports",
                rating: 4,
                title: "Good Experience",
                text: "Courts are well maintained. Good value for money.",
                date: "2025-01-08"
            }
        ];

        // Add matches data
        this.matches = [
            {
                id: 1,
                creator_id: 3,
                creator_name: "John Player",
                sport_type: "badminton",
                skill_level: "intermediate",
                players_needed: 2,
                current_players: 1,
                match_date: "2025-01-20",
                match_time: "18:00",
                venue_id: 1,
                venue_name: "Elite Sports Complex",
                notes: "Looking for intermediate players for doubles",
                status: "open"
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
        setTimeout(() => {
            this.createRevenueChart();
            this.createPeakHoursChart();
            this.initializeBookingCalendar();
        }, 200);
    }

    // Load admin dashboard
    loadAdminDashboard() {
        setTimeout(() => this.createPlatformChart(), 200);
        this.loadPendingFacilities();
        this.loadUsersList();
    }

    // Load pending facilities for admin approval
    loadPendingFacilities() {
        const pendingContainer = document.getElementById('pendingFacilities');
        if (!pendingContainer) return;

        if (this.pendingFacilities.length === 0) {
            pendingContainer.innerHTML = '<p class="text-center text-muted">No pending facilities for approval.</p>';
            return;
        }

        pendingContainer.innerHTML = this.pendingFacilities.map(facility => `
            <div class="facility-approval-item">
                <div class="facility-approval-header">
                    <div>
                        <h6 class="facility-name">${facility.name}</h6>
                        <p class="mb-1">${facility.description}</p>
                        <small class="text-muted">
                            <i class="fas fa-map-marker-alt"></i> ${facility.address}<br>
                            <i class="fas fa-phone"></i> ${facility.phone}<br>
                            <i class="fas fa-envelope"></i> ${facility.email}
                        </small>
                    </div>
                    <span class="facility-status pending">Pending Approval</span>
                </div>
                <div class="facility-approval-actions">
                    <button class="btn btn--primary btn--sm" onclick="approveFacility(${facility.id})">
                        <i class="fas fa-check"></i> Approve
                    </button>
                    <button class="btn btn--secondary btn--sm" onclick="rejectFacility(${facility.id})">
                        <i class="fas fa-times"></i> Reject
                    </button>
                    <button class="btn btn--outline btn--sm" onclick="viewFacilityPhotos(${facility.id})">
                        <i class="fas fa-images"></i> View Photos
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Load users list for admin management
    loadUsersList() {
        const usersContainer = document.getElementById('usersList');
        if (!usersContainer) return;

        usersContainer.innerHTML = this.users.map(user => `
            <div class="user-item">
                <div class="user-info">
                    <div class="user-avatar">
                        ${user.full_name.charAt(0).toUpperCase()}
                    </div>
                    <div class="user-details">
                        <h6>${user.full_name}</h6>
                        <small>${user.email} • ${user.role.replace('_', ' ')}</small>
                    </div>
                </div>
                <div class="user-actions">
                    <button class="btn btn--outline btn--sm" onclick="viewUserBookings(${user.id})">
                        <i class="fas fa-calendar"></i> Bookings
                    </button>
                    <button class="btn btn--secondary btn--sm" onclick="toggleUserStatus(${user.id})">
                        ${user.status === 'active' ? '<i class="fas fa-ban"></i> Ban' : '<i class="fas fa-check"></i> Unban'}
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Create revenue chart
    createRevenueChart() {
        const ctx = document.getElementById('revenueChart');
        if (ctx && ctx.getContext) {
            const textColor = getComputedStyle(document.documentElement).getPropertyValue('--color-text').trim() || '#111827';
            const gridColor = getComputedStyle(document.documentElement).getPropertyValue('--color-card-border').trim() || 'rgba(0,0,0,0.08)';
            this._revenueChart = new Chart(ctx, {
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
                        legend: { display: false }
                    },
                    scales: {
                        x: {
                            ticks: { color: textColor },
                            grid: { color: gridColor }
                        },
                        y: {
                            beginAtZero: true,
                            ticks: {
                                color: textColor,
                                callback: function (value) { return '₹' + value.toLocaleString(); }
                            },
                            grid: { color: gridColor }
                        }
                    }
                }
            });
        }
    }

    // Create peak hours chart
    createPeakHoursChart() {
        const ctx = document.getElementById('peakHoursChart');
        if (ctx && ctx.getContext) {
            const textColor = getComputedStyle(document.documentElement).getPropertyValue('--color-text').trim() || '#111827';
            const gridColor = getComputedStyle(document.documentElement).getPropertyValue('--color-card-border').trim() || 'rgba(0,0,0,0.08)';
            this._peakHoursChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM'],
                    datasets: [{
                        label: 'Bookings',
                        data: [5, 8, 12, 15, 18, 25, 30, 22, 10],
                        backgroundColor: 'rgba(31, 184, 205, 0.8)',
                        borderColor: '#1FB8CD',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { ticks: { color: textColor }, grid: { color: gridColor } },
                        y: { beginAtZero: true, ticks: { color: textColor }, grid: { color: gridColor } }
                    }
                }
            });
        }
    }

    // Create platform analytics chart
    createPlatformChart() {
        const ctx = document.getElementById('platformChart');
        if (ctx && ctx.getContext) {
            const textColor = getComputedStyle(document.documentElement).getPropertyValue('--color-text').trim() || '#111827';
            this._platformChart = new Chart(ctx, {
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
                        legend: { position: 'bottom', labels: { color: textColor } }
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
        const mainPhoto = venue.photos && venue.photos.length > 0 ? venue.photos[0].url : '';
        const minPrice = Math.min(...venue.courts.map(c => c.price_per_hour));
        const sportTypes = [...new Set(venue.courts.map(c => c.sport_type))];

        return `
            <div class="col-lg-4 col-md-6">
                <div class="venue-card">
                    ${mainPhoto ? `
                        <div class="venue-card-image" style="background-image: url('${mainPhoto}')">
                            <div class="venue-price-badge">From ₹${minPrice}/hr</div>
                            <div class="venue-sport-badge">${sportTypes.join(', ')}</div>
                        </div>
                    ` : ''}
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
                        <div class="d-flex gap-2 mb-3">
                            <button class="btn btn--outline flex-fill" onclick="window.app.showVenueDetails(${venue.id})">
                                View Details
                            </button>
                            <button class="btn btn--primary flex-fill" onclick="window.app.quickBook(${venue.id})">
                                Book Now
                            </button>
                        </div>
                        <div class="d-flex gap-2">
                            ${venue.photos && venue.photos.length > 0 ? `
                                <button class="btn btn--outline btn--sm flex-fill" onclick="window.app.showPhotoGallery(${venue.id})">
                                    <i class="fas fa-images"></i> Photos
                                </button>
                            ` : ''}
                            <button class="btn btn--outline btn--sm flex-fill" onclick="window.app.showReviewModal(${venue.id})">
                                <i class="fas fa-star"></i> Review
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
                        
                        ${venue.photos && venue.photos.length > 0 ? `
                            <h6 class="mt-4">Photos</h6>
                            <div class="venue-photo-grid">
                                ${venue.photos.slice(0, 4).map(photo => `
                                    <div class="venue-photo-item" onclick="window.app.showPhotoGallery(${venue.id})">
                                        <img src="${photo.url}" alt="${photo.caption}">
                                        <div class="venue-photo-overlay">${photo.caption}</div>
                                    </div>
                                `).join('')}
                                ${venue.photos.length > 4 ? `
                                    <div class="venue-photo-item" onclick="window.app.showPhotoGallery(${venue.id})">
                                        <div class="venue-photo-overlay">+${venue.photos.length - 4} more</div>
                                    </div>
                                ` : ''}
                            </div>
                        ` : ''}
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
                        
                        <div class="reviews-section">
                            <h6>Reviews</h6>
                            ${this.getVenueReviews(venue.id)}
                            <button class="btn btn--outline btn--sm mt-3" onclick="window.app.showReviewModal(${venue.id})">
                                <i class="fas fa-star"></i> Write a Review
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }

        if (modal && bootstrap.Modal) {
            new bootstrap.Modal(modal).show();
        }
    }

    // Get venue reviews
    getVenueReviews(venueId) {
        const venueReviews = this.reviews.filter(r => r.venue_id === venueId);
        
        if (venueReviews.length === 0) {
            return '<p class="text-muted">No reviews yet. Be the first to review!</p>';
        }

        return venueReviews.map(review => `
            <div class="review-item">
                <div class="review-header">
                    <span class="review-author">${review.user_name}</span>
                    <span class="review-date">${review.date}</span>
                </div>
                <div class="review-rating">
                    ${'★'.repeat(review.rating) + '☆'.repeat(5 - review.rating)}
                </div>
                <div class="review-title">${review.title}</div>
                <div class="review-text">${review.text}</div>
            </div>
        `).join('');
    }

    // Previous month in calendar
    previousMonth() {
        this.currentCalendarDate.setMonth(this.currentCalendarDate.getMonth() - 1);
        this.updateCalendar();
    }

    // Next month in calendar
    nextMonth() {
        this.currentCalendarDate.setMonth(this.currentCalendarDate.getMonth() + 1);
        this.updateCalendar();
    }

    // Select calendar date
    selectCalendarDate(dateString) {
        console.log('Selected date:', dateString);
        // You can implement date-specific actions here
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

        // Show payment modal instead of direct confirmation
        this.showPaymentModal();
    }

    // Submit review
    submitReview() {
        const rating = document.querySelectorAll('.rating-input i.filled').length;
        const title = document.getElementById('reviewTitle').value;
        const text = document.getElementById('reviewText').value;

        if (rating === 0) {
            alert('Please select a rating');
            return;
        }

        if (!title || !text) {
            alert('Please fill all review fields');
            return;
        }

        // Create new review
        const newReview = {
            id: this.reviews.length + 1,
            venue_id: this.currentReviewVenueId,
            user_id: this.currentUser.id,
            user_name: this.currentUser.full_name,
            rating: rating,
            title: title,
            text: text,
            date: new Date().toISOString().split('T')[0]
        };

        this.reviews.push(newReview);

        // Update venue rating
        const venue = this.venues.find(v => v.id === this.currentReviewVenueId);
        if (venue) {
            const venueReviews = this.reviews.filter(r => r.venue_id === venue.id);
            venue.rating = (venueReviews.reduce((sum, r) => sum + r.rating, 0) / venueReviews.length).toFixed(1);
            venue.total_reviews = venueReviews.length;
        }

        alert('Review submitted successfully!');
        
        const modal = document.getElementById('reviewModal');
        if (modal && bootstrap.Modal) {
            bootstrap.Modal.getInstance(modal)?.hide();
        }

        // Reset form
        document.getElementById('reviewForm').reset();
        document.querySelectorAll('.rating-input i').forEach(star => star.classList.remove('filled'));
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

    // Show photo gallery
    showPhotoGallery(venueId) {
        const venue = this.venues.find(v => v.id === venueId);
        if (!venue || !venue.photos) return;

        const modal = document.getElementById('photoGalleryModal');
        const carouselInner = document.getElementById('carouselInner');
        const carouselIndicators = document.getElementById('carouselIndicators');

        if (carouselInner && carouselIndicators) {
            carouselInner.innerHTML = venue.photos.map((photo, index) => `
                <div class="carousel-item ${index === 0 ? 'active' : ''}">
                    <img src="${photo.url}" class="d-block w-100" alt="${photo.caption}">
                    <div class="carousel-caption">
                        <h5>${photo.caption}</h5>
                    </div>
                </div>
            `).join('');

            carouselIndicators.innerHTML = venue.photos.map((_, index) => `
                <button type="button" data-bs-target="#photoGalleryCarousel" data-bs-slide-to="${index}" 
                        class="${index === 0 ? 'active' : ''}" aria-current="${index === 0 ? 'true' : 'false'}"></button>
            `).join('');
        }

        if (modal && bootstrap.Modal) {
            new bootstrap.Modal(modal).show();
        }
    }

    // Show review modal
    showReviewModal(venueId) {
        this.currentReviewVenueId = venueId;
        const modal = document.getElementById('reviewModal');
        if (modal && bootstrap.Modal) {
            new bootstrap.Modal(modal).show();
        }
    }

    // Initialize rating system
    initializeRatingSystem() {
        const ratingStars = document.querySelectorAll('.rating-input i');
        let selectedRating = 0;

        ratingStars.forEach(star => {
            star.addEventListener('click', () => {
                const rating = parseInt(star.dataset.rating);
                selectedRating = rating;
                
                // Update visual state
                ratingStars.forEach((s, index) => {
                    if (index < rating) {
                        s.classList.add('filled');
                    } else {
                        s.classList.remove('filled');
                    }
                });
            });

            star.addEventListener('mouseenter', () => {
                const rating = parseInt(star.dataset.rating);
                ratingStars.forEach((s, index) => {
                    if (index < rating) {
                        s.classList.add('active');
                    } else {
                        s.classList.remove('active');
                    }
                });
            });

            star.addEventListener('mouseleave', () => {
                ratingStars.forEach(s => s.classList.remove('active'));
                ratingStars.forEach((s, index) => {
                    if (index < selectedRating) {
                        s.classList.add('filled');
                    } else {
                        s.classList.remove('filled');
                    }
                });
            });
        });
    }

    // Show match modal
    showMatchModal() {
        if (!this.currentUser) {
            alert('Please login to create or join matches');
            this.showSection('auth');
            return;
        }

        this.loadAvailableMatches();
        const modal = document.getElementById('matchModal');
        if (modal && bootstrap.Modal) {
            new bootstrap.Modal(modal).show();
        }
    }

    // Load available matches
    loadAvailableMatches() {
        const matchesContainer = document.getElementById('availableMatches');
        if (!matchesContainer) return;

        const availableMatches = this.matches.filter(match => 
            match.status === 'open' && match.creator_id !== this.currentUser.id
        );

        if (availableMatches.length === 0) {
            matchesContainer.innerHTML = '<p class="text-center text-muted">No available matches at the moment.</p>';
            return;
        }

        matchesContainer.innerHTML = availableMatches.map(match => `
            <div class="available-match">
                <div class="match-info">
                    <span class="match-sport">${match.sport_type}</span>
                    <span class="match-skill">${match.skill_level}</span>
                </div>
                <div class="match-details">
                    <p><i class="fas fa-calendar"></i> ${match.match_date} at ${match.match_time}</p>
                    <p><i class="fas fa-users"></i> ${match.current_players}/${match.players_needed} players</p>
                    <p><i class="fas fa-map-marker-alt"></i> ${match.venue_name}</p>
                    <p><i class="fas fa-user"></i> Created by ${match.creator_name}</p>
                    ${match.notes ? `<p><i class="fas fa-sticky-note"></i> ${match.notes}</p>` : ''}
                </div>
                <button class="btn btn--primary btn--sm" onclick="joinMatch(${match.id})">
                    <i class="fas fa-plus"></i> Join Match
                </button>
            </div>
        `).join('');
    }

    // Create new match
    createMatch() {
        const sportType = document.getElementById('matchSportType').value;
        const skillLevel = document.getElementById('matchSkillLevel').value;
        const playersNeeded = parseInt(document.getElementById('playersNeeded').value);
        const matchDate = document.getElementById('matchDate').value;
        const matchTime = document.getElementById('matchTime').value;
        const notes = document.getElementById('matchNotes').value;

        if (!sportType || !skillLevel || !playersNeeded || !matchDate || !matchTime) {
            alert('Please fill all required fields');
            return;
        }

        const newMatch = {
            id: this.matches.length + 1,
            creator_id: this.currentUser.id,
            creator_name: this.currentUser.full_name,
            sport_type: sportType,
            skill_level: skillLevel,
            players_needed: playersNeeded,
            current_players: 1,
            match_date: matchDate,
            match_time: matchTime,
            venue_id: 1, // Default venue for demo
            venue_name: "Elite Sports Complex",
            notes: notes,
            status: 'open'
        };

        this.matches.push(newMatch);
        alert('Match created successfully!');
        
        const modal = document.getElementById('matchModal');
        if (modal && bootstrap.Modal) {
            bootstrap.Modal.getInstance(modal)?.hide();
        }
    }

    // Join existing match
    joinMatch(matchId) {
        const match = this.matches.find(m => m.id === matchId);
        if (!match) return;

        if (match.current_players >= match.players_needed) {
            alert('This match is already full');
            return;
        }

        match.current_players++;
        if (match.current_players >= match.players_needed) {
            match.status = 'full';
        }

        alert('Successfully joined the match!');
        this.loadAvailableMatches();
    }

    // Show payment modal
    showPaymentModal() {
        if (!this.selectedCourtForBooking) return;

        // Populate payment summary
        const date = document.getElementById('bookingDate')?.value;
        const startTime = document.getElementById('bookingStartTime')?.value;
        const duration = parseInt(document.getElementById('bookingDuration')?.value || 1);

        if (date && startTime && duration) {
            document.getElementById('paymentVenueName').textContent = this.selectedCourtForBooking.venueName;
            document.getElementById('paymentCourtName').textContent = this.selectedCourtForBooking.courtName;
            document.getElementById('paymentDateTime').textContent = `${date} at ${startTime}`;
            document.getElementById('paymentDuration').textContent = `${duration} hour(s)`;
            document.getElementById('paymentTotal').textContent = `₹${this.selectedCourtForBooking.pricePerHour * duration}`;
        }

        const modal = document.getElementById('paymentModal');
        if (modal && bootstrap.Modal) {
            bootstrap.Modal.getInstance(document.getElementById('bookingModal'))?.hide();
            new bootstrap.Modal(modal).show();
        }
    }

    // Process payment
    processPayment() {
        const cardNumber = document.getElementById('cardNumber').value;
        const expiryDate = document.getElementById('expiryDate').value;
        const cvv = document.getElementById('cvv').value;
        const cardholderName = document.getElementById('cardholderName').value;

        if (!cardNumber || !expiryDate || !cvv || !cardholderName) {
            alert('Please fill all payment details');
            return;
        }

        // Simulate payment processing
        const submitBtn = document.querySelector('#paymentModal .btn--primary');
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<div class="loading"></div> Processing...';
        submitBtn.disabled = true;

        setTimeout(() => {
            // Simulate successful payment
            alert('Payment successful! Your booking has been confirmed.');
            
            // Create the actual booking
            this.createBookingAfterPayment();
            
            // Close payment modal
            const modal = document.getElementById('paymentModal');
            if (modal && bootstrap.Modal) {
                bootstrap.Modal.getInstance(modal)?.hide();
            }

            // Reset form
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            document.getElementById('paymentForm').reset();

            // Refresh dashboard
            if (this.currentSection === 'userDashboard') {
                this.loadUserDashboard();
            }
        }, 2000);
    }

    // Create booking after successful payment
    createBookingAfterPayment() {
        const date = document.getElementById('bookingDate')?.value;
        const startTime = document.getElementById('bookingStartTime')?.value;
        const duration = parseInt(document.getElementById('bookingDuration')?.value || 1);

        if (!date || !startTime || !duration || !this.selectedCourtForBooking) return;

        // Calculate end time
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const endHour = startHour + duration;
        const endTime = `${endHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`;

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
        this.selectedCourtForBooking = null;
    }

    // Show add court modal
    showAddCourtModal() {
        const modal = document.getElementById('addCourtModal');
        if (modal && bootstrap.Modal) {
            new bootstrap.Modal(modal).show();
        }
    }

    // Add new court
    addNewCourt() {
        const name = document.getElementById('newCourtName').value;
        const sportType = document.getElementById('newCourtSportType').value;
        const price = parseInt(document.getElementById('newCourtPrice').value);
        const startTime = document.getElementById('newCourtStartTime').value;
        const endTime = document.getElementById('newCourtEndTime').value;

        if (!name || !sportType || !price || !startTime || !endTime) {
            alert('Please fill all fields');
            return;
        }

        // Add court to the first venue (demo logic)
        const newCourt = {
            id: this.venues[0].courts.length + 1,
            name: name,
            sport_type: sportType,
            price_per_hour: price,
            operating_start_time: startTime,
            operating_end_time: endTime
        };

        this.venues[0].courts.push(newCourt);
        alert('Court added successfully!');
        
        const modal = document.getElementById('addCourtModal');
        if (modal && bootstrap.Modal) {
            bootstrap.Modal.getInstance(modal)?.hide();
        }
    }

    // Show facility edit modal
    showFacilityEditModal() {
        const venue = this.venues[0]; // Demo: edit first venue
        if (!venue) return;

        document.getElementById('editFacilityName').value = venue.name;
        document.getElementById('editFacilityDescription').value = venue.description;
        document.getElementById('editFacilityPhone').value = venue.phone;
        document.getElementById('editFacilityEmail').value = venue.email;
        document.getElementById('editFacilityAddress').value = venue.address;
        document.getElementById('editFacilityAmenities').value = venue.amenities.join(', ');

        const modal = document.getElementById('editFacilityModal');
        if (modal && bootstrap.Modal) {
            new bootstrap.Modal(modal).show();
        }
    }

    // Update facility
    updateFacility() {
        const name = document.getElementById('editFacilityName').value;
        const description = document.getElementById('editFacilityDescription').value;
        const phone = document.getElementById('editFacilityPhone').value;
        const email = document.getElementById('editFacilityEmail').value;
        const address = document.getElementById('editFacilityAddress').value;
        const amenities = document.getElementById('editFacilityAmenities').value.split(',').map(a => a.trim());

        if (!name || !description || !phone || !email || !address) {
            alert('Please fill all required fields');
            return;
        }

        // Update venue (demo logic)
        const venue = this.venues[0];
        venue.name = name;
        venue.description = description;
        venue.phone = phone;
        venue.email = email;
        venue.address = address;
        venue.amenities = amenities;

        alert('Facility updated successfully!');
        
        const modal = document.getElementById('editFacilityModal');
        if (modal && bootstrap.Modal) {
            bootstrap.Modal.getInstance(modal)?.hide();
        }
    }

    // Show time slot modal
    showTimeSlotModal() {
        const modal = document.getElementById('timeSlotModal');
        if (modal && bootstrap.Modal) {
            this.populateTimeSlotCourtSelect();
            new bootstrap.Modal(modal).show();
        }
    }

    // Populate time slot court select
    populateTimeSlotCourtSelect() {
        const courtSelect = document.getElementById('timeSlotCourtSelect');
        if (!courtSelect) return;

        courtSelect.innerHTML = '<option value="">Select Court</option>';
        this.venues[0].courts.forEach(court => {
            const option = document.createElement('option');
            option.value = court.id;
            option.textContent = court.name;
            courtSelect.appendChild(option);
        });
    }

    // Apply time slot changes
    applyTimeSlotChanges() {
        const courtId = document.getElementById('timeSlotCourtSelect').value;
        const date = document.getElementById('timeSlotDate').value;
        const action = document.getElementById('timeSlotAction').value;

        if (!courtId || !date || !action) {
            alert('Please select court, date and action');
            return;
        }

        alert(`Time slot changes applied for court ${courtId} on ${date}`);
        
        const modal = document.getElementById('timeSlotModal');
        if (modal && bootstrap.Modal) {
            bootstrap.Modal.getInstance(modal)?.hide();
        }
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

// New global functions for enhanced features
window.showPhotoGallery = function (venueId) {
    if (window.app) {
        window.app.showPhotoGallery(venueId);
    }
};

window.showReviewModal = function (venueId) {
    if (window.app) {
        window.app.showReviewModal(venueId);
    }
};

window.showMatchModal = function () {
    if (window.app) {
        window.app.showMatchModal();
    }
};

window.createMatch = function () {
    if (window.app) {
        window.app.createMatch();
    }
};

window.joinMatch = function (matchId) {
    if (window.app) {
        window.app.joinMatch(matchId);
    }
};

window.processPayment = function () {
    if (window.app) {
        window.app.processPayment();
    }
};

window.submitReview = function () {
    if (window.app) {
        window.app.submitReview();
    }
};

window.showAddCourtModal = function () {
    if (window.app) {
        window.app.showAddCourtModal();
    }
};

window.addNewCourt = function () {
    if (window.app) {
        window.app.addNewCourt();
    }
};

window.showFacilityEditModal = function () {
    if (window.app) {
        window.app.showFacilityEditModal();
    }
};

window.updateFacility = function () {
    if (window.app) {
        window.app.updateFacility();
    }
};

window.showTimeSlotModal = function () {
    if (window.app) {
        window.app.showTimeSlotModal();
    }
};

window.applyTimeSlotChanges = function () {
    if (window.app) {
        window.app.applyTimeSlotChanges();
    }
};

window.previousMonth = function () {
    if (window.app) {
        window.app.previousMonth();
    }
};

window.nextMonth = function () {
    if (window.app) {
        window.app.nextMonth();
    }
};

window.selectCalendarDate = function (dateString) {
    if (window.app) {
        window.app.selectCalendarDate(dateString);
    }
};

// Admin functions
window.approveFacility = function (facilityId) {
    if (window.app) {
        // Move facility from pending to approved
        const facility = window.app.pendingFacilities.find(f => f.id === facilityId);
        if (facility) {
            facility.status = 'approved';
            facility.approved_date = new Date().toISOString().split('T')[0];
            window.app.venues.push({
                ...facility,
                rating: 0,
                total_reviews: 0,
                courts: []
            });
            window.app.pendingFacilities = window.app.pendingFacilities.filter(f => f.id !== facilityId);
            window.app.loadPendingFacilities();
            alert('Facility approved successfully!');
        }
    }
};

window.rejectFacility = function (facilityId) {
    if (window.app) {
        window.app.pendingFacilities = window.app.pendingFacilities.filter(f => f.id !== facilityId);
        window.app.loadPendingFacilities();
        alert('Facility rejected successfully!');
    }
};

window.viewFacilityPhotos = function (facilityId) {
    if (window.app) {
        const facility = window.app.pendingFacilities.find(f => f.id === facilityId);
        if (facility && facility.photos) {
            // Show photos in a simple modal
            let photosHTML = facility.photos.map(photo => `
                <img src="${photo.url}" alt="${photo.caption}" style="max-width: 100%; margin-bottom: 10px;">
                <p class="text-center">${photo.caption}</p>
            `).join('');
            alert('Facility Photos:\n' + facility.photos.map(p => p.caption).join('\n'));
        }
    }
};

window.viewUserBookings = function (userId) {
    if (window.app) {
        const userBookings = window.app.bookings.filter(b => b.user_id === userId);
        if (userBookings.length > 0) {
            const bookingsList = userBookings.map(booking => 
                `${booking.venue_name} - ${booking.court_name} on ${booking.booking_date}`
            ).join('\n');
            alert('User Bookings:\n' + bookingsList);
        } else {
            alert('No bookings found for this user.');
        }
    }
};

window.toggleUserStatus = function (userId) {
    if (window.app) {
        const user = window.app.users.find(u => u.id === userId);
        if (user) {
            user.status = user.status === 'active' ? 'banned' : 'active';
            window.app.loadUsersList();
            alert(`User ${user.full_name} ${user.status === 'active' ? 'unbanned' : 'banned'} successfully!`);
        }
    }
};

window.toggleTheme = function () {
    if (window.app) {
        window.app.toggleTheme();
    }
};

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM loaded, initializing QuickCourt app...');
    window.app = new QuickCourtApp();
    console.log('QuickCourt app initialized:', window.app);
});