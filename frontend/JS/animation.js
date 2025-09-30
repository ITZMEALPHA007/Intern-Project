$(document).ready(function() {
    // Initialize animations on page load
    initPageAnimations();
    
    // Add hover effects to 3D cards
    init3DCardEffects();
    
    // Smooth scrolling
    initSmoothScrolling();
});

// Initialize page animations with stagger effect
function initPageAnimations() {
    // Animate elements with data-delay attribute
    $('.animate-slide-up[data-delay]').each(function() {
        const delay = $(this).data('delay');
        $(this).css('animation-delay', delay + 's');
    });
    
    $('.animate-fade-in-up[data-delay]').each(function() {
        const delay = $(this).data('delay');
        $(this).css('animation-delay', delay + 's');
    });
}

// 3D card tilt effect on mouse move
function init3DCardEffects() {
    $('.card-3d').on('mousemove', function(e) {
        const card = $(this);
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.css({
            'transform': `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
        });
    });
    
    $('.card-3d').on('mouseleave', function() {
        $(this).css({
            'transform': 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)'
        });
    });
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    $('a[href^="#"]').on('click', function(e) {
        const target = $(this.getAttribute('href'));
        
        if (target.length) {
            e.preventDefault();
            $('html, body').stop().animate({
                scrollTop: target.offset().top - 80
            }, 1000);
        }
    });
}

// Parallax effect for gradient orbs
$(window).on('scroll', function() {
    const scrolled = $(window).scrollTop();
    
    $('.orb-1').css('transform', 'translate(' + (scrolled * 0.2) + 'px, ' + (scrolled * 0.3) + 'px)');
    $('.orb-2').css('transform', 'translate(' + (-scrolled * 0.1) + 'px, ' + (-scrolled * 0.2) + 'px)');
    $('.orb-3').css('transform', 'translate(' + (scrolled * 0.15) + 'px, ' + (-scrolled * 0.15) + 'px)');
});
