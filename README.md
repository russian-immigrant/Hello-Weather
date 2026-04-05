# Hello Weather

A lightweight, multi-page weather site that runs as **static HTML, CSS, and JavaScript**—no framework, no build step, and **no API key**. Search any city for **current conditions** or a **7-day forecast**, with a small **About** page and a configurable footer link to your GitHub repo.

**Live repository:** [github.com/russian-immigrant/Hello-Weather](https://github.com/russian-immigrant/Hello-Weather)

---

## Quick links (GitHub)

These links jump to the right section when you view this file on GitHub ([README on `main`](https://github.com/russian-immigrant/Hello-Weather/blob/main/README.md)):

| Section | Link |
|--------|------|
| Overview | [README#overview](https://github.com/russian-immigrant/Hello-Weather/blob/main/README.md#overview) |
| Features | [README#features](https://github.com/russian-immigrant/Hello-Weather/blob/main/README.md#features) |
| Tech stack | [README#tech-stack](https://github.com/russian-immigrant/Hello-Weather/blob/main/README.md#tech-stack) |
| Requirements | [README#requirements](https://github.com/russian-immigrant/Hello-Weather/blob/main/README.md#requirements) |
| Getting started | [README#getting-started](https://github.com/russian-immigrant/Hello-Weather/blob/main/README.md#getting-started) |
| Project structure | [README#project-structure](https://github.com/russian-immigrant/Hello-Weather/blob/main/README.md#project-structure) |
| Configuration | [README#configuration](https://github.com/russian-immigrant/Hello-Weather/blob/main/README.md#configuration) |
| How it works | [README#how-it-works](https://github.com/russian-immigrant/Hello-Weather/blob/main/README.md#how-it-works) |
| Data and privacy | [README#data-and-privacy](https://github.com/russian-immigrant/Hello-Weather/blob/main/README.md#data-and-privacy) |
| Customization | [README#customization](https://github.com/russian-immigrant/Hello-Weather/blob/main/README.md#customization) |
| Deploying | [README#deploying](https://github.com/russian-immigrant/Hello-Weather/blob/main/README.md#deploying) |
| Troubleshooting | [README#troubleshooting](https://github.com/russian-immigrant/Hello-Weather/blob/main/README.md#troubleshooting) |
| Contributing | [README#contributing](https://github.com/russian-immigrant/Hello-Weather/blob/main/README.md#contributing) |
| License | [README#license](https://github.com/russian-immigrant/Hello-Weather/blob/main/README.md#license) |
| Acknowledgements | [README#acknowledgements](https://github.com/russian-immigrant/Hello-Weather/blob/main/README.md#acknowledgements) |

---

## Overview

**Hello Weather** is a front-end-only project: you open `index.html` or deploy the folder to **GitHub Pages**, Netlify, Cloudflare Pages, or any static host. All weather data is fetched in the browser from **[Open-Meteo](https://open-meteo.com/)**, which provides a free forecast API and a geocoding endpoint—no signup required for typical use.

The app remembers your **last searched city** using the browser’s `localStorage` key `weatherCity`, so returning to the site or switching between **Current** and **7-Day** feels seamless.

---

## Features

| Area | Details |
|------|---------|
| **Current weather** | Temperature (°C), “feels like”, relative humidity, wind speed (km/h), wind direction (compass + degrees), and human-readable condition text from WMO weather codes. |
| **7-day forecast** | Daily min/max temperatures, condition labels, and max precipitation probability when available. |
| **City search** | Text search resolved through Open-Meteo’s geocoding API; first matching place is used. |
| **Multi-page UI** | Separate pages for current conditions, forecast, and about—plain navigation links, no SPA router. |
| **Branding** | Favicon and touch icon from `assets/hello-weather.png`. |
| **Footer** | Optional attribution text and a **GitHub repository** URL loaded from one config file (`js/shar.js`). |

---

## Tech stack

- **HTML5** — semantic pages (`index.html`, `forecast.html`, `about.html`).
- **CSS3** — layout, dark theme, responsive-friendly styles (`css/styles.css`).
- **JavaScript (ES5-style IIFEs)** — no transpiler; works in modern browsers with `fetch` and `async`/`await`.
- **Open-Meteo** — [Forecast API](https://open-meteo.com/en/docs) and [Geocoding API](https://open-meteo.com/en/docs/geocoding-api).

---

## Requirements

- A **modern browser** with `fetch`, `async`/`await`, and `localStorage` (recent Chrome, Firefox, Safari, Edge).
- **Network access** to `api.open-meteo.com` and `geocoding-api.open-meteo.com` (required for live data).

---

## Getting started

### Option A: Open files directly

1. Clone or download this repository.
2. Open **`index.html`** in your browser (double-click or drag into a tab).

Some browsers restrict `fetch` for `file://` URLs. If searches fail, use Option B.

### Option B: Local static server (recommended)

From the project root:

```bash
npx --yes serve .
```

Then visit the URL shown in the terminal (often `http://localhost:3000`). Any equivalent static server works (`python -m http.server`, VS Code Live Server, etc.).

---

## Project structure

```
hello-weather/
├── about.html           # About page + repo link snippet
├── forecast.html        # 7-day forecast page
├── index.html           # Current weather page
├── LICENSE              # MIT license
├── README.md            # This file
├── assets/
│   └── hello-weather.png   # Favicon / app icon
├── css/
│   └── styles.css       # Global styles
└── js/
    ├── codes.js         # WMO weather code → label text
    ├── footer.js        # Injects footer; reads GitHub URL from SHAR
    ├── forecast-page.js # Forecast page logic
    ├── home.js          # Current weather page logic
    ├── shar.js          # **Edit:** `githubRepo` for your GitHub link
    └── weather.js       # Geocode + Open-Meteo API helpers
```

---

## Configuration

### GitHub link in shar.js

Edit **`js/shar.js`** and set your repository URL (this project defaults to [russian-immigrant/Hello-Weather](https://github.com/russian-immigrant/Hello-Weather)):

```javascript
window.SHAR = {
  githubRepo: "https://github.com/russian-immigrant/Hello-Weather",
};
```

This value is used by:

- **`js/footer.js`** — “GitHub repository” link in the site footer.
- **`about.html`** — inline script appends “Open the repository” using the same URL.

If `shar.js` fails to load, fallbacks in **`footer.js`** and **`about.html`** still use the same default URL above.

---

## How it works

1. **User enters a city** on the Current or 7-Day page and submits the form.
2. **`WeatherAPI.geocode(query)`** calls  
   `https://geocoding-api.open-meteo.com/v1/search`  
   and takes the first result (name, admin area, country, latitude, longitude).
3. **Current page:** **`WeatherAPI.fetchCurrent(lat, lon)`** requests current variables (temperature, humidity, wind, weather code, etc.) from  
   `https://api.open-meteo.com/v1/forecast` with `timezone=auto`.
4. **Forecast page:** **`WeatherAPI.fetchDaily(lat, lon)`** requests seven days of daily min/max, weather codes, and precipitation probability maxima.
5. **`codes.js`** maps numeric **WMO weather codes** to short English descriptions shown in the UI.

Implementation details live in **`js/weather.js`**; UI wiring is in **`js/home.js`** and **`js/forecast-page.js`**.

---

## Data and privacy

- **Open-Meteo** receives requests from the user’s browser (your deployed site does not proxy them unless you add a backend). See Open-Meteo’s site for their terms and attribution guidelines.
- **Local storage:** only the **last searched city string** is stored (`weatherCity`). No accounts or server-side database.

---

## Customization

| Goal | Where to look |
|------|----------------|
| Replace icon | Swap **`assets/hello-weather.png`** and keep paths in HTML or update `<link rel="icon">` paths. |
| Colors / fonts | **`css/styles.css`** — `:root` CSS variables (`--bg`, `--accent`, etc.). |
| Footer wording | **`js/footer.js`** — HTML string inside `renderFooter`. |
| Forecast length | **`js/weather.js`** — `forecast_days` in `fetchDaily` (Open-Meteo allows configurable days within API limits). |

---

## Deploying

This repo is **static-only**. Push to GitHub and enable **GitHub Pages** (publish from `main` / root), or upload the folder to Netlify, Cloudflare Pages, or S3 static hosting. No environment variables are required.

The footer and **`js/shar.js`** are set to [https://github.com/russian-immigrant/Hello-Weather](https://github.com/russian-immigrant/Hello-Weather) so they match this repository.

---

## Troubleshooting

| Issue | What to try |
|--------|-------------|
| Search does nothing on `file://` | Serve the site over **http://localhost** (see [Getting started](#getting-started)). |
| “No place found” | Try a simpler city name or add region/country if duplicates exist elsewhere. |
| CORS / blocked requests | Corporate networks sometimes block APIs; try another network or browser. |
| Blank forecast rows | Check the browser **Network** tab for Open-Meteo errors; APIs occasionally rate-limit heavy abuse (normal use is fine). |

---

## Contributing

Issues and pull requests are welcome. Please keep changes focused (this project intentionally stays small and dependency-free). If you add features, update this **README** so behavior and file layout stay documented.

---

## License

This project is licensed under the **[MIT License](LICENSE)**.

---

## Acknowledgements

- **[Open-Meteo](https://open-meteo.com/)** — weather and geocoding APIs used by this project.
- Weather condition text is derived from **WMO weather interpretation codes** as documented by Open-Meteo.
