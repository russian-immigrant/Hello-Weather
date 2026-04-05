(function (w) {
  var GEO = "https://geocoding-api.open-meteo.com/v1/search";
  var FC = "https://api.open-meteo.com/v1/forecast";

  function getStoredCity() {
    try {
      return localStorage.getItem("weatherCity") || "";
    } catch (e) {
      return "";
    }
  }

  function setStoredCity(name) {
    try {
      localStorage.setItem("weatherCity", name);
    } catch (e) {}
  }

  async function geocode(query) {
    var q = (query || "").trim();
    if (!q) throw new Error("Enter a city name.");
    var url =
      GEO +
      "?name=" +
      encodeURIComponent(q) +
      "&count=5&language=en&format=json";
    var res = await fetch(url);
    if (!res.ok) throw new Error("Location lookup failed.");
    var data = await res.json();
    if (!data.results || !data.results.length) {
      throw new Error('No place found for "' + q + '".');
    }
    return data.results[0];
  }

  async function fetchCurrent(lat, lon) {
    var params = new URLSearchParams({
      latitude: String(lat),
      longitude: String(lon),
      current:
        "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m",
      timezone: "auto",
    });
    var res = await fetch(FC + "?" + params.toString());
    if (!res.ok) throw new Error("Weather request failed.");
    return res.json();
  }

  async function fetchDaily(lat, lon) {
    var params = new URLSearchParams({
      latitude: String(lat),
      longitude: String(lon),
      daily:
        "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
      forecast_days: "7",
      timezone: "auto",
    });
    var res = await fetch(FC + "?" + params.toString());
    if (!res.ok) throw new Error("Forecast request failed.");
    return res.json();
  }

  w.WeatherAPI = {
    geocode: geocode,
    fetchCurrent: fetchCurrent,
    fetchDaily: fetchDaily,
    getStoredCity: getStoredCity,
    setStoredCity: setStoredCity,
  };
})(window);
