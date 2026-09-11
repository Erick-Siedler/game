import {BALANCE as B,PLANTS,ZOMBIES,METRICS} from './data.js';
import {PLANT_LEVELS,applyEffects} from './plantUpgrades.js';
import {UPGRADES,affects,chooseUpgrades} from './roguelikeUpgrades.js';

export class Game {
 constructor(meta,onWave=()=>{},onEnd=()=>{},rng=Math.random){this.meta=meta;this.onWave=onWave;this.onEnd=onEnd;this.rng=rng;this.reset()}
 reset(){
  this.runMastery={...this.meta.plantMastery};this.state='intermission';this.wave=0;this.sun=B.startSun+this.meta.economy*10;this.food=0;
  this.maxHp=B.baseHp*(1+this.meta.fortress*.05);this.hp=this.maxHp;this.plants=[];this.zombies=[];this.shots=[];this.effects=[];this.sunDrops=[];
  this.levels=Object.fromEntries(PLANTS.map(p=>[p.id,1]));this.mods={costDiscount:0};this.upgrades=[];this.choices=[];
  this.kills=0;this.time=0;this.combatTime=0;this.runTime=0;this.intermissionTime=0;this.generated=0;this.placed=0;this.collected=0;
  this.metrics=Object.fromEntries(METRICS.map(k=>[k,0]));this.sunTimer=0;this.queue=0;this.spawnTimer=0;this.speed=1;this.paused=false;this.nextId=0;this.earned=0;this.plantRevision=0;
  this.countdown=B.firstIntermission;this.autoStart=this.meta.settings?.autoStart??true;
 }
 stats(plant,{permanent=false,extra=null}={}){
  const p=typeof plant==='string'?PLANTS.find(p=>p.id===plant):PLANTS.find(d=>d.id===plant.id);if(!p)throw Error('Espécie inválida');
  const s={...p,damageReduction:0,regen:0,thorns:0,extraChance:0,doubleSunChance:0,criticalChance:0,criticalMultiplier:1.75,costDiscount:0,network:0,crowdBonus:0};
  const mastery=(permanent?this.meta.plantMastery:this.runMastery)?.[p.id]||0;
  if(p.id==='sunflower')s.sunAmount*=1+mastery*.02;else if(p.id==='wallNut')s.hp*=1+mastery*.03;else s.damage*=1+mastery*(p.id==='potatoMine'?.03:.02);
  if(!permanent){for(let i=0;i<this.levels[p.id]-1;i++)applyEffects(s,PLANT_LEVELS[p.id][i].effects);for(const id of this.upgrades){const u=UPGRADES.find(u=>u.id===id);if(u&&affects(u,p))applyEffects(s,u.effects)}if(extra&&affects(extra,p))applyEffects(s,extra.effects)}
  if(s.attackInterval)s.attackInterval=Math.max(B.caps.attackInterval,s.attackInterval);if(s.productionInterval)s.productionInterval=Math.max(B.caps.productionInterval,s.productionInterval/(1+Math.min(.25,s.network*this.fieldCount(p.id))));
  if(s.armTime)s.armTime=Math.max(.75,s.armTime);if(s.splashRadius)s.splashRadius=Math.min(4,s.splashRadius);s.range=Math.min(B.caps.range,s.range);
  for(const k of ['extraChance','doubleSunChance','criticalChance'])s[k]=Math.min(B.caps.chance,s[k]);s.damageReduction=Math.min(B.caps.damageReduction,s.damageReduction);s.regen=Math.min(B.caps.regen,s.regen);s.costDiscount=Math.min(B.plantCostScaling.maxDiscount,s.costDiscount+(permanent?0:this.mods.costDiscount));
  s.dps=s.attackInterval?s.damage*((s.projectileCount||1)+s.extraChance+(s.burstEvery?1/s.burstEvery:0))*(1+s.criticalChance*(s.criticalMultiplier-1))/s.attackInterval:0;
  return s;
 }
 fieldCount(id){return this.plants.filter(p=>p.id===id&&p.hp>0).length}
 getPlantCost(id,{count=this.fieldCount(id),discount=true}={}){const p=PLANTS.find(p=>p.id===id);if(!p)return Infinity;const c=B.plantCostScaling,m=c.enabled?(p.costGrowth??c.defaultMultiplier):1;return Math.round(p.baseCost*Math.pow(m,count)*(1-(discount?this.stats(p).costDiscount:0)))}
 occupied(x,y){return this.plants.find(p=>p.x===x&&p.y===y&&p.hp>0)}
 valid(x,y){return Number.isInteger(x)&&Number.isInteger(y)&&x>0&&y>0&&x<B.cols-1&&y<B.rows-1&&!(x>=9&&x<=10&&y>=6&&y<=7)&&!this.occupied(x,y)&&!this.zombies.some(z=>z.hp>0&&Math.floor(z.x)===x&&Math.floor(z.y)===y)}
 place(id,x,y){const def=PLANTS.find(p=>p.id===id),cost=this.getPlantCost(id);if(!def||!['intermission','playing'].includes(this.state)||this.paused||!this.valid(x,y)||this.sun<cost)return false;this.sun-=cost;const s=this.stats(def);this.plants.push({...def,x,y,hp:s.hp,maxHp:s.hp,timer:0,productionTimer:0,age:0,attacks:0,uid:++this.nextId});this.placed++;this.metrics.plantsPlaced++;this.plantRevision++;return true}
 startWave(){if(this.state!=='intermission'||this.paused)return false;this.wave++;this.state='playing';this.queue=B.waves.baseCount+Math.floor((this.wave-1)*B.waves.countGrowth);this.spawnTimer=0;return true}
 spawn(){const r=this.rng(),bucket=this.wave>=5?Math.min(.35,.03+(this.wave-5)*.02):0,cone=this.wave>=3?Math.min(.35,.1+(this.wave-3)*.025):0;const tier=r<bucket?2:r<bucket+cone?1:0,d=ZOMBIES[tier],side=this.wave<=2?0:this.wave<=4?Math.floor(this.rng()*2)*2:Math.floor(this.rng()*4);let x=.5+Math.floor(this.rng()*B.cols),y=.5+Math.floor(this.rng()*B.rows);if(side===0){y=.15;if(this.wave<=2)x=7+this.rng()*6};if(side===1)x=B.cols-.15;if(side===2)y=B.rows-.15;if(side===3)x=.15;const n=this.wave-1,hp=d.hp*Math.pow(B.waves.hpGrowth,n);this.zombies.push({...d,x,y,tier,hp,maxHp:hp,speed:d.speed*Math.min(B.waves.speedCap,1+n*B.waves.speedGrowth),damage:d.damage*Math.pow(B.waves.damageGrowth,n),cool:0,uid:++this.nextId,flash:0})}
 damage(z,amount,critical=false){if(z.hp<=0)return;this.metrics.damageDealt+=Math.min(z.hp,amount);z.hp-=amount;z.flash=.12;if(critical)this.effect(z.x,z.y,'#f5b42d',.7,.5,'CRIT');if(z.hp<=0){this.kills++;this.effect(z.x,z.y,'#d9eaac',.45,.35)}}
 effect(x,y,color,r=.5,t=.35,label=''){this.effects.push({x,y,color,r,t,max:t,label})}
 spawnSun(source,x,y,amount){const bonus=Math.pow(1.1,this.upgrades.filter(id=>id==='sunny').length),value=Math.round(amount*bonus);const drop={id:++this.nextId,x:Math.max(.5,Math.min(19.5,x)),y:Math.max(.5,Math.min(13.5,y)),amount:value,age:0,lifetime:B.sunPickupLifetime,source};this.sunDrops.push(drop);this.metrics.sunSpawned+=value;this.metrics[source==='natural'?'naturalSun':'sunflowerSun']+=value;this.generated+=value;return drop}
 collectSun(id){if(this.paused||!['playing','intermission','upgrade'].includes(this.state))return false;const i=this.sunDrops.findIndex(s=>s.id===id);if(i<0)return false;const [s]=this.sunDrops.splice(i,1);this.sun+=s.amount;this.metrics.sunCollected+=s.amount;this.effect(s.x,s.y,'#ffd338',.75,.65,'+'+s.amount);return s}
 clickMap(x,y,selected){const sun=this.sunDrops.find(s=>Math.hypot(s.x-x,s.y-y)<=B.pickupRadius);if(sun){this.collectSun(sun.id);return 'sun'}const p=this.occupied(Math.floor(x),Math.floor(y));if(p)return p;return selected&&this.place(selected,Math.floor(x),Math.floor(y))?'planted':false}
 foodCost(id){return B.plantFoodUpgradeCosts[this.levels[id]-1]??Infinity}
 syncHp(){for(const p of this.plants){const n=this.stats(p).hp;p.hp=Math.min(n,p.hp+Math.max(0,n-p.maxHp));p.maxHp=n}this.plantRevision++}
 plantFood(id){const lv=this.levels[id],cost=this.foodCost(id);if(!lv||lv>=5||this.food<cost||this.paused||!['intermission','playing'].includes(this.state))return false;this.food-=cost;this.levels[id]++;this.syncHp();return true}
 upgrade(upgrade){const u=typeof upgrade==='string'?UPGRADES.find(u=>u.id===upgrade):upgrade;if(this.state!=='upgrade'||!u||!UPGRADES.includes(u)||!this.choices.some(c=>c.id===u.id))return false;this.upgrades.push(u.id);if(u.target==='base'){if(u.id==='emergency')this.hp=Math.min(this.maxHp,this.hp+this.maxHp*.2);else{const old=this.maxHp;this.maxHp*=1.12;this.hp+=this.maxHp-old}}this.syncHp();this.state='intermission';this.countdown=B.intermission;this.choices=[];return true}
 finishWave(){this.food++;this.collected++;for(const p of this.plants){const s=this.stats(p);p.hp=Math.min(p.maxHp,p.hp+p.maxHp*s.regen)}this.state='upgrade';this.shots=[];this.choices=chooseUpgrades(this,this.rng);this.onWave(this.choices)}
 cleanupPlants(){const alive=this.plants.filter(p=>p.hp>0);if(alive.length!==this.plants.length){this.metrics.plantsLost+=this.plants.length-alive.length;this.plantRevision++}this.plants=alive}
 step(dt){
  if(!Number.isFinite(dt)||dt<=0||this.paused||!['playing','intermission'].includes(this.state))return;
  this.runTime+=dt;this.effects.forEach(e=>e.t-=dt);this.effects=this.effects.filter(e=>e.t>0);this.cleanupPlants();
  if(this.state==='intermission'){this.intermissionTime+=dt;if(this.autoStart){this.countdown=Math.max(0,this.countdown-dt);if(this.countdown<=0)this.startWave()}return}
  this.combatTime+=dt;this.time=this.combatTime;this.sunTimer+=dt;
  if(this.sunTimer>=B.naturalInterval){this.sunTimer-=B.naturalInterval;let x=1+this.rng()*18,y=1+this.rng()*12;if(x>=9&&x<=11&&y>=6&&y<=8)y=4;this.spawnSun('natural',x,y,B.naturalSun)}
  for(const s of this.sunDrops)s.age+=dt;const expired=this.sunDrops.filter(s=>s.age>=s.lifetime);this.metrics.sunMissed+=expired.reduce((n,s)=>n+s.amount,0);this.sunDrops=this.sunDrops.filter(s=>s.age<s.lifetime);
  this.spawnTimer-=dt;if(this.queue>0&&this.spawnTimer<=0){this.spawn();this.queue--;this.spawnTimer=Math.max(.5,B.waves.spawnInterval-this.wave*.015)}
  for(const p of this.plants){if(p.hp<=0)continue;const s=this.stats(p);p.age+=dt;p.timer-=dt;
   if(s.productionInterval){p.productionTimer+=dt;if(p.productionTimer>=s.productionInterval){p.productionTimer-=s.productionInterval;this.spawnSun('sunflower',p.x+.8,p.y+.25,s.sunAmount);if(this.rng()<s.doubleSunChance)this.spawnSun('sunflower',p.x+.15,p.y+.8,s.sunAmount)}continue}
   if(!s.damage)continue;const near=this.zombies.filter(z=>z.hp>0&&Math.hypot(z.x-p.x-.5,z.y-p.y-.5)<=s.range).sort((a,b)=>Math.hypot(a.x-10,a.y-7)-Math.hypot(b.x-10,b.y-7));
   if(!near.length||p.timer>0)continue;if(s.armTime){if(p.age<s.armTime)continue;for(const z of this.zombies)if(Math.hypot(z.x-p.x-.5,z.y-p.y-.5)<=s.splashRadius)this.damage(z,s.damage);p.hp=0;this.effect(p.x+.5,p.y+.5,'#ff9d39',s.splashRadius,.55);continue}
   p.attacks++;p.timer=s.attackInterval;const target=near[0],crit=this.rng()<s.criticalChance,combo=s.comboEvery&&p.attacks%s.comboEvery===0;
   const damage=s.damage*(crit?s.criticalMultiplier:1)*(1+Math.min(.32,near.length*s.crowdBonus))*(combo?s.comboMultiplier:1);
   if(p.class==='melee'){if(combo)for(const z of this.zombies){if(Math.hypot(z.x-target.x,z.y-target.y)<=s.comboRadius)this.damage(z,damage,true)}else this.damage(target,damage);this.effect(target.x,target.y,'#e9f0a2',combo?1:.4,.2,combo?'COMBO':'');continue}
   const count=s.projectileCount+(this.rng()<s.extraChance?1:0)+(s.burstEvery&&p.attacks%s.burstEvery===0?1:0);
   for(let i=0;i<count;i++)this.shots.push({x:p.x+.5,y:p.y+.5+i*.1,startX:p.x+.5,startY:p.y+.5,target,damage,splash:s.splashRadius||0,speed:s.projectileSpeed,color:p.color,life:4,critical:crit});
  }
  for(const z of this.zombies){if(z.hp<=0)continue;z.cool-=dt;z.flash=Math.max(0,z.flash-dt);let target=null,closest=.88;for(const p of this.plants){const d=Math.hypot(p.x+.5-z.x,p.y+.5-z.y);if(p.hp>0&&d<closest){closest=d;target=p}}const tx=target?target.x+.5:10,ty=target?target.y+.5:7,dist=Math.hypot(tx-z.x,ty-z.y);
   if(dist<=(target?.88:1.3)){if(z.cool<=0){z.cool=z.attackInterval||1;if(target){const s=this.stats(target);target.hp-=z.damage*(1-s.damageReduction);if(s.thorns)this.damage(z,s.thorns)}else this.hp-=z.damage}}
   else {z.x+=(tx-z.x)/dist*z.speed*dt;z.y+=(ty-z.y)/dist*z.speed*dt}
  }
  for(const s of this.shots){s.life-=dt;if(s.target.hp<=0&&!s.splash){s.life=0;continue}const dx=s.target.x-s.x,dy=s.target.y-s.y,d=Math.hypot(dx,dy),move=s.speed*dt;if(d<=move){if(s.splash){for(const z of this.zombies)if(Math.hypot(z.x-s.target.x,z.y-s.target.y)<=s.splash)this.damage(z,s.damage,s.critical);this.effect(s.target.x,s.target.y,'#b1df65',s.splash,.3)}else this.damage(s.target,s.damage,s.critical);s.life=0}else{s.x+=dx/d*move;s.y+=dy/d*move}}
  this.shots=this.shots.filter(s=>s.life>0);this.zombies=this.zombies.filter(z=>z.hp>0);this.cleanupPlants();
  if(this.hp<=0){this.hp=0;this.state='over';this.earned=this.wave*3+Math.floor(this.kills/4)+Math.floor(this.combatTime/60);this.onEnd();return}
  if(this.queue===0&&this.zombies.length===0)this.finishWave();
 }
}
