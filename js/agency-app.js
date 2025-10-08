// Agency App
class AgencyApp {
    constructor() {
        this.state = {
            currentSection: 'deliveries',
            deliveries: [],
            products: []
        };
    }

    initialize() {
        console.log('🚚 Initializing Agency App');
        
        this.loadSampleData();
        this.renderAgencyApp();
    }

    renderAgencyApp() {
        const appContainer = document.getElementById('agencyApp');
        
        appContainer.innerHTML = `
            <div class="agency-app">
                <header class="agency-header">
                    <div class="header-content">
                        <div class="greeting">
                            <h1>Good Morning, Rajesh! 🚚</h1>
                            <p>You have ${this.state.deliveries.length} deliveries today</p>
                        </div>
                        <div class="header-stats">
                            <div class="stat-item">
                                <span class="stat-number">${this.getCompletedDeliveries()}</span>
                                <span class="stat-label">Completed</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-number">${this.getPendingDeliveries()}</span>
                                <span class="stat-label">Pending</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="agency-nav">
                        <button class="agency-nav-btn ${this.state.currentSection === 'deliveries' ? 'active' : ''}" 
                                onclick="agencyApp.showSection('deliveries')">
                            Deliveries
                        </button>
                        <button class="agency-nav-btn ${this.state.currentSection === 'products' ? 'active' : ''}" 
                                onclick="agencyApp.showSection('products')">
                            Product Management
                        </button>
                    </div>
                </header>

                <main class="agency-main">
                    ${this.state.currentSection === 'deliveries' ? this.renderDeliveries() : ''}
                    ${this.state.currentSection === 'products' ? this.renderProductManagement() : ''}
                </main>
            </div>
        `;
    }

    renderDeliveries() {
        return `
            <div class="delivery-list-container">
                <h2 class="section-title">Today's Deliveries</h2>
                <div class="deliveries-list">
                    ${this.state.deliveries.map(delivery => `
                        <div class="delivery-card ${delivery.status}">
                            <div class="delivery-card-header">
                                <div class="customer-info">
                                    <h3>${delivery.customerName}</h3>
                                    <p class="delivery-time">${delivery.timeSlot}</p>
                                </div>
                                <div class="delivery-status ${delivery.status === 'pending' ? 'status-pending' : 'status-completed'}">
                                    ${delivery.status === 'pending' ? 'Pending' : 'Completed'}
                                </div>
                            </div>
                            <div class="delivery-details">
                                <p><strong>Address:</strong> ${delivery.address}</p>
                                <p><strong>Items:</strong> ${delivery.items.join(', ')}</p>
                                <p><strong>Amount:</strong> ₹${delivery.amount}</p>
                            </div>
                            <div class="delivery-actions">
                                <button class="action-btn" onclick="agencyApp.callCustomer('${delivery.phone}')">
                                    <span class="material-icons">call</span>
                                    Call
                                </button>
                                <button class="action-btn" onclick="agencyApp.startNavigation('${delivery.address}')">
                                    <span class="material-icons">directions</span>
                                    Navigate
                                </button>
                                ${delivery.status === 'pending' ? `
                                    <button class="action-btn primary" onclick="agencyApp.markDelivered(${delivery.id})">
                                        <span class="material-icons">check_circle</span>
                                        Mark Delivered
                                    </button>
                                ` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderProductManagement() {
        return `
            <div class="management-section">
                <h2 class="section-title">Product Management</h2>
                <div class="products-management">
                    ${this.state.products.map(product => `
                        <div class="management-card">
                            <h3>${product.name}</h3>
                            <p><strong>Current Price:</strong> ₹${product.price}</p>
                            <p><strong>Stock:</strong> ${product.stock} units</p>
                            <p><strong>Status:</strong> ${product.available ? 'Available' : 'Out of Stock'}</p>
                            <div class="action-buttons" style="margin-top: 15px;">
                                <button class="btn-primary" onclick="agencyApp.editProduct(${product.id})">
                                    Edit Product
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    showSection(section) {
        this.state.currentSection = section;
        this.renderAgencyApp();
    }

    loadSampleData() {
        // Sample deliveries data
        this.state.deliveries = [
            {
                id: 1,
                customerName: "Anita Sharma",
                phone: "+91 9876543210",
                address: "123 Main Street, Apartment 4B",
                timeSlot: "7:00 - 7:15 AM",
                items: ["1L Milk × 2", "Curd × 1"],
                amount: 100,
                status: "pending"
            },
            {
                id: 2,
                customerName: "Raj Kumar",
                phone: "+91 9876543211",
                address: "456 Oak Avenue, Floor 2",
                timeSlot: "7:15 - 7:30 AM",
                items: ["500ml Milk × 1"],
                amount: 30,
                status: "completed"
            }
        ];

        // Sample products data
        this.state.products = [
            {
                id: 1,
                name: "Fresh Cow Milk 1L",
                price: 30,
                stock: 50,
                available: true
            },
            {
                id: 2,
                name: "Buffalo Milk 1L",
                price: 40,
                stock: 30,
                available: true
            },
            {
                id: 3,
                name: "Fresh Curd 500g",
                price: 40,
                stock: 20,
                available: true
            }
        ];
    }

    getCompletedDeliveries() {
        return this.state.deliveries.filter(d => d.status === 'completed').length;
    }

    getPendingDeliveries() {
        return this.state.deliveries.filter(d => d.status === 'pending').length;
    }

    // Delivery methods
    callCustomer(phone) {
        this.showNotification(`📞 Calling customer at ${phone}`);
    }

    startNavigation(address) {
        this.showNotification(`🗺️ Navigating to: ${address}`);
    }

    markDelivered(deliveryId) {
        const delivery = this.state.deliveries.find(d => d.id === deliveryId);
        if (delivery) {
            delivery.status = 'completed';
            this.renderAgencyApp();
            this.showNotification(`✅ Delivery completed for ${delivery.customerName}`);
        }
    }

    editProduct(productId) {
        this.showNotification(`✏️ Editing product #${productId}`);
    }

    showNotification(message) {
        // Create a simple notification
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4A90E2;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 1000;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 3000);
    }
}

// Initialize agency app
const agencyApp = new AgencyApp();

function initializeAgencyApp() {
    console.log('🚚 Initializing Agency App');
    agencyApp.initialize();
}

// Make globally available
window.agencyApp = agencyApp;
window.initializeAgencyApp = initializeAgencyApp;
