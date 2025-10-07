// Akshaya Milk Delivery Application
class MilkFlowApp {
    constructor() {
        this.currentUser = null;
        this.currentRole = null;
        this.currentPage = 'dashboard';
        this.init();
    }

    init() {
        console.log('🚀 Initializing Akshaya Milk Delivery App...');
        this.setupEventListeners();
        this.checkAuthStatus();
        
        // Simulate loading
        setTimeout(() => {
            this.hideLoadingScreen();
        }, 2000);
    }

    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Auth tabs
        const tabButtons = document.querySelectorAll('.tab-btn');
        if (tabButtons.length > 0) {
            tabButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    this.switchAuthTab(e.target.dataset.tab);
                });
            });
        }

        // Role selection
        const roleRadios = document.querySelectorAll('input[name="role"]');
        if (roleRadios.length > 0) {
            roleRadios.forEach(radio => {
                radio.addEventListener('change', (e) => {
                    this.toggleRoleFields(e.target.value);
                });
            });
        }

        // Forms
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        const signupForm = document.getElementById('signupForm');
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => this.handleSignup(e));
        }

        // Burger menu
        const burgerMenu = document.getElementById('burgerMenu');
        if (burgerMenu) {
            burgerMenu.addEventListener('click', () => this.toggleSidebar());
        }

        const closeSidebar = document.getElementById('closeSidebar');
        if (closeSidebar) {
            closeSidebar.addEventListener('click', () => this.toggleSidebar());
        }

        const sidebarOverlay = document.getElementById('sidebarOverlay');
        if (sidebarOverlay) {
            sidebarOverlay.addEventListener('click', () => this.toggleSidebar());
        }

        // User menu
        const userMenuBtn = document.getElementById('userMenuBtn');
        if (userMenuBtn) {
            userMenuBtn.addEventListener('click', () => this.toggleUserMenu());
        }

        // Navigation items
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.currentTarget.dataset.page;
                if (page) {
                    this.showPage(page);
                    this.toggleSidebar();
                }
            });
        });

        // Dropdown actions
        const dropdownItems = document.querySelectorAll('.dropdown-item');
        dropdownItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const action = e.target.closest('.dropdown-item').dataset.action;
                this.handleUserAction(action);
            });
        });

        // Vini Solutions link
        const viniLink = document.getElementById('viniSolutions');
        if (viniLink) {
            viniLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showViniModal();
            });
        }

        console.log('Event listeners setup complete!');
    }

    switchAuthTab(tab) {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tab);
        });
        
        document.querySelectorAll('.auth-form').forEach(form => {
            form.classList.toggle('active', form.id === `${tab}Form`);
        });
    }

    toggleRoleFields(role) {
        const agencyFields = document.getElementById('agencyFields');
        const customerFields = document.getElementById('customerFields');
        
        if (agencyFields) agencyFields.classList.toggle('hidden', role !== 'agency');
        if (customerFields) customerFields.classList.toggle('hidden', role !== 'customer');
    }

    async handleLogin(e) {
        e.preventDefault();
        console.log('Login attempt...');
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        if (!email || !password) {
            this.showToast('Error', 'Please fill all fields', 'error');
            return;
        }

        this.showLoading('Logging in...');
        
        // Simulate API call
        setTimeout(() => {
            const role = email.includes('owner') ? 'owner' : 
                        email.includes('agency') ? 'agency' : 'customer';
            
            this.currentUser = {
                id: 'user1',
                name: role === 'owner' ? 'Business Owner' : 
                     role === 'agency' ? 'Rajesh Kumar' : 'Anita Sharma',
                email: email,
                phone: '9876543210',
                role: role,
                agencyId: role === 'agency' ? 'agency1' : null
            };

            localStorage.setItem('milkflow_user', JSON.stringify(this.currentUser));
            this.currentRole = role;
            
            this.hideLoading();
            this.showAuthScreen(false);
            this.showDashboard();
            this.showToast('Success', 'Login successful!', 'success');
            
            console.log('User logged in:', this.currentUser);
        }, 1500);
    }

    async handleSignup(e) {
        e.preventDefault();
        console.log('Signup attempt...');
        
        const formData = new FormData(e.target);
        const role = formData.get('role');
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const phone = document.getElementById('signupPhone').value;
        const password = document.getElementById('signupPassword').value;

        if (!name || !email || !phone || !password) {
            this.showToast('Error', 'Please fill all required fields', 'error');
            return;
        }

        this.showLoading('Creating account...');

        setTimeout(() => {
            this.currentUser = {
                id: 'user_' + Date.now(),
                name: name,
                email: email,
                phone: phone,
                role: role,
                agencyId: role === 'agency' ? 'agency_' + Date.now() : null
            };

            localStorage.setItem('milkflow_user', JSON.stringify(this.currentUser));
            
            this.currentRole = role;
            this.hideLoading();
            this.showAuthScreen(false);
            this.showDashboard();
            this.showToast('Success', 'Account created successfully!', 'success');
            
            console.log('New user created:', this.currentUser);
        }, 2000);
    }

    checkAuthStatus() {
        console.log('Checking auth status...');
        const savedUser = localStorage.getItem('milkflow_user');
        
        if (savedUser) {
            try {
                this.currentUser = JSON.parse(savedUser);
                this.currentRole = this.currentUser.role;
                console.log('User found:', this.currentUser);
                this.showAuthScreen(false);
                this.showDashboard();
            } catch (error) {
                console.error('Error parsing user data:', error);
                this.showAuthScreen(true);
            }
        } else {
            console.log('No user found, showing auth screen');
            this.showAuthScreen(true);
        }
    }

    showAuthScreen(show) {
        const authScreen = document.getElementById('authScreen');
        const app = document.getElementById('app');
        
        if (authScreen && app) {
            if (show) {
                authScreen.classList.remove('hidden');
                app.classList.add('hidden');
            } else {
                authScreen.classList.add('hidden');
                app.classList.remove('hidden');
            }
        } else {
            console.error('Auth screen or app container not found!');
        }
    }

    showDashboard() {
        console.log('Showing dashboard for role:', this.currentRole);
        
        // Hide all dashboards
        document.querySelectorAll('.dashboard').forEach(dash => {
            dash.classList.add('hidden');
        });

        // Show appropriate dashboard
        const dashboardId = `${this.currentRole}Dashboard`;
        const dashboard = document.getElementById(dashboardId);
        
        if (dashboard) {
            dashboard.classList.remove('hidden');
            this.updateUIForRole();
        } else {
            console.error('Dashboard not found:', dashboardId);
        }
    }

    updateUIForRole() {
        const userName = document.getElementById('userName');
        if (userName && this.currentUser) {
            userName.textContent = this.currentUser.name;
        }

        // Show/hide navigation based on role
        document.getElementById('customerNav')?.classList.toggle('hidden', this.currentRole !== 'customer');
        document.getElementById('agencyNav')?.classList.toggle('hidden', this.currentRole !== 'agency');
        document.getElementById('ownerNav')?.classList.toggle('hidden', this.currentRole !== 'owner');
        document.getElementById('agencyFooter')?.classList.toggle('hidden', this.currentRole !== 'agency');

        if (this.currentRole === 'agency') {
            this.updateSubscriptionStatus();
        }
    }

    updateSubscriptionStatus() {
        const statusElement = document.getElementById('subscriptionStatus');
        const trialAlert = document.getElementById('trialAlert');
        const countdownElement = document.getElementById('trialCountdown');

        if (statusElement) {
            statusElement.innerHTML = '<span class="status-badge trial">5 Days Trial</span>';
        }

        if (trialAlert) {
            trialAlert.classList.remove('hidden');
        }

        if (countdownElement) {
            countdownElement.innerHTML = '<i class="fas fa-clock"></i><span>5 days trial remaining</span>';
        }
    }

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        
        if (sidebar && overlay) {
            const isOpen = !sidebar.classList.contains('hidden');
            
            if (isOpen) {
                sidebar.classList.add('hidden');
                overlay.classList.add('hidden');
            } else {
                sidebar.classList.remove('hidden');
                overlay.classList.remove('hidden');
                this.loadAgencyInfo();
            }
        }
    }

    loadAgencyInfo() {
        if (this.currentRole === 'customer') {
            const agencyInfo = document.getElementById('agencyInfo');
            if (agencyInfo) {
                agencyInfo.classList.remove('hidden');
            }
        }
    }

    toggleUserMenu() {
        const dropdown = document.getElementById('userDropdown');
        if (dropdown) {
            dropdown.classList.toggle('hidden');
        }
    }

    showPage(pageName) {
        console.log('Showing page:', pageName);
        
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.add('hidden');
        });

        // Show selected page
        const pageElement = document.getElementById(pageName + 'Page');
        if (pageElement) {
            pageElement.classList.remove('hidden');
            this.currentPage = pageName;
        } else {
            console.error('Page not found:', pageName + 'Page');
        }
    }

    handleUserAction(action) {
        console.log('User action:', action);
        switch (action) {
            case 'profile':
                this.showToast('Info', 'Profile page coming soon', 'info');
                break;
            case 'subscription':
                this.showSubscriptionModal();
                break;
            case 'support':
                this.contactSupport();
                break;
            case 'logout':
                this.logout();
                break;
        }
        this.toggleUserMenu();
    }

    showSubscriptionModal() {
        const modal = document.getElementById('subscriptionModal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    closeSubscriptionModal() {
        const modal = document.getElementById('subscriptionModal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    selectPlan(plan) {
        const plans = {
            monthly: { name: 'Monthly', price: 2000, duration: 'month' },
            quarterly: { name: '3 Months', price: 5800, duration: '3 months' },
            semiannual: { name: '6 Months', price: 11000, duration: '6 months' },
            annual: { name: 'Annual', price: 19500, duration: 'year' }
        };

        const selectedPlan = plans[plan];
        this.showToast('Success', `Selected ${selectedPlan.name} plan - ₹${selectedPlan.price}`, 'success');
        this.closeSubscriptionModal();
    }

    showViniModal() {
        const modal = document.getElementById('viniModal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    closeViniModal() {
        const modal = document.getElementById('viniModal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    contactVini() {
        const phone = '8317581308';
        const message = 'Hello ViNi Business Solutions, I am interested in your services.';
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    }

    contactSupport() {
        const phone = '8317581308';
        const message = 'Hello Akshaya Milk Support, I need help with...';
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    }

    makePayment() {
        this.showToast('Info', 'Payment functionality coming soon!', 'info');
    }

    logout() {
        this.currentUser = null;
        this.currentRole = null;
        localStorage.removeItem('milkflow_user');
        this.showAuthScreen(true);
        this.showToast('Info', 'Logged out successfully', 'info');
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            console.log('Loading screen hidden');
        }
    }

    showLoading(message = 'Loading...') {
        console.log('Showing loading:', message);
    }

    hideLoading() {
        console.log('Hiding loading');
    }

    showToast(title, message, type = 'info') {
        console.log(`[${type.toUpperCase()}] ${title}: ${message}`);
        
        // Simple alert for now - you can enhance this with proper toast notifications
        alert(`${title}: ${message}`);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing app...');
    window.app = new MilkFlowApp();
});

// Global functions for HTML onclick handlers
function showSubscriptionModal() {
    if (window.app) {
        window.app.showSubscriptionModal();
    }
}

function closeSubscriptionModal() {
    if (window.app) {
        window.app.closeSubscriptionModal();
    }
}

function selectPlan(plan) {
    if (window.app) {
        window.app.selectPlan(plan);
    }
}
