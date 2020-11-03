var body = document.querySelector("body");

urlLink = "https://developers.zomato.com/api/v2.1/cities?q=Boulder";

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
      console.log(data.location_suggestions[0].state_code);
      for (var i = 0; i < data.location_suggestions.length; i++) {
        if (data.location_suggestions[i].state_code === "CO") {
          var cityID = data.location_suggestions[i].id;
          return;
        } else {
          var cityID = data.location_suggestions[0].id;
        }
      }

      urlCityID =
        "https://developers.zomato.com/api/v2.1/search?entity_id=" +
        cityID +
        "&entity_type=city&establishment_type=Brewery";

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
          console.log(data.restaurants);
          userLat = data.restaurants[0].restaurant.location.latitude;
          userLon = data.restaurants[0].restaurant.location.longitude;

          urlWeather =
            "https://api.openweathermap.org/data/2.5/onecall?lat=" +
            userLat +
            "&lon=" +
            userLon +
            "&exclude=current,minutely,daily,alerts&units=imperial&appid=96bbb97e9dec979e1eede50c7d6896d7";

          // fetch(urlWeather)
          //   .then(function (response) {
          //     return response.json();
          //   })
          //   .then(function (data) {
          //     console.log(data);

          //     for (var i = 0; i < 10; i++) {
          //       var hourlyWeatherBox = document.createElement("section");
          //       body.appendChild(hourlyWeatherBox);
          //       currentTime = new Date(Number(data.hourly[i].dt) * 1000);
          //       currentTime = currentTime.toLocaleString();
          //       var timeBlock = document.createElement("p");
          //       timeBlock.textContent = currentTime.split(" ")[1];
          //       hourlyWeatherBox.appendChild(timeBlock);
          //       weatherImg = document.createElement("img");
          //       weatherImg.setAttribute(
          //         "src",
          //         "http://openweathermap.org/img/wn/" +
          //           data.hourly[i].weather[0].icon +
          //           "@2x.png"
          //       );
          //       hourlyWeatherBox.appendChild(weatherImg);
          //       hourlyTemp = document.createElement("p");
          //       hourlyTemp.textContent = data.hourly[i].temp + " °F";
          //       hourlyWeatherBox.appendChild(hourlyTemp);
          //       console.log(currentTime.split(" ")[1]);
          //     }
          //   });

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
              for (var i = 0; i < data.trails.length; i++) {
                var cardHolder = document.createElement("section");

                body.appendChild(cardHolder);
                var hikePic = document.createElement("img");
                hikePic.setAttribute("src", data.trails[i].imgSmallMed);
                var hikeName = document.createElement("p");
                hikeName.textContent = data.trails[i].name;
                var hikeCity = document.createElement("p");
                hikeCity.textContent = data.trails[i].location;
                var elevationData = document.createElement("p");
                elevationData.textContent =
                  "Max elevation: " +
                  data.trails[i].high +
                  " Min elevation: " +
                  data.trails[i].low;
                var hikeDifficulty = document.createElement("p");
                hikeDifficulty.textContent = data.trails.difficulty;
                var selectButton = document.createElement("button");
                selectButton.setAttribute("value", [
                  data.trails[i].latitude,
                  data.trails[i].longitude,
                ]);
                selectButton.textContent = "Select";
                selectButton.addEventListener("click", function () {
                  selectionCoodsArray = Array.from(
                    selectButton.value.split(",")
                  );
                  var lat1 = selectionCoodsArray[0];
                  var long1 = selectionCoodsArray[1];
                  console.log(selectionCoodsArray);
                  console.log(selectButton.value);
                  for (var i = 0; i < data.trails.length - 1; i++) {
                    if (this.parentElement.nextElementSibling === null) {
                      this.parentElement.previousElementSibling.remove();
                    } else {
                      this.parentElement.nextElementSibling.remove();
                    }
                  }
                  for (var j = 0; j < restaurantArray.length; j++) {
                    // console.log(restaurantArray[i].restaurant.location.latitude);
                    var distance = calcDistance(
                      lat1,
                      restaurantArray[j].restaurant.location.latitude,
                      long1,
                      restaurantArray[j].restaurant.location.longitude
                    );
                    console.log(distance);
                  }
                  this.remove();
                });
                var detailsButton = document.createElement("button");
                detailsButton.textContent = "Details";
                detailsButton.setAttribute("value", data.trails[i].url);
                detailsButton.addEventListener("click", function () {
                  window.open(detailsButton.value, "_target");
                });
                cardHolder.appendChild(hikePic);
                cardHolder.appendChild(hikeName);
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
function createStuff() {
  for (var i = 0; i < 10; i++) {
    var cardHolder = document.createElement("section");
    cardHolder.setAttribute("class", "hikeSection");
    body.appendChild(cardHolder);
    var hikePic = document.createElement("img");
    hikePic.setAttribute("src", data.trails[i].imgMedium);
    var hikeName = document.createElement("p");
    hikeName.textContent = data.trails[i].name;
    var hikeCity = document.createElement("p");
    hikeCity.textContent = data.trails[i].location;
    var elevationData = document.createElement("p");
    elevationData.textContent =
      "Max elevation: " +
      data.trails[i].high +
      " Min elevation: " +
      data.trails[i].low;
    var hikeDifficulty = document.createElement("p");
    hikeDifficulty.textContent = data.trails.difficulty;
    var selectButton = document.createElement("button");
    selectButton.addEventListener("click", function () {
      for (var i = 0; i < 9; i++) {
        if (this.parentElement.nextElementSibling === null) {
          this.parentElement.previousElementSibling.remove();
        } else {
          this.parentElement.nextElementSibling.remove();
        }
      }
    });
    var detailsButton = document.createElement("button");
    detailsButton.setAttribute("value", data.trails[i].url);
    detailsButton.addEventListener("click", function () {
      console.log(detailsButton.value);
      window.open(detailsButton.value, "_target");
    });
    cardHolder.appendChild(detailsButton);
    cardHolder.appendChild(selectButton);
    cardHolder.appendChild(hikeName);
  }
}

callAPI();
