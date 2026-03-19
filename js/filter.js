$(function() {
  var selectedClass = "";
  $("#filter > p").click(function(){    

    $('p').removeClass('on');
    $(this).addClass('on')

    selectedClass = $(this).attr("data-rel");
    $(".portfolio-img").fadeTo(1, 0);
    $(".portfolio-img li").not("."+selectedClass).fadeOut();
    setTimeout(function() {
      $("."+selectedClass).fadeIn();
      $(".portfolio-img").fadeTo(1, 1);
    }, 500);
    
  });
});
