import {heroById} from '../heroes.js';
export function drawHero(c,h,x,y,time){const d=heroById(h.id),moving=Math.hypot(h.velocityX||0,h.velocityY||0)>.05,bob=h.downed?0:Math.sin(time*(moving?12:3)+h.uid)* (moving?2:1);c.save();c.translate(x,y);c.fillStyle='#14262955';c.beginPath();c.ellipse(0,15,20,7,0,0,Math.PI*2);c.fill();if(h.downed){c.rotate(-.9);c.globalAlpha=.5}else c.translate(0,bob);c.scale(h.facing||1,1);c.rotate(moving?.08*(h.velocityX>0?1:-1):0);c.fillStyle=d.visual.color;c.strokeStyle='#20382d';c.lineWidth=2;
 const ellipse=(x,y,rx,ry,color)=>{c.fillStyle=color;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill();c.stroke()};
 for(const sign of [-1,1])ellipse(sign*10,13+Math.sin(time*12+sign)*(moving?3:0),9,4,d.visual.color);
 ellipse(0,-4,h.id==='brawler'?19:13,h.id==='sentinel'?20:16,h.hitCue>0?'#ffffff':d.visual.color);
 c.fillStyle=d.visual.accent;
 if(h.id==='vanguard'){c.fillRect(-15,-15,28,6);ellipse(15,-6,10,5,d.visual.accent)}
 if(h.id==='warden')for(let i=0;i<7;i++){const a=i*Math.PI*2/7;ellipse(Math.cos(a)*15,-13+Math.sin(a)*15,5,8,d.visual.accent)}
 if(h.id==='brawler')for(let i=-1;i<=1;i++){c.beginPath();c.moveTo(i*12-5,-16);c.lineTo(i*12,-29);c.lineTo(i*12+5,-16);c.fill();c.stroke()}
 if(h.id==='sentinel'){c.fillRect(6,-9,28,3);c.beginPath();c.moveTo(-12,-18);c.lineTo(-4,-33);c.lineTo(4,-18);c.fill()}
 if(h.id==='controller'){for(const sign of [-1,1]){c.beginPath();c.moveTo(sign*8,-14);c.quadraticCurveTo(sign*32,-39,sign*15,-28);c.lineTo(sign*8,-14);c.fill();c.stroke()}ellipse(17,0,6,6,d.visual.accent)}
 c.fillStyle='#172e2a';c.fillRect(2,-12,3,4);c.fillRect(9,-12,3,4);if(h.attackCue>0){c.strokeStyle=d.visual.accent;c.lineWidth=3;c.beginPath();c.arc(23,-5,7,-.8,.8);c.stroke()}c.restore();
 c.save();c.translate(x,y);if(h.abilityCue>0){c.strokeStyle=d.visual.color;c.globalAlpha=h.abilityCue;c.lineWidth=3;c.beginPath();c.arc(0,0,25+(1-h.abilityCue)*22,0,Math.PI*2);c.stroke()}c.fillStyle='#172e2a';c.fillRect(-20,25,40,4);c.fillStyle=h.downed?'#d37b80':d.visual.color;c.fillRect(-20,25,40*Math.max(0,h.hp/h.maxHp),4);c.fillStyle='#f0ffe8';c.font='bold 9px system-ui';c.textAlign='center';c.fillText(h.downed?'DOWNED':'◆',0,h.downed?40:-38);c.restore()}
const portraits=new Map();
export function heroImage(id){if(portraits.has(id))return portraits.get(id);const c=document.createElement('canvas');c.width=100;c.height=100;drawHero(c.getContext('2d'),{id,uid:1,hp:1,maxHp:1,facing:1},50,55,0);const image=c.toDataURL();portraits.set(id,image);return image}
