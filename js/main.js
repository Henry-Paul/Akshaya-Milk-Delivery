// Main application initialization
document.addEventListener('DOMContentLoaded', function() {
    console.log('Akshaya Milk Delivery System loaded');
    
    // Check if user was previously in an app
    const lastApp = localStorage.getItem('lastApp');
    if (lastApp && lastApp !== 'selector') {
        switchApp(lastApp);
    }
});

// Save last app to localStorage
function switchApp(appType) {
    localStorage.setItem('lastApp', appType);
    window.appSelector.switchApp(appType);
}

// Make app selector available globally
window.appSelector = {
    switchApp: switchApp
};
