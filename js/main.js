// Main application initialization
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Akshaya Milk Delivery System loaded');
    
    // Show splash screen first
    showSplashScreen();
});

function showSplashScreen() {
    console.log('🎬 Showing splash screen');
    
    // Hide everything except splash
    document.getElementById('appSelector').style.display = 'none';
    document.getElementById('customerApp').style.display = 'none';
    document.getElementById('agencyApp').style.display = 'none';
    document.getElementById('ownerApp').style.display = 'none';
    document.getElementById('backToSelector').style.display = 'none';
    
    // Show splash screen
    document.getElementById('splashScreen').style.display = 'flex';
    
    // After 2 seconds, show app selector
    setTimeout(() => {
        document.getElementById('splashScreen').style.display = 'none';
        showAppSelector();
    }, 2000);
}

function showAppSelector() {
    console.log('🔄 Showing app selector');
    
    // Hide all apps
    document.getElementById('customerApp').style.display = 'none';
    document.getElementById('agencyApp').style.display = 'none';
    document.getElementById('ownerApp').style.display = 'none';
    document.getElementById('backToSelector').style.display = 'none';
    
    // Show app selector
    document.getElementById('appSelector').style.display = 'flex';
    
    // Setup app card click events
    setupAppSelector();
}

function setupAppSelector() {
    const appCards = document.querySelectorAll('.app-card');
    
    appCards.forEach(card => {
        card.addEventListener('click', function() {
            const appType = this.getAttribute('data-app');
            console.log('App selected:', appType);
            switchToApp(appType);
        });
    });
    
    // Setup back button
    const backButton = document.getElementById('backToSelector');
    backButton.addEventListener('click', showAppSelector);
}

function switchToApp(appType) {
    console.log('🔄 Switching to app:', appType);
    
    // Hide app selector
    document.getElementById('appSelector').style.display = 'none';
    
    // Show back button
    document.getElementById('backToSelector').style.display = 'flex';
    
    // Hide all apps
    document.getElementById('customerApp').style.display = 'none';
    document.getElementById('agencyApp').style.display = 'none';
    document.getElementById('ownerApp').style.display = 'none';
    
    // Show selected app
    const selectedApp = document.getElementById(appType + 'App');
    selectedApp.style.display = 'block';
    
    // Initialize the selected app
    switch(appType) {
        case 'customer':
            if (typeof initializeCustomerApp === 'function') {
                initializeCustomerApp();
            }
            break;
        case 'agency':
            if (typeof initializeAgencyApp === 'function') {
                initializeAgencyApp();
            }
            break;
        case 'owner':
            if (typeof initializeOwnerApp === 'function') {
                initializeOwnerApp();
            }
            break;
    }
}

// Make functions globally available
window.showAppSelector = showAppSelector;
window.switchToApp = switchToApp;
