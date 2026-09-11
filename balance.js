import {Game} from '../dist/js/game.js';import {fresh} from '../dist/js/save.js';import {PLANTS} from '../dist/js/data.js';
// Deterministic simulated player: collects Suns, buys a diverse garden, uses upgrades.
const runs=[];
for(let seed=1;seed<=5;seed++){
 let state=seed;const rng=()=>{state=(state*1664525+1013904223)>>>0;return state/4294967296};
 const g=new Game(fresh(),()=>{},()=>{},rng);g.autoStart=false;
 g.place('peashooter',8,5);g.place('sunflower',8,8);g.place('potatoMine',10,4);
 const spots=[[11,5],[9,4],[11,7],[8,6],[9,9],[12,6],[7,7],[10,3],[6,6],[12,8],[8,4],[11,9],[7,5],[12,4]];
 const ids=['peashooter','wallNut','repeater','cabbagePult','bonkChoy','sunflower','potatoMine'];let budgetTick=0;
 for(let i=0;i<60*1800&&g.state!=='over'&&g.wave<20;i++){
  if(g.state==='upgrade'){const chosen=g.choices.find(u=>['global','peashooter','cabbagePult'].includes(u.target))||g.choices[0];g.upgrade(chosen);for(const p of PLANTS)if(g.fieldCount(p.id))g.plantFood(p.id)}
  if(g.state==='intermission')g.startWave();
  for(const s of [...g.sunDrops])g.collectSun(s.id);
  if(budgetTick++%60===0){const desired=g.fieldCount('peashooter')<2?'peashooter':g.fieldCount('sunflower')<2?'sunflower':ids.slice().sort((a,b)=>g.fieldCount(a)-g.fieldCount(b))[0];if(g.sun>=g.getPlantCost(desired)){const spot=spots.find(([x,y])=>g.valid(x,y));if(spot)g.place(desired,...spot)}}
  g.step(1/60);
 }
 runs.push({seed,wave:g.wave,combatSeconds:Math.round(g.combatTime),hp:Math.round(g.hp),kills:g.kills,sunCollected:g.metrics.sunCollected,plants:g.placed});
}
console.log(JSON.stringify(runs,null,2));
