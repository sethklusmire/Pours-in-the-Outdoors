var userLat = "";
var userLon = "";
var urlWeather = "";

urlBrew =
  "https://developers.zomato.com/api/v2.1/categories?res_id=373255548d00e2f86142eb53b14b2a1b";

fetch(
  "https://developers.zomato.com/api/v2.1/search?entity_id=305&entity_type=city&establishment_type=Brewery",
  {
    headers: {
      "user-key": "befc99cf9aa7e704466965a423310b06",
      "content-type": "application/json",
    },
  }
)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data);
    userLat = data.restaurants[0].restaurant.location.latitude;
    userLon = data.restaurants[0].restaurant.location.longitude;

    urlWeather =
      "https://api.openweathermap.org/data/2.5/onecall?lat=" +
      userLat +
      "&lon=" +
      userLon +
      "&exclude=current,minutely,daily,alerts&appid=96bbb97e9dec979e1eede50c7d6896d7";

    fetch(urlWeather)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);
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
        console.log(data);
      });
  });