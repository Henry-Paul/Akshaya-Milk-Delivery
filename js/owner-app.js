// Owner App
class OwnerApp {
    constructor() {
        this.state = {
            currentSection: 'dashboard',
            stats: {},
            agencies: [],
            products: []
        };
    }

    initialize() {
        this.loadSampleData();
        this.renderOwnerApp();
    }

    renderOwnerApp() {
        const appContainer = document.getElementById('ownerApp');
        appContainer.innerHTML = `
            <div class="owner-app">
                <div class="owner-layout">
                    <aside class="owner-sidebar">
                        <div class="sidebar-header">
                            <div class="logo">
                                <span>🥛</span>
                                <h2>Akshaya Admin</h2>
                            </div>
                        </div>
                        <nav class="sidebar-nav">
                            <a class="sidebar-nav-item ${this.state.currentSection === 'dashboard' ? 'active' : ''}" 
                               onclick="ownerApp.showSection('dashboard')">
                                <span class="material-icons">dashboard</span>
                                Dashboard
                            </a>
                            <a class="sidebar-nav-item ${this.state.currentSection === 'agencies' ? 'active' : ''}" 
                               onclick="ownerApp.showSection('agencies')">
                                <span class="material-icons">local_shipping</span>
                                Agencies
                            </a>
                            <a class="sidebar-nav-item ${this.state.currentSection === 'products' ? 'active' : ''}" 
                               onclick="ownerApp.showSection('products')">
                                <span class="material-icons">inventory</span>
                                Products
                            </a>
                            <a class="sidebar-nav-item ${this.state.currentSection === 'customers' ? 'active' : ''}" 
                               onclick="ownerApp.showSection('customers')">
                                <span class="material-icons">people</span>
                                Customers
                            </a>
                            <a class="sidebar-nav-item ${this.state.currentSection === 'analytics' ? 'active' : ''}" 
                               onclick="ownerApp.showSection('analytics')">
                                <span class="material-icons">analytics</span>
                                Analytics
                            </a>
                        </nav>
                    </aside>

                    <main class="owner-main">
                        ${this.state.currentSection === 'dashboard' ? this.renderDashboard() : ''}
                        ${this.state.currentSection === 'agencies' ? this.renderAgencies() : ''}
                        ${this.state.currentSection === 'products' ? this.renderProducts() : ''}
                        ${this.state.currentSection === 'customers' ? this.renderCustomers() : ''}
                        ${this.state.currentSection === 'analytics' ? this.renderAnalytics() : ''}
                    </main>
                </div>
            </div>
        `;
    }

    renderDashboard() {
        return `
            <div class="dashboard">
                <h1 class="section-title">Business Overview</h1>
                
                <div class="kpi-grid">
                    <div class="kpi-card">
                        <div class="kpi-value">₹${this.state.stats.revenue}</div>
                        <div class="kpi-label">Monthly Revenue</div>
                    </div>
                    <div class="kpi-card">
                        <div class="kpi-value">${this.state.stats.customers}</div>
                        <div class="kpi-label">Active Customers</div>
                    </div>
                    <div class="kpi-card">
                        <div class="kpi-value">${this.state.stats.deliveries}</div>
                        <div class="kpi-label">Daily Deliveries</div>
                    </div>
                    <div class="kpi-card">
                        <div class="kpi-value">${this.state.stats.agencies}</div>
                        <div class="kpi-label">Active Agencies</div>
                    </div>
                </div>

                <div class="charts-grid">
                    <div class="chart-card">
                        <h3>Revenue Trend</h3>
                        <div class="chart-placeholder">
                            <p>Revenue chart would be displayed here</p>
                        </div>
                    </div>
                    <div class="chart-card">
                        <h3>Top Products</h3>
                        <div class="chart-placeholder">
                            <p>Product performance chart would be displayed here</p>
                        </div>
                    </div>
                </div>

                <div class="management-section">
                    <h3>Recent Activity</h3>
                    <div class="activity-list">
                        <p>New order from Customer #1234 - ₹250</p>
                        <p>Agency Bangalore South updated their stock</p>
                        <p>New customer registered - Total: ${this.state.stats.customers}</p>
                    </div>
                </div>
            </div>
        `;
    }

    renderAgencies() {
        return `
            <div class="management-section">
                <h2 class="section-title">Agency Management</h2>
                <div class="agencies-list">
                    ${this.state.agencies.map(agency => `
                        <div class="management-card">
                            <h3>${agency.name}</h3>
                            <p><strong>Manager:</strong> ${agency.manager}</p>
                            <p><strong>Location:</strong> ${agency.location}</p>
                            <p><strong>Status:</strong> <span class="status-${agency.status}">${agency.status}</span></p>
                            <p><strong>Performance:</strong> ${agency.performance}%</p>
                            <div class="action-buttons">
                                <button class="btn-primary" onclick="ownerApp.editAgency(${agency.id})">Edit</button>
                                <button class="btn-secondary" onclick="ownerApp.viewAgencyDetails(${agency.id})">Details</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <button class="btn-primary" style="margin-top: 20px;">
                    + Add New Agency
                </button>
            </div>
        `;
    }

    renderProducts() {
        return `
            <div class="management-section">
                <h2 class="section-title">Product Catalog</h2>
                <div class="products-list">
                    ${this.state.products.map(product => `
                        <div class="management-card">
                            <h3>${product.name}</h3>
                            <p><strong>Base Price:</strong> ₹${product.basePrice}</p>
                            <p><strong>Category:</strong> ${product.category}</p>
                            <p><strong>Status:</strong> ${product.active ? 'Active' : 'Inactive'}</p>
                            <div class="action-buttons">
                                <button class="btn-primary" onclick="ownerApp.editProduct(${product.id})">Edit</button>
                                <button class="btn-secondary" onclick="ownerApp.viewProductAnalytics(${product.id})">Analytics</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <button class="btn-primary" style="margin-top: 20px;">
                    + Add New Product
                </button>
            </div>
        `;
    }

    renderCustomers() {
        return `
            <div class="management-section">
                <h2 class="section-title">Customer Management</h2>
                <p>Customer management interface would be displayed here.</p>
                <div class="empty-state">
                    <span class="material-icons">people</span>
                    <p>Customer management features</p>
                </div>
            </div>
        `;
    }

    renderAnalytics() {
        return `
            <div class="management-section">
                <h2 class="section-title">Business Analytics</h2>
                <p>Detailed analytics and reports would be displayed here.</p>
                <div class="empty-state">
                    <span class="material-icons">analytics</span>
                    <p>Advanced analytics dashboard</p>
                </div>
            </div>
        `;
    }

    showSection(section) {
        this.state.currentSection = section;
        this.renderOwnerApp();
    }

    loadSampleData() {
        this.state.stats = {
            revenue: '1,84,560',
            customers: '1,247',
            deliveries: '342',
            agencies: '12'
        };

        this.state.agencies = [
            {
                id: 1,
                name: "Bangalore South",
                manager: "Rajesh Kumar",
                location: "BTM Layout, Bangalore",
                status: "active",
                performance: 85
            },
            {
                id: 2,
                name: "Bangalore North",
                manager: "Priya Singh",
                location: "Yeshwanthpur, Bangalore",
                status: "active",
                performance: 92
            }
        ];

        this.state.products = [
            {
                id: 1,
                name: "Fresh Cow Milk 1L",
                basePrice: 30,
                category: "Milk",
                active: true
            },
            {
                id: 2,
                name: "Buffalo Milk 1L",
                basePrice: 40,
                category: "Milk",
                active: true
            }
        ];
    }

    editAgency(agencyId) {
        alert(`Editing agency #${agencyId}`);
    }

    viewAgencyDetails(agencyId) {
        alert(`Viewing details for agency #${agencyId}`);
    }

    editProduct(productId) {
        alert(`Editing product #${productId}`);
    }

    viewProductAnalytics(productId) {
        alert(`Viewing analytics for product #${productId}`);
    }
}

// Initialize owner app
const ownerApp = new OwnerApp();
function initializeOwnerApp() {
    ownerApp.initialize();
}
