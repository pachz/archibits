$(document).on('ready', function () {
    
    "use strict";
    
    var win = $(window);
            
    
    win.on('load', function () {
        $('.loading-overlay').fadeOut(100);
    });
    
   
  
    win.on("scroll", function () {
      var wScrollTop  = $(window).scrollTop();    
        
        if (wScrollTop > 150) {
            $("#pageHeader").addClass("shrink");
        } else {
            $("#pageHeader").removeClass("shrink");
        }
    });


     // Bootstrap Scroll Spy //
       
    $("body").scrollspy({
        target: ".navbar-collapse",
        offset: 70
    });
    
     // Collapse navigation on click on nav anchor in Mobile //
       
    $(".nav a").on('click', function () {
        $("#myNavbar").removeClass("in").addClass("collapse");
    });

     // navbar Scroll //
     
    $(".navbar-nav li a, .navbar-brand, .button a, .a-btn").on("click", function (e) {
        var anchor = $(this);
        $("html, body").stop().animate({
            
            scrollTop: $(anchor.attr("href")).offset().top - 60
        }, 1000);
        e.preventDefault();
    });
	
	
	 //var mixerContainer = $('#work #change'),
        // portfolio (MIXITUP)
     //   mixer = mixitup(mixerContainer, {
     //       selectors: {
     //           control: '#work ul > li'
     //       }
     //   }),
        
        var scrollButton = $('#scroll-top');
    
   
    $('#work ul li').on('click', function () {
        $(this).addClass('selected').siblings().removeClass('selected');
    });
     
    
    // Caching The Scroll Top Element
    
    win.on('scroll', function () {
        if ($(this).scrollTop() >= 700) {
            
            scrollButton.show();
            
        } else {
            
            scrollButton.hide();
        }
        
    });
    
    // Click On Button To Scroll Top
    
    scrollButton.on('click', function () {
        
        $('html,body').animate({ scrollTop : 0 }, 1100);
        
    });
	
	$('.counter').counterUp({
        delay: 50,
        time: 2000
    });
 
	
	$('.slider .owl-carousel').owlCarousel({
        items: 1,
        loop: true,
        margin: 0,
        autoplay: true,
        autoplayTimeout: 3000,
        autoplayHoverPause: true,
        smartSpeed: 650,
    });
	
	
	// slider of team section
    $('.team .owl-carousel').owlCarousel({
        items: 3,
        loop: true,
        margin: 20,
        autoplay: true,
        autoplayTimeout: 3000,
        autoplayHoverPause: true,
        smartSpeed: 650,
        responsiveClass:true,
        responsive : {
            992 : {
                items: 3
            },
    
            768 : {
                items: 2
            },
            
            0 : {
                items: 1
            }
        }
        
    });
	
	 
	
	// slider of clients section
    $('.clients .owl-carousel').owlCarousel({
        items: 1,
        loop: true,
        margin: 0,
        autoplay: true,
        autoplayTimeout: 3000,
        autoplayHoverPause: true,
        smartSpeed: 650
    });
    
  
	// slider of blog section
    $('.blog .owl-carousel').owlCarousel({
        items: 3,
        loop: true,
        margin: 20,
        autoplay: true,
        autoplayTimeout: 3000,
        autoplayHoverPause: true,
        smartSpeed: 650,
        responsiveClass:true,
        responsive : {
            992 : {
                items: 3
            },
    
            768 : {
                items: 2
            },
            
            0 : {
                items: 1
            }
        }
        
    });
	
	// slider of team section
    $('.partners .owl-carousel').owlCarousel({
        items: 6,
        loop: true,
        margin: 20,
        autoplay: true,
        autoplayTimeout: 2000,
        autoplayHoverPause: true,
        smartSpeed: 600,
        responsiveClass:true,
        responsive : {
            992 : {
                items: 6
            },
    
            768 : {
                items: 4
            },
            
            0 : {
                items: 2
            }
        }
        
    });
	
	
	// swiper slider for carousel page
	var swiper = new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        paginationClickable: true,
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        spaceBetween: 10,
        effect: 'fade',
		speed: 500
    });
	
	// dynamic tabs
	
	$('.services-tabs ul li').on('click', function(){
		var myID = $(this).attr('id');
		$(this).addClass('active').siblings().removeClass('active');
		
		
		$('#' + myID + '-content').fadeIn(700).siblings().hide();
	})
	
	$('.element').typed({
        strings: [ " Creative Agency",  "  Different", " ARCHiBits"],
        loop: true,
        showCursor: true,
        startDelay: 2000,
        backDelay: 2500,
		typeSpeed: 60
    });
	
	// text animated page
	$('.tlt').textillate({
        loop: true,
        // out animation settings.
        in: {
            // set the delay factor applied to each consecutive character         
            delayScale: 0.8,

            // set the delay between each character
            delay: 100,

            // set to true to animate all the characters at the same time
            sync: false,

            // randomize the character sequence
            // (note that shuffle doesn't make sense with sync = true)
            shuffle: false,

            // reverse the character sequence
            // (note that reverse doesn't make sense with sync = true)
            reverse: false,

            // callback that executes once the animation has finished
            callback: function () {}
        },
        // out animation settings.
        out: {
            delayScale: 10,
            delay: 5,
            sync: false,
            shuffle: false,
            reverse: true,
            callback: function () {}
        },

       // callback that executes once textillate has finished
        callback: function () {} ,

    });
	
	//  section skills
	
	var wind = $(window);

    var main_height = $(".main-height").outerHeight();
 
    wind.on('scroll', function () {
        $(".skills-progress span").each(function () {
            var bottom_of_object = 
            $(this).offset().top + $(this).outerHeight();
            var bottom_of_window = 
            $(window).scrollTop() + $(window).height();
            var myVal = $(this).attr('data-value');
            if(bottom_of_window > bottom_of_object) {
                $(this).css({
                  width : myVal
                });
            }
        });
    });
	
	
    // contact form
    if ($.fn.validator) {
        $('#contact-form').validator();
    }

    $('#contact-form').on('submit', function (e) {
        e.preventDefault();
        var $form = $('#contact-form');
        var url = "/api/send-email";

        function submitAjax() {
            $.ajax({
                type: "POST",
                url: url,
                data: $form.serialize(),
                dataType: 'json',
                success: function (data) {
                    var messageAlert = 'alert-' + (data && data.type ? data.type : 'success');
                    var messageText = (data && data.message) ? data.message : 'Message Sent Successfully!';
                    var alertBox = '<div class="alert ' + messageAlert + ' alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>' + messageText + '</div>';
                    $form.find('.messages').html(alertBox);
                    if (data && data.type === 'success') {
                        $form[0].reset();
                    }
                },
                error: function (xhr) {
                    var messageText = xhr && xhr.responseText ? xhr.responseText : 'There was an error while submitting the form. Please try again later';
                    var alertBox = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>' + messageText + '</div>';
                    $form.find('.messages').html(alertBox);
                }
            });
        }

        // reCAPTCHA v3: generate token just-in-time
        var siteKey = ($form.find('#submit').data('sitekey')) || '6LdowqIrAAAAAKuXhqjpsHmfiu9rJuwq7rVON2h2';
        if (typeof grecaptcha === 'undefined' || !grecaptcha.execute) {
            // If script not loaded, fallback submit without token (server will handle if secret configured)
            submitAjax();
            return false;
        }

        grecaptcha.ready(function () {
            grecaptcha.execute(siteKey, { action: 'contact' }).then(function (token) {
                $form.find('input[name="g-recaptcha-response"]').val(token);
                submitAjax();
            }).catch(function () {
                submitAjax();
            });
        });
        return false;
    });
	
    
});
