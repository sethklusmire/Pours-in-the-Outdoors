var body = document.querySelector("body");
var userCity = document.querySelector(".input");
var searchButton = document.querySelector(".is-info");
var hikeHours = "";
var userState = "";

var urlLink = searchButton.addEventListener("click", function () {
  urlLink = "https://developers.zomato.com/api/v2.1/cities?q=" + userCity.value;
  var stateDropdown = document.getElementById("state");
  userState = stateDropdown.value;
  var hoursDropdown = document.getElementById("time");
  hikeHours = hoursDropdown.value;
  callAPI();
  // var cardSelector = document.getElementsByClassName(".hikecard");
  // cardSelector.setAttribute("style", "visibility: visible");
});

var timeFrame = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

for (var i = 0; i < timeFrame.length; i++) {
  var option = document.createElement("option");
  option.text = timeFrame[i];
  option.value = timeFrame[i];
  var select = document.getElementById("time");
  select.appendChild(option);
}

var usStates = [
  { name: "ALABAMA", abbreviation: "AL" },
  { name: "ALASKA", abbreviation: "AK" },
  { name: "AMERICAN SAMOA", abbreviation: "AS" },
  { name: "ARIZONA", abbreviation: "AZ" },
  { name: "ARKANSAS", abbreviation: "AR" },
  { name: "CALIFORNIA", abbreviation: "CA" },
  { name: "COLORADO", abbreviation: "CO" },
  { name: "CONNECTICUT", abbreviation: "CT" },
  { name: "DELAWARE", abbreviation: "DE" },
  { name: "DISTRICT OF COLUMBIA", abbreviation: "DC" },
  { name: "FEDERATED STATES OF MICRONESIA", abbreviation: "FM" },
  { name: "FLORIDA", abbreviation: "FL" },
  { name: "GEORGIA", abbreviation: "GA" },
  { name: "GUAM", abbreviation: "GU" },
  { name: "HAWAII", abbreviation: "HI" },
  { name: "IDAHO", abbreviation: "ID" },
  { name: "ILLINOIS", abbreviation: "IL" },
  { name: "INDIANA", abbreviation: "IN" },
  { name: "IOWA", abbreviation: "IA" },
  { name: "KANSAS", abbreviation: "KS" },
  { name: "KENTUCKY", abbreviation: "KY" },
  { name: "LOUISIANA", abbreviation: "LA" },
  { name: "MAINE", abbreviation: "ME" },
  { name: "MARSHALL ISLANDS", abbreviation: "MH" },
  { name: "MARYLAND", abbreviation: "MD" },
  { name: "MASSACHUSETTS", abbreviation: "MA" },
  { name: "MICHIGAN", abbreviation: "MI" },
  { name: "MINNESOTA", abbreviation: "MN" },
  { name: "MISSISSIPPI", abbreviation: "MS" },
  { name: "MISSOURI", abbreviation: "MO" },
  { name: "MONTANA", abbreviation: "MT" },
  { name: "NEBRASKA", abbreviation: "NE" },
  { name: "NEVADA", abbreviation: "NV" },
  { name: "NEW HAMPSHIRE", abbreviation: "NH" },
  { name: "NEW JERSEY", abbreviation: "NJ" },
  { name: "NEW MEXICO", abbreviation: "NM" },
  { name: "NEW YORK", abbreviation: "NY" },
  { name: "NORTH CAROLINA", abbreviation: "NC" },
  { name: "NORTH DAKOTA", abbreviation: "ND" },
  { name: "NORTHERN MARIANA ISLANDS", abbreviation: "MP" },
  { name: "OHIO", abbreviation: "OH" },
  { name: "OKLAHOMA", abbreviation: "OK" },
  { name: "OREGON", abbreviation: "OR" },
  { name: "PALAU", abbreviation: "PW" },
  { name: "PENNSYLVANIA", abbreviation: "PA" },
  { name: "PUERTO RICO", abbreviation: "PR" },
  { name: "RHODE ISLAND", abbreviation: "RI" },
  { name: "SOUTH CAROLINA", abbreviation: "SC" },
  { name: "SOUTH DAKOTA", abbreviation: "SD" },
  { name: "TENNESSEE", abbreviation: "TN" },
  { name: "TEXAS", abbreviation: "TX" },
  { name: "UTAH", abbreviation: "UT" },
  { name: "VERMONT", abbreviation: "VT" },
  { name: "VIRGIN ISLANDS", abbreviation: "VI" },
  { name: "VIRGINIA", abbreviation: "VA" },
  { name: "WASHINGTON", abbreviation: "WA" },
  { name: "WEST VIRGINIA", abbreviation: "WV" },
  { name: "WISCONSIN", abbreviation: "WI" },
  { name: "WYOMING", abbreviation: "WY" },
];

for (var i = 0; i < usStates.length; i++) {
  var option = document.createElement("option");
  option.text = usStates[i].name + " [" + usStates[i].abbreviation + "]";
  option.value = usStates[i].abbreviation;
  var select = document.getElementById("state");
  select.appendChild(option);
}

function callAPI() {
  fetch(urlLink, {
    headers: {
      "user-key": "2d7d4ca953bf2eda6fef41cd6db1962f",
      "content-type": "application/json",
    },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(userState);
      for (var i = 0; i < data.location_suggestions.length; i++) {
        if (data.location_suggestions[i].state_code === userState) {
          var cityID = data.location_suggestions[i].id;
          break;
        } else {
          var cityID = data.location_suggestions[0].id;
        }
      }

      urlCityID =
        "https://developers.zomato.com/api/v2.1/search?entity_id=" +
        cityID +
        "&entity_type=city&establishment_type=283";

      fetch(urlCityID, {
        headers: {
          "user-key": "2d7d4ca953bf2eda6fef41cd6db1962f",
          "content-type": "application/json",
        },
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          restaurantArray = data.restaurants;
          userLat = data.restaurants[0].restaurant.location.latitude;
          userLon = data.restaurants[0].restaurant.location.longitude;

          urlWeather =
            "https://api.openweathermap.org/data/2.5/onecall?lat=" +
            userLat +
            "&lon=" +
            userLon +
            "&exclude=current,minutely,daily,alerts&units=imperial&appid=96bbb97e9dec979e1eede50c7d6896d7";

          fetch(urlWeather)
            .then(function (response) {
              return response.json();
            })
            .then(function (data) {
              for (var i = 0; i < hikeHours; i++) {
                var hourlyWeatherBox = document.createElement("section");
                body.appendChild(hourlyWeatherBox);
                currentTime = new Date(Number(data.hourly[i].dt) * 1000);
                currentTime = currentTime.toLocaleString();
                var timeBlock = document.createElement("p");
                timeBlock.textContent = currentTime.split(" ")[1];
                hourlyWeatherBox.appendChild(timeBlock);
                weatherImg = document.createElement("img");
                weatherImg.setAttribute(
                  "src",
                  "http://openweathermap.org/img/wn/" +
                    data.hourly[i].weather[0].icon +
                    "@2x.png"
                );
                hourlyWeatherBox.appendChild(weatherImg);
                hourlyTemp = document.createElement("p");
                hourlyTemp.textContent = data.hourly[i].temp + " °F";
                hourlyWeatherBox.appendChild(hourlyTemp);
              }
            });

          urlHike =
            "https://www.hikingproject.com/data/get-trails?lat=" +
            userLat +
            "&lon=" +
            userLon +
            "&maxDistance=10&key=200960634-4e140b5cd4726398c5b2066fb05cebd8";

          fetch(urlHike)
            .then(function (response) {
              return response.json();
            })
            .then(function (data) {
              var hikingArray = data.trails;
              console.log(hikingArray);
              if (hikingArray.length > 4) {
                hikingArray.length = 4;
              }
              console.log(hikingArray);

              for (var i = 0; i < hikingArray.length; i++) {
                console.log(i);
                var cardHolder = document.querySelector("#hikecard" + [i]);
                // body.appendChild(cardHolder);
                var hikePic = document.querySelector("#hikeimg" + [i]);
                hikePic.setAttribute("src", hikingArray[i].imgSmallMed);
                var hikeName = document.querySelector("#hiketitle" + [i]);
                hikeName.textContent = hikingArray[i].name;
                var hikeCity = document.createElement("p");
                hikeCity.textContent = hikingArray[i].location;
                var elevationData = document.createElement("p");
                elevationData.textContent =
                  "Max elevation: " +
                  hikingArray[i].high +
                  " Min elevation: " +
                  hikingArray[i].low;
                var hikeDifficulty = document.createElement("p");
                hikeDifficulty.textContent = hikingArray.difficulty;
                var selectButton = document.createElement("button");
                selectButton.setAttribute("value", [
                  hikingArray[i].latitude,
                  hikingArray[i].longitude,
                ]);
                selectButton.textContent = "Select";
                selectButton.addEventListener("click", function () {
                  selectionCoodsArray = Array.from(
                    selectButton.value.split(",")
                  );
                  var lat1 = selectionCoodsArray[0];
                  var long1 = selectionCoodsArray[1];
                  // console.log(selectionCoodsArray);
                  // console.log(selectButton.value);
                  console.log(this.parentElement.parentElement);
                  for (var i = 0; i < hikingArray.length - 1; i++) {
                    if (
                      this.parentElement.parentElement.nextElementSibling ===
                      null
                    ) {
                      this.parentElement.parentElement.previousElementSibling.remove();
                    } else {
                      this.parentElement.parentElement.nextElementSibling.remove();
                    }
                  }
                  this.remove();
                  for (var j = 0; j < restaurantArray.length; j++) {
                    // console.log(restaurantArray[i].restaurant.location.latitude);
                    restaurantArray[j].distance = calcDistance(
                      lat1,
                      restaurantArray[j].restaurant.location.latitude,
                      long1,
                      restaurantArray[j].restaurant.location.longitude
                    );
                  }

                  restaurantArray.sort(function (a, b) {
                    return a.distance - b.distance;
                  });
                  if (restaurantArray.length > 4) {
                    restaurantArray.length = 4;
                  }
                  console.log(restaurantArray);
                  for (var k = 0; k < restaurantArray.length; k++) {
                    var breweryBox = document.querySelector("#brewcard" + [k]);
                    var restaurantImg = document.querySelector(
                      "#brewimg" + [k]
                    );
                    restaurantImg.setAttribute(
                      "src",
                      restaurantArray[k].restaurant.thumb
                    );

                    var breweryName = document.querySelector(
                      "#brewTitle" + [k]
                    );
                    breweryName.textContent =
                      restaurantArray[k].restaurant.name;
                    var breweryAddress = document.createElement("p");
                    breweryAddress.textContent =
                      restaurantArray[k].restaurant.location.address;
                    breweryBox.appendChild(breweryAddress);
                    var breweryDistance = document.createElement("p");
                    breweryDistance.textContent =
                      restaurantArray[k].distance.toFixed(2) + " miles";
                    breweryBox.appendChild(breweryDistance);
                    var breweryPhone = document.createElement("p");
                    breweryPhone.textContent =
                      restaurantArray[k].restaurant.phone_numbers;
                    breweryBox.appendChild(breweryPhone);
                    var breweryDetailsButton = document.createElement("button");
                    breweryDetailsButton.setAttribute(
                      "value",
                      restaurantArray[k].restaurant.url
                    );
                    breweryDetailsButton.textContent = "Details";
                    breweryBox.appendChild(breweryDetailsButton);
                    breweryDetailsButton.addEventListener("click", function () {
                      window.open(this.value, "_target");
                    });
                  }
                });

                var detailsButton = document.createElement("button");
                detailsButton.textContent = "Details";
                detailsButton.setAttribute("value", data.trails[i].url);
                detailsButton.addEventListener("click", function () {
                  window.open(this.value, "_target");
                });

                // cardHolder.appendChild(hikeName);
                cardHolder.appendChild(hikeCity);
                cardHolder.appendChild(elevationData);
                cardHolder.appendChild(hikeDifficulty);
                cardHolder.appendChild(selectButton);
                cardHolder.appendChild(detailsButton);
              }
            });
        });
    });
}

function calcDistance(lat1, lat2, long1, long2) {
  // console.log(lat1);
  // console.log(lat2);
  // console.log(long1);
  // console.log(long2);
  lat1Sin = Math.sin((lat1 * Math.PI) / 180);
  lat2Sin = Math.sin((lat2 * Math.PI) / 180);
  lat1Cos = Math.cos((lat1 * Math.PI) / 180);
  lat2Cos = Math.cos((lat2 * Math.PI) / 180);
  longCos = Math.cos(((long2 - long1) * Math.PI) / 180);
  combinedEq =
    3963 * Math.acos(lat1Sin * lat2Sin + lat1Cos * lat2Cos * longCos);
  return combinedEq;
}

//Need to add function to the last .then fetch after completed
// function createStuff() {
//   for (var i = 0; i < 10; i++) {
//     var cardHolder = document.createElement("section");
//     cardHolder.setAttribute("class", "hikeSection");
//     body.appendChild(cardHolder);
//     var hikePic = document.createElement("img");
//     hikePic.setAttribute("src", data.trails[i].imgMedium);
//     var hikeName = document.createElement("p");
//     hikeName.textContent = data.trails[i].name;
//     var hikeCity = document.createElement("p");
//     hikeCity.textContent = data.trails[i].location;
//     var elevationData = document.createElement("p");
//     elevationData.textContent =
//       "Max elevation: " +
//       data.trails[i].high +
//       " Min elevation: " +
//       data.trails[i].low;
//     var hikeDifficulty = document.createElement("p");
//     hikeDifficulty.textContent = data.trails.difficulty;
//     var selectButton = document.createElement("button");
//     selectButton.addEventListener("click", function () {
//       for (var i = 0; i < 9; i++) {
//         if (this.parentElement.nextElementSibling === null) {
//           this.parentElement.previousElementSibling.remove();
//         } else {
//           this.parentElement.nextElementSibling.remove();
//         }
//       }
//     });
//     var detailsButton = document.createElement("button");
//     detailsButton.setAttribute("value", data.trails[i].url);
//     detailsButton.addEventListener("click", function () {
//       console.log(detailsButton.value);
//       window.open(detailsButton.value, "_target");
//     });
//     cardHolder.appendChild(detailsButton);
//     cardHolder.appendChild(selectButton);
//     cardHolder.appendChild(hikeName);
//   }
// }
