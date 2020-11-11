/* 
* ITSE 2302 - Semester Project
* Zeb Campbell - May 6, 2020
* Weather App Name TBD
*/

// Declare variables used in multiple functions
var apiKey = 'f16541e620a354e4a5148f16dd516fe0';
var url = 'https://api.openweathermap.org/data/2.5/';

// Hide weather card and error message divs
hideDivs();

// Adding event listeners for 2 buttons and using Enter key in text input box
document.getElementById("zipcodeWeather").addEventListener("click", zipcodeWeather);
document.getElementById("currentLocation").addEventListener("click", currentLocation);
document.getElementById("zip").addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById("zipcodeWeather").click();
  }
});

// Function for getting weather by browser location
function currentLocation() {
  // Hide divs on button click
  hideDivs();

  // Gets location from browser
  navigator.geolocation.getCurrentPosition(success, error);

  // On successful location, passes lat-lon
  function success(position) {
    lat = position.coords.latitude;
    lon = position.coords.longitude;

    // API call to Open Weather Map
    $.getJSON(
      url + 'weather?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey, updateWeather)
  }

  // Displays error if browser location fails
  function error() {
    $('#error').hide().html('Unable to retrieve your location').fadeIn('slow');
  }
}

// Function for getting weather by zipcode
function zipcodeWeather() {
  // Hide divs on button click
  hideDivs();

  // Get zipcode from input
  var zipcode = $('#zip').val();

  // Zipcode validation
  if(zipcode.length !== 5) {
    $('#error').hide().html('Must be a valid 5-digit U.S. ZIP Code.').fadeIn('slow');
    return;
  } else {
    // API call to Open Weather Map
    $.getJSON(url + 'weather?zip=' + zipcode + '&appid=' + apiKey, updateWeather)
      .fail(function() {
        $('#error').hide().html('Zipcode not found. Try again.').fadeIn('slow');
    });
  }
}

// Function to update weather info in divs
function updateWeather(data) {
  // Hide any error messages
  $('#error').hide();

  // Build current conditions icon URL
  var icon = 'https://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png';
  
  // Function to add storm CSS
  weatherStorm(data.weather[0].icon);

  // Function to change glow color around weatherCard based on temperature
  weatherTemp(tempConvert(data.main.temp));

  // This section updates the divs with weather information from the API
  $('#icon').html("<img src='" + icon + "' alt='Current Conditions'>");
  $('#conditions').html(data.weather[0].description.toUpperCase());
  $('#temp').html(tempConvert(data.main.temp));
  $('#feelsLike').html(tempConvert(data.main.feels_like));
  $('#windSpeed').html(data.wind.speed + ' MPH');
  $('#windDir').html(windDir(data.wind.deg));
  $('#tempMin').html(tempConvert(data.main.temp_min));
  $('#tempMax').html(tempConvert(data.main.temp_max));
  $('#humidity').html(data.main.humidity + '%');
  $('#pressure').html(data.main.pressure + ' hPa');
  $('#city').html(data.name);
  $('#weatherCard').fadeIn('slow');
}

// Function to convert Kelvin values to Fahrenheit
function tempConvert(kelvin) {
  var F = Math.round(kelvin - 273.15) * 9 / 5 + 32;
  var tempF = F + '° F';
  return tempF; 
}

// Function to convert wind degrees to string direction
function windDir(direction) {
  var windDir = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  var dir = windDir[(Math.floor(((direction % 360) / 22.5) + .5)) % 16];
  return dir;
}

// Function to hide weather card and error divs at page load and button click
function hideDivs() {
  $('#weatherCard').hide();
  $('#error').hide(); 
}

// Creates a thunderstorm flash with CSS
function weatherStorm(icon) {
  if(icon == "11d" || icon == "11n") {
    $('#weatherCard').css("animation", "flash 5s linear infinite");
  } 
}

// Adjusts glow for weather card depending on temperature
function weatherTemp(temp) {
  if(temp >= "90") {
    $('#weatherCard').css({"border-color":"#ff0000", "box-shadow":"0 0 25px 10px #ff0000"});
  } else if(temp >= "80" && temp < "90") {
    $('#weatherCard').css({"border-color":"#ff8800", "box-shadow":"0 0 25px 10px #ff8800"});
  }else if(temp > "40" && temp < "50") {
    $('#weatherCard').css({"border-color":"#7a73ff", "box-shadow":"0 0 25px 10px #7a73ff"});
  } else if(temp < "40") {
    $('#weatherCard').css({"border-color":"#0a00c7", "box-shadow":"0 0 25px 10px #0a00c7"});
  }
}