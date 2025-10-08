// Enhanced Akshaya Milk Delivery PWA
class AkshayaMilkApp {
    constructor() {
        this.state = {
            currentView: 'customerView',
            cart: [],
            products: [],
            currentProduct: null,
            currentQuantity: 1,
            selectedSize: '500ml',
            selectedSchedule: 'Mon-Fri',
            userLocation: null,
            isOnline: true
        };
        
        this.init();
    }

    async init() {
        this.setupEventListeners();
        this.loadProducts();
        this.loadCartFromStorage();
        this.checkOnlineStatus();
        this.showSplashScreen();
        
        // Register service worker
        if ('serviceWorker' in navigator) {
            try {
                await navigator.serviceWorker.register('/sw.js');
                console.log('Service Worker registered successfully');
            } catch (error) {
                console.log('Service Worker registration failed:', error);
            }
        }
    }

    showSplashScreen() {
        setTimeout(() => {
            document.getElementById('splashScreen').style.opacity = '0';
            setTimeout(() => {
                document.getElementById('splashScreen').style.display = 'none';
                document.getElementById('app').style.display = 'block';
                this.showView('customerView');
            }, 500);
        }, 2000);
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item[data-view]').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const view = item.dataset.view;
                this.showView(view);
            });
        });

        // Back buttons
        document.querySelectorAll('.back-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const view = btn.dataset.view;
                this.showView(view);
            });
        });

        // App mode selector
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const mode = btn.dataset.mode;
                this.switchAppMode(mode);
            });
        });

        // Search functionality
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        // Categories
        document.querySelectorAll('.category-item').forEach(item => {
            item.addEventListener('click', () => {
                this.handleCategoryClick(item);
            });
        });

        // Product modal
        document.getElementById('closeModal').addEventListener('click', () => {
            this.closeProductModal();
        });

        // Quantity controls
        document.getElementById('increaseQty').addEventListener('click', () => {
            this.changeQuantity(1);
        });

        document.getElementById('decreaseQty').addEventListener('click', () => {
            this.changeQuantity(-1);
        });

        // Size options
        document.querySelectorAll('.size-option').forEach(option => {
            option.addEventListener('click', () => {
                this.selectSize(option);
            });
        });

        // Schedule options
        document.querySelectorAll('.schedule-option').forEach(option => {
            option.addEventListener('click', () => {
                this.selectSchedule(option);
            });
        });

        // Add to cart
        document.getElementById('addToCartModal').addEventListener('click', () => {
            this.addToCartFromModal();
        });

        // Online/offline detection
        window.addEventListener('online', () => this.handleOnlineStatus(true));
        window.addEventListener('offline', () => this.handleOnlineStatus(false));

        // Close modal on outside click
        document.getElementById('productModal').addEventListener('click', (e) => {
            if (e.target === document.getElementById('productModal')) {
                this.closeProductModal();
            }
        });
    }

    showView(viewName) {
        // Hide all views
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });

        // Show selected view
        document.getElementById(viewName).classList.add('active');
        this.state.currentView = viewName;

        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-view="${viewName}"]`)?.classList.add('active');

        // Load view-specific data
        this.loadViewData(viewName);
    }

    switchAppMode(mode) {
        switch (mode) {
            case 'customer':
                this.showView('customerView');
                break;
            case 'agency':
                this.showView('agencyView');
                this.loadAgencyData();
                break;
            case 'admin':
                this.showView('adminView');
                this.loadAdminData();
                break;
        }
    }

    async loadProducts() {
        // Show loading skeleton
        this.showLoadingSkeleton();

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            this.state.products = [
                {
                    id: 1,
                    name: "Fresh Cow Milk",
                    description: "Pure and fresh cow milk, pasteurized for safety",
                    icon: "🥛",
                    price: 30,
                    originalPrice: 35,
                    unit: "litre",
                    category: "milk",
                    rating: 4.8,
                    ratingCount: 1247,
                    popular: true
                },
                {
                    id: 2,
                    name: "Buffalo Milk",
                    description: "Rich and creamy buffalo milk with high fat content",
                    icon: "🐃",
                    price: 40,
                    originalPrice: 45,
                    unit: "litre",
                    category: "milk",
                    rating: 4.6,
                    ratingCount: 892
                },
                {
                    id: 3,
                    name: "Organic Milk",
                    description: "100% organic, chemical-free farm milk",
                    icon: "🌱",
                    price: 50,
                    originalPrice: 55,
                    unit: "litre",
                    category: "milk",
                    rating: 4.9,
                    ratingCount: 567,
                    popular: true
                },
                {
                    id: 4,
                    name: "Fresh Curd",
                    description: "Homemade style fresh curd, perfect for your meals",
                    icon: "🍶",
                    price: 40,
                    originalPrice: 45,
                    unit: "500g",
                    category: "curd",
                    rating: 4.7,
                    ratingCount: 345
                },
                {
                    id: 5,
                    name: "Fresh Paneer",
                    description: "Soft and fresh cottage cheese for cooking",
                    icon: "🧀",
                    price: 200,
                    originalPrice: 220,
                    unit: "kg",
                    category: "paneer",
                    rating: 4.5,
                    ratingCount: 234
                },
                {
                    id: 6,
                    name: "Pure Ghee",
                    description: "Traditional clarified butter for authentic taste",
                    icon: "🫕",
                    price: 500,
                    originalPrice: 550,
                    unit: "500g",
                    category: "ghee",
                    rating: 4.8,
                    ratingCount: 189
                },
                {
                    id: 7,
                    name: "Butter",
                    description: "Fresh creamy butter for your bread and cooking",
                    icon: "🧈",
                    price: 80,
                    originalPrice: 90,
                    unit: "200g",
                    category: "butter",
                    rating: 4.4,
                    ratingCount: 156
                },
                {
                    id: 8,
                    name: "Flavored Milk",
                    description: "Chocolate and strawberry flavored milk",
                    icon: "🍫",
                    price: 25,
                    originalPrice: 30,
                    unit: "200ml",
                    category: "milk",
                    rating: 4.3,
                    ratingCount: 278
                }
            ];

            this.renderProducts();
        } catch (error) {
            console.error('Error loading products:', error);
            this.showError('Failed to load products');
        } finally {
            this.hideLoadingSkeleton();
        }
    }

    renderProducts(products = this.state.products) {
        const grid = document.getElementById('productsGrid');
        grid.innerHTML = '';

        products.forEach(product => {
            const productCard = this.createProductCard(product);
            grid.appendChild(productCard);
        });
    }

    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            ${product.popular ? '<div class="card-badge popular">MOST POPULAR</div>' : ''}
            <div class="product-image">
                <span class="product-emoji">${product.icon}</span>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-desc">${product.description}</p>
                <div class="price-section">
                    <span class="current-price">₹${product.price}</span>
                    <span class="original-price">₹${product.originalPrice}</span>
                    <span class="discount">${Math.round((1 - product.price / product.originalPrice) * 100)}% OFF</span>
                </div>
                <div class="rating">
                    <span class="stars">${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}</span>
                    <span class="rating-count">(${product.rating})</span>
                </div>
            </div>
            <button class="add-btn" data-product-id="${product.id}">
                <span>ADD</span>
                <span class="material-icons">add</span>
            </button>
        `;

        // Add event listeners
        const addBtn = card.querySelector('.add-btn');
        addBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.addToCart(product.id);
        });

        card.addEventListener('click', () => {
            this.openProductModal(product);
        });

        return card;
    }

    openProductModal(product) {
        this.state.currentProduct = product;
        this.state.currentQuantity = 1;
        this.state.selectedSize = '500ml';
        this.state.selectedSchedule = 'Mon-Fri';

        // Update modal content
        document.getElementById('modalProductName').textContent = product.name;
        document.getElementById('modalProductIcon').textContent = product.icon;
        document.getElementById('modalProductPrice').textContent = product.price;
        this.updateModalTotalPrice();

        // Show modal
        document.getElementById('productModal').classList.add('show');
    }

    closeProductModal() {
        document.getElementById('productModal').classList.remove('show');
        this.state.currentProduct = null;
    }

    changeQuantity(change) {
        const newQuantity = this.state.currentQuantity + change;
        if (newQuantity >= 1 && newQuantity <= 10) {
            this.state.currentQuantity = newQuantity;
            document.getElementById('currentQty').textContent = newQuantity;
            this.updateModalTotalPrice();
        }
    }

    selectSize(option) {
        document.querySelectorAll('.size-option').forEach(opt => {
            opt.classList.remove('active');
        });
        option.classList.add('active');
        this.state.selectedSize = option.dataset.size;
    }

    selectSchedule(option) {
        document.querySelectorAll('.schedule-option').forEach(opt => {
            opt.classList.remove('active');
        });
        option.classList.add('active');
        this.state.selectedSchedule = option.querySelector('.days').textContent;
    }

    updateModalTotalPrice() {
        if (this.state.currentProduct) {
            const total = this.state.currentProduct.price * this.state.currentQuantity;
            document.getElementById('modalTotalPrice').textContent = total;
        }
    }

    addToCart(productId, quantity = 1) {
        const product = this.state.products.find(p => p.id === productId);
        if (!product) return;

        const existingItem = this.state.cart.find(item => item.product.id === productId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.state.cart.push({
                product: product,
                quantity: quantity,
                size: this.state.selectedSize,
                schedule: this.state.selectedSchedule
            });
        }

        this.updateCartUI();
        this.saveCartToStorage();
        this.showNotification(`${product.name} added to cart!`);
    }

    addToCartFromModal() {
        if (this.state.currentProduct) {
            this.addToCart(this.state.currentProduct.id, this.state.currentQuantity);
            this.closeProductModal();
        }
    }

    updateCartUI() {
        const totalCount = this.state.cart.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = this.state.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

        // Update cart count in navigation
        document.getElementById('navCartCount').textContent = totalCount;

        // Update cart view if active
        if (this.state.currentView === 'cartView') {
            this.renderCartView();
        }
    }

    renderCartView() {
        const container = document.querySelector('.cart-container');
        if (!container) return;

        if (this.state.cart.length === 0) {
            container.innerHTML = `
                <div class="empty-cart">
                    <span class="material-icons">shopping_cart</span>
                    <h3>Your cart is empty</h3>
                    <p>Add some delicious milk products to get started!</p>
                    <button class="btn-primary" onclick="app.showView('customerView')">
                        Start Shopping
                    </button>
                </div>
            `;
        } else {
            container.innerHTML = this.state.cart.map(item => `
                <div class="cart-item">
                    <div class="item-info">
                        <span class="item-icon">${item.product.icon}</span>
                        <div class="item-details">
                            <h4>${item.product.name}</h4>
                            <p>${item.size} • ${item.schedule}</p>
                            <div class="item-price">₹${item.product.price * item.quantity}</div>
                        </div>
                    </div>
                    <div class="item-controls">
                        <button class="qty-btn" onclick="app.updateCartItemQuantity(${item.product.id}, ${item.quantity - 1})">-</button>
                        <span class="qty-value">${item.quantity}</span>
                        <button class="qty-btn" onclick="app.updateCartItemQuantity(${item.product.id}, ${item.quantity + 1})">+</button>
                        <button class="remove-btn" onclick="app.removeFromCart(${item.product.id})">
                            <span class="material-icons">delete</span>
                        </button>
                    </div>
                </div>
            `).join('') + `
                <div class="cart-total">
                    <div class="total-line">
                        <span>Subtotal</span>
                        <span>₹${this.state.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)}</span>
                    </div>
                    <div class="total-line">
                        <span>Delivery</span>
                        <span>FREE</span>
                    </div>
                    <div class="total-line grand-total">
                        <span>Total</span>
                        <span>₹${this.state.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)}</span>
                    </div>
                    <button class="checkout-btn" onclick="app.proceedToCheckout()">
                        Proceed to Checkout
                    </button>
                </div>
            `;
        }
    }

    updateCartItemQuantity(productId, newQuantity) {
        if (newQuantity <= 0) {
            this.removeFromCart(productId);
        } else {
            const item = this.state.cart.find(item => item.product.id === productId);
            if (item) {
                item.quantity = newQuantity;
                this.updateCartUI();
                this.saveCartToStorage();
            }
        }
    }

    removeFromCart(productId) {
        this.state.cart = this.state.cart.filter(item => item.product.id !== productId);
        this.updateCartUI();
        this.saveCartToStorage();
        this.showNotification('Item removed from cart');
    }

    proceedToCheckout() {
        if (this.state.cart.length === 0) {
            this.showNotification('Your cart is empty!');
            return;
        }

        const total = this.state.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
        
        // Simulate checkout process
        this.showNotification(`Order placed successfully! Total: ₹${total}`);
        
        // Clear cart
        this.state.cart = [];
        this.updateCartUI();
        this.saveCartToStorage();
        this.showView('customerView');
    }

    handleSearch(query) {
        const filteredProducts = this.state.products.filter(product =>
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.description.toLowerCase().includes(query.toLowerCase()) ||
            product.category.toLowerCase().includes(query.toLowerCase())
        );
        this.renderProducts(filteredProducts);
    }

    handleCategoryClick(categoryItem) {
        // Update active category
        document.querySelectorAll('.category-item').forEach(item => {
            item.classList.remove('active');
        });
        categoryItem.classList.add('active');

        const category = categoryItem.dataset.category;
        if (category === 'all') {
            this.renderProducts();
        } else {
            const filteredProducts = this.state.products.filter(product =>
                product.category === category
            );
            this.renderProducts(filteredProducts);
        }
    }

    async loadAgencyData() {
        // Simulate loading agency data
        const deliveries = [
            {
                id: 1,
                customer: "Anita Sharma",
                address: "123 Main Street, Apartment 4B",
                time: "7:00 - 7:15 AM",
                status: "pending",
                items: ["1L Milk × 2"],
                amount: 60
            },
            {
                id: 2,
                customer: "Raj Kumar",
                address: "456 Oak Avenue, Floor 2",
                time: "7:15 - 7:30 AM",
                status: "pending",
                items: ["500ml Milk × 1", "Curd × 1"],
                amount: 70
            },
            {
                id: 3,
                customer: "Priya Singh",
                address: "789 Pine Road, House 5",
                time: "7:30 - 7:45 AM",
                status: "completed",
                items: ["2L Milk × 1"],
                amount: 80
            }
        ];

        this.renderDeliveries(deliveries);
        
        // Update stats
        const pending = deliveries.filter(d => d.status === 'pending').length;
        const completed = deliveries.filter(d => d.status === 'completed').length;
        
        document.getElementById('deliveryCount').textContent = deliveries.length;
        document.getElementById('pendingDeliveries').textContent = pending;
        document.getElementById('completedDeliveries').textContent = completed;
    }

    renderDeliveries(deliveries) {
        const container = document.getElementById('deliveriesList');
        container.innerHTML = deliveries.map(delivery => `
            <div class="delivery-card ${delivery.status}">
                <div class="delivery-header">
                    <div class="customer-info">
                        <h3>${delivery.customer}</h3>
                        <p class="delivery-time">${delivery.time}</p>
                    </div>
                    <div class="delivery-status ${delivery.status}">
                        <span>${delivery.status.charAt(0).toUpperCase() + delivery.status.slice(1)}</span>
                    </div>
                </div>
                <div class="delivery-details">
                    <div class="address">
                        <span class="material-icons">location_on</span>
                        <span>${delivery.address}</span>
                    </div>
                    <div class="order-items">
                        <span class="item">${delivery.items.join(', ')}</span>
                        <span class="amount">₹${delivery.amount}</span>
                    </div>
                </div>
                <div class="delivery-actions">
                    <button class="btn-outline" onclick="app.callCustomer('${delivery.customer}')">
                        <span class="material-icons">call</span>
                        Call
                    </button>
                    <button class="btn-outline" onclick="app.navigateToCustomer(${delivery.id})">
                        <span class="material-icons">directions</span>
                        Navigate
                    </button>
                    <button class="btn-primary" onclick="app.markDelivered(${delivery.id})">
                        <span class="material-icons">check_circle</span>
                        Delivered
                    </button>
                </div>
            </div>
        `).join('');
    }

    async loadAdminData() {
        // Simulate loading admin data
        // In a real app, this would fetch from an API
        console.log('Loading admin data...');
        
        // Initialize charts
        this.initCharts();
    }

    initCharts() {
        // Simulate chart initialization
        // In a real app, you would use Chart.js or similar
        const revenueCtx = document.getElementById('revenueChart');
        const productsCtx = document.getElementById('productsChart');
        
        if (revenueCtx) {
            revenueCtx.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #666;">
                    <span class="material-icons" style="font-size: 48px; margin-bottom: 16px;">analytics</span>
                    <p>Revenue Chart</p>
                </div>
            `;
        }
        
        if (productsCtx) {
            productsCtx.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #666;">
                    <span class="material-icons" style="font-size: 48px; margin-bottom: 16px;">pie_chart</span>
                    <p>Products Chart</p>
                </div>
            `;
        }
    }

    loadViewData(viewName) {
        switch (viewName) {
            case 'cartView':
                this.renderCartView();
                break;
            case 'ordersView':
                this.renderOrdersView();
                break;
            case 'profileView':
                this.renderProfileView();
                break;
        }
    }

    renderOrdersView() {
        const container = document.querySelector('.orders-container');
        container.innerHTML = `
            <div class="empty-state">
                <span class="material-icons">receipt</span>
                <h3>No orders yet</h3>
                <p>Your order history will appear here</p>
            </div>
        `;
    }

    renderProfileView() {
        const container = document.querySelector('.profile-container');
        container.innerHTML = `
            <div class="profile-card">
                <div class="profile-header">
                    <div class="avatar">
                        <span class="material-icons">person</span>
                    </div>
                    <div class="profile-info">
                        <h3>John Doe</h3>
                        <p>+91 9876543210</p>
                    </div>
                </div>
                <div class="profile-stats">
                    <div class="stat">
                        <span class="number">12</span>
                        <span class="label">Orders</span>
                    </div>
                    <div class="stat">
                        <span class="number">30</span>
                        <span class="label">Days</span>
                    </div>
                    <div class="stat">
                        <span class="number">₹360</span>
                        <span class="label">Saved</span>
                    </div>
                </div>
                <div class="profile-actions">
                    <button class="profile-btn">
                        <span class="material-icons">edit</span>
                        Edit Profile
                    </button>
                    <button class="profile-btn">
                        <span class="material-icons">location_on</span>
                        Delivery Addresses
                    </button>
                    <button class="profile-btn">
                        <span class="material-icons">subscriptions</span>
                        My Subscriptions
                    </button>
                    <button class="profile-btn">
                        <span class="material-icons">logout</span>
                        Logout
                    </button>
                </div>
            </div>
        `;
    }

    // Agency methods
    callCustomer(customerName) {
        this.showNotification(`Calling ${customerName}...`);
    }

    navigateToCustomer(deliveryId) {
        this.showNotification(`Starting navigation to delivery ${deliveryId}...`);
    }

    markDelivered(deliveryId) {
        this.showNotification(`Delivery ${deliveryId} marked as delivered!`);
        // In real app, update the delivery status
    }

    // Utility methods
    showLoadingSkeleton() {
        document.getElementById('loadingSkeleton').style.display = 'block';
    }

    hideLoadingSkeleton() {
        document.getElementById('loadingSkeleton').style.display = 'none';
    }

    showNotification(message, type = 'success') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <span class="material-icons">${type === 'success' ? 'check_circle' : 'error'}</span>
            <span>${message}</span>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : '#f44336'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 8px;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    checkOnlineStatus() {
        this.state.isOnline = navigator.onLine;
        this.updateOnlineIndicator();
    }

    handleOnlineStatus(online) {
        this.state.isOnline = online;
        this.updateOnlineIndicator();
        
        if (online) {
            this.showNotification('Back online! Syncing data...');
        } else {
            this.showNotification('You are offline. Some features may not work.', 'error');
        }
    }

    updateOnlineIndicator() {
        const indicator = document.getElementById('offlineIndicator');
        if (this.state.isOnline) {
            indicator.classList.remove('show');
        } else {
            indicator.classList.add('show');
        }
    }

    saveCartToStorage() {
        try {
            localStorage.setItem('akshayaCart', JSON.stringify(this.state.cart));
        } catch (error) {
            console.warn('Could not save cart to localStorage:', error);
        }
    }

    loadCartFromStorage() {
        try {
            const savedCart = localStorage.getItem('akshayaCart');
            if (savedCart) {
                this.state.cart = JSON.parse(savedCart);
                this.updateCartUI();
            }
        } catch (error) {
            console.warn('Could not load cart from localStorage:', error);
        }
    }

    quickActions() {
        this.showNotification('Quick actions menu opened');
    }

    startNavigation() {
        this.showNotification('Starting delivery route navigation...');
    }

    showAddModal() {
        this.showNotification('Add new item/agency modal opened');
    }
}

// Initialize the app when DOM is loaded
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new AkshayaMilkApp();
});

// Make app globally available for onclick handlers
window.app = app;
