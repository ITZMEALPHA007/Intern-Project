$(document).ready(function () {
    // Check authentication
    const sessionToken = localStorage.getItem('sessionToken');
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email');

    if (!sessionToken || !userId) {
        // Not logged in, redirect to login page
        window.location.href = 'login.html';
        return;
    }

    // Display user info in header
    $('#profileUsername').text(username || 'User');
    $('#profileEmail').text(email || '');

    // Set first letter of username as avatar
    if (username) {
        $('#profileAvatar').html(username.charAt(0).toUpperCase());
    }

    // Load profile data
    loadProfileData();

    // Edit button click
    $('#editBtn').click(function () {
        $('#viewMode').hide();
        $('#editMode').show();
    });

    // Cancel button click
    $('#cancelBtn').click(function () {
        $('#editMode').hide();
        $('#viewMode').show();
    });

    // Logout button click
    $('#logoutBtn').click(function () {
        logout();
    });

    // Profile form submission
    $('#profileForm').submit(function (e) {
        e.preventDefault();
        updateProfile();
    });
});


// 👉 Load profile data from Node backend
function loadProfileData() {
    const userId = localStorage.getItem('userId');

    $.ajax({
        url: `https://guvi-backend-bfra.onrender.com`,  
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            console.log("GET response:", response); 

            if (response.success && response.profile) {
                $('#displayAge').text(response.profile.age || 'Not set');
                $('#displayDob').text(response.profile.dob || 'Not set');
                $('#displayContact').text(response.profile.contact || 'Not set');
                $('#displayAddress').text(response.profile.address || 'Not set');

                // Fill edit form
                $('#age').val(response.profile.age || '');
                $('#dob').val(response.profile.dob || '');
                $('#contact').val(response.profile.contact || '');
                $('#address').val(response.profile.address || '');
            } else {
                showAlert('No profile data found', 'info');
            }
        },
        error: function (xhr, status, error) {
            console.error('❌ Error loading profile:', xhr.responseText || error);
            showAlert('Failed to load profile', 'danger');
        }
    });
}


// 👉 Update profile data in Node backend
function updateProfile() {
    const userId = localStorage.getItem('userId');

    toggleLoadingState('#saveBtn', true);

    const profileData = {
        userId: parseInt(userId),  // ✅ make sure it's a number
        age: $('#age').val(),
        dob: $('#dob').val(),
        contact: $('#contact').val(),
        address: $('#address').val()
    };

    $.ajax({
        url: 'https://guvi-backend-bfra.onrender.com',  
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(profileData),
        success: function (response) {
            console.log("POST response:", response); 

            toggleLoadingState('#saveBtn', false);

            if (response.success) {
                showAlert('Profile updated successfully!', 'success');

                // Update view mode
                $('#displayAge').text(profileData.age || 'Not set');
                $('#displayDob').text(profileData.dob || 'Not set');
                $('#displayContact').text(profileData.contact || 'Not set');
                $('#displayAddress').text(profileData.address || 'Not set');

                setTimeout(function () {
                    $('#editMode').hide();
                    $('#viewMode').show();
                }, 1500);
            } else {
                showAlert(response.message || 'Failed to update profile', 'danger');
            }
        },
        error: function (xhr, status, error) {
            toggleLoadingState('#saveBtn', false);
            console.error('❌ Error updating profile:', xhr.responseText || error);
            showAlert('An error occurred while updating profile', 'danger');
        }
    });
}


// 👉 Logout function (still handled by PHP)
function logout() {
    const sessionToken = localStorage.getItem('sessionToken');

    $.ajax({
        url: 'GUVI/backend/php/logout.php',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({ sessionToken: sessionToken }),
        complete: function () {
            localStorage.clear();
            window.location.href = 'index.html';
        }
    });
}


// 👉 Helper Functions
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
