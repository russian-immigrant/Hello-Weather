(function () {
  var form = document.getElementById("forecast-form");
  var input = document.getElementById("fc-city");
  var btn = document.getElementById("fc-btn");
  var err = document.getElementById("fc-error");
  var list = document.getElementById("fc-list");
  var placeEl = document.getElementById("fc-place");

  function showError(msg) {
    err.textContent = msg;
    err.hidden = false;
  }

  function clearError() {
    err.hidden = true;
  }

  function formatDay(iso) {
    var d = new Date(iso + "T12:00:00");
    return d.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }

  async function loadForecast(query) {
    clearError();
    btn.disabled = true;
    list.innerHTML = '<p class="skeleton">Loading…</p>';
    try {
      var g = await WeatherAPI.geocode(query);
      var data = await WeatherAPI.fetchDaily(g.latitude, g.longitude);
      var daily = data.daily;
      var name =
        g.name +
        (g.admin1 ? ", " + g.admin1 : "") +
        (g.country ? " · " + g.country : "");
      placeEl.textContent = name;
      WeatherAPI.setStoredCity(query);

      var html = "";
      for (var i = 0; i < daily.time.length; i++) {
        var code = daily.weather_code[i];
        var tmin = Math.round(daily.temperature_2m_min[i]);
        var tmax = Math.round(daily.temperature_2m_max[i]);
        var rain = daily.precipitation_probability_max[i];
        html +=
          '<div class="forecast-row">' +
          '<div><span class="day">' +
          formatDay(daily.time[i]) +
          '</span><div class="desc">' +
          wmoLabel(code) +
          (rain != null ? " · " + rain + "% rain" : "") +
          "</div></div>" +
          '<div class="temps">' +
          tmin +
          "° / " +
          tmax +
          "°C</div></div>";
      }
      list.innerHTML = html;
    } catch (e) {
      list.innerHTML = "";
      placeEl.textContent = "";
      showError(e.message || "Could not load forecast.");
    } finally {
      btn.disabled = false;
    }
  }

  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    loadForecast(input.value);
  });

  var saved = WeatherAPI.getStoredCity();
  if (saved) {
    input.value = saved;
    loadForecast(saved);
  }
})();
