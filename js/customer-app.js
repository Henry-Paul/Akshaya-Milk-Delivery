// Customer App
class CustomerApp {
    constructor() {
        this.state = {
            cart: [],
            products: [],
            currentView: 'home',
            selectedCategory: 'all'
        };
    }

    initialize() {
        this.loadProducts();
        this.loadCartFromStorage();
        this.renderCustomerApp();
        this.setupEventListeners();
    }

    renderCustomerApp() {
        const appContainer = document.getElementById('customerApp');
        appContainer.innerHTML = `
            <div class="customer-app">
                <header class="customer-header">
                    <nav class="customer-nav">
                        <div class="logo">
                            <span>🥛</span>
                            <span>Akshaya Milk</span>
                        </div>
                        <div class="customer-actions">
                            <button class="icon-btn" onclick="customerApp.showCart()">
                                <span class="material-icons">shopping_cart</span>
                                ${this.state.cart.length > 0 ? `<span class="cart-badge">${this.getTotalCartItems()}</span>` : ''}
                            </button>
                        </div>
                    </nav>
                </header>

                <main class="customer-main">
                    ${this.state.currentView === 'home' ? this.renderHome() : ''}
                    ${this.state.currentView === 'cart' ? this.renderCart() : ''}
                    ${this.state.currentView === 'orders' ? this.renderOrders() : ''}
                    ${this.state.currentView === 'profile' ? this.renderProfile() : ''}
                </main>

                <nav class="bottom-nav">
                    <button class="nav-item ${this.state.currentView === 'home' ? 'active' : ''}" onclick="customerApp.showView('home')">
                        <span class="material-icons">home</span>
                        <span class="nav-label">Home</span>
                    </button>
                    <button class="nav-item ${this.state.currentView === 'orders' ? 'active' : ''}" onclick="customerApp.showView('orders')">
                        <span class="material-icons">receipt</span>
                        <span class="nav-label">Orders</span>
                    </button>
                    <button class="nav-item ${this.state.currentView === 'profile' ? 'active' : ''}" onclick="customerApp.showView('profile')">
                        <span class="material-icons">person</span>
                        <span class="nav-label">Profile</span>
                    </button>
                </nav>
            </div>
        `;
    }

    renderHome() {
        const filteredProducts = this.state.selectedCategory === 'all' 
            ? this.state.products 
            : this.state.products.filter(p => p.category === this.state.selectedCategory);

        return `
            <section class="search-section">
                <div class="search-bar">
                    <input type="text" placeholder="Search milk, curd, paneer..." id="searchInput">
                    <button class="btn-primary" onclick="customerApp.handleSearch()">
                        <span class="material-icons">search</span>
                        Search
                    </button>
                </div>
            </section>

            <section class="categories-section">
                <div class="categories-scroll">
                    <div class="category-item ${this.state.selectedCategory === 'all' ? 'active' : ''}" onclick="customerApp.filterCategory('all')">
                        <span>🥛</span>
                        <span>All</span>
                    </div>
                    <div class="category-item ${this.state.selectedCategory === 'milk' ? 'active' : ''}" onclick="customerApp.filterCategory('milk')">
                        <span>🐄</span>
                        <span>Milk</span>
                    </div>
                    <div class="category-item ${this.state.selectedCategory === 'curd' ? 'active' : ''}" onclick="customerApp.filterCategory('curd')">
                        <span>🍶</span>
                        <span>Curd</span>
                    </div>
                    <div class="category-item ${this.state.selectedCategory === 'paneer' ? 'active' : ''}" onclick="customerApp.filterCategory('paneer')">
                        <span>🧀</span>
                        <span>Paneer</span>
                    </div>
                </div>
            </section>

            <section class="products-section">
                <h2 class="section-title">Fresh Dairy Products</h2>
                <div class="products-grid">
                    ${filteredProducts.map(product => `
                        <div class="product-card" onclick="customerApp.showProductDetail(${product.id})">
                            ${product.popular ? '<div class="product-badge">Popular</div>' : ''}
                            <div class="product-image">
                                <span class="emoji">${product.icon}</span>
                            </div>
                            <div class="product-info">
                                <h3>${product.name}</h3>
                                <p class="product-description">${product.description}</p>
                                <div class="product-price">
                                    <span class="current-price">₹${product.price}</span>
                                    ${product.originalPrice ? `<span class="original-price">₹${product.originalPrice}</span>` : ''}
                                    ${product.discount ? `<span class="discount">${product.discount}% OFF</span>` : ''}
                                </div>
                            </div>
                            <button class="add-to-cart-btn" onclick="event.stopPropagation(); customerApp.addToCart(${product.id})">
                                <span class="material-icons">add</span>
                                Add to Cart
                            </button>
                        </div>
                    `).join('')}
                </div>
            </section>
        `;
    }

    renderCart() {
        if (this.state.cart.length === 0) {
            return `
                <div class="empty-state">
                    <span class="material-icons">shopping_cart</span>
                    <h3>Your cart is empty</h3>
                    <p>Add some fresh dairy products to get started!</p>
                    <button class="btn-primary" onclick="customerApp.showView('home')">
                        Start Shopping
                    </button>
                </div>
            `;
        }

        const total = this.state.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

        return `
            <div class="cart-container">
                <h2 class="section-title">Your Cart</h2>
                <div class="cart-items">
                    ${this.state.cart.map(item => `
                        <div class="cart-item">
                            <div class="cart-item-image">
                                <span class="emoji">${item.product.icon}</span>
                            </div>
                            <div class="cart-item-details">
                                <div class="cart-item-name">${item.product.name}</div>
                                <div class="cart-item-meta">Quantity: ${item.quantity}</div>
                                <div class="cart-item-price">₹${item.product.price * item.quantity}</div>
                            </div>
                            <div class="cart-item-controls">
                                <button class="quantity-btn" onclick="customerApp.updateQuantity(${item.product.id}, ${item.quantity - 1})">-</button>
                                <span>${item.quantity}</span>
                                <button class="quantity-btn" onclick="customerApp.updateQuantity(${item.product.id}, ${item.quantity + 1})">+</button>
                                <button class="quantity-btn" onclick="customerApp.removeFromCart(${item.product.id})">
                                    <span class="material-icons">delete</span>
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="cart-summary">
                    <div class="summary-row">
                        <span>Subtotal</span>
                        <span>₹${total}</span>
                    </div>
                    <div class="summary-row">
                        <span>Delivery</span>
                        <span>FREE</span>
                    </div>
                    <div class="summary-row summary-total">
                        <span>Total</span>
                        <span>₹${total}</span>
                    </div>
                    <button class="checkout-btn" onclick="customerApp.checkout()">
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        `;
    }

    renderOrders() {
        return `
            <div class="empty-state">
                <span class="material-icons">receipt</span>
                <h3>No orders yet</h3>
                <p>Your order history will appear here</p>
            </div>
        `;
    }

    renderProfile() {
        return `
            <div class="management-section">
                <h2 class="section-title">Your Profile</h2>
                <div class="form-group">
                    <label>Full Name</label>
                    <input type="text" value="John Doe" placeholder="Enter your name">
                </div>
                <div class="form-group">
                    <label>Phone Number</label>
                    <input type="tel" value="+91 9876543210" placeholder="Enter your phone number">
                </div>
                <div class="form-group">
                    <label>Delivery Address</label>
                    <input type="text" value="123 Main Street, Bangalore" placeholder="Enter your address">
                </div>
                <button class="btn-primary">
                    Save Changes
                </button>
            </div>
        `;
    }

    showView(view) {
        this.state.currentView = view;
        this.renderCustomerApp();
    }

    showCart() {
        this.showView('cart');
    }

    filterCategory(category) {
        this.state.selectedCategory = category;
        this.renderCustomerApp();
    }

    addToCart(productId) {
        const product = this.state.products.find(p => p.id === productId);
        if (!product) return;

        const existingItem = this.state.cart.find(item => item.product.id === productId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.state.cart.push({
                product: product,
                quantity: 1
            });
        }

        this.saveCartToStorage();
        this.renderCustomerApp();
        this.showNotification(`${product.name} added to cart!`);
    }

    updateQuantity(productId, newQuantity) {
        if (newQuantity <= 0) {
            this.removeFromCart(productId);
            return;
        }

        const item = this.state.cart.find(item => item.product.id === productId);
        if (item) {
            item.quantity = newQuantity;
            this.saveCartToStorage();
            this.renderCustomerApp();
        }
    }

    removeFromCart(productId) {
        this.state.cart = this.state.cart.filter(item => item.product.id !== productId);
        this.saveCartToStorage();
        this.renderCustomerApp();
        this.showNotification('Item removed from cart');
    }

    getTotalCartItems() {
        return this.state.cart.reduce((total, item) => total + item.quantity, 0);
    }

    checkout() {
        if (this.state.cart.length === 0) {
            this.showNotification('Your cart is empty!', 'error');
            return;
        }

        const total = this.state.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
        
        this.showNotification(`Order placed successfully! Total: ₹${total}`);
        this.state.cart = [];
        this.saveCartToStorage();
        this.showView('home');
    }

    loadProducts() {
        // Sample products data
        this.state.products = [
            {
                id: 1,
                name: "Fresh Cow Milk",
                description: "Pure and fresh cow milk, pasteurized for safety",
                icon: "🥛",
                price: 30,
                originalPrice: 35,
                category: "milk",
                popular: true,
                discount: 14
            },
            {
                id: 2,
                name: "Buffalo Milk",
                description: "Rich and creamy buffalo milk with high fat content",
                icon: "🐃",
                price: 40,
                originalPrice: 45,
                category: "milk",
                discount: 11
            },
            {
                id: 3,
                name: "Fresh Curd",
                description: "Homemade style fresh curd, perfect for your meals",
                icon: "🍶",
                price: 40,
                category: "curd"
            },
            {
                id: 4,
                name: "Fresh Paneer",
                description: "Soft and fresh cottage cheese for cooking",
                icon: "🧀",
                price: 200,
                category: "paneer"
            }
        ];
    }

    saveCartToStorage() {
        localStorage.setItem('customerCart', JSON.stringify(this.state.cart));
    }

    loadCartFromStorage() {
        const savedCart = localStorage.getItem('customerCart');
        if (savedCart) {
            this.state.cart = JSON.parse(savedCart);
        }
    }

    showNotification(message, type = 'success') {
        // Simple notification implementation
        alert(message);
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }
    }

    handleSearch(query = '') {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            query = searchInput.value;
        }

        // Simple search implementation
        console.log('Searching for:', query);
    }

    showProductDetail(productId) {
        const product = this.state.products.find(p => p.id === productId);
        if (product) {
            this.showNotification(`Showing details for ${product.name}`);
        }
    }
}

// Initialize customer app
const customerApp = new CustomerApp();
function initializeCustomerApp() {
    customerApp.initialize();
}
