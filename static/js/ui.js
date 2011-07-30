$().ready(function(){
	
	var notes = [
		{ bgColor: 'red' },
		{ bgColor: 'orange' },
		{ bgColor: 'yellow' },
		{ bgColor: 'green' },
		{ bgColor: 'blue' }
	];
	
	// var scroller = setInterval(function(){
	// 	$('#mst_notes').style.left = parseInt( $('#mst_notes').style.left ) + 1 + 'px';
	// }, 1000);
	
	/* ACTUAL FUNCTIONS */
	
	function createNote(index){
		$('#mst_notes').css('background', notes[index].bgColor);
	}
	
	$(window).keydown(function(e){
		if (e.which == 65) createNote(0);
			else if (e.which == 83) createNote(1);
			else if (e.which == 68) createNote(2);
			else if (e.which == 70) createNote(3);
			else if (e.which == 71) createNote(4);
	});
	
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
	
	/* LOAD IN THE NOTES */
	$('#mst_notes').load('notes.html');
})