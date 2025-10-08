// App Selector Functionality
function switchApp(appType) {
    // Hide all apps and show app selector
    document.getElementById('appSelector').style.display = 'none';
    document.getElementById('backToSelector').style.display = 'flex';
    
    // Hide all apps
    document.querySelectorAll('.app-container').forEach(app => {
        app.style.display = 'none';
    });
    
    // Show selected app
    const selectedApp = document.getElementById(appType + 'App');
    if (selectedApp) {
        selectedApp.style.display = 'block';
        selectedApp.classList.add(appType + '-app');
        
        // Initialize the selected app
        switch(appType) {
            case 'customer':
                initializeCustomerApp();
                break;
            case 'agency':
                initializeAgencyApp();
                break;
            case 'owner':
                initializeOwnerApp();
                break;
        }
    }
}

function showAppSelector() {
    document.getElementById('appSelector').style.display = 'flex';
    document.getElementById('backToSelector').style.display = 'none';
    document.querySelectorAll('.app-container').forEach(app => {
        app.style.display = 'none';
    });
}
