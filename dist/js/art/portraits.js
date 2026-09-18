import {drawPlant} from './plants.js';
import {drawBoss} from './bosses.js';
import {drawZombie} from './zombies.js';
import {P} from './palette.js';
import {oval,leaf,line,star} from './shapes.js';
const cache=new Map();
export function drawPlantPortrait(c,id,width=160,height=144,evolution=''){c.save();c.translate(width/2,height*.55);const scale=Math.min(width/78,height/74);c.scale(scale,scale);oval(c,0,-3,31,31,P.light,false);leaf(c,-28,20,12,-.7,P.leaf);leaf(c,29,21,11,.8,P.green);drawPlant(c,id,0,1,1,1.3,{evolution,level:1,armed:true});if(evolution){star(c,27,-26,5,P.evolution,.2);if(evolution==='piercingPeas'||evolution==='splitPeas'||evolution==='sniperPea'){line(c,[[-24,31],[25,31]],P.dark,1.5);for(let i=0;i<3;i++)oval(c,-10+i*13,31,3,3,P.green)}if(evolution==='napalmSoil')for(const x of [-21,20])leaf(c,x,26,7,0,P.fire)}c.restore()}
export function plantImage(id,evolution=''){const key=id+':'+evolution;if(cache.has(key))return cache.get(key);const c=document.createElement('canvas');c.width=192;c.height=172;drawPlantPortrait(c.getContext('2d'),id,c.width,c.height,evolution);const url=c.toDataURL();cache.set(key,url);return url}
export function bossImage(id='crusher'){const key='boss:'+id;if(cache.has(key))return cache.get(key);const c=document.createElement('canvas');c.width=120;c.height=120;const ctx=c.getContext('2d');ctx.translate(60,69);ctx.scale(1.1,1.1);drawBoss(ctx,{bossId:id,uid:0,hp:1,maxHp:1,chargeState:'moving'},0,0,0,{moving:false});const url=c.toDataURL();cache.set(key,url);return url}
export function enemyImage(enemy){const z=typeof enemy==='string'?{id:enemy,name:enemy,hp:1,maxHp:1}:enemy,key='enemy:'+z.id;if(cache.has(key))return cache.get(key);const c=document.createElement('canvas');c.width=112;c.height=112;const ctx=c.getContext('2d');ctx.translate(56,68);ctx.scale(z.id==='brute'?.95:1.18,z.id==='brute'?.95:1.18);drawZombie(ctx,{...z,uid:0,hp:z.hp||1,maxHp:z.hp||1},0,0,0,{moving:false});const url=c.toDataURL();cache.set(key,url);return url}
