var SERVER = 'https://www.roomoy.com/api/v1/';
var booking = {
	'lat': '',
	'long': '',
	'address': '',
	'to_date': '2017-06-20',
	'from_date': '2017-06-20',
	'room_type': ''
}
function validateEmail(email) {
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}
function validatePhone(phone) {
	var isnum = /^\d+$/.test(phone);

	if (isnum == true && phone.length <= 12 && phone.length >= 7) {
		return true;
	}
	else {
		return false;
	}

}
$(document).ready(function() {

	/***************** Waypoints ******************/

	$('.wp1').waypoint(function() {
		$('.wp1').addClass('animated fadeInLeft');
	}, {
		offset: '75%'
	});
	$('.wp2').waypoint(function() {
		$('.wp2').addClass('animated fadeInDown');
	}, {
		offset: '75%'
	});
	$('.wp3').waypoint(function() {
		$('.wp3').addClass('animated bounceInDown');
	}, {
		offset: '75%'
	});
	$('.wp4').waypoint(function() {
		$('.wp4').addClass('animated fadeInDown');
	}, {
		offset: '75%'
	});

	/***************** Flickity ******************/

	$('#featuresSlider').flickity({
		cellAlign: 'left',
		contain: true,
		prevNextButtons: false
	});

	$('#showcaseSlider').flickity({
		cellAlign: 'left',
		contain: true,
		prevNextButtons: false,
		imagesLoaded: true
	});

	/***************** Fancybox ******************/

	$(".youtube-media").on("click", function(e) {
		var jWindow = $(window).width();
		if (jWindow <= 768) {
			return;
		}
		$.fancybox({
			href: this.href,
			padding: 4,
			type: "iframe",
			'href': this.href.replace(new RegExp("watch\\?v=", "i"), 'v/'),
		});
		return false;
	});

});

$(document).ready(function() {
	//$("a.single_image").fancybox({
	//	padding: 4,
	//});
});

/***************** Nav Transformicon ******************/

/* When user clicks the Icon */
$(".nav-toggle").click(function() {
	$(this).toggleClass("active");
	$(".nav-menu").toggleClass("open");
});

/* When user clicks a link */
$(".overlay ul li a").click(function() {
	$(".nav-toggle").toggleClass("active");
	$(".nav-menu").toggleClass("open");
});

/* When user clicks outside */
$(".overlay").click(function() {
	$(".nav-toggle").toggleClass("active");
	$(".nav-menu").toggleClass("open");
});

/***************** Smooth Scrolling ******************/

$('a[href*=#]:not([href=#])').click(function() {
	if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname) {

		var target = $(this.hash);
		target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
		if (target.length) {
			$('html,body').animate({
				scrollTop: target.offset().top
			}, 2000);
			return false;
		}
	}
});

function clearFields(){

	$('#location').val('');
	$('#date-picker').val('');
	$('#book_name').val('');
	$('#book_number').val('');
	$('#book_email').val('');
}
$('#date-picker').datepicker({
	minDate: new Date()
});
function formateDate(date){
	var temp = new Date(date);

	var month = temp.getMonth()+1;

	return temp.getFullYear() + '-' + month + '-' + temp.getDate();

}

$('#book_btn').click(function(){

	var location = $('#location').val();
	var date = $('#date-picker').val();
	var budget = $('#budget').find(":selected").val();

	if(location == '' || date == ''){
		return;
	}

	var temp = date.split(' - ');
	booking.from_date = formateDate(temp[0]);
	console.log(temp);

	booking.room_type = budget;
	$('.booking-form').addClass('open');
});
$('.booking-form').click(function(){
	$('.booking-form').removeClass('open');
	clearFields();
});
$('.booking_wrap').click(function(e){
	e.stopPropagation();
});
$('.back_btn').click(function(){
	$('.booking-form').removeClass('open');
	clearFields();
});
$('#submit_btn').click(function(){

	$('#form_error').html('').fadeOut();
	var name = $('#book_name').val();
	var phone = $('#book_number').val();
	var email = $('#book_email').val();

	if(name == '' || phone == ''){
		$('#form_error').html('Please enter all the required fields').fadeIn();
		return;
	}
	if(!validatePhone(phone)){
		$('#form_error').html('Please enter valid phone number').fadeIn();
		return;
	}

	var url = SERVER + 'offline-booking-submission/';

	var data = {
		'name' : name,
		'email': email,
		'phone_number' : phone ,
		'lat' : booking.lat ,
		'lng' : booking.long ,
		'address' : booking.address ,
		'to_date' : booking.to_date ,
		'from_date' : booking.from_date ,
		'room_type' : booking.room_type
	};

	$('#submit_btn').html('Submitting...');
	$.ajax({
		url: url,
		type: 'POST',
		data: JSON.stringify(data),
		cache: false,
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data, textStatus, jqXHR) {

			$('#submit_btn').html('SUBMIT');

			var result = JSON.parse(jqXHR["responseText"]);

			console.log(result);
			// alert('success');
			$('.booking_wrap').addClass('success');


		},
		error: function (jqXHR, textStatus, errorThrown) {
			$('.submit_btn').html('SUBMIT');
			var result = JSON.parse(jqXHR["responseText"]);

			console.log(result);
			$('#form_error').html('Something went wrong. Try again').fadeIn();
		}
	});
	//$('.booking_wrap').addClass('success');
});
$('#ok_btn').click(function(){
	$('.booking-form').removeClass('open');
	clearFields();
	setTimeout(function(){
		$('.booking_wrap').removeClass('success');
	}, 1000);
});

var defaultBounds = new google.maps.LatLngBounds(
		new google.maps.LatLng(8.00, 72.1759),
		new google.maps.LatLng(36.00, 96.2631));

var input = document.getElementById('location');

var searchBox = new google.maps.places.SearchBox(input, {
	bounds: defaultBounds
});

searchBox.addListener('places_changed', function() {
	var places = searchBox.getPlaces();
	console.log(places[0])
	if (places.length == 0) {
		return;
	}
	booking.lat  = places[0].geometry.location.lat();
	booking.long = places[0].geometry.location.lng();
	booking.address = places[0].formatted_address;
	console.log(booking)
});
