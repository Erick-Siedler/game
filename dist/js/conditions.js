export const GARDEN_CONDITIONS={
 drought:{id:'drought',name:'DROUGHT',summary:'Menos Sun natural, fogo mais intenso.',effects:{naturalSunMultiplier:.7,fireDurationMultiplier:1.15,fireDamageMultiplier:1.15},lines:['−30% Natural Sun','+15% duração e dano de fogo']},
 fertile:{id:'fertile',name:'FERTILE SEASON',summary:'Economia floresce junto com a pressão.',effects:{sunflowerProductionMultiplier:1.15,threatBudgetMultiplier:1.1},lines:['+15% produção de Sunflower','+10% Threat Budget']},
 nightfall:{id:'nightfall',name:'NIGHTFALL',summary:'Pouca luz, maior alcance e mais Elites.',effects:{naturalSunMultiplier:.75,eliteChanceBonus:.08,shooterRangeBonus:.5},lines:['−25% Natural Sun','+0,5 alcance de Shooters','Mais chance de Elites']},
 heavyRain:{id:'heavyRain',name:'HEAVY RAIN',summary:'Chuva enfraquece fogo e favorece controle.',effects:{fireDurationMultiplier:.75,slowDurationMultiplier:1.28,sprinterSpeedMultiplier:.9},lines:['+28% duração de Slow','−10% velocidade de Sprinters','−25% duração de fogo']},
 strongWinds:{id:'strongWinds',name:'STRONG WINDS',summary:'Projéteis voam, mas Sprinters chegam mais.',effects:{projectileSpeedMultiplier:1.2,sprinterFrequencyMultiplier:1.22},lines:['+20% velocidade de projéteis','+22% frequência de Sprinters']},
 infestedSoil:{id:'infestedSoil',name:'INFESTED SOIL',summary:'Solo hostil acelera minas e ameaças tóxicas.',effects:{volatileFrequencyMultiplier:1.3,toxicFrequencyMultiplier:1.2,mineArmTimeMultiplier:.8},lines:['−20% tempo para armar Potato Mine','Mais Volatiles e ameaças tóxicas']},
 overgrowth:{id:'overgrowth',name:'OVERGROWTH',summary:'Sementes retornam cedo; a invasão também cresce.',effects:{seedCooldownMultiplier:.9,threatBudgetMultiplier:1.15},lines:['−10% seed cooldown','+15% Threat Budget']},
 humidAir:{id:'humidAir',name:'HUMID AIR',summary:'Umidade fortalece cura e lentidão, mas apaga fogo.',effects:{sporeHealMultiplier:1.1,slowDurationMultiplier:1.2,fireDurationMultiplier:.8},lines:['+20% duração de Slow','+10% cura de Sporekeeper','−20% duração de fogo']}
};
export function conditionFor(garden){return typeof garden?.condition==='string'?GARDEN_CONDITIONS[garden.condition]:garden?.condition||null}
export function getGardenConditionModifier(garden,key,fallback=1){const value=conditionFor(garden)?.effects?.[key];return Number.isFinite(value)?value:fallback}
export function getGardenConditionBonus(garden,key){return getGardenConditionModifier(garden,key,0)}
export function assignGardenCondition(definition,rng=Math.random){const pool=definition.conditionPool||[];const id=definition.defaultCondition||pool[Math.floor(rng()*pool.length)]||null;return GARDEN_CONDITIONS[id]||null}
