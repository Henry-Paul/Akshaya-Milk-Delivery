// Main application initialization - CLICK FIXED VERSION
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
    
    // Setup app card click events IMMEDIATELY
    setupAppCards();
    
    // Setup back button
    setupBackButton();
}

// SIMPLE CLICK HANDLER - This will definitely work
function setupAppCards() {
    console.log('🔧 Setting up app cards');
    
    const appCards = document.querySelectorAll('.app-card');
    
    appCards.forEach(card => {
        // Remove any existing click events
        card.onclick = null;
        
        // Add new click event - SIMPLE DIRECT APPROACH
        card.onclick = function() {
            const appType = this.getAttribute('data-app');
            console.log('🎯 App card clicked:', appType);
            switchToApp(appType);
        };
        
        // Also add cursor pointer to make it obvious it's clickable
        card.style.cursor = 'pointer';
    });
    
    console.log('✅ App cards setup complete - found', appCards.length, 'cards');
}

function setupBackButton() {
    const backButton = document.getElementById('backToSelector');
    if (backButton) {
        backButton.onclick = showAppSelector;
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
    console.log('🚀 Initializing app:', appType);
    
    switch(appType) {
        case 'customer':
            if (typeof initializeCustomerApp === 'function') {
                initializeCustomerApp();
            } else {
                showFallbackApp(appType);
            }
            break;
        case 'agency':
            if (typeof initializeAgencyApp === 'function') {
                initializeAgencyApp();
            } else {
                showFallbackApp(appType);
            }
            break;
        case 'owner':
            if (typeof initializeOwnerApp === 'function') {
                initializeOwnerApp();
            } else {
                showFallbackApp(appType);
            }
            break;
        default:
            console.error('❌ Unknown app type:', appType);
    }
}

function showFallbackApp(appType) {
    console.log('🔄 Showing fallback for:', appType);
    const appContainer = document.getElementById(appType + 'App');
    appContainer.innerHTML = `
        <div style="padding: 40px; text-align: center;">
            <h1>${appType.charAt(0).toUpperCase() + appType.slice(1)} App</h1>
            <p>✅ Successfully loaded!</p>
            <p>This is the ${appType} interface.</p>
            <button onclick="showAppSelector()" class="btn-primary" style="margin-top: 20px;">
                ← Back to App Selector
            </button>
        </div>
    `;
}

// Make functions globally available
window.showAppSelector = showAppSelector;
window.switchToApp = switchToApp;
