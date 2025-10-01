$(document).ready(function () {
    // Initialize animations
    initAnimations();

    // Password toggle functionality
    $('#togglePassword').click(function () {
        togglePasswordVisibility('#password', this);
    });

    $('#toggleConfirmPassword').click(function () {
        togglePasswordVisibility('#confirmPassword', this);
    });

    // Form submission
    $('#registerForm').submit(function (e) {
        e.preventDefault();

        // Get form values
        const username = $('#username').val().trim();
        const email = $('#email').val().trim();
        const password = $('#password').val();
        const confirmPassword = $('#confirmPassword').val();
        const termsAccepted = $('#terms').is(':checked');

        // Validation
        if (!username || !email || !password || !confirmPassword) {
            showAlert('Please fill in all fields', 'danger');
            return;
        }
        if (!validateEmail(email)) {
            showAlert('Please enter a valid email address', 'danger');
            return;
        }
        if (password.length < 6) {
            showAlert('Password must be at least 6 characters long', 'danger');
            return;
        }
        if (password !== confirmPassword) {
            showAlert('Passwords do not match', 'danger');
            return;
        }
        if (!termsAccepted) {
            showAlert('Please accept the Terms & Conditions', 'danger');
            return;
        }

        // Show loading state
        toggleLoadingState('#registerBtn', true);

        // ✅ Send as standard form data (not JSON)
        $.ajax({
            url: 'http://if0_40066517.infinityfreeapp.com/register.php',
            type: 'POST',
            dataType: 'json',
            data: {
                username: username,
                email: email,
                password: password
            },
            success: function (response) {
                toggleLoadingState('#registerBtn', false);

                if (response.success) {
                    showAlert('Registration successful! Redirecting to login...', 'success');

                    // Redirect after 2 seconds
                    setTimeout(function () {
                        window.location.href = 'login.html';
                    }, 2000);
                } else {
                    showAlert(response.message || 'Registration failed. Please try again.', 'danger');
                }
            },
            error: function (xhr, status, error) {
                toggleLoadingState('#registerBtn', false);
                console.error('Registration error:', error);
                showAlert('An error occurred during registration. Please try again.', 'danger');
            }
        });
    });
});

// Helper Functions
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

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showAlert(message, type) {
    const alertHtml = `
        <div class="custom-alert alert-${type}">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'danger' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    $('#alertContainer').html(alertHtml);

    setTimeout(function () {
        $('#alertContainer').fadeOut(function () {
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
    $('.form-group').each(function (index) {
        $(this).css({
            'animation-delay': (index * 0.1) + 's'
        });
    });
}
