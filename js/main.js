// Main application initialization
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Akshaya Milk Delivery System loaded');
    
    // Initialize app selector
    initializeAppSelector();
    
    // Check if user was previously in an app
    const lastApp = localStorage.getItem('lastApp');
    if (lastApp && lastApp !== 'selector') {
        console.log('Restoring last app:', lastApp);
        switchApp(lastApp);
    }
});

function initializeAppSelector() {
    console.log('Initializing app selector...');
    
    // Add click event listeners to app cards
    const appCards = document.querySelectorAll('.app-card');
    appCards.forEach(card => {
        card.addEventListener('click', function() {
            const appType = this.classList[1].replace('-app', ''); // Get 'customer', 'agency', or 'owner'
            console.log('App card clicked:', appType);
            switchApp(appType);
        });
    });
    
    // Initialize back button
    const backButton = document.getElementById('backToSelector');
    if (backButton) {
        backButton.addEventListener('click', showAppSelector);
    }
    
    console.log('App selector initialized successfully');
}

// Save last app to localStorage
function switchApp(appType) {
    console.log('Switching to app:', appType);
    localStorage.setItem('lastApp', appType);
    window.switchApp(appType);
}

// Make functions globally available
window.initializeAppSelector = initializeAppSelector;
