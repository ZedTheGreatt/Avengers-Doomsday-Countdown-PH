# Avengers: Doomsday — Manila Countdown

A cinematic countdown to **December 16, 2026 at 12:00 AM Philippine time**.

## Live sites

- [GitHub Pages](https://zedthegreatt.github.io/Avengers-Doomsday-Countdown-PH/)
- [Cloudflare Pages](https://avengers-doomsday-countdown-ph.pages.dev/)

## Features

- Counts down in months, days, hours, minutes, and seconds.
- Uses an explicit UTC+08:00 target, so the countdown stays anchored to Manila time regardless of the visitor's time zone.
- Responsive, single-page design with an original Doom-inspired vector illustration and animated atmosphere.
- Optional clock audio, controlled by an on-page sound button.
- Built with static HTML, CSS, and JavaScript; no build step or dependencies required.

## Run locally

You can open `dist/index.html` directly, or serve the `dist` folder locally:

```sh
python -m http.server 8000 --directory dist
```

Then visit <http://localhost:8000>.

## Deployment

The GitHub Pages site is deployed from the `dist/` directory by the workflow in `.github/workflows/main.yml` whenever changes are pushed to `main`. The workflow can also be started manually from the repository's Actions tab.

## Disclaimer

This is an unofficial fan-made project and is not affiliated with, endorsed by, or sponsored by Marvel, Disney, or any related rights holders. All associated names and trademarks belong to their respective owners.