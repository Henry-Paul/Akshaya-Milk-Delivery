// Sample product data
const products = [
    {
        id: 1,
        name: "Fresh Cow Milk",
        description: "Pure and fresh cow milk, pasteurized",
        icon: "🥛",
        price: 60,
        unit: "litre",
        category: "milk"
    },
    {
        id: 2,
        name: "Buffalo Milk",
        description: "Rich and creamy buffalo milk",
        icon: "🐃",
        price: 70,
        unit: "litre",
        category: "milk"
    },
    {
        id: 3,
        name: "Standardized Milk",
        description: "Milk with standardized fat content",
        icon: "📊",
        price: 55,
        unit: "litre",
        category: "milk"
    },
    {
        id: 4,
        name: "Fresh Curd",
        description: "Homemade style fresh curd",
        icon: "🍶",
        price: 40,
        unit: "500g",
        category: "curd"
    },
    {
        id: 5,
        name: "Fresh Paneer",
        description: "Soft and fresh cottage cheese",
        icon: "🧀",
        price: 200,
        unit: "kg",
        category: "paneer"
    },
    {
        id: 6,
        name: "Pure Ghee",
        description: "Traditional clarified butter",
        icon: "🫕",
        price: 500,
        unit: "500g",
        category: "ghee"
    },
    {
        id: 7,
        name: "Flavored Milk",
        description: "Chocolate and strawberry flavors",
        icon: "🍫",
        price: 30,
        unit: "200ml",
        category: "milk"
    },
    {
        id: 8,
        name: "Low Fat Milk",
        description: "Perfect for weight watchers",
        icon: "⚖️",
        price: 50,
        unit: "litre",
        category: "milk"
    }
];

// App State
let state = {
    cart: [],
    currentProduct: null,
    currentQuantity: 1
};

// DOM Elements
const elements = {
    productsGrid: document.getElementById('productsGrid'),
    cartSidebar: document.getElementById('cartSidebar'),
    cartItems: document.getElementById('cartItems'),
    cartCount: document.getElementById('cartCount'),
    cartTotal: document.getElementById('cartTotal'),
    cartBtn: document.getElementById('cartBtn'),
    closeCart: document.getElementById('closeCart'),
    checkoutBtn: document.getElementById('checkoutBtn'),
    productModal: document.getElementById('productModal'),
    closeModal: document.getElementById('closeModal'),
    modalProductName: document.getElementById('modalProductName'),
    modalProductIcon: document.getElementById('modalProductIcon'),
    modalProductDesc: document.getElementById('modalProductDesc'),
    modalProductPrice: document.getElementById('modalProductPrice'),
    modalProductUnit: document.getElementById('modalProductUnit'),
    decreaseQty: document.getElementById('decreaseQty'),
    increaseQty: document.getElementById('increaseQty'),
    currentQty: document.getElementById('currentQty'),
    addToCartModal: document.getElementById('addToCartModal'),
    searchInput: document.getElementById('searchInput'),
    filterBtn: document.getElementById('filterBtn'),
    offlineIndicator: document.getElementById('offlineIndicator'),
    exploreBtn: document.getElementById('exploreBtn')
};

// Initialize App
function initApp() {
    renderProducts();
    setupEventListeners();
    checkOnlineStatus();
    loadCartFromStorage();
}

// Render Products
function renderProducts(filteredProducts = products) {
    elements.productsGrid.innerHTML = '';
    
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        elements.productsGrid.appendChild(productCard);
    });
}

// Create Product Card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <div class="product-header">
            <div class="product-icon">${product.icon}</div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="description">${product.description}</p>
            </div>
        </div>
        <div class="product-footer">
            <div class="price-info">
                <span class="price">₹${product.price}</span>
                <span class="unit">/${product.unit}</span>
            </div>
            <button class="add-btn" data-product-id="${product.id}">
                Add
            </button>
        </div>
    `;
    
    // Add event listeners
    const addBtn = card.querySelector('.add-btn');
    addBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        addToCart(product.id, 1);
    });
    
    card.addEventListener('click', () => {
        openProductModal(product);
    });
    
    return card;
}

// Open Product Modal
function openProductModal(product) {
    state.currentProduct = product;
    state.currentQuantity = 1;
    
    elements.modalProductName.textContent = product.name;
    elements.modalProductIcon.textContent = product.icon;
    elements.modalProductDesc.textContent = product.description;
    elements.modalProductPrice.textContent = product.price;
    elements.modalProductUnit.textContent = `/${product.unit}`;
    elements.currentQty.textContent = state.currentQuantity;
    
    elements.productModal.classList.add('show');
}

// Close Product Modal
function closeProductModal() {
    elements.productModal.classList.remove('show');
    state.currentProduct = null;
    state.currentQuantity = 1;
}

// Add to Cart
function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = state.cart.find(item => item.product.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        state.cart.push({
            product: product,
            quantity: quantity,
            schedule: 'once'
        });
    }
    
    updateCartUI();
    saveCartToStorage();
    showNotification(`${product.name} added to cart!`);
}

// Remove from Cart
function removeFromCart(productId) {
    state.cart = state.cart.filter(item => item.product.id !== productId);
    updateCartUI();
    saveCartToStorage();
}

// Update Cart Quantity
function updateCartQuantity(productId, newQuantity) {
    const item = state.cart.find(item => item.product.id === productId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = newQuantity;
        }
    }
    updateCartUI();
    saveCartToStorage();
}

// Update Cart UI
function updateCartUI() {
    // Update cart items
    elements.cartItems.innerHTML = '';
    
    if (state.cart.length === 0) {
        elements.cartItems.innerHTML = '<p style="text-align: center; color: var(--text-light);">Your cart is empty</p>';
    } else {
        state.cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.product.name}</h4>
                    <div class="cart-item-price">₹${item.product.price * item.quantity}</div>
                </div>
                <div class="cart-item-actions">
                    <button class="qty-btn decrease" data-product-id="${item.product.id}">-</button>
                    <span class="qty-value">${item.quantity}</span>
                    <button class="qty-btn increase" data-product-id="${item.product.id}">+</button>
                    <button class="remove-btn" data-product-id="${item.product.id}">🗑️</button>
                </div>
            `;
            elements.cartItems.appendChild(cartItem);
        });
    }
    
    // Update cart count and total
    const totalCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = state.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    
    elements.cartCount.textContent = totalCount;
    elements.cartTotal.textContent = totalPrice;
}

// Setup Event Listeners
function setupEventListeners() {
    // Cart functionality
    elements.cartBtn.addEventListener('click', () => {
        elements.cartSidebar.classList.add('open');
    });
    
    elements.closeCart.addEventListener('click', () => {
        elements.cartSidebar.classList.remove('open');
    });
    
    elements.checkoutBtn.addEventListener('click', proceedToCheckout);
    
    // Modal functionality
    elements.closeModal.addEventListener('click', closeProductModal);
    
    elements.decreaseQty.addEventListener('click', () => {
        if (state.currentQuantity > 1) {
            state.currentQuantity--;
            elements.currentQty.textContent = state.currentQuantity;
        }
    });
    
    elements.increaseQty.addEventListener('click', () => {
        state.currentQuantity++;
        elements.currentQty.textContent = state.currentQuantity;
    });
    
    elements.addToCartModal.addEventListener('click', () => {
        if (state.currentProduct) {
            addToCart(state.currentProduct.id, state.currentQuantity);
            closeProductModal();
        }
    });
    
    // Search functionality
    elements.searchInput.addEventListener('input', handleSearch);
    elements.filterBtn.addEventListener('click', showFilterOptions);
    
    // Explore button
    elements.exploreBtn.addEventListener('click', () => {
        document.querySelector('.products').scrollIntoView({ 
            behavior: 'smooth' 
        });
    });
    
    // Category cards
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            filterByCategory(category);
        });
    });
    
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = item.dataset.page;
            navigateToPage(page);
        });
    });
    
    // Online/offline detection
    window.addEventListener('online', () => {
        elements.offlineIndicator.classList.remove('show');
        showNotification('Back online!');
    });
    
    window.addEventListener('offline', () => {
        elements.offlineIndicator.classList.add('show');
        showNotification('You are offline. Some features may not work.');
    });
    
    // Close modal on outside click
    elements.productModal.addEventListener('click', (e) => {
        if (e.target === elements.productModal) {
            closeProductModal();
        }
    });
}

// Handle Search
function handleSearch() {
    const searchTerm = elements.searchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        renderProducts();
        return;
    }
    
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
    
    renderProducts(filteredProducts);
}

// Filter by Category
function filterByCategory(category) {
    const filteredProducts = products.filter(product => 
        product.category === category
    );
    
    renderProducts(filteredProducts);
    
    // Update UI to show active filter
    document.querySelectorAll('.category-card').forEach(card => {
        card.style.opacity = card.dataset.category === category ? '1' : '0.6';
    });
}

// Show Filter Options
function showFilterOptions() {
    // Simple filter implementation - can be enhanced
    const priceRanges = [
        { min: 0, max: 50, label: 'Under ₹50' },
        { min: 50, max: 100, label: '₹50 - ₹100' },
        { min: 100, max: Infinity, label: 'Above ₹100' }
    ];
    
    const selectedRange = prompt(
        'Filter by price:\n1. Under ₹50\n2. ₹50 - ₹100\n3. Above ₹100\n\nEnter choice (1-3):'
    );
    
    if (selectedRange && ['1', '2', '3'].includes(selectedRange)) {
        const range = priceRanges[parseInt(selectedRange) - 1];
        const filteredProducts = products.filter(product => 
            product.price >= range.min && product.price <= range.max
        );
        renderProducts(filteredProducts);
    }
}

// Navigate to Page
function navigateToPage(page) {
    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-page="${page}"]`).classList.add('active');
    
    // Simple page navigation - can be enhanced with proper routing
    showNotification(`Navigating to ${page} page...`);
    
    // For demo purposes, just show a message
    if (page === 'orders') {
        alert('Orders page would show your order history here.');
    } else if (page === 'subscriptions') {
        alert('Subscriptions page would manage your milk subscriptions here.');
    } else if (page === 'profile') {
        alert('Profile page would show your account details here.');
    }
}

// Proceed to Checkout
function proceedToCheckout() {
    if (state.cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const total = state.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    
    // Simple checkout simulation
    const address = prompt('Enter delivery address:');
    if (address) {
        const orderId = 'ORD' + Date.now();
        alert(`Order placed successfully!\nOrder ID: ${orderId}\nTotal: ₹${total}\nDelivery to: ${address}\n\nThank you for choosing Akshaya Milk!`);
        
        // Clear cart
        state.cart = [];
        updateCartUI();
        saveCartToStorage();
        elements.cartSidebar.classList.remove('open');
    }
}

// Show Notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 12px 20px;
        border-radius: var(--border-radius-sm);
        box-shadow: var(--shadow-lg);
        z-index: 1003;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    notification.textContent = message;
    
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

// Check Online Status
function checkOnlineStatus() {
    if (!navigator.onLine) {
        elements.offlineIndicator.classList.add('show');
    }
}

// Save Cart to Local Storage
function saveCartToStorage() {
    try {
        localStorage.setItem('akshayaCart', JSON.stringify(state.cart));
    } catch (e) {
        console.warn('Could not save cart to localStorage:', e);
    }
}

// Load Cart from Local Storage
function loadCartFromStorage() {
    try {
        const savedCart = localStorage.getItem('akshayaCart');
        if (savedCart) {
            state.cart = JSON.parse(savedCart);
            updateCartUI();
        }
    } catch (e) {
        console.warn('Could not load cart from localStorage:', e);
    }
}

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);

// Handle cart item actions (delegated events)
document.addEventListener('click', (e) => {
    // Handle quantity changes in cart
    if (e.target.classList.contains('decrease')) {
        const productId = parseInt(e.target.dataset.productId);
        const item = state.cart.find(item => item.product.id === productId);
        if (item) {
            updateCartQuantity(productId, item.quantity - 1);
        }
    }
    
    if (e.target.classList.contains('increase')) {
        const productId = parseInt(e.target.dataset.productId);
        const item = state.cart.find(item => item.product.id === productId);
        if (item) {
            updateCartQuantity(productId, item.quantity + 1);
        }
    }
    
    // Handle remove from cart
    if (e.target.classList.contains('remove-btn')) {
        const productId = parseInt(e.target.dataset.productId);
        removeFromCart(productId);
    }
});
