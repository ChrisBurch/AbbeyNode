$().ready(function(){
	// var scroller = setInterval(function(){
	// 	$('#mst_notes').style.left = parseInt( $('#mst_notes').style.left ) + 1 + 'px';
	// }, 1000);
	
	/* ACTUAL FUNCTIONS */	
	$('#landingPage li div').click(function(){
		$(this).toggleClass('active');
	})
	
	$('#mav_name').keyup(function(){
		$('#musicAvatar > h1').text($(this).val());
	});
	
	$('#mav_dress li:nth-child(1)').click(function(){ $('#mvh-sg').show() });
	$('#mav_dress li:nth-child(2)').click(function(){ $('#mav_body').css('background', 'orange') });
	$('#mav_dress li:nth-child(5)').click(function(){ $('#mav_body').css('background', 'blue') });
	
	$('#musicAvatar > h1').click(function(){
		$(this).toggleClass('opened');
		$('#mav_dress').fadeToggle();
	})
})