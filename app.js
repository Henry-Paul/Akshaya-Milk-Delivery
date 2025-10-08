// Complete MilkFlow SaaS Application
class MilkFlowApp {
    constructor() {
        this.currentUser = null;
        this.currentRole = null;
        this.currentPage = 'dashboard';
        this.data = this.loadData();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkAuthStatus();
        setTimeout(() => this.hideLoadingScreen(), 2000);
    }

    loadData() {
        const saved = localStorage.getItem('milkflow_data');
        if (saved) return JSON.parse(saved);
        
        // Initialize with demo data
        return {
            agencies: [
                {
                    id: 'agency1',
                    name: 'Fresh Milk Dairy',
                    owner: 'Rajesh Kumar',
                    email: 'rajesh@freshmilk.com',
                    phone: '9876543210',
                    address: '123 Dairy Farm, Bangalore',
                    subscription: 'trial',
                    trialEnds: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
                    customers: [],
                    revenue: 0,
                    brandSettings: {
                        primaryColor: '#10b981',
                        businessName: 'Fresh Milk Dairy'
                    }
                }
            ],
            customers: [],
            deliveries: [],
            payments: [],
            products: {
                organic: [],
                dairy: []
            }
        };
    }

    saveData() {
        localStorage.setItem('milkflow_data', JSON.stringify(this.data));
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

        // Navigation
        document.getElementById('burgerMenu').addEventListener('click', () => this.toggleSidebar());
        document.getElementById('closeSidebar').addEventListener('click', () => this.toggleSidebar());
        document.getElementById('sidebarOverlay').addEventListener('click', () => this.toggleSidebar());

        // User menu
        document.getElementById('userMenuBtn').addEventListener('click', () => this.toggleUserMenu());
        document.querySelectorAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleUserAction(e.target.closest('.dropdown-item').dataset.action);
            });
        });

        // Navigation items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.currentTarget.dataset.page;
                this.showPage(page);
                this.toggleSidebar();
            });
        });

        // Vini Solutions
        document.getElementById('viniSolutions').addEventListener('click', (e) => {
            e.preventDefault();
            this.showViniModal();
        });
    }

    // Authentication Methods
    async handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        if (!email || !password) {
            this.showToast('Error', 'Please fill all fields', 'error');
            return;
        }

        // Demo authentication
        const role = email.includes('owner') ? 'owner' : 
                    email.includes('agency') ? 'agency' : 'customer';
        
        this.currentUser = {
            id: 'user1',
            name: role === 'owner' ? 'Business Owner' : 
                 role === 'agency' ? 'Rajesh Kumar' : 'Anita Sharma',
            email: email,
            phone: '9876543210',
            role: role,
            agencyId: role === 'agency' ? 'agency1' : 
                     role === 'customer' ? 'agency1' : null
        };

        localStorage.setItem('milkflow_user', JSON.stringify(this.currentUser));
        this.currentRole = role;
        
        this.showAuthScreen(false);
        this.showDashboard();
        this.showToast('Success', 'Login successful!', 'success');
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

        this.currentUser = {
            id: 'user_' + Date.now(),
            name: name,
            email: email,
            phone: phone,
            role: role,
            agencyId: role === 'agency' ? 'agency_' + Date.now() : 
                     role === 'customer' ? 'agency1' : null
        };

        if (role === 'agency') {
            const newAgency = {
                id: this.currentUser.agencyId,
                name: document.getElementById('agencyName').value || `${name}'s Dairy`,
                owner: name,
                email: email,
                phone: phone,
                address: document.getElementById('agencyAddress').value,
                subscription: 'trial',
                trialEnds: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
                customers: [],
                revenue: 0,
                brandSettings: {
                    primaryColor: '#10b981',
                    businessName: document.getElementById('agencyName').value || `${name}'s Dairy`
                }
            };
            this.data.agencies.push(newAgency);
        } else if (role === 'customer') {
            const newCustomer = {
                id: 'cust_' + Date.now(),
                name: name,
                email: email,
                phone: phone,
                address: document.getElementById('customerAddress').value,
                agencyId: 'agency1',
                currentPlan: null,
                deliveries: [],
                payments: []
            };
            this.data.customers.push(newCustomer);
        }

        localStorage.setItem('milkflow_user', JSON.stringify(this.currentUser));
        this.saveData();
        
        this.currentRole = role;
        this.showAuthScreen(false);
        this.showDashboard();
        this.showToast('Success', 'Account created successfully!', 'success');
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

    // UI Navigation Methods
    showAuthScreen(show) {
        document.getElementById('authScreen').classList.toggle('hidden', !show);
        document.getElementById('app').classList.toggle('hidden', show);
    }

    showDashboard() {
        // Hide all dashboards
        document.querySelectorAll('.dashboard-page').forEach(page => {
            page.classList.remove('active');
        });

        // Show appropriate dashboard
        const dashboardId = `${this.currentRole}Dashboard`;
        document.getElementById(dashboardId).classList.add('active');

        this.updateUIForRole();
        this.loadDashboardData();
    }

    updateUIForRole() {
        // Update user name
        document.getElementById('userName').textContent = this.currentUser.name;

        // Show/hide navigation based on role
        document.getElementById('customerNav').classList.toggle('hidden', this.currentRole !== 'customer');
        document.getElementById('agencyNav').classList.toggle('hidden', this.currentRole !== 'agency');
        document.getElementById('ownerNav').classList.toggle('hidden', this.currentRole !== 'owner');
        document.getElementById('agencyFooter').classList.toggle('hidden', this.currentRole !== 'agency');

        // Update subscription status for agencies
        if (this.currentRole === 'agency') {
            this.updateSubscriptionStatus();
        }

        // Load agency info for customers
        if (this.currentRole === 'customer') {
            this.loadAgencyInfo();
        }
    }

    loadDashboardData() {
        switch (this.currentRole) {
            case 'owner':
                this.loadOwnerDashboard();
                break;
            case 'agency':
                this.loadAgencyDashboard();
                break;
            case 'customer':
                this.loadCustomerDashboard();
                break;
        }
    }

    // Owner Dashboard
    loadOwnerDashboard() {
        const totalRevenue = this.data.agencies.reduce((sum, agency) => sum + agency.revenue, 0);
        const totalAgencies = this.data.agencies.length;
        const totalCustomers = this.data.customers.length;
        const activeAgencies = this.data.agencies.filter(a => a.subscription !== 'trial').length;
        const conversionRate = totalAgencies > 0 ? Math.round((activeAgencies / totalAgencies) * 100) : 0;

        // Update stats
        document.getElementById('totalRevenue').textContent = totalRevenue.toLocaleString();
        document.getElementById('totalAgencies').textContent = totalAgencies;
        document.getElementById('totalCustomers').textContent = totalCustomers;
        document.getElementById('conversionRate').textContent = conversionRate + '%';

        // Load recent agencies
        this.loadRecentAgencies();
    }

    loadRecentAgencies() {
        const container = document.getElementById('recentAgencies');
        const recentAgencies = this.data.agencies.slice(0, 5);
        
        container.innerHTML = recentAgencies.map(agency => `
            <div class="agency-card">
                <div class="agency-header">
                    <h4>${agency.name}</h4>
                    <span class="status-badge ${agency.subscription}">${agency.subscription}</span>
                </div>
                <div class="agency-details">
                    <p><i class="fas fa-user"></i> ${agency.owner}</p>
                    <p><i class="fas fa-users"></i> ${agency.customers.length} customers</p>
                    <p><i class="fas fa-rupee-sign"></i> ₹${agency.revenue.toLocaleString()} revenue</p>
                </div>
                <div class="agency-actions">
                    <button class="btn btn-outline btn-sm" onclick="app.viewAgency('${agency.id}')">
                        View Details
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Agency Dashboard
    loadAgencyDashboard() {
        const agency = this.data.agencies.find(a => a.id === this.currentUser.agencyId);
        if (!agency) return;

        const agencyCustomers = this.data.customers.filter(c => c.agencyId === agency.id);
        const today = new Date().toDateString();
        const todayDeliveries = this.data.deliveries.filter(d => 
            d.agencyId === agency.id && new Date(d.date).toDateString() === today
        ).length;

        const monthlyRevenue = this.calculateMonthlyRevenue(agency.id);
        const pendingPayments = this.calculatePendingPayments(agency.id);

        // Update stats
        document.getElementById('agencyCustomers').textContent = agencyCustomers.length;
        document.getElementById('todayDeliveries').textContent = todayDeliveries;
        document.getElementById('monthlyRevenue').textContent = monthlyRevenue.toLocaleString();
        document.getElementById('pendingPayments').textContent = pendingPayments.toLocaleString();

        // Load recent customers
        this.loadRecentCustomers(agencyCustomers);
    }

    loadRecentCustomers(customers) {
        const container = document.getElementById('recentCustomers');
        const recentCustomers = customers.slice(0, 5);
        
        container.innerHTML = recentCustomers.map(customer => `
            <div class="customer-card">
                <div class="customer-header">
                    <h4>${customer.name}</h4>
                    <span class="status-badge ${customer.currentPlan ? 'active' : 'inactive'}">
                        ${customer.currentPlan ? 'Active' : 'Inactive'}
                    </span>
                </div>
                <div class="customer-details">
                    <p><i class="fas fa-phone"></i> ${customer.phone}</p>
                    <p><i class="fas fa-map-marker-alt"></i> ${customer.address.substring(0, 50)}...</p>
                </div>
                <div class="customer-actions">
                    <button class="btn btn-outline btn-sm" onclick="app.viewCustomer('${customer.id}')">
                        View Details
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Customer Dashboard
    loadCustomerDashboard() {
        const customer = this.data.customers.find(c => c.id === this.currentUser.id);
        if (!customer) return;

        const customerDeliveries = this.data.deliveries.filter(d => d.customerId === customer.id);
        const currentMonth = new Date().getMonth();
        const monthlyDeliveries = customerDeliveries.filter(d => 
            new Date(d.date).getMonth() === currentMonth
        );
        
        const deliveredCount = monthlyDeliveries.filter(d => d.status === 'delivered').length;
        const monthlyAmount = this.calculateCustomerMonthlyAmount(customer.id);
        const pendingAmount = this.calculateCustomerPendingAmount(customer.id);
        const avgPackets = deliveredCount > 0 ? 
            Math.round(monthlyDeliveries.reduce((sum, del) => sum + del.packets, 0) / deliveredCount) : 0;

        // Update stats
        document.getElementById('customerDeliveries').textContent = deliveredCount;
        document.getElementById('customerAmount').textContent = monthlyAmount;
        document.getElementById('customerPending').textContent = pendingAmount;
        document.getElementById('avgPackets').textContent = avgPackets;

        // Load current plan
        this.loadCurrentPlan(customer);
        
        // Load recent deliveries
        this.loadRecentDeliveries(customerDeliveries);
    }

    loadCurrentPlan(customer) {
        const container = document.getElementById('currentPlanOverview');
        
        if (customer.currentPlan) {
            const plan = customer.currentPlan;
            container.innerHTML = `
                <div class="plan-badge active">Active</div>
                <h3>Daily ${this.getPackageDisplayName(plan.package)} Milk Plan</h3>
                <div class="plan-details">
                    <div class="detail-item">
                        <span class="label">Package:</span>
                        <span class="value">${this.getPackageDisplayName(plan.package)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Started:</span>
                        <span class="value">${new Date(plan.startDate).toLocaleDateString()}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Next Billing:</span>
                        <span class="value">${new Date(plan.endDate).toLocaleDateString()}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Monthly Cost:</span>
                        <span class="value">₹${plan.dailyRate * 30}</span>
                    </div>
                </div>
            `;
        } else {
            container.innerHTML = `
                <div class="no-plan">
                    <i class="fas fa-calendar-times"></i>
                    <h3>No Active Plan</h3>
                    <p>You don't have an active milk plan. Subscribe now to start receiving deliveries.</p>
                    <button class="btn btn-primary" onclick="app.showPage('plans')">
                        Choose a Plan
                    </button>
                </div>
            `;
        }
    }

    loadRecentDeliveries(deliveries) {
        const container = document.getElementById('recentDeliveries');
        const recentDeliveries = deliveries.slice(-5).reverse();
        
        container.innerHTML = recentDeliveries.map(delivery => `
            <div class="delivery-item ${delivery.status}">
                <i class="fas fa-${delivery.status === 'delivered' ? 'check' : 'times'}-circle"></i>
                <div class="delivery-content">
                    <p><strong>${delivery.packets} packet${delivery.packets > 1 ? 's' : ''} ${delivery.status}</strong></p>
                    <span class="delivery-time">${new Date(delivery.date).toLocaleDateString()}</span>
                </div>
                <div class="delivery-amount">₹${delivery.amount}</div>
            </div>
        `).join('');
    }

    // Page Navigation
    showPage(pageName) {
        this.currentPage = pageName;
        
        // Hide all dashboard pages
        document.querySelectorAll('.dashboard-page').forEach(page => {
            page.classList.remove('active');
        });

        // Load page content
        this.loadPageContent(pageName);
    }

    loadPageContent(pageName) {
        const container = document.getElementById('pageContent');
        
        switch (pageName) {
            case 'plans':
                this.loadPlansPage(container);
                break;
            case 'orders':
                this.loadOrdersPage(container);
                break;
            case 'customers':
                this.loadCustomersPage(container);
                break;
            case 'agencies':
                this.loadAgenciesPage(container);
                break;
            // Add more pages as needed
            default:
                this.showDashboard();
                break;
        }
    }

    loadPlansPage(container) {
        container.innerHTML = `
            <div class="page-content">
                <div class="page-header">
                    <h1>Choose Your Milk Plan</h1>
                    <p>Select your preferred package and subscription duration</p>
                </div>
                <div class="plans-selection">
                    <!-- Plans selection UI will be loaded here -->
                </div>
            </div>
        `;
        
        // Show this page and hide dashboard
        document.getElementById('customerDashboard').classList.remove('active');
        container.classList.add('active');
    }

    // Utility Methods
    calculateMonthlyRevenue(agencyId) {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        return this.data.deliveries
            .filter(d => d.agencyId === agencyId && 
                new Date(d.date).getMonth() === currentMonth &&
                new Date(d.date).getFullYear() === currentYear)
            .reduce((sum, del) => sum + del.amount, 0);
    }

    calculatePendingPayments(agencyId) {
        const agencyCustomers = this.data.customers.filter(c => c.agencyId === agencyId);
        return agencyCustomers.reduce((total, customer) => {
            return total + this.calculateCustomerPendingAmount(customer.id);
        }, 0);
    }

    calculateCustomerMonthlyAmount(customerId) {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        return this.data.deliveries
            .filter(d => d.customerId === customerId && 
                new Date(d.date).getMonth() === currentMonth &&
                new Date(d.date).getFullYear() === currentYear)
            .reduce((sum, del) => sum + del.amount, 0);
    }

    calculateCustomerPendingAmount(customerId) {
        const paidAmount = this.data.payments
            .filter(p => p.customerId === customerId && p.status === 'completed')
            .reduce((sum, payment) => sum + payment.amount, 0);
            
        const totalAmount = this.calculateCustomerMonthlyAmount(customerId);
        return Math.max(0, totalAmount - paidAmount);
    }

    getPackageDisplayName(packageSize) {
        const packages = {
            '500ml': '500ml',
            '1l': '1 Liter',
            '2l': '2 Liter'
        };
        return packages[packageSize] || '1 Liter';
    }

    // UI Components
    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        
        const isOpen = !sidebar.classList.contains('hidden');
        sidebar.classList.toggle('hidden', isOpen);
        overlay.classList.toggle('hidden', isOpen);
        
        if (!isOpen) {
            this.loadAgencyInfo();
        }
    }

    toggleUserMenu() {
        document.getElementById('userDropdown').classList.toggle('hidden');
    }

    loadAgencyInfo() {
        if (this.currentRole === 'customer') {
            const agency = this.data.agencies.find(a => a.id === this.currentUser.agencyId);
            if (agency) {
                document.getElementById('agencyInfo').classList.remove('hidden');
                document.getElementById('agencyDisplayName').textContent = agency.name;
                document.getElementById('agencyLocation').textContent = agency.address;
                document.getElementById('ownerName').textContent = agency.owner;
            }
        }
    }

    updateSubscriptionStatus() {
        const agency = this.data.agencies.find(a => a.id === this.currentUser.agencyId);
        if (!agency) return;

        const statusElement = document.getElementById('subscriptionStatus');
        const trialAlert = document.getElementById('trialAlert');
        const countdownElement = document.getElementById('trialCountdown');

        if (agency.subscription === 'trial') {
            const trialEnds = new Date(agency.trialEnds);
            const now = new Date();
            const daysLeft = Math.ceil((trialEnds - now) / (1000 * 60 * 60 * 24));

            if (daysLeft <= 2 && daysLeft > 0) {
                trialAlert.classList.remove('hidden');
                document.getElementById('trialDays').textContent = daysLeft;
            }

            if (daysLeft <= 0) {
                statusElement.innerHTML = '<span class="status-badge expired">Trial Expired</span>';
                countdownElement.innerHTML = '<i class="fas fa-exclamation-triangle"></i><span>Trial expired</span>';
            } else {
                statusElement.innerHTML = `<span class="status-badge trial">${daysLeft} Days Trial</span>`;
                countdownElement.innerHTML = `<i class="fas fa-clock"></i><span>${daysLeft} days trial remaining</span>`;
            }
        } else {
            statusElement.innerHTML = '<span class="status-badge active">Subscribed</span>';
            countdownElement.classList.add('hidden');
            trialAlert.classList.add('hidden');
        }
    }

    // Modal Methods
    showAddCustomerModal() {
        this.showModal(`
            <div class="modal-header">
                <h2>Add New Customer</h2>
                <button class="close-btn" onclick="app.closeModal()">&times;</button>
            </div>
            <form onsubmit="app.handleAddCustomer(event)">
                <div class="form-group">
                    <label>Customer Name *</label>
                    <input type="text" id="newCustomerName" required>
                </div>
                <div class="form-group">
                    <label>Phone Number *</label>
                    <input type="tel" id="newCustomerPhone" required>
                </div>
                <div class="form-group">
                    <label>Delivery Address *</label>
                    <textarea id="newCustomerAddress" required></textarea>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-outline" onclick="app.closeModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Add Customer</button>
                </div>
            </form>
        `);
    }

    handleAddCustomer(e) {
        e.preventDefault();
        const name = document.getElementById('newCustomerName').value;
        const phone = document.getElementById('newCustomerPhone').value;
        const address = document.getElementById('newCustomerAddress').value;

        const newCustomer = {
            id: 'cust_' + Date.now(),
            name: name,
            phone: phone,
            address: address,
            agencyId: this.currentUser.agencyId,
            currentPlan: null,
            deliveries: [],
            payments: []
        };

        this.data.customers.push(newCustomer);
        this.saveData();
        this.closeModal();
        this.showToast('Success', `Customer ${name} added successfully`, 'success');
        this.loadAgencyDashboard();
    }

    showModal(content) {
        const modalsContainer = document.getElementById('modalsContainer');
        modalsContainer.innerHTML = `
            <div class="modal-overlay active">
                <div class="modal">
                    ${content}
                </div>
            </div>
        `;
    }

    closeModal() {
        document.getElementById('modalsContainer').innerHTML = '';
    }

    showViniModal() {
        this.showModal(`
            <div class="modal-header">
                <h2>ViNi Business Solutions</h2>
                <button class="close-btn" onclick="app.closeModal()">&times;</button>
            </div>
            <div class="services-grid">
                <div class="service-card">
                    <div class="service-icon">
                        <i class="fas fa-laptop-code"></i>
                    </div>
                    <h3>Website Design</h3>
                    <p>Professional website development</p>
                </div>
                <div class="service-card">
                    <div class="service-icon">
                        <i class="fas fa-mobile-alt"></i>
                    </div>
                    <h3>Web Applications</h3>
                    <p>Custom web apps for your business</p>
                </div>
                <div class="service-card">
                    <div class="service-icon">
                        <i class="fas fa-cloud"></i>
                    </div>
                    <h3>SaaS Development</h3>
                    <p>Scalable software solutions</p>
                </div>
            </div>
        `);
    }

    // Other Methods
    handleUserAction(action) {
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
        this.showModal(`
            <div class="modal-header">
                <h2>Choose Your Plan</h2>
                <button class="close-btn" onclick="app.closeModal()">&times;</button>
            </div>
            <div class="subscription-plans">
                <div class="plan-option">
                    <h3>Monthly</h3>
                    <div class="price">₹2,000<span>/month</span></div>
                    <button class="btn btn-primary" onclick="app.selectPlan('monthly')">Choose Plan</button>
                </div>
                <div class="plan-option popular">
                    <h3>3 Months</h3>
                    <div class="price">₹5,800<span>/3 months</span></div>
                    <button class="btn btn-primary" onclick="app.selectPlan('quarterly')">Choose Plan</button>
                </div>
            </div>
        `);
    }

    selectPlan(plan) {
        const agency = this.data.agencies.find(a => a.id === this.currentUser.agencyId);
        if (agency) {
            agency.subscription = 'active';
            this.saveData();
            this.updateSubscriptionStatus();
            this.showToast('Success', 'Subscription activated successfully!', 'success');
            this.closeModal();
        }
    }

    contactSupport() {
        const phone = '8317581308';
        const message = 'Hello Akshaya Milk Support, I need help with...';
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    }

    logout() {
        this.currentUser = null;
        this.currentRole = null;
        localStorage.removeItem('milkflow_user');
        this.showAuthScreen(true);
        this.showToast('Info', 'Logged out successfully', 'info');
    }

    hideLoadingScreen() {
        document.getElementById('loadingScreen').classList.add('hidden');
    }

    showToast(title, message, type = 'info') {
        // Simple toast implementation
        alert(`${title}: ${message}`);
    }

    // Demo data methods
    viewAgency(agencyId) {
        this.showToast('Info', `Viewing agency ${agencyId}`, 'info');
    }

    viewCustomer(customerId) {
        this.showToast('Info', `Viewing customer ${customerId}`, 'info');
    }

    showPaymentModal() {
        this.showModal(`
            <div class="modal-header">
                <h2>Make Payment</h2>
                <button class="close-btn" onclick="app.closeModal()">&times;</button>
            </div>
            <div class="payment-options">
                <div class="payment-option">
                    <h3>UPI Payment</h3>
                    <p>Send payment to: 8317581308@ybl</p>
                    <button class="btn btn-primary" onclick="app.processUPIPayment()">Pay via UPI</button>
                </div>
                <div class="payment-option">
                    <h3>Cash Payment</h3>
                    <p>Pay directly to your milk agency</p>
                    <button class="btn btn-outline" onclick="app.recordCashPayment()">Mark as Paid</button>
                </div>
            </div>
        `);
    }

    processUPIPayment() {
        this.showToast('Success', 'UPI payment initiated!', 'success');
        this.closeModal();
    }

    recordCashPayment() {
        this.showToast('Success', 'Cash payment recorded!', 'success');
        this.closeModal();
    }
}

// Initialize the application
const app = new MilkFlowApp();
