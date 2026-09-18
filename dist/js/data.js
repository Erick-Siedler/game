export const BALANCE={
 startSun:250,baseHp:1200,naturalInterval:10,naturalSun:15,sunPickupLifetime:12,pickupRadius:.65,
 firstIntermission:15,intermission:9,plantFoodUpgradeCosts:[1,2,3,4],plantCostScaling:{enabled:true,defaultMultiplier:1.2,maxDiscount:.25},
 caps:{attackInterval:.18,productionInterval:4,range:8,chance:.6,damageReduction:.5,regen:.15},
 waves:{baseBudget:5,budgetGrowth:2,chapterGrowth:3.5,hpGrowth:1.065,damageGrowth:1.035,speedGrowth:.005,speedCap:1.24,insideDelay:.7,groupDelay:2.5},
 bossEvery:10,debug:false
};
export const SUN_MAGNET=Object.freeze({
 levels:Object.freeze([
  Object.freeze({radius:0,strength:0,collectionRadius:0}),
  Object.freeze({radius:1.4,strength:4.5,collectionRadius:.28}),
  Object.freeze({radius:2.25,strength:6,collectionRadius:.32}),
  Object.freeze({radius:3.25,strength:8,collectionRadius:.36})
 ]),
 response:7,curve:.16,glovesCollectionBonus:.04
});
export const CLASSES={all:'Todas',shooter:'Atiradoras',support:'Economia',melee:'Corpo a corpo',artillery:'Artilharia',trap:'Armadilhas',defense:'Defesa'};
export const PLANTS=[
 {id:'peashooter',name:'Peashooter',class:'shooter',color:'#5bae48',baseCost:100,cooldown:2,hp:150,damage:26,attackInterval:1.05,range:4.2,projectileSpeed:9,projectileCount:1,abilityName:'Single Shot',description:'Dispara no zumbi mais próximo do jardim.',role:'Defesa versátil de médio alcance.'},
 {id:'sunflower',name:'Sunflower',class:'support',color:'#efb832',baseCost:75,cooldown:4,hp:110,damage:0,range:0,productionInterval:12,sunAmount:25,abilityName:'Solar Bloom',description:'Produz Suns coletáveis ao redor das raízes.',role:'Invista cedo e proteja sua renda.'},
 {id:'wallNut',name:'Wall-Nut',class:'defense',color:'#bc824b',baseCost:100,cooldown:7,hp:1000,damage:0,range:0,abilityName:'Living Shield',description:'Bloqueia zumbis e absorve seus ataques.',role:'Compre tempo para suas plantas ofensivas.'},
 {id:'repeater',name:'Repeater',class:'shooter',color:'#327b43',baseCost:200,cooldown:5,hp:160,damage:24,attackInterval:1,range:4.3,projectileSpeed:9,projectileCount:2,abilityName:'Double Shot',description:'Dispara duas ervilhas por ataque.',role:'Concentre dano contra inimigos resistentes.'},
 {id:'bonkChoy',name:'Bonk Choy',class:'melee',color:'#8fbe5c',baseCost:150,cooldown:4,hp:350,damage:38,attackInterval:.5,range:1.5,abilityName:'Leaf Fists',description:'Socos rápidos contra inimigos adjacentes.',role:'Defenda rotas junto de uma barreira.'},
 {id:'cabbagePult',name:'Cabbage-Pult',class:'artillery',color:'#64953e',baseCost:200,cooldown:5,hp:160,damage:60,attackInterval:2.2,range:6,projectileSpeed:6,projectileCount:1,splashRadius:1.25,abilityName:'Splash Lob',description:'Lança repolhos que causam dano em área.',role:'Posicione atrás da linha de frente contra grupos.'},
 {id:'potatoMine',name:'Potato Mine',class:'trap',color:'#b89062',baseCost:50,cooldown:7,hp:80,damage:420,range:1,armTime:5,splashRadius:1.7,abilityName:'Buried Explosive',description:'Arma em 5s e explode quando um zumbi se aproxima.',role:'Prepare antecipadamente contra ameaças pesadas.'}
];
export const ZOMBIES=[
 {id:'normal',name:'Normal',role:'horde',roleLabel:'HORDE',hp:120,speed:.56,damage:16,attackInterval:1,color:'#9cad79',threatCost:1,unlockWave:1,weight:7,ability:'Sem habilidade especial.',description:'A espinha dorsal da horda.'},
 {id:'conehead',name:'Conehead',role:'guard',roleLabel:'TOUGH',hp:300,speed:.5,damage:22,attackInterval:1,color:'#9ba66d',threatCost:2.5,unlockWave:3,weight:4.5,ability:'Proteção leve.',description:'Resiste mais que um invasor comum.'},
 {id:'buckethead',name:'Buckethead',role:'guard',roleLabel:'ARMORED',hp:650,speed:.43,damage:28,attackInterval:1,color:'#819b81',threatCost:5,unlockWave:5,weight:2.5,ability:'Proteção pesada.',description:'Avança devagar atrás de um balde resistente.'},
 {id:'sprinter',name:'Sprinter',role:'fast',roleLabel:'FAST',hp:155,speed:1.08,damage:18,attackInterval:.72,color:'#b5bd72',threatCost:1.75,unlockWave:4,weight:3.4,groupCap:6,ability:'Corrida veloz.',description:'Chega ao jardim antes do restante da horda.'},
 {id:'brute',name:'Brute',role:'heavy',roleLabel:'HEAVY',hp:1150,speed:.29,damage:58,attackInterval:1.55,color:'#71836b',threatCost:8,unlockWave:8,weight:1.15,groupCap:1,armorFlat:10,minDamageRatio:.12,ability:'Armadura improvisada.',description:'Reduz hits pequenos, mas ataques pesados atravessam sua defesa.'},
 {id:'sporekeeper',name:'Sporekeeper',role:'support',roleLabel:'SUPPORT',hp:420,speed:.42,damage:14,attackInterval:1.25,color:'#78976b',threatCost:4.5,unlockWave:11,weight:1.25,groupCap:1,healRadius:2.6,healInterval:4.5,healPercent:.06,healCap:90,ability:'Pulso de esporos.',description:'Cura aliados próximos e deve ser eliminado cedo.'},
 {id:'volatile',name:'Volatile',role:'volatile',roleLabel:'EXPLODES',hp:260,speed:.53,damage:19,attackInterval:1.05,color:'#91a84f',threatCost:4,unlockWave:12,weight:1.5,groupCap:2,deathRadius:1.3,deathDamage:120,ability:'Explosão tóxica.',description:'Ao morrer, fere plantas agrupadas ao redor.'}
];
export const ELITE_MODIFIERS={
 hasty:{id:'hasty',name:'Hasty',label:'HASTY',threatMultiplier:1.4,description:'+35% de movimento e trilhas de vento.'},
 armored:{id:'armored',name:'Armored',label:'ARMORED',threatMultiplier:1.5,description:'Placas reduzem cada hit sem criar imunidade.'},
 regenerating:{id:'regenerating',name:'Regenerating',label:'REGEN',threatMultiplier:1.45,description:'Recupera 1,5% HP/s após 3s sem receber dano.'},
 frenzied:{id:'frenzied',name:'Frenzied',label:'FRENZIED',threatMultiplier:1.4,description:'+30% de velocidade de ataque.'},
 toxic:{id:'toxic',name:'Toxic',label:'TOXIC',threatMultiplier:1.5,description:'Deixa uma pequena zona tóxica ao morrer.'}
};
export const METRICS=['sunSpawned','sunCollected','sunMissed','sunflowerSun','naturalSun','plantsPlaced','plantsLost','damageDealt','bossesDefeated','highestBossWave','sunsAutoCollected','sectorsExpanded','evolutionsChosen'];
export {UPGRADES} from './roguelikeUpgrades.js';
