# Vaga — live surf conditions for the Portuguese coast

Vaga ("wave" in Portuguese) is a static website that tells surfers what the sea is doing right now, and what it will do over the next seven days, at eight surf spots between Porto and Sagres.

- **Home page.** One card per spot with its live wave height, wave period, wind and a rating from Flat to Epic. The spots can be filtered by region and sorted by the biggest waves or the best conditions. A short guide explains how to read the numbers.
- **Spot page.** The story of the spot, a compass with the swell and the wind against the direction the beach faces, and a seven-day chart. Dragging along the chart (or using the arrow keys) changes every number on the page, the compass and the animated sea. A spot can be saved, and the browser remembers it.

Watch `SEEME.webm` for a one-minute tour.

## Where the data comes from

| Source | What Vaga takes from it |
| --- | --- |
| [`data/spots.json`](data/spots.json) (static content of this repository) | The spots: name, coordinates, the direction the beach faces, description and photo credit |
| [Open-Meteo Marine API](https://open-meteo.com/en/docs/marine-weather-api) | Hourly wave height, period, direction and water temperature |
| [Open-Meteo Forecast API](https://open-meteo.com/en/docs) | Hourly wind speed and direction |

Both APIs are public, need no key and are called with `fetch`. They accept several places in one request, so the home page loads all eight spots with two requests.

The rating is Vaga's own: it adds points for a long wave period and for wind that blows from the land (offshore), which is worked out from the direction each beach faces. It is a rough guide, not a safety warning.

## How it meets the requirements

- **Responsive.** Fluid type and spacing with `clamp()` and grids that fit as many columns as there is room for. There is not a single media query for screen sizes.
- **Dynamic interaction.** Filters, sorting, the draggable chart, saving spots and the light/dark theme button.
- **CSS animation.** The sea is three layers that drift at the speed of the real wave period and grow with the real wave height. Cards rise as they scroll into view, pages cross-fade into each other and cards glide to their new place when sorted.
- **Fetched content.** Everything on the cards and on the spot page is generated from the sources above.
- **No third-party libraries.** Plain HTML, CSS and JavaScript modules, with no dependencies and no build step. The chart is an SVG drawn by a custom element.

## Running it locally

JavaScript modules and `fetch` need a server, so opening `index.html` directly does not work. The project includes a small one, which needs only [Node.js](https://nodejs.org) 22 or newer:

```bash
node server.js
```

Then open <http://localhost:3000>. To use another port: `PORT=4000 node server.js`.

### With Docker

```bash
docker compose up --build
```

Then open <http://localhost:3000>, and stop it with `Ctrl+C`.

Without Compose: `docker build -t vaga .` and `docker run --rm -p 3000:3000 vaga`.

The server and the container are only for local testing. The published website is served by GitHub Pages.

## Project structure

```
index.html            the home page
spot.html             the page of one spot (spot.html?id=nazare)
data/spots.json       the eight spots
css/
├── base.css          colours for both themes, type, spacing
├── components.css    what both pages share: header, rating, animated sea
├── home.css          the home page
└── spot.css          the spot page
js/
├── api.js            fetches the spots and the forecasts
├── surf.js           reads a forecast like a surfer: wind type, rating
├── saved.js          the saved spots, kept in localStorage
├── theme.js          the light/dark button
├── ui.js             small pieces shared by both pages
├── wave-chart.js     the <wave-chart> custom element
├── home.js           the home page
└── spot.js           the spot page
images/               WebP photos and SVG drawings
fonts/                the Fraunces typeface
server.js             local server (Node.js, no dependencies)
Dockerfile            container that runs server.js (with docker-compose.yml)
```

## Credits

- Forecasts by [Open-Meteo](https://open-meteo.com), licensed under CC BY 4.0.
- Photos from [Wikimedia Commons](https://commons.wikimedia.org). The author and licence of each one are in `data/spots.json` and shown on the page of its spot.
- Headings are set in [Fraunces](https://fonts.google.com/specimen/Fraunces), under the SIL Open Font License.
