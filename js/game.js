SkyGame.Game = class {
  constructor(canvas) {
    this.canvas=canvas;this.renderer=new SkyGame.Renderer(canvas);this.keys=new Set();this.jumpQueued=false;
    this.scoreNode=document.getElementById('score');this.livesNode=document.getElementById('lives');
    this.overlay=document.getElementById('overlay');this.status=document.getElementById('status');
    this.bindInput();this.reset();this.lastTime=null;this.accumulator=0;
    requestAnimationFrame(timestamp=>this.frame(timestamp));
  }
  reset() {
    this.level=SkyGame.createLevel();this.lives=3;this.score=0;this.camera=0;this.time=0;
    this.doubleJump=false;this.powerUpFlash=0;
    this.state='playing';this.particles=[];this.keys.clear();this.jumpQueued=false;
    this.overlay.hidden=true;this.spawn();this.updateHud();
  }
  spawn() {
    this.player={...this.level.spawn,w:34,h:42,vx:0,vy:0,facing:1,grounded:false,coyote:0,jumpBuffer:0,invincible:1.4,doubleJump:this.doubleJump,airJumpUsed:false};
    this.camera=0;
  }
  bindInput() {
    const controls=['ArrowLeft','ArrowRight','ArrowUp','KeyA','KeyD','Space'];
    window.addEventListener('keydown',e=>{
      if(!controls.includes(e.code) || e.target.closest('button'))return;
      e.preventDefault();this.keys.add(e.code);
      if(!e.repeat && ['Space','ArrowUp'].includes(e.code))this.jumpQueued=true;
    });
    window.addEventListener('keyup',e=>this.keys.delete(e.code));
    const clear=()=>{this.keys.clear();this.jumpQueued=false;this.lastTime=null;this.accumulator=0;};
    window.addEventListener('blur',clear);document.addEventListener('visibilitychange',clear);
    const restart=()=>{this.reset();this.canvas.focus();};
    document.getElementById('restart').addEventListener('click',restart);
    document.getElementById('play-again').addEventListener('click',restart);
    this.canvas.addEventListener('pointerdown',()=>this.canvas.focus());
  }
  updateHud() {
    document.getElementById('double-jump').hidden=!this.doubleJump;
    this.scoreNode.textContent=String(this.score).padStart(3,'0');
    this.livesNode.textContent='♥ '.repeat(this.lives)+'♡ '.repeat(3-this.lives);
    this.livesNode.setAttribute('aria-label',`${this.lives} lives`);
  }
  burst(x,y,count,celebration=false) {
    for(let i=0;i<count;i++) {
      const life=celebration?2+Math.random()*1.5:.6;
      this.particles.push({x,y,vx:(Math.random()-.5)*(celebration?420:150),vy:-Math.random()*(celebration?490:180)-40,
        life,maxLife:life,size:celebration?4+Math.random()*5:4,color:['#f3be54','#fff2be','#69c2a4','#ef9477'][i%4]});
    }
  }
  loseLife() {
    this.lives--;this.updateHud();this.jumpQueued=false;
    if(this.lives<=0)this.finish(false);
    else {this.spawn();this.status.textContent=`A little tumble! ${this.lives} lives left. Back at the start.`;}
  }
  finish(won) {
    this.state=won?'won':'lost';this.player.vx=0;this.keys.clear();
    if(won)this.burst(this.level.goal.x+32,this.level.goal.y+25,110,true);
    document.getElementById('eyebrow').textContent=won?'GARDEN COMPLETE':'A LITTLE TUMBLE';
    document.getElementById('message-title').textContent=won?'You lit up the garden!':'Another sky awaits.';
    document.getElementById('message-text').textContent=won?`${this.score} points · ${this.score/10} of ${this.level.seeds.length} seeds · ${this.lives} lives left`:'Pip is ready for another adventure. Try again!';
    this.status.textContent=won?'Level complete!':'Game over.';
    // Let the beacon and confetti play before revealing the result.
    this.endDelay=won?1.25:.35;
  }
  update(dt,input) {
    this.time+=dt;this.powerUpFlash=Math.max(0,this.powerUpFlash-dt);
    for(const p of this.particles){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=450*dt;p.life-=dt;}
    this.particles=this.particles.filter(p=>p.life>0);
    if(this.state!=='playing') {
      this.endDelay-=dt;if(this.endDelay<=0 && this.overlay.hidden){this.overlay.hidden=false;document.getElementById('play-again').focus();}
      return;
    }
    SkyGame.Physics.movePlayer(this.player,input,this.level.platforms,this.level.width,dt);
    SkyGame.Physics.moveEnemies(this.level.enemies,dt);
    if(this.player.y>610){this.loseLife();return;}
    for(const e of this.level.enemies)if(this.player.invincible===0 && SkyGame.Physics.overlaps(this.player,e)){this.loseLife();return;}
    for(const seed of this.level.seeds)if(!seed.collected && SkyGame.Physics.overlaps(this.player,seed)){
      seed.collected=true;this.score+=10;this.burst(seed.x+11,seed.y+14,10);this.updateHud();
    }
    for(const coin of this.level.coins)if(!coin.collected && SkyGame.Physics.overlaps(this.player,coin)){
      coin.collected=true;
    }
    const powerUp=this.level.powerUp;
    if(!powerUp.collected && SkyGame.Physics.overlaps(this.player,powerUp)) {
      powerUp.collected=true;this.doubleJump=true;this.player.doubleJump=true;
      this.powerUpFlash=1;this.updateHud();
      this.status.textContent='Double-jump active! Press jump again in the air. Lasts until you restart.';
    }
    this.camera=Math.max(0,Math.min(this.level.width-960,this.player.x-320));
    if(SkyGame.Physics.overlaps(this.player,this.level.goal))this.finish(true);
  }
  frame(timestamp) {
    if(this.lastTime===null)this.lastTime=timestamp;
    this.accumulator+=Math.min((timestamp-this.lastTime)/1000,.1);this.lastTime=timestamp;
    const dt=1/120;
    while(this.accumulator>=dt){
      const axis=Number(this.keys.has('ArrowRight')||this.keys.has('KeyD'))-Number(this.keys.has('ArrowLeft')||this.keys.has('KeyA'));
      this.update(dt,{axis,jump:this.jumpQueued});this.jumpQueued=false;this.accumulator-=dt;
    }
    this.renderer.draw(this);requestAnimationFrame(t=>this.frame(t));
  }
};
const game = new SkyGame.Game(document.getElementById('game'));
