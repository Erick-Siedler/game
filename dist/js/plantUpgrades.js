const e=(stat,value,mode='multiply')=>({stat,value,mode});
const level=(desc,...effects)=>({desc,effects});
export const PLANT_LEVELS={
 peashooter:[level('+15% de dano',e('damage',1.15)),level('+10% velocidade de ataque',e('attackInterval',1/1.1)),level('+10% alcance e dano',e('range',1.1),e('damage',1.1)),level('20% chance de ervilha extra',e('extraChance',.2,'add'))],
 repeater:[level('+10% dano',e('damage',1.1)),level('+10% velocidade de ataque',e('attackInterval',1/1.1)),level('Ervilha extra a cada 3 ataques',e('burstEvery',3,'set')),level('+15% dano e +10% alcance',e('damage',1.15),e('range',1.1))],
 sunflower:[level('+5 Sun por pickup',e('sunAmount',5,'add')),level('Intervalo de produção −10%',e('productionInterval',.9)),level('15% chance de dois Suns',e('doubleSunChance',.15,'add')),level('+10 Sun por pickup e +30% HP',e('sunAmount',10,'add'),e('hp',1.3))],
 bonkChoy:[level('+15% dano',e('damage',1.15)),level('+12% velocidade de ataque',e('attackInterval',1/1.12)),level('+0,25 alcance',e('range',.25,'add')),level('5º soco causa 2× dano em área',e('comboEvery',5,'set'),e('comboMultiplier',2,'set'),e('comboRadius',1,'set'))],
 cabbagePult:[level('+15% dano',e('damage',1.15)),level('+15% raio de impacto',e('splashRadius',1.15)),level('+10% velocidade de ataque',e('attackInterval',1/1.1)),level('20% chance de crítico de 1,75×',e('criticalChance',.2,'add'))],
 potatoMine:[level('+20% dano de explosão',e('damage',1.2)),level('Tempo para armar −25%',e('armTime',.75)),level('+20% raio de explosão',e('splashRadius',1.2)),level('+40% dano de explosão',e('damage',1.4))],
 wallNut:[level('+20% HP máximo',e('hp',1.2)),level('+15% HP máximo',e('hp',1.15)),level('Redução de dano de 10%',e('damageReduction',.1,'add')),level('Recupera 8% HP entre waves',e('regen',.08,'add'))]
};
export function applyEffects(stats,effects){for(const {stat,value,mode} of effects){if(mode==='set')stats[stat]=value;else if(mode==='add')stats[stat]=(stats[stat]||0)+value;else if(stats[stat]!==undefined)stats[stat]*=value}return stats}
