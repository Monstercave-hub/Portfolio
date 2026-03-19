// Nav
$(window).scroll(function () {
  var sc = $(window).scrollTop()
  if (sc > 100) {
      $(".header-sroll").addClass("small")
  } else {
      $(".header-sroll").removeClass("small")
  }
});

$(function () {
  const current = window.location.pathname.replace(/\/$/, '');

  $('nav a').each(function () {
    const link = new URL(this.href, location.origin).pathname.replace(/\/$/, '');

    // '/' (메인 페이지)는 완전히 일치하는 경우만 active
    if (current === link) {
      $(this).addClass('active');
    }
    // 그 외에는 하위 경로도 포함되면 active
    else if (link !== '' && link !== '/' && current.startsWith(link + '/')) {
      $(this).addClass('active');
    }
  });
});

// Scroll Top
(function($) { "use strict";
  $(document).ready(function(){"use strict";
    var progressPath = document.querySelector('.progress-wrap path');
    var pathLength = progressPath.getTotalLength();
    progressPath.style.transition = progressPath.style.WebkitTransition = 'none';
    progressPath.style.strokeDasharray = pathLength + ' ' + pathLength;
    progressPath.style.strokeDashoffset = pathLength;
    progressPath.getBoundingClientRect();
    progressPath.style.transition = progressPath.style.WebkitTransition = 'stroke-dashoffset 10ms linear';		
    var updateProgress = function () {
      var scroll = $(window).scrollTop();
      var height = $(document).height() - $(window).height();
      var progress = pathLength - (scroll * pathLength / height);
      progressPath.style.strokeDashoffset = progress;
    }
    updateProgress();
    $(window).scroll(updateProgress);	
    var offset = 50;
    var duration = 550;
    jQuery(window).on('scroll', function() {
      if (jQuery(this).scrollTop() > offset) {
        jQuery('.progress-wrap').addClass('active-progress');
      } else {
        jQuery('.progress-wrap').removeClass('active-progress');
      }
    });				
    jQuery('.progress-wrap').on('click', function(event) {
      event.preventDefault();
      jQuery('html, body').animate({scrollTop: 0}, duration);
      return false;
    })
  });
})(jQuery);

