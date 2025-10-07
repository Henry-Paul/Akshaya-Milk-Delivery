class MilkFlowApp {
    constructor() {
        this.currentUser = null;
        this.currentRole = null;
        this.currentPage = 'dashboard';
        this.customers = [];
        this.agencies = [];
        this.orders = [];
        this.plans = [];
        this.brandSettings = {};
        
        this.init();
    }

    init() {
        this.loadData();
        this.setupEventListeners();
        this.checkAuthStatus();
        this.setupWhatsAppIntegration();
        
        setTimeout(() => {
            this.hideLoadingScreen();
        }, 2000);
    }

    loadData() {
        // Load all data from localStorage
        const savedData = localStorage.getItem('milkflow_data');
        if (savedData) {
            const data = JSON.parse(savedData);
            this.customers = data.customers || [];
            this.agencies = data.agencies || [];
            this.orders = data.orders || [];
            this.plans = data.plans || [];
            this.brandSettings = data.brandSettings || {};
        } else {
            this.initializeDemoData();
        }

        const savedUser = localStorage.getItem('milkflow_user');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.currentRole = this.currentUser.role;
        }
    }

    saveData() {
        const data = {
            customers: this.customers,
            agencies: this.agencies,
            orders: this.orders,
            plans: this.plans,
            brandSettings: this.brandSettings
        };
        localStorage.setItem('milkflow_data', JSON.stringify(data));
    }

    initializeDemoData() {
        // Demo Agencies
        this.agencies = [
            {
                id: 'agency1',
                name: 'Fresh Milk Dairy',
                displayName: 'Fresh Milk',
                owner: 'Rajesh Kumar',
                email: 'rajesh@freshmilk.com',
                phone: '9876543210',
                address: '123 Dairy Farm, Bangalore',
                location: { lat: 12.9716, lng: 77.5946 },
                experience: '3 years',
                rating: 4.5,
                totalCustomers: 150,
                subscription: 'trial',
                trialEnds: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
                brandSettings: {
                    primaryColor: '#10b981',
                    businessName: 'Fresh Milk Dairy',
                    logo: '',
                    description: 'Fresh milk delivered daily to your doorstep'
                }
            }
        ];

        // Demo Customers
        this.customers = [
            {
                id: 'cust1',
                agencyId: 'agency1',
                name: 'Anita Sharma',
                phone: '9876543211',
                address: '456 Main Street, Bangalore',
                location: { lat: 12.9716, lng: 77.5946 },
                currentPlan: {
                    package: '1l',
                    duration: 30,
                    startDate: new Date().toISOString(),
                    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                    dailyRate: 30,
                    status: 'active'
                },
                orders: []
            }
        ];

        // Demo Plans
        this.plans = [
            {
                id: 'plan1',
                agencyId: 'agency1',
                packages: [
                    { size: '500ml', dailyRate: 15, description: 'Perfect for singles' },
                    { size: '1l', dailyRate: 30, description: 'Ideal for couples', popular: true },
                    { size: '2l', dailyRate: 55, description: 'Great for families' }
                ],
                durations: [
                    { days: 15, discount: 0 },
                    { days: 30, discount: 10 },
                    { days: 90, discount: 15 }
                ]
            }
        ];

        this.saveData();
    }

    setupEventListeners() {
        // Burger menu
        document.getElementById('burgerMenu').addEventListener('click', () => this.toggleSidebar());
        document.getElementById('closeSidebar').addEventListener('click', () => this.toggleSidebar());
        document.getElementById('sidebarOverlay').addEventListener('click', () => this.toggleSidebar());

        // Navigation items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.currentTarget.dataset.page;
                this.showPage(page);
                this.toggleSidebar();
            });
        });

        // Package selection
        document.querySelectorAll('.package-option').forEach(option => {
            option.addEventListener('click', (e) => {
                this.selectPackage(e.currentTarget.dataset.package);
            });
        });

        // Duration selection
        document.querySelectorAll('.duration-option').forEach(option => {
            option.addEventListener('click', (e) => {
                this.selectDuration(parseInt(e.currentTarget.dataset.duration));
            });
        });

        // Vini Solutions link
        document.getElementById('viniSolutions').addEventListener('click', (e) => {
            e.preventDefault();
            this.showViniModal();
        });

        // Plan start date
        document.getElementById('planStartDate').addEventListener('change', (e) => {
            this.updatePlanSummary();
        });
    }

    setupWhatsAppIntegration() {
        // WhatsApp automation for trial warnings
        this.checkTrialStatus();
        setInterval(() => this.checkTrialStatus(), 60 * 60 * 1000); // Check every hour
    }

    checkTrialStatus() {
        if (this.currentRole === 'agency') {
            const agency = this.agencies.find(a => a.id === this.currentUser.agencyId);
            if (agency && agency.subscription === 'trial') {
                const trialEnds = new Date(agency.trialEnds);
                const now = new Date();
                const daysLeft = Math.ceil((trialEnds - now) / (1000 * 60 * 60 * 24));

                if (daysLeft === 3) {
                    this.sendWhatsAppNotification('trial_warning_3_days');
                } else if (daysLeft === 2) {
                    this.sendWhatsAppNotification('trial_warning_2_days');
                } else if (daysLeft === 1) {
                    this.sendWhatsAppNotification('trial_warning_1_day');
                } else if (daysLeft <= 0) {
                    this.sendWhatsAppNotification('trial_ended');
                    agency.subscription = 'expired';
                    this.saveData();
                }
            }
        }
    }

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        
        sidebar.classList.toggle('hidden');
        overlay.classList.toggle('hidden');
        
        if (!sidebar.classList.contains('hidden')) {
            this.loadAgencyInfo();
        }
    }

    loadAgencyInfo() {
        if (this.currentRole === 'customer') {
            const agency = this.agencies.find(a => a.id === this.currentUser.agencyId);
            if (agency) {
                document.getElementById('agencyInfo').classList.remove('hidden');
                document.getElementById('agencyDisplayName').textContent = agency.displayName || agency.name;
                document.getElementById('agencyRating').textContent = agency.rating;
                document.getElementById('agencyLocation').textContent = agency.address;
                document.getElementById('agencyExperience').textContent = agency.experience;
                document.getElementById('agencyCustomers').textContent = agency.totalCustomers;
                document.getElementById('ownerName').textContent = agency.owner;
                
                // Load logo if exists
                if (agency.brandSettings?.logo) {
                    document.getElementById('agencyLogo').src = agency.brandSettings.logo;
                    document.getElementById('ownerImage').src = agency.brandSettings.logo;
                }
            }
        }

        // Show appropriate footer
        document.getElementById('agencyFooter').classList.toggle('hidden', this.currentRole !== 'agency');
    }

    showPage(pageName) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        // Show selected page
        document.getElementById(pageName + 'Page').classList.add('active');
        this.currentPage = pageName;

        // Load page-specific data
        this.loadPageData(pageName);
    }

    loadPageData(pageName) {
        switch (pageName) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'orders':
                this.loadOrders();
                break;
            case 'plans':
                this.loadPlansPage();
                break;
            case 'location':
                this.loadLocationPage();
                break;
            case 'branding':
                this.loadBrandingPage();
                break;
        }
    }

    loadDashboard() {
        if (this.currentRole === 'customer') {
            this.loadCustomerDashboard();
        } else if (this.currentRole === 'agency') {
            this.loadAgencyDashboard();
        }
    }

    loadCustomerDashboard() {
        const customer = this.customers.find(c => c.id === this.currentUser.id);
        if (customer && customer.currentPlan) {
            const plan = customer.currentPlan;
            document.getElementById('currentPlanName').textContent = 
                `Daily ${this.getPackageDisplayName(plan.package)} Milk Plan`;
            document.getElementById('currentPackage').textContent = 
                this.getPackageDisplayName(plan.package);
            document.getElementById('planStartDate').textContent = 
                new Date(plan.startDate).toLocaleDateString();
            document.getElementById('nextBillingDate').textContent = 
                new Date(plan.endDate).toLocaleDateString();
            document.getElementById('monthlyCost').textContent = 
                plan.dailyRate * 30;
        }

        // Load orders count
        const customerOrders = this.orders.filter(o => o.customerId === this.currentUser.id);
        document.getElementById('totalOrders').textContent = customerOrders.length;
        document.getElementById('activeDeliveries').textContent = 
            customerOrders.filter(o => o.status === 'delivered').length;
    }

    selectPackage(packageSize) {
        document.querySelectorAll('.package-option').forEach(option => {
            option.classList.remove('active');
        });
        
        document.querySelector(`[data-package="${packageSize}"]`).classList.add('active');
        this.updatePlanSummary();
    }

    selectDuration(duration) {
        document.querySelectorAll('.duration-option').forEach(option => {
            option.classList.remove('active');
        });
        
        document.querySelector(`[data-duration="${duration}"]`).classList.add('active');
        this.updatePlanSummary();
    }

    updatePlanSummary() {
        const selectedPackage = document.querySelector('.package-option.active')?.dataset.package;
        const selectedDuration = document.querySelector('.duration-option.active')?.dataset.duration;
        const startDate = document.getElementById('planStartDate').value;

        if (selectedPackage && selectedDuration) {
            const packageInfo = this.getPackageInfo(selectedPackage);
            const durationInfo = this.getDurationInfo(parseInt(selectedDuration));
            
            document.getElementById('summaryPackage').textContent = this.getPackageDisplayName(selectedPackage);
            document.getElementById('summaryDuration').textContent = `${selectedDuration} days`;
            document.getElementById('summaryStartDate').textContent = 
                startDate ? new Date(startDate).toLocaleDateString() : 'Not selected';
            
            const totalAmount = packageInfo.dailyRate * parseInt(selectedDuration);
            document.getElementById('summaryAmount').textContent = totalAmount;
        }
    }

    getPackageInfo(packageSize) {
        const packages = {
            '500ml': { dailyRate: 15, displayName: '500ml' },
            '1l': { dailyRate: 30, displayName: '1 Liter' },
            '2l': { dailyRate: 55, displayName: '2 Liter' }
        };
        return packages[packageSize] || packages['1l'];
    }

    getPackageDisplayName(packageSize) {
        const info = this.getPackageInfo(packageSize);
        return info.displayName;
    }

    getDurationInfo(duration) {
        const durations = {
            15: { discount: 0 },
            30: { discount: 10 },
            90: { discount: 15 }
        };
        return durations[duration] || durations[30];
    }

    setStartDate(type) {
        const dateInput = document.getElementById('planStartDate');
        const today = new Date();
        
        if (type === 'today') {
            dateInput.value = today.toISOString().split('T')[0];
        } else if (type === 'tomorrow') {
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            dateInput.value = tomorrow.toISOString().split('T')[0];
        }
        
        this.updatePlanSummary();
    }

    confirmPlan() {
        const selectedPackage = document.querySelector('.package-option.active')?.dataset.package;
        const selectedDuration = document.querySelector('.duration-option.active')?.dataset.duration;
        const startDate = document.getElementById('planStartDate').value;

        if (!selectedPackage || !selectedDuration || !startDate) {
            this.showToast('Error', 'Please complete all plan details', 'error');
            return;
        }

        const packageInfo = this.getPackageInfo(selectedPackage);
        const customer = this.customers.find(c => c.id === this.currentUser.id);
        
        if (customer) {
            customer.currentPlan = {
                package: selectedPackage,
                duration: parseInt(selectedDuration),
                startDate: startDate,
                endDate: new Date(new Date(startDate).getTime() + parseInt(selectedDuration) * 24 * 60 * 60 * 1000).toISOString(),
                dailyRate: packageInfo.dailyRate,
                status: 'active'
            };

            this.saveData();
            this.showToast('Success', 'Plan updated successfully!', 'success');
            this.showPage('dashboard');
            
            // Send WhatsApp confirmation
            this.sendWhatsAppNotification('plan_updated', {
                package: selectedPackage,
                duration: selectedDuration,
                startDate: startDate
            });
        }
    }

    loadOrders() {
        const ordersList = document.getElementById('ordersList');
        const customerOrders = this.orders.filter(o => o.customerId === this.currentUser.id);
        
        if (customerOrders.length === 0) {
            ordersList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-shopping-basket"></i>
                    <h3>No Orders Yet</h3>
                    <p>Your order history will appear here</p>
                </div>
            `;
            return;
        }

        ordersList.innerHTML = customerOrders.map(order => `
            <div class="order-card ${order.status}">
                <div class="order-header">
                    <div class="order-id">Order #${order.id.slice(-6)}</div>
                    <div class="order-status ${order.status}">${order.status}</div>
                </div>
                <div class="order-details">
                    <div class="order-date">
                        <i class="fas fa-calendar"></i>
                        ${new Date(order.date).toLocaleDateString()}
                    </div>
                    <div class="order-package">
                        <i class="fas fa-box"></i>
                        ${this.getPackageDisplayName(order.package)}
                    </div>
                    <div class="order-amount">
                        <i class="fas fa-rupee-sign"></i>
                        ₹${order.amount}
                    </div>
                </div>
                ${order.status === 'delivered' ? `
                <div class="order-actions">
                    <button class="btn btn-outline btn-sm" onclick="app.rateOrder('${order.id}')">
                        <i class="fas fa-star"></i> Rate Delivery
                    </button>
                </div>
                ` : ''}
            </div>
        `).join('');
    }

    loadLocationPage() {
        const customer = this.customers.find(c => c.id === this.currentUser.id);
        if (customer) {
            document.getElementById('deliveryAddress').value = customer.address || '';
            document.getElementById('deliveryLandmark').value = customer.landmark || '';
            document.getElementById('deliveryInstructions').value = customer.instructions || '';
            
            if (customer.location) {
                document.getElementById('locationLat').textContent = customer.location.lat;
                document.getElementById('locationLng').textContent = customer.location.lng;
            }
        }
    }

    saveLocation() {
        const address = document.getElementById('deliveryAddress').value;
        const landmark = document.getElementById('deliveryLandmark').value;
        const instructions = document.getElementById('deliveryInstructions').value;

        if (!address) {
            this.showToast('Error', 'Please enter delivery address', 'error');
            return;
        }

        const customer = this.customers.find(c => c.id === this.currentUser.id);
        if (customer) {
            customer.address = address;
            customer.landmark = landmark;
            customer.instructions = instructions;
            
            this.saveData();
            this.showToast('Success', 'Delivery location updated!', 'success');
            
            // Send WhatsApp notification to agency
            this.sendWhatsAppNotification('location_updated');
        }
    }

    useCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    
                    document.getElementById('locationLat').textContent = lat.toFixed(6);
                    document.getElementById('locationLng').textContent = lng.toFixed(6);
                    
                    this.showToast('Success', 'Current location captured!', 'success');
                },
                (error) => {
                    this.showToast('Error', 'Unable to get current location', 'error');
                }
            );
        } else {
            this.showToast('Error', 'Geolocation not supported', 'error');
        }
    }

    openGoogleMaps() {
        const lat = document.getElementById('locationLat').textContent;
        const lng = document.getElementById('locationLng').textContent;
        const url = `https://www.google.com/maps?q=${lat},${lng}`;
        window.open(url, '_blank');
    }

    // Brand Customization
    loadBrandingPage() {
        const agency = this.agencies.find(a => a.id === this.currentUser.agencyId);
        if (agency && agency.brandSettings) {
            const settings = agency.brandSettings;
            
            document.getElementById('businessName').value = settings.businessName || '';
            document.getElementById('primaryColor').value = settings.primaryColor || '#10b981';
            document.getElementById('colorValue').textContent = settings.primaryColor || '#10b981';
            document.getElementById('businessDescription').value = settings.description || '';
            
            if (settings.logo) {
                document.getElementById('logoPreview').innerHTML = 
                    `<img src="${settings.logo}" alt="Business Logo">`;
            }
            
            this.updateBrandPreview();
        }
    }

    updateBrandPreview() {
        const businessName = document.getElementById('businessName').value || 'Your Business';
        const primaryColor = document.getElementById('primaryColor').value;
        
        document.getElementById('previewBrandName').textContent = businessName;
        document.getElementById('previewBusinessName').textContent = businessName;
        document.getElementById('previewHeader').style.backgroundColor = primaryColor;
        document.getElementById('colorValue').textContent = primaryColor;
        
        // Update CSS variables for real-time preview
        document.documentElement.style.setProperty('--brand-primary', primaryColor);
    }

    handleLogoUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                document.getElementById('logoPreview').innerHTML = 
                    `<img src="${e.target.result}" alt="Business Logo">`;
            };
            reader.readAsDataURL(file);
        }
    }

    saveBrandSettings() {
        const agency = this.agencies.find(a => a.id === this.currentUser.agencyId);
        if (agency) {
            agency.brandSettings = {
                businessName: document.getElementById('businessName').value,
                primaryColor: document.getElementById('primaryColor').value,
                logo: document.getElementById('logoPreview').querySelector('img')?.src || '',
                description: document.getElementById('businessDescription').value
            };

            // Update agency display name
            agency.displayName = agency.brandSettings.businessName;

            this.saveData();
            this.showToast('Success', 'Brand settings saved!', 'success');
            
            // Update UI in real-time
            document.getElementById('brandName').textContent = agency.displayName;
        }
    }

    resetBrandSettings() {
        const defaultSettings = {
            businessName: 'MilkFlow',
            primaryColor: '#10b981',
            logo: '',
            description: ''
        };

        document.getElementById('businessName').value = defaultSettings.businessName;
        document.getElementById('primaryColor').value = defaultSettings.primaryColor;
        document.getElementById('businessDescription').value = defaultSettings.description;
        document.getElementById('logoPreview').innerHTML = '';
        
        this.updateBrandPreview();
        this.showToast('Info', 'Brand settings reset to default', 'info');
    }

    // ViNi Business Solutions
    showViniModal() {
        document.getElementById('viniModal').classList.remove('hidden');
    }

    closeViniModal() {
        document.getElementById('viniModal').classList.add('hidden');
    }

    contactVini() {
        const phone = '8317581308';
        const message = 'Hello ViNi Business Solutions, I am interested in your services.';
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    }

    // WhatsApp Integration
    sendWhatsAppNotification(type, data = null) {
        const messages = {
            welcome: `🚀 Welcome to MilkFlow! Your 5-day agency trial has started. Manage your milk delivery business efficiently.`,
            trial_warning_3_days: `⏰ Trial Alert: 3 days left in your MilkFlow trial. Subscribe now to continue uninterrupted service.`,
            trial_warning_2_days: `🚨 Trial Alert: Only 2 days left! Your MilkFlow trial ends soon. Choose a plan to continue.`,
            trial_warning_1_day: `⚠️ Final Reminder: 1 day left in your MilkFlow trial. Subscribe now to avoid service interruption.`,
            trial_ended: `🔒 Your MilkFlow trial has ended. Subscribe now to reactivate your account and continue serving customers.`,
            plan_updated: `✅ Plan Updated: Your milk subscription has been updated to ${data.package} for ${data.duration} days starting ${data.startDate}.`,
            location_updated: `📍 Delivery location updated for customer. Please check the new address.`,
            payment_received: `💳 Payment received from customer. Thank you for your prompt payment.`
        };

        const message = messages[type];
        if (message) {
            // In production, this would call your backend WhatsApp API
            console.log('WhatsApp Notification:', message);
            
            // Simulate sending to customer/agency phone
            if (this.currentUser?.phone) {
                const phone = this.currentUser.phone;
                const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
                // window.open(url, '_blank'); // Uncomment to actually send
            }
        }
    }

    makePayment() {
        const customer = this.customers.find(c => c.id === this.currentUser.id);
        if (customer && customer.currentPlan) {
            const amount = customer.currentPlan.dailyRate * 30; // Monthly amount
            
            // Show payment modal
            this.showToast('Info', `Payment of ₹${amount} initiated`, 'info');
            
            // Simulate payment processing
            setTimeout(() => {
                this.showToast('Success', `Payment of ₹${amount} completed!`, 'success');
                this.sendWhatsAppNotification('payment_received');
            }, 2000);
        }
    }

    // Utility Methods
    showToast(title, message, type = 'info') {
        // Toast implementation from previous code
    }

    checkAuthStatus() {
        // Auth implementation from previous code
    }

    // ... All other methods from previous implementation
}

// Global functions
function showSubscriptionModal() {
    app.showSubscriptionModal();
}

function closeSubscriptionModal() {
    app.closeSubscriptionModal();
}

// Initialize app
const app = new MilkFlowApp();
