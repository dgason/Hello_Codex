/* All artwork is drawn here with canvas primitives. No image assets. */
SkyGame.Renderer = class {
  constructor(canvas) {this.ctx=canvas.getContext('2d');this.width=canvas.width;this.height=canvas.height;}
  ellipse(x,y,rx,ry,color) {const c=this.ctx;c.fillStyle=color;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill();}
  rounded(x,y,w,h,r,color) {const c=this.ctx;c.fillStyle=color;c.beginPath();c.roundRect(x,y,w,h,r);c.fill();}
  text(label,x,y,size,color,align='left') {const c=this.ctx;c.fillStyle=color;c.font=`600 ${size}px system-ui`;c.textAlign=align;c.fillText(label,x,y);}
  background(camera,t) {
    const c=this.ctx;
    const sky=c.createLinearGradient(0,0,0,540);sky.addColorStop(0,'#afe0e9');sky.addColorStop(1,'#e7f4de');c.fillStyle=sky;c.fillRect(0,0,960,540);
    this.ellipse(770-camera*.04,95,49,49,'#fff7c8');this.ellipse(770-camera*.04,95,66,66,'#fff9d52e');
    for(let i=-1;i<8;i++) {
      const x=i*245-camera*.17+Math.sin(t*.1+i)*14;
      this.ellipse(x,104+(i%3)*31,49,15,'#f5ffffb8');this.ellipse(x-18,97+(i%3)*31,24,21,'#f5ffffb8');
    }
    for(let layer=0;layer<2;layer++) {
      c.fillStyle=layer?'#86cbbb':'#a1d4ca';c.beginPath();c.moveTo(0,540);
      for(let x=-30;x<=990;x+=10){const world=x+camera*(layer?.28:.12);c.lineTo(x,335+layer*49+Math.sin(world*.007+layer*3)*36+Math.sin(world*.016)*13);}
      c.lineTo(990,540);c.fill();
    }
    for(let i=0;i<20;i++){const x=((i*137-camera*.4+t*8)%1000+1000)%1000;const y=170+(i*53)%255+Math.sin(t+i)*7;this.ellipse(x,y,2,2,'#fffce59c');}
  }
  platform(p,t) {
    const c=this.ctx,ground=p.h>40;
    this.rounded(p.x,p.y,p.w,p.h,ground?12:9,ground?'#b4835e':'#ba8c68');
    c.save();c.beginPath();c.rect(p.x,p.y+15,p.w,p.h-15);c.clip();
    for(let i=0;i<p.w;i+=35) this.rounded(p.x+i+10,p.y+31+(i%3)*10,8,5,2,'#d3a682');
    c.restore();
    this.rounded(p.x,p.y,p.w,18,8,'#409a78');this.rounded(p.x+2,p.y,p.w-4,7,4,'#7fcb85');
    for(let i=18;i<p.w-10;i+=59){const x=p.x+i;
      c.strokeStyle='#419c75';c.lineWidth=2;c.beginPath();c.moveTo(x,p.y);c.quadraticCurveTo(x-3,p.y-8,x+Math.sin(t*1.7+i)*3,p.y-13);c.stroke();
      if(i%2===0){this.ellipse(x+Math.sin(t*1.7+i)*3,p.y-14,4,4,'#fff2bb');this.ellipse(x+Math.sin(t*1.7+i)*3,p.y-14,1.5,1.5,'#e7ae54');}
    }
    if(!ground){c.strokeStyle='#5eaa83';c.lineWidth=3;c.beginPath();c.moveTo(p.x+25,p.y+p.h);c.quadraticCurveTo(p.x+32+Math.sin(t)*4,p.y+57,p.x+22,p.y+63);c.stroke();this.ellipse(p.x+28,p.y+45,7,3,'#5eaa83');}
  }
  seed(seed,t,index) {
    if(seed.collected)return;const c=this.ctx,x=seed.x+11,y=seed.y+14+Math.sin(t*3+index)*5;
    c.save();c.translate(x,y);c.scale(.65+Math.abs(Math.cos(t*2+index))*.35,1);
    this.ellipse(0,0,17,20,'#fff2b231');c.fillStyle='#f0b846';c.beginPath();c.moveTo(0,-13);c.quadraticCurveTo(17,-1,0,14);c.quadraticCurveTo(-17,-1,0,-13);c.fill();
    c.strokeStyle='#ffec9e';c.lineWidth=2;c.beginPath();c.moveTo(-2,-7);c.quadraticCurveTo(-7,0,-2,6);c.stroke();c.restore();
  }
  player(p,t) {
    if(p.invincible>0 && Math.floor(t*12)%2===0)return;
    const c=this.ctx,walk=p.grounded?Math.sin(t*18)*Math.min(1,Math.abs(p.vx)/100):0;
    c.save();c.translate(p.x+p.w/2,p.y+p.h);c.scale(p.facing,1);
    this.ellipse(0,1,18,4,'#275f5a24');
    this.ellipse(-9,-3+walk*3,7,5,'#206f68');this.ellipse(9,-3-walk*3,7,5,'#206f68');
    c.strokeStyle='#287f71';c.lineWidth=3;c.beginPath();c.moveTo(0,-34);c.quadraticCurveTo(0,-49,5,-49+Math.sin(t*5)*2);c.stroke();
    this.ellipse(10,-48+Math.sin(t*5)*2,9,4,'#6fae60');
    this.rounded(-17,-39+Math.abs(walk),34,34,13,'#348e80');this.rounded(-13,-37+Math.abs(walk),29,28,11,'#60bc9f');
    this.ellipse(1,-21,11,12,'#c4e5b2');this.ellipse(3,-26,2.2,3,'#244c4c');this.ellipse(12,-26,2.2,3,'#244c4c');this.ellipse(13,-20,3,1.7,'#e5a082');
    c.strokeStyle='#244c4c';c.lineWidth=1.5;c.beginPath();c.arc(8,-21,3,0,Math.PI);c.stroke();
    c.fillStyle='#edaa5f';c.beginPath();c.moveTo(-13,-16);c.lineTo(-28,-12+Math.sin(t*9)*3);c.lineTo(-20,-22);c.closePath();c.fill();this.rounded(-16,-19,30,5,2,'#efb86c');c.restore();
  }
  enemy(e,t) {
    const c=this.ctx,x=e.x+e.w/2,y=e.y+e.h;
    this.ellipse(x,y,20,4,'#275f5a22');
    for(let i=0;i<4;i++)this.ellipse(x-12+i*8,y-2+Math.sin(t*12+i)*2,4,4,'#665372');
    c.fillStyle='#897199';c.beginPath();c.moveTo(x-19,y-9);
    for(let i=0;i<7;i++){const a=Math.PI+i*Math.PI/6;c.lineTo(x+Math.cos(a)*22,y-11+Math.sin(a)*23);c.lineTo(x+Math.cos(a+.2)*15,y-11+Math.sin(a+.2)*15);}c.closePath();c.fill();
    this.ellipse(x,y-11,18,13,'#9d85ad');this.ellipse(x+e.direction*9,y-12,7,7,'#e4d5da');this.ellipse(x+e.direction*11,y-12,2,3,'#4d405b');
  }
  goal(goal,t,won) {
    const c=this.ctx,x=goal.x+goal.w/2;
    this.ellipse(x,goal.y+goal.h,46,8,'#34775d30');this.rounded(x-24,goal.y+90,48,25,8,'#e7dbc1');
    c.strokeStyle='#5b9685';c.lineWidth=7;c.beginPath();c.moveTo(x-19,goal.y+95);c.lineTo(x-19,goal.y+22);c.quadraticCurveTo(x,goal.y-6,x+19,goal.y+22);c.lineTo(x+19,goal.y+95);c.stroke();
    this.ellipse(x,goal.y+38,32+Math.sin(t*2)*4,40,won?'#fff7af80':'#fff7af40');
    c.save();c.translate(x,goal.y+36+Math.sin(t*2)*5);c.rotate(t*.4);c.fillStyle='#fff5b6';c.beginPath();for(let i=0;i<8;i++){const a=i*Math.PI/4,r=i%2?7:21;c.lineTo(Math.cos(a)*r,Math.sin(a)*r);}c.closePath();c.fill();c.restore();
    this.text('THE BEACON',x,goal.y-27,11,'#42796e','center');
  }
  draw(game) {
    const {camera,time:t,level,player,particles}=game,c=this.ctx;
    c.clearRect(0,0,960,540);this.background(camera,t);c.save();c.translate(-camera,0);
    for(const p of level.platforms)this.platform(p,t);
    this.text('THE FLOATING GARDEN',65,215,11,'#558c87');this.text('Every adventure starts with a leap.',65,241,17,'#37766e');
    this.text('PIP',89,player.x<130?376:390,10,'#427d72','center');
    this.text('Mind the gap  ↗',553,402,12,'#427d72');
    level.seeds.forEach((s,i)=>this.seed(s,t,i));level.enemies.forEach(e=>this.enemy(e,t));this.goal(level.goal,t,game.state==='won');this.player(player,t);
    for(const p of particles){c.globalAlpha=Math.max(0,p.life/p.maxLife);this.rounded(p.x,p.y,p.size,p.size,2,p.color);}c.globalAlpha=1;c.restore();
    // A quiet progress trail follows the journey along the bottom of the sky.
    this.rounded(398,518,164,3,2,'#ffffff65');this.rounded(398,518,164*Math.min(1,player.x/level.goal.x),3,2,'#387e6c');
  }
};
