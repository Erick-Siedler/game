import assert from 'node:assert/strict';
import {Game} from '../dist/js/game.js';
import {fresh,validate,read} from '../dist/js/save.js';
import {HEROES} from '../dist/js/heroes.js';
import {updateHeroes,findHeroTarget} from '../dist/js/heroSystem.js';
const saves=new Map();globalThis.localStorage={setItem:(k,v)=>saves.set(k,v),getItem:k=>saves.get(k)};
const old=fresh();delete old.heroesUnlocked;delete old.highestCompletedWave;old.highestWave=96;
assert.deepEqual(validate(old).heroesUnlocked,['vanguard','warden','brawler']);
assert.equal(validate({...fresh(),highestWave:30}).heroesUnlocked.length,0);
const meta=fresh(),flow=[],g=new Game(meta,(_,kind)=>flow.push(kind),()=>{},()=>.5);
assert.equal(g.assignHero('vanguard','frontYard'),false);
g.checkHeroUnlocks(150);assert.equal(read().heroesUnlocked.length,5);assert.equal(g.checkHeroUnlocks(150).length,0);
const a=g.assignHero('vanguard','frontYard');assert.ok(a);assert.equal(g.assignHero('warden','frontYard'),false);
g.unlockGarden('greenhouse');g.pendingGardenIntro=null;
assert.equal(g.assignHero('vanguard','greenhouse'),false);
const medic=g.assignHero('warden','greenhouse');assert.ok(medic);assert.equal(g.plants.length,0);
g.planNextWave();g.startWave();assert.equal(g.unassignHero('vanguard'),false);assert.equal(g.assignHero('brawler','greenhouse'),false);
for(const garden of g.activeGardens){garden.spawnQueue=[];garden.queue=0;garden.zombies=[];garden.currentWavePlan={...garden.currentWavePlan,type:'normal'}}
g.globalWavePlan={type:'normal'};
g.damageHero(a,1e6);assert.equal(a.state,'downed');const x=a.x;updateHeroes(g,g.activeGarden,2);assert.equal(a.x,x);
g.finishWave();assert.equal(a.downed,false);assert.equal(a.hp,a.maxHp*.6);assert.equal(g.heroMetrics.heroDowns,1);
g.state='playing';g.loseGarden(g.gardens.greenhouse);assert.equal(medic.gardenId,null);assert.ok(g.heroRoster.warden);assert.equal(g.assignHero('warden','frontYard'),false);
g.state='intermission';g.unassignHero('vanguard');assert.ok(g.assignHero('warden','frontYard'));
for(const id of HEROES.map(h=>h.id)){
 g.state='intermission';const current=g.heroForGarden('frontYard');if(current)g.unassignHero(current.id);const h=g.assignHero(id,'frontYard');g.state='playing';
 const z=g.spawn({type:'normal'});z.x=h.x+.8;z.y=h.y;z.hp=z.maxHp=10000;h.target=z;h.targetUid=z.uid;h.abilityTimer=0;
 if(id==='warden'){h.hp=h.maxHp*.5;g.place('wallNut',Math.floor(h.x),Math.floor(h.y));const p=g.occupied(Math.floor(h.x),Math.floor(h.y));if(p)p.hp=p.maxHp*.5}
 g.withGarden(g.activeGarden,()=>updateHeroes(g,g.activeGarden,.25));
 assert.ok(h.abilityTimer>0,id+' ability');assert.equal(g.ascensionProgress.peashooterHits,0);
 g.updateGardenCombat(g.activeGarden,.2,.2);assert.ok(Number.isFinite(h.hp));g.activeGarden.zombies=[];g.activeGarden.shots=[];g.activeGarden.zones=[];
}
const completed=fresh(),milestones=[],m=new Game(completed,(_,kind)=>milestones.push(kind));m.wave=29;m.startWave();
assert.equal(completed.heroesUnlocked.length,0);for(const garden of m.activeGardens){garden.spawnQueue=[];garden.zombies=[]}m.finishWave();
assert.equal(completed.heroesUnlocked.length,1);assert.equal(read().heroesUnlocked.length,1);assert.notEqual(m.state,'heroUnlock');
if(m.state==='evolution')m.selectEvolution(m.choices[0].id);else if(m.state==='relic')m.selectRelic(m.choices[0].id);else if(m.state==='bossReward')m.upgrade(m.choices[0].id);
assert.equal(m.state,'heroUnlock');m.continueHeroUnlock();assert.equal(m.state,'gardenIntro');m.continueGardenIntro();assert.equal(m.state,'intermission');assert.ok(m.assignHero('vanguard','greenhouse'));
// An offscreen Hero acquires a local target, fires, and cannot lock an enemy in another Garden.
m.activeGardenId='frontYard';m.startWave();
const offscreen=m.gardens.greenhouse,offHero=m.heroForGarden('greenhouse');
m.withGarden(offscreen,()=>{const z=m.spawn({type:'normal'});z.x=offHero.x+2;z.y=offHero.y;z.hp=z.maxHp=10000});
m.step(.25);assert.ok(offHero.target);assert.equal(offHero.target.gardenId,'greenhouse');assert.ok(offHero.metrics.damage>0);assert.equal(m.activeGardenId,'frontYard');
const pausedTimer=offHero.abilityTimer;m.paused=true;m.step(1);assert.equal(offHero.abilityTimer,pausedTimer);
const targetGarden=m.gardens.frontYard,base=targetGarden.mapDefinition.basePosition;
targetGarden.zombies=[{uid:1,id:'normal',x:base.centerX+.5,y:base.centerY,hp:100},{uid:2,bossId:'crusher',x:base.centerX+3,y:base.centerY,hp:100}];
const probe={id:'brawler',x:base.centerX+1,y:base.centerY,homeX:base.centerX+1,homeY:base.centerY};
assert.equal(findHeroTarget(probe,targetGarden).uid,1);probe.id='sentinel';assert.equal(findHeroTarget(probe,targetGarden).uid,2);
console.log('Hero sanity: save migration, uniqueness, combat lock, abilities, down/revive/rescue, milestone flow OK');
