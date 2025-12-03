const form = document.querySelector("#form");
const input = document.querySelector("#inputCity");

const cardCity = document.querySelector(".card-city");
const cardTemp = document.querySelector(".card-temp");
const cardImg = document.querySelector(".card-img");
const cardDescription = document.querySelector(".card-description");

// 1 — получить координаты города
async function getCityCoordinates(city) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${city}`;

  const response = await fetch(url);
  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    throw new Error("City not found");
  }

  const place = data.results[0];

  return {
    name: place.name,
    lat: place.latitude,
    lon: place.longitude
  };
}

// 2 — получить погоду
async function getWeather(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

  const response = await fetch(url);
  const data = await response.json();

  return data.current_weather;
}

// смена фона
function updateBackground(code) {
  document.body.classList.remove("weather-sunny", "weather-cloudy", "weather-rain", "weather-snow");

  if (code < 3) {
    document.body.classList.add("weather-sunny");
  } else if (code < 60) {
    document.body.classList.add("weather-cloudy");
  } else if (code < 70) {
    document.body.classList.add("weather-rain");
  } else {
    document.body.classList.add("weather-snow");
  }
}
// хеадер
function updateHeaderVideo(code) {
  const video = document.querySelector(".bg-video");

  if (code < 3) {
    video.src = "./mp4/sunny.mp4";
  } else if (code < 60) {
    video.src = "./mp4/cloudy.mp4";
  } else if (code < 70) {
    video.src = "./mp4/rain.mp4";
  } else {
    video.src = "./mp4/snow.mp4";
  }

  video.play();
}


// обработка формы
form.onsubmit = async function (e) {
  e.preventDefault();

  const city = input.value.trim();
  if (!city) return;

  try {
  
    const info = await getCityCoordinates(city);
    const weather = await getWeather(info.lat, info.lon);

    cardCity.textContent = info.name;
    cardTemp.textContent = `${weather.temperature}°C`;
    cardDescription.textContent = `Wind: ${weather.windspeed} km/h`;

    if (weather.weathercode < 3) cardImg.src = "./img/sun.png";
    else if (weather.weathercode < 60) cardImg.src = "./img/cloud.png";
    else if (weather.weathercode < 70) cardImg.src = "./img/rain.png"
    else cardImg.src = "./img/snow.png";

    updateBackground(weather.weathercode);
    updateHeaderVideo(weather.weathercode);
  

  } catch (err) {
    alert("City not found");
  }
};
 