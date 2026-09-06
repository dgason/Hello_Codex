const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const noop = () => {};
const drawing = new Proxy({}, {get:(_,name)=>name==='createLinearGradient'?()=>({addColorStop:noop}):noop,set:()=>true});
const nodes = new Map();
global.window = global;
global.addEventListener = noop;
global.requestAnimationFrame = noop;
global.document = {addEventListener:noop,getElementById(id){
  if(!nodes.has(id))nodes.set(id,{width:960,height:540,getContext:()=>drawing,addEventListener:noop,setAttribute:noop,focus:noop});
  return nodes.get(id);
}};
for(const file of ['js/level.js','js/physics.js','js/renderer.js','js/game.js','tests/game-tests.js'])
  vm.runInThisContext(fs.readFileSync(path.join(__dirname,'..',file),'utf8'),{filename:file});
