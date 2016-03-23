// Global variables for data storage

var DayItinerary = function(day) {
	this.day = day;
	this.hotel = "";
	this.restaurants = [];
	this.activities = [];
}

var model = [new DayItinerary(1)];
var currentDay = "1";





var getTodaysItinerary = function() {
	return model.filter(function(dayItin) {
		return dayItin.day = currentDay
	})
}
var todaysItinerary = getTodaysItinerary();

// Adding elements to the control panel and map
$('#hotel-btn').on('click', function(){
	var newHotelName = $('#hotel-selector :selected').text(),
		hotelList = $('#hotel-list');

	if (hotelList[0].childElementCount === 0) {
		var newElement = '<div class="itinerary-item"><span class="title">' + newHotelName + '</span><button class="btn btn-xs btn-danger remove btn-circle">x</button></div>';
		hotelList.append(newElement);
		todaysItinerary = getTodaysItinerary();
		todaysItinerary.hotel = newHotelName;
	} else alert('Cannot add second hotel.');
});

$('#restaurant-btn').on('click', function(){
	var newRestaurantName = $('#restaurant-selector :selected').text(),
		restaurantList = $('#restaurant-list'),
		newElement = '<div class="itinerary-item"><span class="title">' + newRestaurantName + '</span><button class="btn btn-xs btn-danger remove btn-circle">x</button></div>';	
	restaurantList.append(newElement);
	todaysItinerary = getTodaysItinerary();
	todaysItinerary.restaurants.push(newRestaurantName);
});

$('#activity-btn').on('click', function(){
	var newActivityName = $('#activity-selector :selected').text(),
		activityList = $('#activity-list'),
		newElement = '<div class="itinerary-item"><span class="title">' + newActivityName + '</span><button class="btn btn-xs btn-danger remove btn-circle">x</button></div>';
	activityList.append(newElement);
	todaysItinerary = getTodaysItinerary();
	todaysItinerary.activities.push(newRestaurantName);
});

// Removing elements from the control panel and map
$('#hotel-list').on('click', 'button', function() {
	$('#hotel-list').empty();
	todaysItinerary = getTodaysItinerary();
	todaysItinerary.hotel = "";
})

$('#restaurant-list').on('click', 'button', function(event) {
	$(this).parent().remove();
	todaysItinerary = getTodaysItinerary();
	todaysItinerary.hotel = "";

	//WE LEFT OFF HERE
	// Need to find a way to get the restaurant name, search for it within
	// the .restaurants array, and remove that restaurant from the array.
})

$('#activity-list').on('click', 'button', function(event) {
	$(this).parent().remove();
})

// Adding days
$("#add-day-btn").on('click', function(){
	var dayNum, 
		newDayBtn; 

	dayNum = parseInt($('.day-buttons button').last().prev().text()) + 1;
	newDayBtn = '<button class="btn btn-circle day-btn">'+ dayNum +'</button>';
	$('.day-buttons button').last().before(newDayBtn);

	model[dayNum]
})

// Switch days
$('.day-buttons').on('click', 'button', function(event) {
	if ($(this).attr('id') !== 'add-day-btn') {
		
		$('.current-day').removeClass('current-day');
		$('#hotel-list').empty();
		$('#restaurant-list').empty();
		$('#activity-list').empty();

		$(this).addClass('current-day');
		currentDay = $(this).text();
	}
})









