// App Selector Functionality
function switchApp(appType) {
    console.log('Switching to app:', appType);
    
    // Hide app selector
    const appSelector = document.getElementById('appSelector');
    if (appSelector) {
        appSelector.style.display = 'none';
    }
    
    // Show back button
    const backButton = document.getElementById('backToSelector');
    if (backButton) {
        backButton.style.display = 'flex';
    }
    
    // Hide all apps
    const appContainers = document.querySelectorAll('.app-container');
    appContainers.forEach(app => {
        app.style.display = 'none';
        app.innerHTML = ''; // Clear previous content
    });
    
    // Show selected app
    const selectedApp = document.getElementById(appType + 'App');
    if (selectedApp) {
        selectedApp.style.display = 'block';
        
        // Initialize the selected app
        switch(appType) {
            case 'customer':
                if (typeof initializeCustomerApp === 'function') {
                    initializeCustomerApp();
                } else {
                    console.error('initializeCustomerApp function not found');
                }
                break;
            case 'agency':
                if (typeof initializeAgencyApp === 'function') {
                    initializeAgencyApp();
                } else {
                    console.error('initializeAgencyApp function not found');
                }
                break;
            case 'owner':
                if (typeof initializeOwnerApp === 'function') {
                    initializeOwnerApp();
                } else {
                    console.error('initializeOwnerApp function not found');
                }
                break;
            default:
                console.error('Unknown app type:', appType);
        }
    } else {
        console.error('App container not found for:', appType);
    }
}

function showAppSelector() {
    console.log('Showing app selector');
    
    // Show app selector
    const appSelector = document.getElementById('appSelector');
    if (appSelector) {
        appSelector.style.display = 'flex';
    }
    
    // Hide back button
    const backButton = document.getElementById('backToSelector');
    if (backButton) {
        backButton.style.display = 'none';
    }
    
    // Hide all apps
    const appContainers = document.querySelectorAll('.app-container');
    appContainers.forEach(app => {
        app.style.display = 'none';
        app.innerHTML = ''; // Clear content
    });
}

// Make functions globally available
window.switchApp = switchApp;
window.showAppSelector = showAppSelector;
