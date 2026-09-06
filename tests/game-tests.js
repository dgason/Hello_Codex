/* Runs in Node (with a small DOM stub) and in tests/index.html (real canvas). */
(() => {
  const results=[];
  const assert=(condition,message)=>{if(!condition)throw new Error(message);};
  const step=(frames,axis=0,jump=false)=>{for(let i=0;i<frames;i++)game.update(1/120,{axis,jump:jump&&i===0});};
  function test(name,fn){try{game.reset();step(2);fn();game.renderer.draw(game);results.push(`PASS ${name}`);}catch(e){results.push(`FAIL ${name}: ${e.message}`);}}
  test('Gravity, ground landing, left/right movement and world boundary',()=>{
    step(60);assert(game.player.y===410&&game.player.grounded,'ground landing');
    step(30,1);assert(game.player.x>130,'right');step(70,-1);assert(game.player.x===0,'left boundary');
  });
  test('Jump arc and landing on a raised platform',()=>{
    game.player.x=190;step(50,1,true);step(100);assert(game.player.y===308&&game.player.grounded,'raised platform landing');
  });
  test('Solid platform underside and side collisions',()=>{
    game.player.x=300;step(14,0,true);assert(game.player.vy>=0&&game.player.y>=376,'ceiling blocks jump');
    Object.assign(game.player,{x:223,y:350,vy:0});step(2,1);assert(game.player.x<=226,'side blocks movement');
  });
  test('Seed increases score once and remains collected after death',()=>{
    step(45,1);assert(game.score===10,'collect seed');step(30);assert(game.score===10,'no duplicate collection');
    game.player.x=650;game.player.y=650;step(1);assert(game.lives===2&&game.score===10&&game.level.seeds[0].collected,'preserve seed after death');
  });
  test('Patrol reverses direction at its bounds',()=>{
    const e=game.level.enemies[0];e.x=e.max;e.direction=1;step(1);assert(e.direction===-1&&e.x===e.max,'reverse');
  });
  test('Enemy contact consumes exactly one life and respawns safely',()=>{
    const e=game.level.enemies[0];Object.assign(game.player,{x:e.x,y:e.y-10,invincible:0});step(1);
    assert(game.lives===2&&game.player.x===72,'enemy damage');step(20);assert(game.lives===2,'one life only');
  });
  test('Walk into a pit, lose three lives, show game over, restart',()=>{
    for(let i=0;i<3;i++){game.player.x=645;step(150);}
    assert(game.lives===0&&game.state==='lost'&&!game.overlay.hidden,'game over');
    game.reset();assert(game.lives===3&&game.score===0&&game.overlay.hidden,'restart');
  });
  test('Continuous playable route from spawn to beacon without teleporting',()=>{
    const walkTo=x=>{for(let i=0;i<1000&&game.player.x<x&&game.state==='playing';i++)step(1,1);};
    const leapTo=x=>{step(1,1,true);walkTo(x);for(let i=0;i<160&&!game.player.grounded;i++)step(1);};
    for(const [from,to] of [[600,780],[1160,1280],[1300,1500],[1840,2000],[2025,2220]]){
      walkTo(from);leapTo(to);
    }
    walkTo(2800);
    assert(game.state==='won',`route ended at ${game.player.x.toFixed(0)}, lives ${game.lives}`);
    assert(game.lives===3,'route avoids enemies and pits');assert(game.particles.length>0,'celebration');
    step(180);assert(!game.overlay.hidden,'completion dialog');
  });
  game.reset();
  if(typeof process!=='undefined'){console.log(results.join('\n'));if(results.some(r=>r.startsWith('FAIL')))process.exitCode=1;}
  else document.getElementById('results').textContent=results.join('\n');
})();
