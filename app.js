// MilkFlow SaaS Application
class MilkFlowApp {
    constructor() {
        this.currentUser = null;
        this.currentRole = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkAuthStatus();
        
        // Simulate loading
        setTimeout(() => {
            this.hideLoadingScreen();
        }, 2000);
    }

    setupEventListeners() {
        // Auth tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchAuthTab(e.target.dataset.tab);
            });
        });

        // Role selection
        document.querySelectorAll('input[name="role"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.toggleRoleFields(e.target.value);
            });
        });

        // Forms
        document.getElementById('loginForm').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('signupForm').addEventListener('submit', (e) => this.handleSignup(e));
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
        document.getElementById('agencyFields').classList.toggle('hidden', role !== 'agency');
        document.getElementById('customerFields').classList.toggle('hidden', role !== 'customer');
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        if (!email || !password) {
            this.showToast('Error', 'Please fill all fields', 'error');
            return;
        }

        this.showLoading('Logging in...');
        
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
        }, 1500);
    }

    async handleSignup(e) {
        e.preventDefault();
        
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
        }, 2000);
    }

    checkAuthStatus() {
        const savedUser = localStorage.getItem('milkflow_user');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.currentRole = this.currentUser.role;
            this.showAuthScreen(false);
            this.showDashboard();
        } else {
            this.showAuthScreen(true);
        }
    }

    showAuthScreen(show) {
        document.getElementById('authScreen').classList.toggle('hidden', !show);
        document.getElementById('app').classList.toggle('hidden', show);
    }

    showDashboard() {
        document.querySelectorAll('.dashboard').forEach(dash => {
            dash.classList.add('hidden');
        });

        const dashboardId = `${this.currentRole}Dashboard`;
        const dashboard = document.getElementById(dashboardId);
        if (dashboard) {
            dashboard.classList.remove('hidden');
        }

        this.updateUIForRole();
    }

    updateUIForRole() {
        document.getElementById('userName').textContent = this.currentUser.name;
    }

    hideLoadingScreen() {
        document.getElementById('loadingScreen').classList.add('hidden');
    }

    showLoading(message = 'Loading...') {
        document.body.style.pointerEvents = 'none';
        document.body.style.opacity = '0.7';
    }

    hideLoading() {
        document.body.style.pointerEvents = 'auto';
        document.body.style.opacity = '1';
    }

    showToast(title, message, type = 'info') {
        console.log(`[${type}] ${title}: ${message}`);
        // In a real app, you'd show a proper toast notification
        alert(`${title}: ${message}`);
    }

    logout() {
        this.currentUser = null;
        this.currentRole = null;
        localStorage.removeItem('milkflow_user');
        this.showAuthScreen(true);
        this.showToast('Info', 'Logged out successfully', 'info');
    }
}

// Initialize the application
const app = new MilkFlowApp();
