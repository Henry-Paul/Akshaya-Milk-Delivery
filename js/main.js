// Main application initialization - FIXED VERSION
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
    const appSelector = document.getElementById('appSelector');
    appSelector.style.display = 'flex';
    
    // Setup app card click events
    setupAppCards();
    
    // Setup back button
    setupBackButton();
}

function setupAppCards() {
    console.log('🔧 Setting up app cards');
    
    const appCards = document.querySelectorAll('.app-card');
    appCards.forEach(card => {
        // Remove any existing event listeners
        card.replaceWith(card.cloneNode(true));
    });
    
    // Re-select and add fresh event listeners
    const freshAppCards = document.querySelectorAll('.app-card');
    freshAppCards.forEach(card => {
        card.addEventListener('click', function() {
            const appType = this.getAttribute('data-app');
            console.log('🎯 App card clicked:', appType);
            switchToApp(appType);
        });
    });
    
    console.log('✅ App cards setup complete');
}

function setupBackButton() {
    const backButton = document.getElementById('backToSelector');
    if (backButton) {
        // Remove any existing event listeners
        backButton.replaceWith(backButton.cloneNode(true));
        
        // Re-select and add fresh event listener
        const freshBackButton = document.getElementById('backToSelector');
        freshBackButton.addEventListener('click', showAppSelector);
        console.log('✅ Back button setup complete');
    }
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
        initializeApp(appType);
    } else {
        console.error('❌ App container not found:', appType + 'App');
    }
}

function initializeApp(appType) {
    switch(appType) {
        case 'customer':
            if (typeof initializeCustomerApp === 'function') {
                console.log('🚀 Initializing Customer App');
                initializeCustomerApp();
            } else {
                console.error('❌ initializeCustomerApp function not found');
                // Fallback: Show basic customer app
                document.getElementById('customerApp').innerHTML = `
                    <div style="padding: 20px; text-align: center;">
                        <h1>Customer App</h1>
                        <p>App loaded successfully!</p>
                        <button onclick="showAppSelector()" class="btn-primary">Back to Selector</button>
                    </div>
                `;
            }
            break;
        case 'agency':
            if (typeof initializeAgencyApp === 'function') {
                console.log('🚀 Initializing Agency App');
                initializeAgencyApp();
            } else {
                console.error('❌ initializeAgencyApp function not found');
                // Fallback
                document.getElementById('agencyApp').innerHTML = `
                    <div style="padding: 20px; text-align: center;">
                        <h1>Agency App</h1>
                        <p>App loaded successfully!</p>
                        <button onclick="showAppSelector()" class="btn-primary">Back to Selector</button>
                    </div>
                `;
            }
            break;
        case 'owner':
            if (typeof initializeOwnerApp === 'function') {
                console.log('🚀 Initializing Owner App');
                initializeOwnerApp();
            } else {
                console.error('❌ initializeOwnerApp function not found');
                // Fallback
                document.getElementById('ownerApp').innerHTML = `
                    <div style="padding: 20px; text-align: center;">
                        <h1>Owner App</h1>
                        <p>App loaded successfully!</p>
                        <button onclick="showAppSelector()" class="btn-primary">Back to Selector</button>
                    </div>
                `;
            }
            break;
        default:
            console.error('❌ Unknown app type:', appType);
    }
}

// Make functions globally available
window.showAppSelector = showAppSelector;
window.switchToApp = switchToApp;
