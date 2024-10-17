function changeBackgroundColor(color) {
    document.body.style.backgroundColor = color;
}

function changeTextColor(color) {
    document.body.style.color = color;
}

function changeBarColor(color) {
    // Target all navigation bar elements
    var navBars = document.querySelectorAll('nav, .nav-bar, #nav-bar');
    navBars.forEach(function(navBar) {
        navBar.style.backgroundColor = color;
        // Target the text elements within the navigation bar
        var navBarText = navBar.querySelectorAll('a, span, p'); // or any other text element
        navBarText.forEach(function(element) {
            element.style.color = color;
        });
    });
}

function NavigationTextColor(color) {
    // Target all navigation bar elements
    var navBars = document.querySelectorAll('nav, .nav-bar, #nav-bar');
    navBars.forEach(function(navBar) {
        // Target the text elements within the navigation bar
        var navBarText = navBar.querySelectorAll('a, span, p'); // or any other text element
        navBarText.forEach(function(element) {
            element.style.color = color;
        });
    });
}