$(document).ready(function () {
    // Initialize animations
    initAnimations();

    const sessionToken = localStorage.getItem('sessionToken');

    $('#togglePassword').click(function () {
        togglePasswordVisibility('#password', this);
    });

    // Form submission
    $('#loginForm').submit(function (e) {
        e.preventDefault();

        const username = $('#username').val().trim();
        const password = $('#password').val();
        const rememberMe = $('#rememberMe').is(':checked');

        if (!username || !password) {
            showAlert('Please fill in all fields', 'danger');
            return;
        }

        toggleLoadingState('#loginBtn', true);

        const formData = {
            username: username,
            password: password,
            rememberMe: rememberMe
        };

        $.ajax({
            url: "https://guvi-php.42web.io/login.php",
            type: "POST",
            data: formData, // form-data
            success: function (response) {
                console.log("Raw response:", response);
        
                // Ensure JSON parsing
                try {
                    if (typeof response === "string") {
                        response = JSON.parse(response);
                    }
                } catch (e) {
                    console.error("JSON parse error:", e, response);
                    showAlert("Server returned invalid response", "danger");
                    return;
                }
        
                // ✅ Handle success
                if (response.success) {
                    // Save session info
                    localStorage.setItem("sessionToken", response.sessionToken || "");
                    localStorage.setItem("userId", response.userId || "");
                    localStorage.setItem("username", response.username || "");
                    localStorage.setItem("email", response.email || "");
        
                    showAlert("Login successful! Redirecting...", "success");
        
                    // ✅ Redirect to profile page
                    setTimeout(function () {
                        window.location.href = "../HTML/profile.html";
                    }, 1500);
                } else {
                    // Show backend error message
                    showAlert(response.message || "Invalid credentials.", "danger");
                }
            },
            error: function (xhr, status, error) {
                console.error("XHR Error:", xhr.responseText || error);
                showAlert("Could not reach server. Check PHP logs.", "danger");
            }
        });
        
    });
});

// ================= Helper Functions ================= //

function verifySession(token) {
    $.ajax({
        url: 'https://guvi-php.42web.io/verify_session.php',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({ sessionToken: token }),
        success: function (response) {
            if (response.valid) {
                window.location.href = 'profile.html';
            }
        },
        error: function () {
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
// ================= End of File ================= //