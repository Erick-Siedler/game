const frontYard={id:'frontYard',name:'FRONT YARD',cols:20,rows:14,tileSize:40,visualTheme:'yard',basePosition:{x:9,y:6,w:2,h:2,centerX:10,centerY:7},sectors:{
 center:{id:'center',name:'Central Garden',terrain:'none',tiles:{x1:2,y1:2,x2:17,y2:11},spawnEdge:'north'},
 north:{id:'north',name:'North Garden',terrain:'sunny',tiles:{x1:1,y1:1,x2:18,y2:1},spawnEdge:'north'},
 east:{id:'east',name:'East Garden',terrain:'high',tiles:{x1:18,y1:2,x2:18,y2:12},spawnEdge:'east'},
 south:{id:'south',name:'South Garden',terrain:'fortified',tiles:{x1:1,y1:12,x2:17,y2:12},spawnEdge:'south'},
 west:{id:'west',name:'West Garden',terrain:'fertile',tiles:{x1:1,y1:2,x2:1,y2:11},spawnEdge:'west'}},activeSectors:['center'],spawnEdges:['north']};

const greenhouse={id:'greenhouse',name:'GREENHOUSE',cols:20,rows:14,tileSize:40,visualTheme:'greenhouse',basePosition:{x:2,y:6,w:2,h:2,centerX:3,centerY:7},sectors:{
 center:{id:'center',name:'Glasshouse Floor',terrain:'fertile',tiles:{x1:2,y1:3,x2:15,y2:10},spawnEdge:'east'},
 north:{id:'north',name:'Misting Gallery',terrain:'sunny',tiles:{x1:4,y1:2,x2:17,y2:2},spawnEdge:'north'},
 east:{id:'east',name:'Propagation Wing',terrain:'fertile',tiles:{x1:16,y1:3,x2:18,y2:10},spawnEdge:'east'},
 south:{id:'south',name:'Drainage Beds',terrain:'fortified',tiles:{x1:4,y1:11,x2:17,y2:12},spawnEdge:'south'},
 west:{id:'west',name:'Service Walk',terrain:'high',tiles:{x1:1,y1:3,x2:1,y2:10},spawnEdge:'west'}},activeSectors:['center'],spawnEdges:['east','south']};

const rooftop={id:'rooftop',name:'ROOFTOP',cols:20,rows:14,tileSize:40,visualTheme:'rooftop',basePosition:{x:9,y:10,w:2,h:2,centerX:10,centerY:11},sectors:{
 center:{id:'center',name:'Roof Deck',terrain:'high',tiles:{x1:3,y1:3,x2:16,y2:12},spawnEdge:'north'},
 north:{id:'north',name:'Vent Row',terrain:'high',tiles:{x1:2,y1:2,x2:17,y2:2},spawnEdge:'north'},
 east:{id:'east',name:'East Ledge',terrain:'sunny',tiles:{x1:17,y1:3,x2:18,y2:11},spawnEdge:'east'},
 south:{id:'south',name:'Water Tanks',terrain:'fortified',tiles:{x1:2,y1:13,x2:17,y2:13},spawnEdge:'south'},
 west:{id:'west',name:'Potting Line',terrain:'fertile',tiles:{x1:1,y1:3,x2:2,y2:11},spawnEdge:'west'}},activeSectors:['center'],spawnEdges:['north','east']};

const backyard={id:'backyard',name:'BACKYARD',cols:20,rows:14,tileSize:40,visualTheme:'backyard',basePosition:{x:15,y:6,w:2,h:2,centerX:16,centerY:7},sectors:{
 center:{id:'center',name:'Old Garden',terrain:'none',tiles:{x1:4,y1:2,x2:17,y2:11},spawnEdge:'west'},
 north:{id:'north',name:'Orchard Edge',terrain:'sunny',tiles:{x1:2,y1:1,x2:17,y2:1},spawnEdge:'north'},
 east:{id:'east',name:'Tool Shed',terrain:'fortified',tiles:{x1:18,y1:2,x2:18,y2:11},spawnEdge:'east'},
 south:{id:'south',name:'Compost Walk',terrain:'fertile',tiles:{x1:2,y1:12,x2:17,y2:12},spawnEdge:'south'},
 west:{id:'west',name:'Wild Border',terrain:'high',tiles:{x1:1,y1:2,x2:3,y2:11},spawnEdge:'west'}},activeSectors:['center'],spawnEdges:['west','north']};

export const GARDEN_MAPS={frontYard,greenhouse,rooftop,backyard};
// Compatibility alias for systems that still deliberately describe the original map.
export const MAP=GARDEN_MAPS.frontYard;
export const TERRAIN={none:{name:'Terra comum',description:'Sem modificadores.'},sunny:{name:'Sunny Patch',description:'Sunflowers produzem 10% mais rápido.'},high:{name:'High Ground',description:'Artilharia recebe +1 de alcance.'},fortified:{name:'Fortified Soil',description:'Plantas defensivas recebem +15% HP.'},fertile:{name:'Fertile Soil',description:'Primeira planta no setor custa 15% menos.'}};

export function mapDefinition(context=MAP){return context?.definition||context?.mapDefinition||context?.map?.definition||context||MAP}
export function createMapState(definition=MAP){const def=mapDefinition(definition);return {definition:def,activeSectors:new Set(def.activeSectors),spawnEdges:[...def.spawnEdges],unlockFlash:0,lastUnlocked:null}}
export function isBaseTile(context,x,y){if(arguments.length===2){y=x;x=context;context=MAP}const b=mapDefinition(context).basePosition;return x>=b.x&&x<b.x+b.w&&y>=b.y&&y<b.y+b.h}
export function sectorAt(context,x,y){if(arguments.length===2){y=x;x=context;context=MAP}const def=mapDefinition(context);return Object.values(def.sectors).find(s=>x>=s.tiles.x1&&x<=s.tiles.x2&&y>=s.tiles.y1&&y<=s.tiles.y2)||null}
export function isTileInsideActiveMap(state,x,y){const s=sectorAt(state,x,y);return !!s&&state.activeSectors.has(s.id)}
export function isTilePlantable(state,x,y){return Number.isInteger(x)&&Number.isInteger(y)&&isTileInsideActiveMap(state,x,y)&&!isBaseTile(state,x,y)}
export function lockedSectors(state){const def=mapDefinition(state);return Object.values(def.sectors).filter(s=>s.id!=='center'&&!state.activeSectors.has(s.id))}
export function unlockSector(state,id){const def=mapDefinition(state),s=def.sectors[id];if(!s||id==='center'||state.activeSectors.has(id))return false;state.activeSectors.add(id);if(!state.spawnEdges.includes(s.spawnEdge))state.spawnEdges.push(s.spawnEdge);state.lastUnlocked=id;state.unlockFlash=1.2;return s}
export function getActiveSpawnEdges(state){return [...state.spawnEdges]}
export function gridToScreen(x,y,camera={x:0,y:0,scale:1},context=MAP){const def=mapDefinition(context);return {x:(x*def.tileSize-camera.x)*camera.scale,y:(y*def.tileSize-camera.y)*camera.scale}}
export function screenToGrid(x,y,camera={x:0,y:0,scale:1},context=MAP){const def=mapDefinition(context);return {x:Math.floor(x/camera.scale/def.tileSize+camera.x/def.tileSize),y:Math.floor(y/camera.scale/def.tileSize+camera.y/def.tileSize)}}
export function worldToScreen(x,y,camera={x:0,y:0,scale:1},context=MAP){const def=mapDefinition(context);return {x:(x*def.tileSize-camera.x)*camera.scale,y:(y*def.tileSize-camera.y)*camera.scale}}
export function screenToWorld(x,y,camera={x:0,y:0,scale:1},context=MAP){const def=mapDefinition(context);return {x:x/camera.scale/def.tileSize+camera.x/def.tileSize,y:y/camera.scale/def.tileSize+camera.y/def.tileSize}}
export function tileCount(sector){return (sector.tiles.x2-sector.tiles.x1+1)*(sector.tiles.y2-sector.tiles.y1+1)}
