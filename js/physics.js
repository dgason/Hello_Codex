/* Fixed-step, axis-separated collision keeps the simulation predictable. */
SkyGame.Physics = (() => {
  const GRAVITY = 1550, SPEED = 265, JUMP = 654;
  const overlaps = (a,b) => a.x < b.x+b.w && a.x+a.w > b.x && a.y < b.y+b.h && a.y+a.h > b.y;
  function movePlayer(p, input, platforms, width, dt) {
    p.vx = input.axis * SPEED;
    if (input.axis) p.facing = input.axis;
    p.coyote = p.grounded ? .10 : Math.max(0,p.coyote-dt);
    if (p.grounded) p.airJumpUsed = false;
    p.jumpBuffer = input.jump ? .12 : Math.max(0,p.jumpBuffer-dt);
    const groundJump = p.jumpBuffer > 0 && p.coyote > 0;
    // Only a fresh press can consume the extra airborne jump.
    const airJump = input.jump && !p.grounded && p.coyote === 0 && p.doubleJump && !p.airJumpUsed;
    if (groundJump || airJump) {
      if (airJump) p.airJumpUsed = true;
      p.vy = -JUMP; p.grounded = false; p.coyote = 0; p.jumpBuffer = 0;
    }
    p.x += p.vx * dt;
    for (const tile of platforms) if (overlaps(p,tile)) {
      if (p.vx > 0) p.x = tile.x-p.w;
      else if (p.vx < 0) p.x = tile.x+tile.w;
    }
    p.x = Math.max(0,Math.min(width-p.w,p.x));
    p.vy = Math.min(p.vy + GRAVITY * dt, 950);
    p.y += p.vy * dt; p.grounded = false;
    for (const tile of platforms) if (overlaps(p,tile)) {
      if (p.vy > 0) {p.y=tile.y-p.h;p.grounded=true;p.airJumpUsed=false;}
      else if (p.vy < 0) p.y=tile.y+tile.h;
      p.vy = 0;
    }
    p.invincible = Math.max(0,p.invincible-dt);
  }
  function moveEnemies(enemies,dt) {
    for (const e of enemies) {
      e.x += e.speed*e.direction*dt;
      if(e.x<e.min){e.x=e.min;e.direction=1;}
      if(e.x>e.max){e.x=e.max;e.direction=-1;}
    }
  }
  return {movePlayer,moveEnemies,overlaps};
})();
