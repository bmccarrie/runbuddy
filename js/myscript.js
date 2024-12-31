

$('#continue1').click(function(e){
    e.preventDefault();
    //$('#welcome').fadeOut('slow', function(){
      //  $('#selectProgram').fadeIn('slow');
    //});
    $('#welcome').animate({ opacity: 0, top: "-300px" }, 'slow', function(){
       $('#selectProgram').fadeIn('slow');
    });
});

$('.conbtn').click(function(e){
    e.preventDefault();
    $('#selectSurvivor').fadeOut('slow', function(){
        $('#vault1').fadeIn('slow');
    });
});

$('#continue3').click(function(e){
    e.preventDefault();
    $('#vault1').fadeOut('slow', function(){
        $('#vault2').fadeIn('slow');
    });
});

$('#tenk').click(function(e){
    e.preventDefault();
    $('#marathon').fadeOut('slow');
    $('#half').fadeOut('slow');
    $('#tenk').animate({'top': '100px'}, 'slow', function(){
        $('#selectDate').fadeIn('slow');
    });
    $('#program')[0].value="10K";
    
});

$('#half').click(function(e){
    e.preventDefault();
    $('#marathon').fadeOut('slow');
    $('#tenk').fadeOut('slow');
    $('#half').animate({'top': '100px'}, 'slow', function(){
        $('#selectDate').fadeIn('slow');
    });
    $('#program')[0].value="1/2 Marathon";
});

$('#marathon').click(function(e){
    e.preventDefault();
    $('#half').fadeOut('slow');
    $('#tenk').fadeOut('slow');
    $('#marathon').animate({'top': '100px'}, 'slow', function(){
        $('#selectDate').fadeIn('slow');
    });
    $('#program')[0].value="Marathon";
});



//window.onload = function() {
//	statStorage();
//}