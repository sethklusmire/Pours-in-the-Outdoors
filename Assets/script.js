//Global variables
var userCity = document.querySelector(".input");
var searchButton = document.querySelector(".is-info");
var hikeHours = "";
var userState = "";
let hikeCards = document.querySelectorAll(".hikecard");
let brewCards = document.querySelectorAll(".brewcard");

//For loop to hide hike and brew cards
for (let i = 0; i < hikeCards.length; i++) {
  let card = hikeCards[i];
  card.classList.add("hidden");
}
for (let i = 0; i < brewCards.length; i++) {
  let card = brewCards[i];
  card.classList.add("hidden");
}

//Search button event listener
searchButton.addEventListener("click", function () {
  //Pulls and stores state abbreviation
  var stateDropdown = document.getElementById("state");
  userState = stateDropdown.value;
  //Kicks out of listener event function if nothing is typed or selected
  if (userCity.value === "" || userState === "") {
    return;
  }

  //Function to restore page to defaults
  resetPage();

  //Creates url need for first fetch
  urlLink = "https://developers.zomato.com/api/v2.1/cities?q=" + userCity.value;

  //Calls the fetch function
  callAPI(urlLink);

  //Only allows 10 past searches to show on page
  if (searches.length === 10) {
    searches.pop();
  }
  //Adds last search to front of array
  searches.unshift([userCity.value, userState]);

  //Adds array to local storage
  localStorage.setItem("searches", JSON.stringify(searches));
  //Calls function to display past searches on page
  renderSearches();
  //Resets input bar to blank
  userCity.value = "";
});

//Array of objects for state data
var usStates = [
  { name: "State", abbreviation: "" },
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

//For loop to add state options to dropdown
for (var i = 0; i < usStates.length; i++) {
  var option = document.createElement("option");
  if (usStates[i].abbreviation) {
    option.text = usStates[i].name + `[${usStates[i].abbreviation}]`;
  } else {
    option.text = usStates[i].name;
  }
  option.value = usStates[i].abbreviation;
  var select = document.getElementById("state");
  select.appendChild(option);
}

//API function
function callAPI(urlLink) {
  //First fetch to zomato to get GPS coordinates from city name
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
      //For loop to match option to correct state otherwise pull first state option from data in fetch
      for (var i = 0; i < data.location_suggestions.length; i++) {
        if (data.location_suggestions[i].state_code === userState) {
          var cityID = data.location_suggestions[i].id;
          break;
        } else {
          var cityID = data.location_suggestions[0].id;
        }
      }

      //Creates next url needed for Zomato to pull brewery info
      urlCityID =
        "https://developers.zomato.com/api/v2.1/search?entity_id=" +
        cityID +
        "&entity_type=city&establishment_type=283";

      //Next fetch from Zomato
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
          //Stores data from Zomato and stores into array
          restaurantArray = data.restaurants;
          //Pulls longitude and latitude from Zomato data
          userLat = data.restaurants[0].restaurant.location.latitude;
          userLon = data.restaurants[0].restaurant.location.longitude;

          //Creates url for weather API
          urlWeather =
            "https://api.openweathermap.org/data/2.5/onecall?lat=" +
            userLat +
            "&lon=" +
            userLon +
            "&exclude=current,minutely,hourly,alerts&units=imperial&appid=96bbb97e9dec979e1eede50c7d6896d7";

          //Fetch call to OpenWeather API
          fetch(urlWeather)
            .then(function (response) {
              return response.json();
            })
            .then(function (data) {
              //Select area for weather display
              var weatherBox = document.querySelector("#weather");
              //Convert unix timestamp to conventional time, creates element for info, stores info, and appends to page
              currentDate = new Date(Number(data.daily[0].dt) * 1000);
              currentDate = currentDate.toLocaleString();
              var timeBlock = document.createElement("p");
              timeBlock.textContent = currentDate.split(" ")[0].slice(0, -1);
              weatherBox.appendChild(timeBlock);
              //Creates current weather img element, stores info, and appends
              weatherImg = document.createElement("img");
              weatherImg.setAttribute(
                "src",
                "http://openweathermap.org/img/wn/" +
                  data.daily[0].weather[0].icon +
                  "@2x.png"
              );
              weatherBox.appendChild(weatherImg);
              //Creates element for daily temp, stores info, and appends
              dailyTemp = document.createElement("p");
              dailyTemp.textContent = data.daily[0].temp.day + " °F";
              weatherBox.appendChild(dailyTemp);
            });

          //Creates url for hiking project API
          urlHike =
            "https://www.hikingproject.com/data/get-trails?lat=" +
            userLat +
            "&lon=" +
            userLon +
            "&maxDistance=10&key=200960634-4e140b5cd4726398c5b2066fb05cebd8";

          //Fetch call for hiking project API
          fetch(urlHike)
            .then(function (response) {
              return response.json();
            })
            .then(function (data) {
              //Stores trails data into an array
              var hikingArray = data.trails;

              //Limits the array to 4 trails
              if (hikingArray.length > 4) {
                hikingArray.length = 4;
              }

              //For loop to make cards visible
              for (let i = 0; i < hikeCards.length; i++) {
                let card = hikeCards[i];
                card.classList.remove("hidden");
              }

              //For loop to store and append necessary information for hike
              for (var i = 0; i < hikingArray.length; i++) {
                //Selects correct card and image placeholder
                var cardHolder = document.querySelector("#hikecard" + [i]);
                var hikePic = document.querySelector("#hikeimg" + [i]);
                //Sets the src for image
                hikePic.setAttribute("src", hikingArray[i].imgSmallMed);
                //Select title location in html for hike name and add text content
                var hikeName = document.querySelector("#hiketitle" + [i]);
                hikeName.textContent = hikingArray[i].name;
                //Creates elements for elevation, city, and difficulty and stores text content
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
                //Creates select button, appends coordinates to the button and adds event listener
                var selectButton = document.createElement("button");
                selectButton.setAttribute("value", [
                  hikingArray[i].latitude,
                  hikingArray[i].longitude,
                ]);
                selectButton.textContent = "Select";
                selectButton.addEventListener("click", function () {
                  //Retrieves coordinate from button on click
                  selectionCoodsArray = Array.from(this.value.split(","));
                  var lat1 = selectionCoodsArray[0];
                  var long1 = selectionCoodsArray[1];

                  //For loop to hide all card but one that is selected
                  for (var i = 0; i < hikingArray.length; i++) {
                    var card = hikeCards[i];
                    if (
                      i === Number(this.parentElement.getAttribute("id")[8])
                    ) {
                      continue;
                    } else {
                      card.classList.add("hidden");
                    }
                  }
                  //Remove select button from card
                  this.remove();
                  //Calculates distance to breweries in array
                  for (var j = 0; j < restaurantArray.length; j++) {
                    //Plug info in the distance function
                    restaurantArray[j].distance = calcDistance(
                      lat1,
                      restaurantArray[j].restaurant.location.latitude,
                      long1,
                      restaurantArray[j].restaurant.location.longitude
                    );
                  }
                  //Sorts breweries to by distance to selected hike
                  restaurantArray.sort(function (a, b) {
                    return a.distance - b.distance;
                  });
                  //Limits the array to 4 values
                  if (restaurantArray.length > 4) {
                    restaurantArray.length = 4;
                  }
                  //For loop for brewery elements
                  for (var k = 0; k < restaurantArray.length; k++) {
                    //Similar to the hiking card, creates elements or stores needed info for display
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
                    //Click event for details button to pull Zomato info to a separate tab
                    breweryDetailsButton.addEventListener("click", function () {
                      window.open(this.value, "_target");
                    });
                  }
                  //For loop to display brewery cards
                  for (let i = 0; i < brewCards.length; i++) {
                    let card = brewCards[i];
                    card.classList.remove("hidden");
                  }
                });
                //Details button for hike that links to hiking project for specific trail
                var detailsButton = document.createElement("button");
                detailsButton.textContent = "Details";
                detailsButton.setAttribute("value", data.trails[i].url);
                detailsButton.addEventListener("click", function () {
                  window.open(this.value, "_target");
                });
                //Append hiking information to page
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

//Function to calculate distance with coordinates in miles
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

//Gets data from local storage
let searches = JSON.parse(localStorage.getItem("searches"));

//if function if local storage is empty
if (searches === null) {
  searches = [];
}
//Gets html location for search history
let pastSearches = document.getElementById("past-search");

//Function to append search history to page
function renderSearches() {
  //Clears search history on page
  pastSearches.innerHTML = "";
  //For loop to run through searches array and appends to page
  for (let i = 0; i < searches.length; i++) {
    let searchesLineItem = searches[i][0];
    let searchesLineElement = document.createElement("li");
    searchesLineElement.classList.add("list-group-item");
    searchesLineElement.setAttribute("value", searches[i][1]);
    searchesLineElement.textContent = searchesLineItem;
    //Event listener for search history
    searchesLineElement.addEventListener("click", function () {
      //Calls reset page function
      resetPage();
      //Pulls needed info stored in array and creates first fetch url
      userCity = this.textContent;
      userState = searchesLineElement.getAttribute("value");
      urlLink = "https://developers.zomato.com/api/v2.1/cities?q=" + userCity;
      callAPI(urlLink);
    });
    pastSearches.appendChild(searchesLineElement);
  }
}

//Get local storage (if any) search history on page when loaded
renderSearches();

//Function to reset page
function resetPage() {
  //Return the hike and brew cards to hidden
  for (let i = 0; i < hikeCards.length; i++) {
    let card = hikeCards[i];
    card.classList.add("hidden");
  }
  for (let i = 0; i < brewCards.length; i++) {
    let card = brewCards[i];
    card.classList.add("hidden");
  }
  //Removes weather elements on page
  var weatherBox = document.querySelector("#weather");
  while (weatherBox.firstChild) {
    weatherBox.removeChild(weatherBox.firstChild);
  }
  //For loop to clear 4 hiking cards
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
  //For loop to clear 4 brewery cards
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
