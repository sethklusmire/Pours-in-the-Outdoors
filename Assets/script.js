var userCity = document.querySelector(".input");
var searchButton = document.querySelector(".is-info");
var hikeHours = "";
var userState = "";

let hikeCards = document.querySelectorAll(".hikecard");
let brewCards = document.querySelectorAll(".brewcard");

for (let i = 0; i < hikeCards.length; i++) {
  let card = hikeCards[i];
  card.classList.add("hidden");
}
for (let i = 0; i < brewCards.length; i++) {
  let card = brewCards[i];
  card.classList.add("hidden");
}
var urlLink = searchButton.addEventListener("click", function () {
  var stateDropdown = document.getElementById("state");
  userState = stateDropdown.value;
  if (userCity.value === "" || userState === "") {
    return;
  }

  resetPage();

  urlLink = "https://developers.zomato.com/api/v2.1/cities?q=" + userCity.value;

  callAPI(urlLink);
  // let searchInput = document.getElementById("city-input");
  if (searches.length === 10) {
    searches.pop();
  }
  searches.unshift([userCity.value, userState]);

  localStorage.setItem("searches", JSON.stringify(searches));
  renderSearches();
  userCity.value = "";
  // var cardSelector = document.getElementsByClassName(".hikecard");
  // cardSelector.setAttribute("style", "visibility: visible");
});

var usStates = [
  { name: "Select State", abbreviation: "" },
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

function callAPI(urlLink) {
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
            "&exclude=current,minutely,hourly,alerts&units=imperial&appid=96bbb97e9dec979e1eede50c7d6896d7";

          fetch(urlWeather)
            .then(function (response) {
              return response.json();
            })
            .then(function (data) {

              var weatherBox = document.querySelector(".weatherCard");
              currentDate = new Date(Number(data.daily[0].dt) * 1000);
              currentDate = currentDate.toLocaleString();
              var timeBlock = document.createElement("p");
              timeBlock.textContent = currentDate.split(" ")[0].slice(0, -1);
              weatherBox.appendChild(timeBlock);
              weatherImg = document.createElement("img");
              weatherImg.setAttribute(
                "src",
                "http://openweathermap.org/img/wn/" +
                  data.daily[0].weather[0].icon +
                  "@2x.png"
              );
              weatherBox.appendChild(weatherImg);
              hourlyTemp = document.createElement("p");
              hourlyTemp.textContent = data.daily[0].temp.day + " °F";
              weatherBox.appendChild(hourlyTemp);
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

              if (hikingArray.length > 4) {
                hikingArray.length = 4;
              }

              for (let i = 0; i < hikeCards.length; i++) {
                let card = hikeCards[i];
                card.classList.remove("hidden");
              }

              for (var i = 0; i < hikingArray.length; i++) {
                var cardHolder = document.querySelector("#hikecard" + [i]);
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

                  for (var i = 0; i < hikingArray.length - 1; i++) {
                    if (
                      this.parentElement.parentElement.parentElement.nextElementSibling ===
                      null
                    ) {
                      this.parentElement.parentElement.parentElement.previousElementSibling.remove();
                    } else {
                      this.parentElement.parentElement.parentElement.nextElementSibling.remove();

                    }
                  }
                  this.remove();
                  for (var j = 0; j < restaurantArray.length; j++) {
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
                  for (let i = 0; i < brewCards.length; i++) {
                    let card = brewCards[i];
                    console.log(card)
                    card.classList.remove("hidden");
                    
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
  lat1Sin = Math.sin((lat1 * Math.PI) / 180);
  lat2Sin = Math.sin((lat2 * Math.PI) / 180);
  lat1Cos = Math.cos((lat1 * Math.PI) / 180);
  lat2Cos = Math.cos((lat2 * Math.PI) / 180);
  longCos = Math.cos(((long2 - long1) * Math.PI) / 180);
  combinedEq =
    3963 * Math.acos(lat1Sin * lat2Sin + lat1Cos * lat2Cos * longCos);
  return combinedEq;
}

let searches = JSON.parse(localStorage.getItem("searches"));

if (searches === null) {
  searches = [];
}
let pastSearches = document.getElementById("past-search");

function renderSearches() {
  pastSearches.innerHTML = "";
  for (let i = 0; i < searches.length; i++) {
    let searchesLineItem = searches[i][0];
    let searchesLineElement = document.createElement("li");
    searchesLineElement.classList.add("list-group-item");
    searchesLineElement.setAttribute("value", searches[i][1]);
    searchesLineElement.textContent = searchesLineItem;
    searchesLineElement.addEventListener("click", function () {
      userCity = this.textContent;
      userState = searchesLineElement.getAttribute("value");
      console.log(userState);
      urlLink = "https://developers.zomato.com/api/v2.1/cities?q=" + userCity;
      callAPI(urlLink);
    });


    pastSearches.appendChild(searchesLineElement);
  }
}

renderSearches();
//Need to add function to the last .then fetch after completed
//
function resetPage() {
  var weatherBox = document.querySelector(".weatherCard");
  while (weatherBox.firstChild) {
    weatherBox.removeChild(weatherBox.firstChild);
  }
  var weatherReport = document.createElement("p");
  weatherReport.setAttribute("class", "title");
  weatherReport.textContent = "Weather Report";
  weatherBox.appendChild(weatherReport);
  for (var i = 0; i < 4; i++) {
    var hikePic = document.querySelector("#hikeimg" + [i]);
    hikePic.setAttribute(
      "src",
      "https://bulma.io/images/placeholders/1280x960.png"
    );
    var hikeCard = document.querySelector("#hikecard" + [i]);
    while (hikeCard.firstChild) {
      hikeCard.removeChild(hikeCard.firstChild);
    }
    var hikeName = document.createElement("p");
    hikeName.setAttribute("class", "title");
    hikeName.setAttribute("id", "hiketitle" + [i]);
    hikeCard.appendChild(hikeName);
  }
  for (var i = 0; i < 4; i++) {
    var brewPic = document.querySelector("#brewimg" + [i]);
    brewPic.setAttribute(
      "src",
      "https://bulma.io/images/placeholders/1280x960.png"
    );
    var brewCard = document.querySelector("#brewcard" + [i]);
    while (brewCard.firstChild) {
      brewCard.removeChild(brewCard.firstChild);
    }
    var brewName = document.createElement("p");
    brewName.setAttribute("class", "title");
    brewName.setAttribute("id", "brewTitle" + [i]);
    brewCard.appendChild(brewName);
  }
}

