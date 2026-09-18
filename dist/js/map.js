export const MAP={cols:20,rows:14,tileSize:40,basePosition:{x:9,y:6,w:2,h:2,centerX:10,centerY:7},sectors:{
 center:{id:'center',name:'Central Garden',terrain:'none',tiles:{x1:2,y1:2,x2:17,y2:11},spawnEdge:'north'},
 north:{id:'north',name:'North Garden',terrain:'sunny',tiles:{x1:1,y1:1,x2:18,y2:1},spawnEdge:'north'},
 east:{id:'east',name:'East Garden',terrain:'high',tiles:{x1:18,y1:2,x2:18,y2:12},spawnEdge:'east'},
 south:{id:'south',name:'South Garden',terrain:'fortified',tiles:{x1:1,y1:12,x2:17,y2:12},spawnEdge:'south'},
 west:{id:'west',name:'West Garden',terrain:'fertile',tiles:{x1:1,y1:2,x2:1,y2:11},spawnEdge:'west'}},activeSectors:['center'],spawnEdges:['north']};
export const TERRAIN={none:{name:'Terra comum',description:'Sem modificadores.'},sunny:{name:'Sunny Patch',description:'Sunflowers produzem 10% mais rápido.'},high:{name:'High Ground',description:'Artilharia recebe +1 de alcance.'},fortified:{name:'Fortified Soil',description:'Plantas defensivas recebem +15% HP.'},fertile:{name:'Fertile Soil',description:'Primeira planta no setor custa 15% menos.'}};
export function createMapState(){return {activeSectors:new Set(MAP.activeSectors),spawnEdges:[...MAP.spawnEdges],unlockFlash:0,lastUnlocked:null}}
export function isBaseTile(x,y){const b=MAP.basePosition;return x>=b.x&&x<b.x+b.w&&y>=b.y&&y<b.y+b.h}
export function sectorAt(x,y){return Object.values(MAP.sectors).find(s=>x>=s.tiles.x1&&x<=s.tiles.x2&&y>=s.tiles.y1&&y<=s.tiles.y2)||null}
export function isTileInsideActiveMap(state,x,y){const s=sectorAt(x,y);return !!s&&state.activeSectors.has(s.id)}
export function isTilePlantable(state,x,y){return Number.isInteger(x)&&Number.isInteger(y)&&isTileInsideActiveMap(state,x,y)&&!isBaseTile(x,y)}
export function lockedSectors(state){return Object.values(MAP.sectors).filter(s=>s.id!=='center'&&!state.activeSectors.has(s.id))}
export function unlockSector(state,id){const s=MAP.sectors[id];if(!s||id==='center'||state.activeSectors.has(id))return false;state.activeSectors.add(id);if(!state.spawnEdges.includes(s.spawnEdge))state.spawnEdges.push(s.spawnEdge);state.lastUnlocked=id;state.unlockFlash=1.2;return s}
export function getActiveSpawnEdges(state){return [...state.spawnEdges]}
export function gridToScreen(x,y,camera={x:0,y:0,scale:1}){return {x:(x*MAP.tileSize-camera.x)*camera.scale,y:(y*MAP.tileSize-camera.y)*camera.scale}}
export function screenToGrid(x,y,camera={x:0,y:0,scale:1}){return {x:Math.floor(x/camera.scale/MAP.tileSize+camera.x/MAP.tileSize),y:Math.floor(y/camera.scale/MAP.tileSize+camera.y/MAP.tileSize)}}
export function worldToScreen(x,y,camera={x:0,y:0,scale:1}){return {x:(x*MAP.tileSize-camera.x)*camera.scale,y:(y*MAP.tileSize-camera.y)*camera.scale}}
export function screenToWorld(x,y,camera={x:0,y:0,scale:1}){return {x:x/camera.scale/MAP.tileSize+camera.x/MAP.tileSize,y:y/camera.scale/MAP.tileSize+camera.y/MAP.tileSize}}
export function tileCount(sector){return (sector.tiles.x2-sector.tiles.x1+1)*(sector.tiles.y2-sector.tiles.y1+1)}
