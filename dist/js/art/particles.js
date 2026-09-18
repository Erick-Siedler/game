import {P} from './palette.js';
import {leaf,oval,star} from './shapes.js';
import {seed} from './animation.js';
export class Particles{
 constructor(){this.items=[];this.serial=0;this.cap=280}
 burst(x,y,type='leaf',count=8,color=null,power=1){for(let i=0;i<count&&this.items.length<this.cap;i++){const n=++this.serial,a=seed(n)*Math.PI*2,speed=(15+seed(n+5)*38)*power;this.items.push({x,y,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed-20,life:.45+seed(n+2)*.5,max:1,size:2+seed(n+3)*4,rotation:a,spin:(seed(n+7)-.5)*6,type,color:color||(type==='dirt'?P.dirt:type==='smoke'?P.cream:type==='spark'?P.sun:type==='ember'?P.fire:P.green)});this.items.at(-1).max=this.items.at(-1).life}}
 step(dt){let n=0;for(const p of this.items){p.life-=dt;if(p.life<=0)continue;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=(p.type==='smoke'||p.type==='ember'?-12:55)*dt;p.rotation+=p.spin*dt;this.items[n++]=p}this.items.length=n}
 draw(c){c.save();for(const p of this.items){c.globalAlpha=Math.min(1,p.life/p.max*2)*(p.type==='smoke'?.35:.85);if(p.type==='leaf')leaf(c,p.x,p.y,p.size,p.rotation,p.color);else if(p.type==='spark'||p.type==='sun')star(c,p.x,p.y,p.size,p.color,p.rotation);else oval(c,p.x,p.y,p.size,p.type==='smoke'?p.size:p.size*.65,p.color,false)}c.restore()}
}
