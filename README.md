# 🥛 Akshaya Milk Delivery PWA

A modern, Swiggy-style Progressive Web App for milk delivery with three distinct interfaces: Customer App, Delivery Agent App, and Admin Dashboard.

## ✨ Features

### 🎯 Customer App
- **Modern UI**: Swiggy-inspired design with vibrant colors
- **Product Catalog**: Beautiful card-based product display
- **Smart Search**: Real-time search and filtering
- **Shopping Cart**: Advanced cart management with quantity controls
- **Subscription Plans**: Weekly and monthly milk plans
- **Delivery Scheduling**: Flexible delivery time selection
- **PWA Features**: Offline support, installable, fast loading

### 🚚 Delivery Agent App
- **Delivery Dashboard**: Overview of daily deliveries
- **Live Tracking**: Map integration for route optimization
- **Task Management**: Mark deliveries as completed
- **Customer Communication**: Direct call and navigation features
- **Performance Stats**: Delivery completion metrics

### 💼 Admin Dashboard
- **Analytics**: Revenue, customers, and delivery metrics
- **KPI Cards**: Key performance indicators at a glance
- **Product Management**: Add/edit products and categories
- **User Management**: Customer and delivery agent management
- **Real-time Data**: Live updates and charts

## 🚀 Deployment on GitHub Pages

1. **Create a new repository** on GitHub
2. **Upload all files** to the repository:
   - `index.html`
   - `style.css`
   - `app.js`
   - `sw.js`
   - `manifest.json`
   - `sample-data.json`
   - `README.md`

3. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Select "Deploy from branch"
   - Choose "main" branch and "/ (root)" folder
   - Click "Save"

4. **Your app will be live at**:  
   `https://[your-username].github.io/[repository-name]`

## 🛠 Local Development

```bash
# Clone the repository
git clone https://github.com/your-username/akshaya-milk-pwa.git
cd akshaya-milk-pwa

# Serve using local server
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
