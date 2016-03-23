// Global variables for data storage

var DayItinerary = function(day) {
	this.day = day;
	this.hotel = "";
	this.restaurants = [];
	this.activities = [];
}

var model = [new DayItinerary('1')];
var currentDay = "1";
var map = initialize_gmaps();
var activeMarkers = [];



// Functions
var getTodaysItinerary = function() {
	var returnArray = model.filter(function(dayItin) {
		return dayItin.day === currentDay;
	})
	return returnArray[0];
}

var todaysItinerary = getTodaysItinerary();


var addMarker = function(array, name, category) {
	var icon;

	var establishment = array.filter(function(place) {
		return place.name === name;
	})[0];

	switch(category){
		case 'hotels':
			icon = './images/lodging_0star.png';
			break;
		case 'restaurants':
			icon= './images/restaurant.png';
			break;
		case 'activities':
			icon = './images/star-3.png';
			break;
	}
	
	var marker = new google.maps.Marker({
		position: {
			lat: establishment.place.location[0],
			lng: establishment.place.location[1]
		},
		map: map,
		title: name,
		icon: icon
	});

	return marker;
}

var showMarkers = function() {
	var bounds = new google.maps.LatLngBounds();
	activeMarkers.forEach(function(marker) {
		bounds.extend(marker.position);
		marker.setMap(map);
	})
	map.fitBounds(bounds);
};

var hideMarkers = function() {
	activeMarkers.forEach(function(marker) {
		marker.setMap(null);
	});
};

var removeMarker = function(name){

	for(var i in activeMarkers) {
		if(activeMarkers[i].title === name){
			activeMarkers[i].setMap(null);
			activeMarkers.splice(i, 1);
			break;
		}
	}
	if(activeMarkers.length){
		showMarkers();
	} else {

	}
}

var addHotel = function(newHotelName, shouldSave){
	var hotelList = $('#hotel-list');

	if (hotelList[0].childElementCount === 0) {
		var newElement = '<div class="itinerary-item"><span class="title">' + newHotelName + '</span><button class="btn btn-xs btn-danger remove btn-circle">x</button></div>';
		if(newHotelName !== ''){
			hotelList.append(newElement);
			activeMarkers.push(addMarker(hotels, newHotelName, 'hotels'));
			showMarkers();
		}
		if(shouldSave){
			todaysItinerary = getTodaysItinerary();
			todaysItinerary.hotel = newHotelName;
		}


	} else alert('Cannot add second hotel.');
};

var addRestaurant = function(newRestaurantName, shouldSave){
	var restaurantList = $('#restaurant-list'),
		newElement = '<div class="itinerary-item"><span class="title">' + newRestaurantName + '</span><button class="btn btn-xs btn-danger remove btn-circle">x</button></div>';	
	if(restaurantList.children().length < 3){
		restaurantList.append(newElement);
		if (shouldSave) {
			todaysItinerary = getTodaysItinerary();
			todaysItinerary.restaurants.push(newRestaurantName);	
		}
		activeMarkers.push(addMarker(restaurants, newRestaurantName, 'restaurants'));
		showMarkers();
		
	} else alert('You can only visit three restaurant in one day');

}

var addActivity = function(newActivityName, shouldSave){
	var activityList = $('#activity-list'),
		newElement = '<div class="itinerary-item"><span class="title">' + newActivityName + '</span><button class="btn btn-xs btn-danger remove btn-circle">x</button></div>';
	activityList.append(newElement);
	if (shouldSave) {
		todaysItinerary = getTodaysItinerary();
		todaysItinerary.activities.push(newActivityName);
	}
	activeMarkers.push(addMarker(activities, newActivityName, 'activities'));
	showMarkers();
}

var clearPanel = function(dayNum) {
	$('.current-day').removeClass('current-day');
	$('#hotel-list').empty();
	$('#restaurant-list').empty();
	$('#activity-list').empty();
	$('#day-title').children().first().text('Day ' + dayNum);	
	hideMarkers();
};

// Adding elements to the control panel and map
$('#hotel-btn').on('click', function(){
	var newHotelName = $('#hotel-selector :selected').text();
	addHotel(newHotelName, true);
});

$('#restaurant-btn').on('click', function(){
	var newRestaurantName = $('#restaurant-selector :selected').text();
	addRestaurant(newRestaurantName, true);
});

$('#activity-btn').on('click', function(){
	var newActivityName = $('#activity-selector :selected').text();
	addActivity(newActivityName, true);
});

// Removing elements from the control panel and map
$('#hotel-list').on('click', 'button', function() {
	removeMarker($(this).prev().text());
	$('#hotel-list').empty();
	todaysItinerary = getTodaysItinerary();
	todaysItinerary.hotel = "";
})

$('#restaurant-list').on('click', 'button', function(event) {
	removeMarker($(this).prev().text());
	$(this).parent().remove();
	var restaurantToRemove = $(this).prev().text();
	todaysItinerary = getTodaysItinerary();

	var idx = todaysItinerary.restaurants.indexOf(restaurantToRemove);
	todaysItinerary.restaurants.splice(idx, 1);
})

$('#activity-list').on('click', 'button', function(event) {
	removeMarker($(this).prev().text());
	$(this).parent().remove();
	var activityToRemove = $(this).prev().text();
	todaysItinerary = getTodaysItinerary();

	var idx = todaysItinerary.activities.indexOf(activityToRemove);
	todaysItinerary.activities.splice(idx, 1);
})

// Adding days
$("#add-day-btn").on('click', function(){
	var dayNum, 
		newDayBtn; 

	dayNum = parseInt($('.day-buttons button').last().prev().text()) + 1;
	clearPanel(dayNum.toString());
	newDayBtn = '<button class="btn btn-circle day-btn">'+ dayNum +'</button>';
	$('.day-buttons button').last().before(newDayBtn);
	model.push(new DayItinerary(dayNum.toString()));
	$(this).prev().addClass('current-day');
	currentDay = dayNum.toString();

})

// Switch days
$('.day-buttons').on('click', 'button', function(event) {
	if ($(this).attr('id') !== 'add-day-btn') {
		currentDay = $(this).text();
		clearPanel(currentDay);
		$(this).addClass('current-day');
		todaysItinerary = getTodaysItinerary();
		addHotel(todaysItinerary.hotel, false);
		todaysItinerary.restaurants.forEach(function(restaurant) {
			addRestaurant(restaurant, false);
		});
		todaysItinerary.activities.forEach(function(activity) {
			addActivity(activity, false);
		})
	}
})

//remove day

$('#day-title').children().last().on('click', function(){

	model = model.filter(function(elem, index){
		return elem.day !== currentDay;
	});

	model = model.map(function(elem, index){
		if(elem.day !== index + 1){
			elem.day = (index + 1).toString();
		} 
		return elem;
	});

	$.each($('.day-buttons').children(), function(index, value){
		var child = $(value); 
		if(child.text() === currentDay){
			child.next().addClass('current-day');
			child.remove();
		} else if ( +child.text() > +currentDay){
			child.text(index);
		}
	});



	$('#hotel-list').empty();
	$('#restaurant-list').empty();
	$('#activity-list').empty();
	$('#day-title').children().first().text('Day ' + currentDay);
	hideMarkers();
	todaysItinerary = getTodaysItinerary();
	addHotel(todaysItinerary.hotel, false);
	todaysItinerary.restaurants.forEach(function(restaurant) {
		addRestaurant(restaurant, false);
	});
	todaysItinerary.activities.forEach(function(activity) {
		addActivity(activity, false);
	});

})









