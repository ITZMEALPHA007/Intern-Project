$(document).ready(function() {
    // Initialize animations
    initAnimations();

    // Check if user is already logged in
    const sessionToken = localStorage.getItem('sessionToken');
    if (sessionToken) {
        // TODO: add verify_session.php later if needed
        // verifySession(sessionToken);
    }

    // Password toggle functionality
    $('#togglePassword').click(function() {
        togglePasswordVisibility('#password', this);
    });

    // Form submission
    $('#loginForm').submit(function(e) {
        e.preventDefault();
        
        // Get form values
        const username = $('#username').val().trim();
        const password = $('#password').val();
        const rememberMe = $('#rememberMe').is(':checked');

        // Validation
        if (!username || !password) {
            showAlert('Please fill in all fields', 'danger');
            return;
        }

        // Show loading state
        toggleLoadingState('#loginBtn', true);

        // Prepare data
        const formData = {
            username: username,
            password: password,
            rememberMe: rememberMe
        };

        // AJAX request to PHP backend
        $.ajax({
            url: '/GUVI/backend/php/login.php',   // ✅ correct path
            type: 'POST',
            dataType: 'json',
            data: formData,                       // ✅ normal form data
            success: function(response) {
                toggleLoadingState('#loginBtn', false);
                
                if (response.success) {
                    // Store session token in localStorage
                    localStorage.setItem('sessionToken', response.sessionToken);
                    localStorage.setItem('userId', response.userId);
                    localStorage.setItem('username', response.username);
                    localStorage.setItem('email', response.email);
                    
                    showAlert('Login successful! Redirecting...', 'success');
                    
                    setTimeout(function() {
                        window.location.href = 'profile.html';
                    }, 1500);
                } else {
                    showAlert(response.message || 'Invalid credentials. Please try again.', 'danger');
                }
            },
            error: function(xhr, status, error) {
                toggleLoadingState('#loginBtn', false);
                console.error('Login error:', error);
                showAlert('An error occurred during login. Please try again.', 'danger');
            }
        });
    });
});


// Helper Functions
function verifySession(token) {
    $.ajax({
        url: 'backend/php/verify_session.php',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({ sessionToken: token }),
        success: function(response) {
            if (response.valid) {
                // Session is valid, redirect to profile
                window.location.href = 'profile.html';
            }
        },
        error: function() {
            // Session invalid, clear storage
            localStorage.clear();
        }
    });
}

function togglePasswordVisibility(inputId, toggleBtn) {
    const input = $(inputId);
    const icon = $(toggleBtn).find('i');
    
    if (input.attr('type') === 'password') {
        input.attr('type', 'text');
        icon.removeClass('fa-eye').addClass('fa-eye-slash');
    } else {
        input.attr('type', 'password');
        icon.removeClass('fa-eye-slash').addClass('fa-eye');
    }
}

function showAlert(message, type) {
    const alertHtml = `
        <div class="custom-alert alert-${type}">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'danger' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    $('#alertContainer').html(alertHtml);
    
    // Auto-hide after 5 seconds
    setTimeout(function() {
        $('#alertContainer').fadeOut(function() {
            $(this).html('').show();
        });
    }, 5000);
}

function toggleLoadingState(btnSelector, isLoading) {
    const btn = $(btnSelector);
    if (isLoading) {
        btn.prop('disabled', true);
        btn.find('.btn-text').hide();
        btn.find('.btn-loader').show();
    } else {
        btn.prop('disabled', false);
        btn.find('.btn-text').show();
        btn.find('.btn-loader').hide();
    }
}

function initAnimations() {
    // Stagger animations for form elements
    $('.form-group').each(function(index) {
        $(this).css({
            'animation-delay': (index * 0.1) + 's'
        });
    });
}
