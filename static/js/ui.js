$().ready(function(){

    $('#landingPage li div').click(function(){
		$(this).toggleClass('active');
	})
	
	$('#mav_name').keyup(function(){
		$('#musicAvatar > h1').text($(this).val());
	});
	
	$('div.addFr').click(function(){
		$(this).toggleClass('active');
		if ( $(this).hasClass('active') )
			$(this).text("Share this link: " + window.location.pathname);
		else
			$(this).text("Invite a friend");
	});
	
	$('#mav_dress li:nth-child(1)').click(function(){ $('#mvh-sg').toggle() });
	$('#mav_dress li:nth-child(2)').click(function(){ $('#mav_body').css('background', 'orange') });
	$('#mav_dress li:nth-child(5)').click(function(){ $('#mav_body').css('background', 'blue') });
	$('#mav_dress li:nth-child(3)').click(function(){
		$('#mav_head').toggleClass('superRip');
		$('#mvh_right').toggleClass('superRip');
		$('#mvh-sg').toggle();
		$('#mav_instrument').toggleClass('superRip');
	});
	$('#mav_dress li:nth-child(6)').click(function(){
		$('#mav_instrument').fadeToggle();
		$('#mav_altInstr').fadeToggle();
	})
	
	$('#musicAvatar > h1').click(function(){
		$(this).toggleClass('opened');
		$('#mav_dress').fadeToggle();
	})

})