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
        
        // Bind methods to maintain context
        this.init = this.init.bind(this);
        this.showSplashScreen = this.showSplashScreen.bind(this);
        this.hideSplashScreen = this.hideSplashScreen.bind(this);
        this.showView = this.showView.bind(this);
    }

    async init() {
        console.log('🚀 Initializing Akshaya Milk App...');
        
        try {
            this.setupEventListeners();
            await this.loadProducts();
            this.loadCartFromStorage();
            this.checkOnlineStatus();
            this.showSplashScreen();
            
            // Register service worker
            if ('serviceWorker' in navigator) {
                try {
                    const registration = await navigator.serviceWorker.register('/sw.js');
                    console.log('✅ Service Worker registered successfully:', registration);
                } catch (error) {
                    console.log('⚠️ Service Worker registration failed:', error);
                }
            }
        } catch (error) {
            console.error('❌ App initialization failed:', error);
            this.hideSplashScreen(); // Ensure splash screen hides even on error
        }
    }

    showSplashScreen() {
        console.log('🎬 Showing splash screen...');
        const splashScreen = document.getElementById('splashScreen');
        const app = document.getElementById('app');
        
        if (!splashScreen || !app) {
            console.error('❌ Required DOM elements not found');
            return;
        }
        
        // Make sure splash is visible and app is hidden
        splashScreen.style.display = 'flex';
        splashScreen.style.opacity = '1';
        app.style.display = 'none';
        
        // Hide splash after 2 seconds
        setTimeout(() => {
            this.hideSplashScreen();
        }, 2000);
    }

    hideSplashScreen() {
        console.log('🎬 Hiding splash screen...');
        const splashScreen = document.getElementById('splashScreen');
        const app = document.getElementById('app');
        
        if (!splashScreen || !app) {
            console.error('❌ Required DOM elements not found');
            return;
        }
        
        // Start fade out
        splashScreen.style.opacity = '0';
        
        // Complete hide after transition
        setTimeout(() => {
            splashScreen.style.display = 'none';
            app.style.display = 'block';
            this.showView('customerView');
            console.log('✅ App ready!');
        }, 500);
    }

    showView(viewName) {
        console.log(`🔄 Switching to view: ${viewName}`);
        
        // Hide all views
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });

        // Show selected view
        const targetView = document.getElementById(viewName);
        if (targetView) {
            targetView.classList.add('active');
            this.state.currentView = viewName;

            // Update navigation
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
            });
            
            const navItem = document.querySelector(`[data-view="${viewName}"]`);
            if (navItem) {
                navItem.classList.add('active');
            }

            // Load view-specific data
            this.loadViewData(viewName);
        } else {
            console.error(`❌ View not found: ${viewName}`);
        }
    }

    switchAppMode(mode) {
        console.log(`🔄 Switching app mode to: ${mode}`);
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
            default:
                console.warn(`⚠️ Unknown app mode: ${mode}`);
        }
    }

    async loadProducts() {
        console.log('📦 Loading products...');
        this.showLoadingSkeleton();

        try {
            // Simulate API call with shorter timeout for better UX
            await new Promise(resolve => setTimeout(resolve, 800));
            
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
                }
            ];

            console.log(`✅ Loaded ${this.state.products.length} products`);
            this.renderProducts();
        } catch (error) {
            console.error('❌ Error loading products:', error);
            this.showError('Failed to load products. Please check your connection.');
        } finally {
            this.hideLoadingSkeleton();
        }
    }

    renderProducts(products = this.state.products) {
        const grid = document.getElementById('productsGrid');
        if (!grid) {
            console.error('❌ Products grid element not found');
            return;
        }

        grid.innerHTML = '';

        if (products.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <span class="material-icons">search_off</span>
                    <h3>No products found</h3>
                    <p>Try adjusting your search or filter</p>
                </div>
            `;
            return;
        }

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

    setupEventListeners() {
        console.log('🔧 Setting up event listeners...');
        
        try {
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
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.addEventListener('input', (e) => {
                    this.handleSearch(e.target.value);
                });
            }

            // Categories
            document.querySelectorAll('.category-item').forEach(item => {
                item.addEventListener('click', () => {
                    this.handleCategoryClick(item);
                });
            });

            // Product modal
            const closeModal = document.getElementById('closeModal');
            if (closeModal) {
                closeModal.addEventListener('click', () => {
                    this.closeProductModal();
                });
            }

            // Quantity controls
            const increaseQty = document.getElementById('increaseQty');
            const decreaseQty = document.getElementById('decreaseQty');
            if (increaseQty) {
                increaseQty.addEventListener('click', () => {
                    this.changeQuantity(1);
                });
            }
            if (decreaseQty) {
                decreaseQty.addEventListener('click', () => {
                    this.changeQuantity(-1);
                });
            }

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
            const addToCartModal = document.getElementById('addToCartModal');
            if (addToCartModal) {
                addToCartModal.addEventListener('click', () => {
                    this.addToCartFromModal();
                });
            }

            // Online/offline detection
            window.addEventListener('online', () => this.handleOnlineStatus(true));
            window.addEventListener('offline', () => this.handleOnlineStatus(false));

            // Close modal on outside click
            const productModal = document.getElementById('productModal');
            if (productModal) {
                productModal.addEventListener('click', (e) => {
                    if (e.target === productModal) {
                        this.closeProductModal();
                    }
                });
            }

            console.log('✅ Event listeners setup complete');
        } catch (error) {
            console.error('❌ Error setting up event listeners:', error);
        }
    }

    // ... (rest of the methods remain similar but with added error handling)

    showLoadingSkeleton() {
        const skeleton = document.getElementById('loadingSkeleton');
        if (skeleton) {
            skeleton.style.display = 'block';
        }
    }

    hideLoadingSkeleton() {
        const skeleton = document.getElementById('loadingSkeleton');
        if (skeleton) {
            skeleton.style.display = 'none';
        }
    }

    showNotification(message, type = 'success') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
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
            font-family: 'Poppins', sans-serif;
        `;

        notification.innerHTML = `
            <span class="material-icons">${type === 'success' ? 'check_circle' : 'error'}</span>
            <span>${message}</span>
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
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    // ... Add other methods with proper error handling

    openProductModal(product) {
        try {
            this.state.currentProduct = product;
            this.state.currentQuantity = 1;
            this.state.selectedSize = '500ml';
            this.state.selectedSchedule = 'Mon-Fri';

            // Update modal content
            document.getElementById('modalProductName').textContent = product.name;
            document.getElementById('modalProductIcon').textContent = product.icon;
            document.getElementById('modalProductPrice').textContent = product.price;
            this.updateModalTotalPrice();

            // Reset and activate first options
            document.querySelectorAll('.size-option').forEach(opt => opt.classList.remove('active'));
            document.querySelectorAll('.schedule-option').forEach(opt => opt.classList.remove('active'));
            
            document.querySelector('.size-option[data-size="500ml"]')?.classList.add('active');
            document.querySelector('.schedule-option:first-child')?.classList.add('active');

            // Show modal
            document.getElementById('productModal').classList.add('show');
        } catch (error) {
            console.error('Error opening product modal:', error);
        }
    }

    // Add missing methods that might be causing issues
    handleSearch(query) {
        if (!this.state.products || this.state.products.length === 0) {
            console.warn('Products not loaded yet');
            return;
        }

        const filteredProducts = this.state.products.filter(product =>
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.description.toLowerCase().includes(query.toLowerCase()) ||
            product.category.toLowerCase().includes(query.toLowerCase())
        );
        this.renderProducts(filteredProducts);
    }

    handleCategoryClick(categoryItem) {
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

    closeProductModal() {
        document.getElementById('productModal').classList.remove('show');
        this.state.currentProduct = null;
    }

    updateCartUI() {
        const totalCount = this.state.cart.reduce((sum, item) => sum + item.quantity, 0);
        const navCartCount = document.getElementById('navCartCount');
        if (navCartCount) {
            navCartCount.textContent = totalCount;
        }

        if (this.state.currentView === 'cartView') {
            this.renderCartView();
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
            case 'agencyView':
                this.loadAgencyData();
                break;
            case 'adminView':
                this.loadAdminData();
                break;
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
            // Implementation for cart items
            container.innerHTML = '<p>Cart items will be shown here</p>';
        }
    }

    renderOrdersView() {
        const container = document.querySelector('.orders-container');
        if (container) {
            container.innerHTML = `
                <div class="empty-state">
                    <span class="material-icons">receipt</span>
                    <h3>No orders yet</h3>
                    <p>Your order history will appear here</p>
                </div>
            `;
        }
    }

    renderProfileView() {
        const container = document.querySelector('.profile-container');
        if (container) {
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
                    <div class="profile-actions">
                        <button class="profile-btn">
                            <span class="material-icons">edit</span>
                            Edit Profile
                        </button>
                        <button class="profile-btn">
                            <span class="material-icons">location_on</span>
                            Delivery Addresses
                        </button>
                    </div>
                </div>
            `;
        }
    }

    loadAgencyData() {
        console.log('Loading agency data...');
        // Implementation for agency data
    }

    loadAdminData() {
        console.log('Loading admin data...');
        // Implementation for admin data
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
        if (indicator) {
            if (this.state.isOnline) {
                indicator.classList.remove('show');
            } else {
                indicator.classList.add('show');
            }
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
}

// Initialize the app when DOM is loaded
let app;

document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM Content Loaded');
    app = new AkshayaMilkApp();
    app.init().catch(error => {
        console.error('Failed to initialize app:', error);
    });
});

// Fallback initialization
window.addEventListener('load', function() {
    console.log('🔄 Window Loaded');
    if (!app) {
        console.log('🔄 Initializing app from window load...');
        app = new AkshayaMilkApp();
        app.init().catch(error => {
            console.error('Failed to initialize app from window load:', error);
        });
    }
});

// Make app globally available for onclick handlers
window.app = app;
