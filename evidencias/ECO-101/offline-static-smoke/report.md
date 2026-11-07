# ECO-101 offline static production smoke

- Definition: no Internet or external resource dependency while served by a loopback static server.
- Browser: `Google Chrome 156.0.8078.47`.
- Result: PASS; 8 product requests, 0 JavaScript/console errors.
- Canvas: 960 × 540; displayed 749 × 423.5625.
- Static scan: 38 committed source/config files and 3 built HTML/CSS/JS files.
- Post-shutdown: shell/canvas remained present for 1,000 ms (749 × 423.5625); no refresh was attempted.

## Request inventory

- 200 Document http://127.0.0.1:4174/
- 200 Script http://127.0.0.1:4174/assets/index-BPBVPWyg.js
- 200 Stylesheet http://127.0.0.1:4174/assets/index-npSrWtCa.css
- 200 Image data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAABAQMAAADD8p2OAAAAA1BMVEX/AP804Oa6AAAACklEQVQI12NgAAAAAgAB4iG8MwAAAABJRU5ErkJggg==
- 200 Image data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgAQMAAABJtOi3AAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAABVJREFUeF7NwIEAAAAAgKD9qdeocAMAoAABm3DkcAAAAABJRU5ErkJggg==
- 200 Image data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAJ9JREFUeNq01ssOwyAMRFG46v//Mt1ESmgh+DFmE2GPOBARKb2NVjo+17PXLD8a1+pl5+A+wSgFygymWYHBb0FtsKhJDdZlncG2IzJ4ayoMDv20wTmSMzClEgbWYNTAkQ0Z+OJ+A/eWnAaR9+oxCF4Os0H8htsMUp+pwcgBBiMNnAwF8GqIgL2hAzaGFFgZauDPKABmowZ4GL369/0rwACp2yA/ttmvsQAAAABJRU5ErkJggg==
- 200 Image data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAIAAAAmkwkpAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABdJREFUeNpi/P//PwMMMDEgAdwcgAADAJZuAwXJYZOzAAAAAElFTkSuQmCC
- 200 Image data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAABAQMAAADD8p2OAAAAA1BMVEX//wCKxvRFAAAACklEQVQI12NgAAAAAgAB4iG8MwAAAABJRU5ErkJggg==

## Reproduce

`npm run test:offline-smoke`
`node --test evidencias/ECO-101/offline-static-smoke/offline-smoke-negative.test.mjs`

## Limits

No claim is made for file://, service-worker caching, refresh after shutdown, other browsers, serial/hardware, gameplay, physics, accessibility, or prolonged performance. Generic dormant loader APIs and metadata inside bundled Phaser/Vite are not external resource references; attempted requests are enforced dynamically.
