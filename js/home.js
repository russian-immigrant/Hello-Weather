(function () {
  var form = document.getElementById("search-form");
  var input = document.getElementById("city-input");
  var btn = document.getElementById("search-btn");
  var err = document.getElementById("error-msg");

  function showError(msg) {
    err.textContent = msg;
    err.hidden = false;
  }

  function clearError() {
    err.hidden = true;
    err.textContent = "";
  }

  function degToCompass(d) {
    if (d == null || isNaN(d)) return "—";
    var dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    return dirs[Math.round(d / 45) % 8];
  }

  async function loadForPlace(place) {
    clearError();
    btn.disabled = true;
    try {
      var g = await WeatherAPI.geocode(place);
      var data = await WeatherAPI.fetchCurrent(g.latitude, g.longitude);
      var c = data.current;
      var name =
        g.name +
        (g.admin1 ? ", " + g.admin1 : "") +
        (g.country ? " · " + g.country : "");

      document.getElementById("temp-display").innerHTML =
        Math.round(c.temperature_2m) + "<small>°C</small>";
      document.getElementById("place-display").textContent = name;
      document.getElementById("condition-display").textContent = wmoLabel(
        c.weather_code
      );
      document.getElementById("feels").textContent =
        Math.round(c.apparent_temperature) + " °C";
      document.getElementById("humidity").textContent =
        c.relative_humidity_2m + "%";
      document.getElementById("wind").textContent =
        Math.round(c.wind_speed_10m) + " km/h";
      document.getElementById("wind-dir").textContent =
        degToCompass(c.wind_direction_10m) +
        " (" +
        Math.round(c.wind_direction_10m) +
        "°)";

      WeatherAPI.setStoredCity(place);
    } catch (e) {
      showError(e.message || "Something went wrong.");
    } finally {
      btn.disabled = false;
    }
  }

  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    loadForPlace(input.value);
  });

  var saved = WeatherAPI.getStoredCity();
  if (saved) {
    input.value = saved;
    loadForPlace(saved);
  }
})();
