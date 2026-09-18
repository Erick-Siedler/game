import {GARDEN_MAPS,createMapState} from './map.js';
import {assignGardenCondition} from './conditions.js';
export const GARDENS={
 frontYard:{id:'frontYard',name:'FRONT YARD',unlockWave:0,isMain:true,mapId:'frontYard',conditionPool:['drought','fertile','overgrowth','nightfall'],defaultCondition:'fertile'},
 greenhouse:{id:'greenhouse',name:'GREENHOUSE',unlockWave:30,isMain:false,mapId:'greenhouse',conditionPool:['humidAir','infestedSoil','overgrowth','fertile'],defaultCondition:'humidAir'},
 rooftop:{id:'rooftop',name:'ROOFTOP',unlockWave:60,isMain:false,mapId:'rooftop',conditionPool:['strongWinds','drought','nightfall','heavyRain'],defaultCondition:'strongWinds'},
 backyard:{id:'backyard',name:'BACKYARD',unlockWave:90,isMain:false,mapId:'backyard',conditionPool:['overgrowth','infestedSoil','fertile','heavyRain'],defaultCondition:'overgrowth'}
};
export const GARDEN_ORDER=Object.keys(GARDENS);
export function gardenUnlockForWave(wave){return Object.values(GARDENS).find(g=>g.unlockWave===wave&&wave>0)||null}
export function createGardenState(definition,maxHp,rng=Math.random,excludedConditions=[]){const mapDefinition=GARDEN_MAPS[definition.mapId];return {id:definition.id,name:definition.name,isMain:definition.isMain,definition,mapDefinition,map:createMapState(mapDefinition),condition:assignGardenCondition(definition,rng,excludedConditions),hp:maxHp,maxHp,plants:[],zombies:[],shots:[],zones:[],effects:[],sunDrops:[],camera:{x:0,y:0,scale:1},active:true,lost:false,threatState:'SAFE',alertState:{level:'SAFE',lastNotified:0},sunTimer:0,queue:0,spawnQueue:[],spawnTimer:0,currentWavePlan:null,nextWavePlan:null,plantRevision:0,lastDamageAt:-99};}
