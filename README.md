# Three Uncles

A speculative website for [Three Uncles](https://www.threeuncles.co.uk), the Cantonese roast meat group: seven London sites, led by Brixton Village, plus a Deliveroo kitchen in Bermondsey.

Demo: https://alexwilder-dev.github.io/three-uncles/

## What it does

- **Which Three Uncles, open or not, what's good.** The first screen is the chosen site's fascia: name, open status in London time, directions, call, and three dishes at that site's prices.
- **The signs.** Every site is a vertical neon shop sign, lit when it's open now. Picking one (or "Nearest to me") sets the site for menus, prices, hours and directions everywhere, and is remembered.
- **The glass counter.** Pick one to three meats, add £1 sauces and dim sum; the ticket prices it from the chosen site's own menu and ends with how to order there.
- **Menus per site**, transcribed from each location page, with the Brixton specials and the Ealing special menu, and a vegetarian filter.
- **Catering.** Package × headcount gives an estimate, which option applies (Deliveroo, collection or free delivery) and the notice needed, then a prefilled enquiry form.
- **Story, timeline, awards and press**, from /ourstory and the homepage, with dates checked against their news posts and the trade press.

No backend: forms show a confirmation only.

## Data

Everything factual is in [`src/data/threeUncles.ts`](src/data/threeUncles.ts), split by location: menus, prices, hours, contacts, catering packages, awards, press and timeline.

## Research

[`research/notes.md`](research/notes.md) covers the Brixton room and market, how they talk, who comes when, what reviewers say, what's broken on the current site, a photo log, and the design reasoning. Their photos and graphics are in `research/images`.

## Running it

```sh
npm install
npm run dev        # local
npm run build      # dist/, base /three-uncles/
npm run assets     # one-off: web images, favicons, og.jpg and the CJK font subset
```

Stack: Vite, React, TypeScript, Framer Motion, HashRouter. Deploys to GitHub Pages from `main` via `.github/workflows/deploy.yml` (Pages source: GitHub Actions).

Type: Red Hat Mono, Roboto Slab and Noto Sans HK (all OFL), standing in for the licensed Pitch Sans and Rum Serif on their current site. Identity by Studio NinetyOne. Photography and graphics belong to Three Uncles.

Site by AlexWilder-Dev
