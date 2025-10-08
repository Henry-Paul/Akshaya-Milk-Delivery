// Agency App
class AgencyApp {
    constructor() {
        this.state = {
            currentSection: 'deliveries',
            deliveries: [],
            products: [],
            promotions: []
        };
    }

    initialize() {
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
                        <button class="agency-nav-btn ${this.state.currentSection === 'promotions' ? 'active' : ''}" 
                                onclick="agencyApp.showSection('promotions')">
                            Promotions
                        </button>
                    </div>
                </header>

                <main class="agency-main">
                    ${this.state.currentSection === 'deliveries' ? this.renderDeliveries() : ''}
                    ${this.state.currentSection === 'products' ? this.renderProductManagement() : ''}
                    ${this.state.currentSection === 'promotions' ? this.renderPromotions() : ''}
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
                            <div class="form-group">
                                <label>Current Price</label>
                                <input type="number" value="${product.price}" 
                                       onchange="agencyApp.updateProductPrice(${product.id}, this.value)">
                            </div>
                            <div class="form-group">
                                <label>Stock Quantity</label>
                                <input type="number" value="${product.stock}" 
                                       onchange="agencyApp.updateProductStock(${product.id}, this.value)">
                            </div>
                            <div class="form-group">
                                <label>Availability</label>
                                <select onchange="agencyApp.updateProductAvailability(${product.id}, this.value)">
                                    <option value="available" ${product.available ? 'selected' : ''}>Available</option>
                                    <option value="unavailable" ${!product.available ? 'selected' : ''}>Out of Stock</option>
                                </select>
                            </div>
                            <button class="btn-primary" onclick="agencyApp.saveProductChanges(${product.id})">
                                Save Changes
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderPromotions() {
        return `
            <div class="management-section">
                <h2 class="section-title">Promotion Management</h2>
                <div class="form-group">
                    <label>Promotion Title</label>
                    <input type="text" id="promoTitle" placeholder="e.g., Summer Special Offer">
                </div>
                <div class="form-group">
                    <label>Discount Percentage</label>
                    <input type="number" id="promoDiscount" placeholder="e.g., 20" min="1" max="100">
                </div>
                <div class="form-group">
                    <label>Valid Until</label>
                    <input type="date" id="promoValidUntil">
                </div>
                <button class="btn-primary" onclick="agencyApp.createPromotion()">
                    Create Promotion
                </button>

                <div class="promotions-list" style="margin-top: 24px;">
                    <h3>Active Promotions</h3>
                    ${this.state.promotions.map(promo => `
                        <div class="management-card">
                            <h4>${promo.title}</h4>
                            <p><strong>Discount:</strong> ${promo.discount}%</p>
                            <p><strong>Valid Until:</strong> ${promo.validUntil}</p>
                            <button class="btn-primary" onclick="agencyApp.deactivatePromotion(${promo.id})">
                                Deactivate
                            </button>
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

        // Sample promotions data
        this.state.promotions = [
            {
                id: 1,
                title: "Weekend Special",
                discount: 15,
                validUntil: "2024-12-31"
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
        alert(`Calling customer at ${phone}`);
    }

    startNavigation(address) {
        alert(`Starting navigation to: ${address}`);
    }

    markDelivered(deliveryId) {
        const delivery = this.state.deliveries.find(d => d.id === deliveryId);
        if (delivery) {
            delivery.status = 'completed';
            this.renderAgencyApp();
            this.showNotification(`Delivery marked as completed for ${delivery.customerName}`);
        }
    }

    // Product management methods
    updateProductPrice(productId, newPrice) {
        const product = this.state.products.find(p => p.id === productId);
        if (product) {
            product.newPrice = newPrice;
        }
    }

    updateProductStock(productId, newStock) {
        const product = this.state.products.find(p => p.id === productId);
        if (product) {
            product.newStock = newStock;
        }
    }

    updateProductAvailability(productId, availability) {
        const product = this.state.products.find(p => p.id === productId);
        if (product) {
            product.newAvailability = availability === 'available';
        }
    }

    saveProductChanges(productId) {
        const product = this.state.products.find(p => p.id === productId);
        if (product) {
            if (product.newPrice !== undefined) {
                product.price = product.newPrice;
                delete product.newPrice;
            }
            if (product.newStock !== undefined) {
                product.stock = product.newStock;
                delete product.newStock;
            }
            if (product.newAvailability !== undefined) {
                product.available = product.newAvailability;
                delete product.newAvailability;
            }
            this.renderAgencyApp();
            this.showNotification('Product changes saved successfully!');
        }
    }

    // Promotion methods
    createPromotion() {
        const title = document.getElementById('promoTitle').value;
        const discount = document.getElementById('promoDiscount').value;
        const validUntil = document.getElementById('promoValidUntil').value;

        if (!title || !discount || !validUntil) {
            this.showNotification('Please fill all promotion details', 'error');
            return;
        }

        const newPromotion = {
            id: Date.now(),
            title: title,
            discount: parseInt(discount),
            validUntil: validUntil
        };

        this.state.promotions.push(newPromotion);
        this.renderAgencyApp();
        this.showNotification('Promotion created successfully!');

        // Clear form
        document.getElementById('promoTitle').value = '';
        document.getElementById('promoDiscount').value = '';
        document.getElementById('promoValidUntil').value = '';
    }

    deactivatePromotion(promoId) {
        this.state.promotions = this.state.promotions.filter(p => p.id !== promoId);
        this.renderAgencyApp();
        this.showNotification('Promotion deactivated');
    }

    showNotification(message, type = 'success') {
        alert(message);
    }
}

// Initialize agency app
const agencyApp = new AgencyApp();
function initializeAgencyApp() {
    agencyApp.initialize();
}
