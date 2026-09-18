const requirementByPlant={peashooter:{key:'peashooterHits',amount:300,label:'300 hits'},repeater:{key:'repeaterAttacks',amount:300,label:'300 attacks'},sunflower:{key:'sunflowerSun',amount:500,label:'500 Sun produced'},bonkChoy:{key:'bonkHits',amount:180,label:'180 melee hits'},cabbagePult:{key:'cabbageSplashHits',amount:150,label:'150 splash hits'},potatoMine:{key:'potatoExplosions',amount:25,label:'25 explosions'},wallNut:{key:'wallNutDamage',amount:1800,label:'1.800 damage tanked'}};
const asc=(id,plant,evolution,name,description,detail,effects)=>({id,plant,evolution,name,description,detail,requirement:requirementByPlant[plant],effects});

export const ASCENSIONS=[
 asc('ricochetStem','peashooter','piercingPeas','RICOCHET STEM','A última perfuração ricocheteia uma vez.','Após atravessar os alvos, busca um inimigo próximo e causa 50% do dano.',{ricochet:true}),
 asc('branchingShot','peashooter','splitPeas','BRANCHING SHOT','Cada split espalha um impacto menor.','Split shots acertam mais um alvo próximo por 20% do dano, sem recursão.',{branching:true}),
 asc('deadlineShot','peashooter','sniperPea','DEADLINE SHOT','O limite do alcance vira zona crítica.','Alvos nos últimos 20% do alcance recebem +25% dano e um cue crítico.',{deadline:true}),
 asc('bulletStorm','repeater','gatlingBurst','BULLET STORM','A rajada Gatling salta para alvos próximos.','Cada Gatling atinge até dois inimigos adicionais por 35% do dano.',{bulletStorm:true}),
 asc('targetLock','repeater','focusedFire','TARGET LOCK','Focused Fire não perde toda a leitura ao trocar de alvo.','Stacks são preservados e decaem gradualmente, um por segundo.',{targetLock:true}),
 asc('tacticalGrid','repeater','crossfireEvolution','TACTICAL GRID','Shooters em lados opostos fecham uma linha de fogo.','Dois Shooters adjacentes em lados diferentes concedem +12% velocidade adicional.',{tacticalGrid:true}),
 asc('compoundInterest','sunflower','solarBank','COMPOUND INTEREST','Solar Bank continua rendendo depois do cap inicial.','Após +20 Sun, ganha +2 a cada 5s até um cap total de +30.',{compoundInterest:true}),
 asc('sunshower','sunflower','goldenBloomEvolution','SUNSHOWER','Golden Bloom pode prolongar a chuva solar.','Cada proc possui 35% de chance de gerar um terceiro Sun com metade do valor.',{sunshower:true}),
 asc('rootNetwork','sunflower','healingBloom','ROOT NETWORK','Healing Bloom alcança uma segunda camada de raízes.','Além das adjacentes, cura a planta ferida mais próxima em 4%.',{rootNetwork:true}),
 asc('heavyweight','bonkChoy','knockout','HEAVYWEIGHT','O golpe pesado interrompe o avanço.','Knockout também aplica um stun curto de 0,45s.',{heavyweight:true}),
 asc('lastRound','bonkChoy','berserker','LAST ROUND','HP crítico transforma cada golpe em espaço.','Abaixo de 25% HP, golpes empurram levemente o alvo.',{lastRound:true}),
 asc('cycloneCombo','bonkChoy','sweepingStrikes','CYCLONE COMBO','Sweeps acumulados liberam um ataque circular.','A cada quinto ataque, atinge até seis inimigos em raio maior.',{cyclone:true}),
 asc('shrapnelStorm','cabbagePult','fragmentation','SHRAPNEL STORM','Fragmentos se quebram uma última vez.','Cada fragment acerta mais um alvo próximo por 18% do dano, com cap estrito.',{shrapnel:true}),
 asc('mudField','cabbagePult','areaControl','MUD FIELD','A multidão faz a zona de controle se espalhar.','Slow zones crescem gradualmente quando contêm três ou mais inimigos, até +50% de raio.',{mudField:true}),
 asc('demolitionRound','cabbagePult','siegeCabbage','DEMOLITION ROUND','Munição de cerco prioriza alvos pesados.','Siege hits causam +35% contra Brutes, Bosses e Elites Armored.',{demolition:true}),
 asc('chainReaction','potatoMine','clusterMine','CHAIN REACTION','Cargas secundárias acordam suas vizinhas.','Uma carga secundária antecipa a detonação das próximas, sem ativar Potato Mines.',{chainReaction:true}),
 asc('tacticalCharge','potatoMine','remoteDetonation','TACTICAL CHARGE','Uma mina mantida armada recompensa paciência.','Detonação manual após 3s armada recebe +30% dano e +20% raio.',{tacticalCharge:true}),
 asc('scorchedEarth','potatoMine','napalmSoil','SCORCHED EARTH','Cada inimigo consumido alimenta o incêndio.','Mortes dentro do Napalm aumentam seu raio em 0,12, até +50%.',{scorchedEarth:true}),
 asc('guardianCall','wallNut','tauntingNut','GUARDIAN CALL','Um grande impacto intensifica o chamado defensivo.','Receber 20% do HP em um hit aumenta temporariamente o raio de Taunt.',{guardianCall:true}),
 asc('brambleWall','wallNut','thornyShell','BRAMBLE WALL','Espinhos espalham parte da retaliação.','25% do dano refletido atinge até três inimigos próximos.',{brambleWall:true}),
 asc('livingBark','wallNut','regenerativeShell','LIVING BARK','Retomar a regeneração endurece a casca.','Ao ficar segura por 3s, ganha 20% damage reduction durante 2s.',{livingBark:true})
];

export const ASCENSION_PROGRESS_KEYS=[...new Set(Object.values(requirementByPlant).map(r=>r.key))];
export function ascensionFor(game,plant){const id=game.selectedAscensions?.[typeof plant==='string'?plant:plant.id];return ASCENSIONS.find(a=>a.id===id)||null}
export function availableAscensions(game){return ASCENSIONS.filter(a=>game.selectedEvolutions?.[a.plant]===a.evolution&&game.levels?.[a.plant]>=5&&!game.selectedAscensions?.[a.plant]&&(game.ascensionProgress?.[a.requirement.key]||0)>=a.requirement.amount)}
export function chooseAscensions(game,rng=Math.random,count=3){let pool=availableAscensions(game),out=[];while(pool.length&&out.length<count){const weights=pool.map(a=>1+Math.min(2,(game.plantUsage?.[a.plant]||0)/20)),total=weights.reduce((x,y)=>x+y,0);let roll=rng()*total,index=pool.length-1;for(let i=0;i<pool.length;i++){roll-=weights[i];if(roll<0){index=i;break}}const chosen=pool[index];out.push(chosen);pool=pool.filter(a=>a.id!==chosen.id)}return out}
