// Main application initialization - FIXED VERSION
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Akshaya Milk Delivery System loaded');
    
    // Show splash screen first
    showSplashScreen();
    
    // Setup app selector click events immediately
    setupAppSelector();
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

function setupAppSelector() {
    console.log('🔧 Setting up app selector events');
    
    // Add click event listeners to app cards
    const appCards = document.querySelectorAll('.app-card');
    appCards.forEach(card => {
        card.addEventListener('click', function() {
            const appType = this.getAttribute('data-app');
            console.log('App card clicked:', appType);
            switchToApp(appType);
        });
    });
    
    // Setup back button
    const backButton = document.getElementById('backToSelector');
    if (backButton) {
        backButton.addEventListener('click', showAppSelector);
        console.log('✅ Back button event listener added');
    }
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
    if (selectedApp) {
        selectedApp.style.display = 'block';
        console.log('✅ Showing app:', appType);
        
        // Initialize the selected app
        switch(appType) {
            case 'customer':
                if (typeof initializeCustomerApp === 'function') {
                    console.log('🚀 Initializing Customer App');
                    initializeCustomerApp();
                } else {
                    console.error('❌ initializeCustomerApp function not found');
                }
                break;
            case 'agency':
                if (typeof initializeAgencyApp === 'function') {
                    console.log('🚀 Initializing Agency App');
                    initializeAgencyApp();
                } else {
                    console.error('❌ initializeAgencyApp function not found');
                }
                break;
            case 'owner':
                if (typeof initializeOwnerApp === 'function') {
                    console.log('🚀 Initializing Owner App');
                    initializeOwnerApp();
                } else {
                    console.error('❌ initializeOwnerApp function not found');
                }
                break;
            default:
                console.error('❌ Unknown app type:', appType);
        }
    } else {
        console.error('❌ App container not found:', appType + 'App');
    }
}

// Make functions globally available
window.showAppSelector = showAppSelector;
window.switchToApp = switchToApp;
