$("document").ready(function(){
  $(".tab-slider-body").hide();
  $(".tab-slider-body:first").show();
});

$(".tab-slider-nav li").click(function() {
  $(".tab-slider-body").hide();
  var activeTab = $(this).attr("rel");
  $("#"+activeTab).fadeIn();
	if($(this).attr("rel") == "partner"){
		$('.tab-slider-tabs').addClass('toggle-slide');
	}else{
		$('.tab-slider-tabs').removeClass('toggle-slide');
	}
  $(".tab-slider-nav li").removeClass("active");
  $(this).addClass("active");
});