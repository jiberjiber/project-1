$(document).foundation();

$(document).ready(function () {
  const forecastDiv = $("#forecast_div");

  //BEGIN FUNCTIONS

  var weatherKey = "c1786506c24426ae384c4cedbae014b0";
  var latiData;
  var longData;
  //weather data variables defined

  //one call version of openweather api for current weather and five day forecast data

  $.ajax({
    //use lat and long inputs from geolocation
    url:
      "https://api.openweathermap.org/data/2.5/onecall?lat=30.2672&lon=-97.7431&units=imperial&exclude=minutely,hourly&appid=" +
      weatherKey,

    method: "GET",
  }).then(function (data) {
    getLocation();
    attachIcon();
    getCurrentWeatherData();
    getForecastData();

    function getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
          coord = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
          };
          let latiData = coord.lat;
          let longData = coord.lng;
        });
      } else {
        let latiData = 30.2672;
        let longData = -97.7431;
      }
    }

    //attaching weather icon and adding alt tag description
    function attachIcon() {
      var iconID = data.current.weather[0].icon;

      var iconURL = "https://openweathermap.org/img/wn/" + iconID + "@2x.png";

      $("#weather-icon, #wpWeatherIcon").attr("src", iconURL);
      $("#weather-icon, #wpWeatherIcon").attr(
        "alt",
        data.current.weather.description
      );
    }

    //Retrieve Data for user location's current weather data
    function getCurrentWeatherData() {
      //use moment js for date
      var currentDate = { now: moment().format("ddd, MMM Do") };
      var temperature = Math.floor(data.current.temp) + "&#8457;";
      var humidity = data.current.humidity + "%";
      var windSpeed = data.current.wind_speed + "mph";
      var uvIndex = data.current.uvi;
      $("#currentDate").append(" " + currentDate.now);
      $("#temp").append(" " + temperature);
      $("#humidity").append(" " + humidity);
      $("#wind").append(" " + windSpeed);
      $("#uv-index").append(" " + uvIndex);

      let wpCurrentDate = { now: moment().format("ddd, MMM Do") };
      let wpTemp = Math.floor(data.current.temp) + "&#8457;";
      let wpHumidity = data.current.humidity + "%";
      let wpWind = data.current.wind_speed + "mph";
      let wpUV = data.current.uvi;
      $("#wpCurrentDate").append(" " + wpCurrentDate.now);
      $("#wpTemp").append(" " + wpTemp);
      $("#wpHumidity").append(" " + wpHumidity);
      $("#wpWind").append(" " + wpWind);
      $("#wpUV").append(" " + wpUV);
    }

    function getForecastData() {
      var forecastDataArray = [
        forecastIconIMG,
        forecastDesc,
        forecastTemp,
        forecastHumidity,
        forecastWindSpeed,
        forecastUV,
      ];
      for (var i = 0; i < forecastDataArray.length; i++) {
        //generate parent_div with viewport responsive class.
        //add 1 day to current date and add class to keep centered
        var parent_div = $("<div>", {
          class: "forecast cell small-10 medium-5 large-3",
        });
        var forecastDates = $("<h4>").text(
          moment()
            .add(i + 1, "days")
            .format("ddd, MMM Do")
        );
        //variables for retrieving icon image
        var iconData = data.daily[i].weather[0].icon;
        var iconURLForecast =
          "https://openweathermap.org/img/wn/" + iconData + "@2x.png";
        var forecastIconIMG = $("<img>", {
          src: iconURLForecast,
          alt: forecastDesc,
        });
        //create li for each forecast item and append weather data from api
        var forecastDesc = $("<li></li>").text(
          data.daily[i].weather[0].description
        );
        var forecastTemp = $("<li></li>").text(
          "Temp: " + Math.floor(data.daily[i].temp.day) + "°F"
        );
        var forecastHumidity = $("<li></li>").text(
          "Humidity: " + data.daily[i].humidity + "%"
        );
        var forecastWindSpeed = $("<li></li>").text(
          "Wind: " + data.daily[i].wind_speed + "mph"
        );
        var forecastUV = $("<li></li>").text("UV Index: " + data.daily[i].uvi);
        //create ul, attach li's and append to parent_div
        var weatherListStart = $("<ul>").append(forecastDates);
        weatherListStart.css("list-style-type", "none");
        //finish loop by appending to html forecast_container div
        $(forecastDiv).append(parent_div);
        parent_div.append(forecastDates);
        parent_div.append(weatherListStart);
        weatherListStart.append(forecastIconIMG);
        weatherListStart.append(forecastDesc);
        weatherListStart.append(forecastTemp);
        weatherListStart.append(forecastHumidity);
        weatherListStart.append(forecastWindSpeed);
        weatherListStart.append(forecastUV);
      }
    }
  });
});

$(".petInfo").on("click", "#petRemoveBtn", (e) => {
  e.preventDefault();
  const target = $(e.currentTarget);

  $.ajax("/pets", {
    method: "DELETE",
    data: {
      id: target.attr("data-id"),
    },
  }).then((data) => {
    if (data) {
      window.location.reload();
    } else {
      alert("An error has occurred");
    }
  });
});

// Mobile navbar toggle
const toggleBtn = document.getElementsByClassName("toggle-button")[0];
const navbarLinks = document.getElementsByClassName("navbar-links")[0];

toggleBtn.addEventListener("click", () => {
  navbarLinks.classList.toggle("active");
});
