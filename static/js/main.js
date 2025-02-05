// Dark mode toggle
const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');

// Check for saved theme preference
const currentTheme = localStorage.getItem('theme');
if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'dark') {
        toggleSwitch.checked = true;
    }
}

// Handle theme switch
function switchTheme(e) {
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }
}

toggleSwitch.addEventListener('change', switchTheme, false);

// Function to perform feedback search
function searchFeedback(email) {
    const feedbackContainer = document.getElementById('feedback-container');
    const errorMessage = document.getElementById('error-message');
    
    // Show loading state
    feedbackContainer.style.display = 'none';
    errorMessage.textContent = 'Loading...';
    
    // Make API request
    fetch('/get_feedback', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email })
    })
    .then(response => response.json())
    .then(data => {
        errorMessage.textContent = '';
        if (data.error) {
            errorMessage.textContent = data.error;
            feedbackContainer.style.display = 'none';
        } else {
            feedbackContainer.innerHTML = data.feedback_html;
            feedbackContainer.style.display = 'block';
            
            // Add syntax highlighting to code blocks if any
            document.querySelectorAll('pre code').forEach((block) => {
                block.style.display = 'block';
                block.style.overflow = 'auto';
                block.style.padding = '1em';
            });
        }
    })
    .catch(error => {
        errorMessage.textContent = 'An error occurred. Please try again.';
        feedbackContainer.style.display = 'none';
    });
}

// Handle email input
document.getElementById('email').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const email = this.value.trim();
        searchFeedback(email);
    }
});

// Check if email is present on page load
document.addEventListener('DOMContentLoaded', function() {
    const emailInput = document.getElementById('email');
    if (emailInput.value.trim()) {
        searchFeedback(emailInput.value.trim());
    }
});
