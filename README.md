# Pip & the Sky Seeds

A short, original side-scrolling platformer built with HTML5 canvas, CSS, and vanilla JavaScript. Pip is a scarf-wearing garden creature collecting golden sky seeds on the way to a glowing beacon. All artwork and animations are canvas shapes; there are no downloaded assets, libraries, frameworks, or game engines.

## Run locally

Open `index.html` directly in a modern desktop browser. There is no installation or build step, and the game works offline.

Alternatively, from this directory run:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Then open <http://127.0.0.1:8000>. Leave the terminal running while you play; Ctrl+C stops the server. If port 8000 is occupied, choose another port in both the command and URL.

## Controls and rules

- **Left / Right arrows** or **A / D**: move.
- **Space** or **Up arrow**: jump. Release and press again for another jump.
- **Restart**: start a fresh game; **Play again** appears after winning or losing.

Click the game if keyboard focus is elsewhere. A keyboard is required; touch controls are not included.

The score in the upper-right starts at 0. Collect seeds for 10 points each and coins for 100 points each. Avoid both purple prickles: contact, even from above, costs a life. Falling into a pit also costs one life. You begin with three lives and respawn at the start with brief blinking protection. Collected seeds, coins, and points are retained between lives, so each collectible can only score once. A full restart resets everything.

Reach the beacon at the far right to complete the level. Collecting every seed is optional. Platforms are solid on their tops, sides, and undersides, so start jumps beside raised platforms to land on them. The level includes three gaps, eight raised platforms, 24 seeds, and two patrolling enemies.

## Project structure

```text
index.html           Page, canvas, score/lives, result overlay
styles.css           Responsive page layout and controls
js/
  level.js           Platform, seed, enemy, spawn, and goal coordinates
  physics.js         Gravity, movement, jump buffering, collisions, patrols
  renderer.js        Original canvas artwork and visual animation
  game.js            Input, fixed-step loop, camera, score, lives, game states
tests/
  index.html         Real-browser integration test page
  game-tests.js      Shared gameplay regression scenarios
  run.cjs            Dependency-free Node test runner with DOM/canvas stubs
```

Scripts share a small `SkyGame` namespace and load in order. They use classic scripts so opening the game directly through `file://` works. Simulation advances in fixed 1/120-second steps; rendering uses `requestAnimationFrame`. The logical canvas is 960 × 540, scaled by CSS. The camera follows Pip within world bounds. Losing focus clears held keys to prevent stuck movement.

To modify the level, edit `createLevel()` in `js/level.js`. Change `GRAVITY`, `SPEED`, and `JUMP` in `js/physics.js` to tune movement. Change drawings and colors in `js/renderer.js`. No Git repository has been initialized.

## Verification

With Node installed, run:

```sh
node tests/run.cjs
```

For the real canvas and DOM checks, open <http://127.0.0.1:8000/tests/> while the server is running (or open `tests/index.html` directly). The test page exercises the same game code, reports PASS/FAIL, and resets the game afterward.

The eight shared scenarios cover movement and world boundaries, gravity, jumping onto raised platforms, underside/side collisions, single-use collectibles, enemy patrols and damage, pits/three-life game over/restart, and a continuous route from spawn to level completion without teleporting. The route test finishes with all three lives and checks the celebration and result overlay. These checks passed in Node and the browser; the browser console had no warnings or errors. Automated screenshot capture was unavailable in the testing environment.

## Double-jump feature

Collect the purple ⇈ power-up near the first seed to unlock one additional jump while airborne. Press Space or Up again to use it; holding the key does not trigger it repeatedly. Landing restores the extra jump. The purple HUD badge shows when the ability is active. It persists across lost lives until Restart or Play again begins a new run. The pickup adds no score.

Four additional regression checks cover single-jump behavior before pickup, the pickup/HUD effect, the two-jump limit and landing reset, and persistence/reset across lives and runs.
