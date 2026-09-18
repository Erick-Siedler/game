const relic=(id,name,description,detail,rarity='relic',effects={},tags=[])=>({id,name,description,detail,rarity,tags,maxStacks:1,effects});

export const BOSS_RELICS=[
 relic('solarCore','SOLAR CORE','Suns grandes podem condensar um segundo pickup.','Suns coletados de 25+ têm 20% de chance de criar 7 Sun. O pickup secundário não pode repetir o efeito.','relic',{minimumSun:25,procChance:.2,secondarySun:7},['sun','economy']),
 relic('emergencyIrrigation','EMERGENCY IRRIGATION','Uma base em crise desperta todo o Garden.','Na primeira queda abaixo de 30% HP em cada Garden, suas plantas regeneram 2% do HP máximo por segundo durante 8s.','relic',{threshold:.3,regenPerSecond:.02,duration:8},['garden','healing']),
 relic('sharedRoots','SHARED ROOTS','A cura atravessa os caminhos entre Gardens.','20% da cura efetiva aplicada a plantas é redistribuída entre plantas feridas de outros Gardens ativos.','greater',{sharedHealing:.2},['garden','healing']),
 relic('overclockedSeeds','OVERCLOCKED SEEDS','Sementes voltam cedo, mas repetir espécies custa mais.','Seed cooldown global −20%. O crescimento do Progressive Cost aumenta em 0,04.','greater',{seedCooldownMultiplier:.8,costGrowthBonus:.04},['cooldown','economy']),
 relic('goldenCompost','GOLDEN COMPOST','A primeira cópia de cada espécie floresce acima das demais.','A primeira planta de cada espécie em cada Garden ganha +20% HP e +10% dano/produção. Cópias elevam o crescimento de custo em 0,02.','greater',{firstHpMultiplier:1.2,firstOutputMultiplier:1.1,costGrowthBonus:.02},['garden','plants']),
 relic('fortressNetwork','FORTRESS NETWORK','Os fronts secundários recebem a força da base principal.','Gardens secundários ganham +25% HP de base; Front Yard perde 10%. Alterações preservam a proporção de HP.','greater',{secondaryBaseHpMultiplier:1.25,mainBaseHpMultiplier:.9},['garden','base']),
 relic('huntersMark','HUNTER’S MARK','A build caça ameaças prioritárias.','Bosses e Elites recebem +18% dano. Invasores sem Elite nascem com +8% HP.','relic',{specialDamageMultiplier:1.18,normalHpMultiplier:1.08},['combat','boss']),
 relic('sunReservoir','SUN RESERVOIR','Parte da luz perdida retorna à reserva global.','Quando um Sun expira, 30% do valor é convertido diretamente em Sun global.','relic',{expiredSunConversion:.3},['sun','garden']),
 relic('crossGardenRoots','CROSS-GARDEN ROOTS','Cada novo território fortalece a economia floral.','Sunflowers produzem 6% mais rápido por Garden ativo adicional.','relic',{productionPerExtraGarden:.06},['sun','garden']),
 relic('lastBastion','LAST BASTION','Uma frente perdida alimenta a resistência das restantes.','Cada Garden secundário perdido enquanto equipado concede +10% dano, produção e HP de base aos Gardens restantes.','greater',{bonusPerLostGarden:.1},['garden','combat']),
 relic('supplyLines','SUPPLY LINES','Coletar Sun acelera o reabastecimento de toda a run.','Cada pickup coletado reduz em 0,2s todos os seed cooldowns ativos.','relic',{cooldownReduction:.2},['sun','cooldown'])
];

export const RELIC_RARITIES={relic:{label:'BOSS RELIC'},greater:{label:'GREATER RELIC'}};
export function relicById(id){return BOSS_RELICS.find(r=>r.id===id)||null}
export function chooseRelics(game,rng=Math.random,count=3,exclude=[]){let pool=BOSS_RELICS.filter(r=>!exclude.includes(r.id)&&(game.relics||[]).filter(id=>id===r.id).length<r.maxStacks),out=[];while(pool.length&&out.length<count){const weights=pool.map(r=>(r.rarity==='greater'?1.2:1)*(r.tags.some(t=>(game.relics||[]).some(id=>relicById(id)?.tags.includes(t)))?1.15:1)),total=weights.reduce((a,b)=>a+b,0);let roll=rng()*total,index=pool.length-1;for(let i=0;i<pool.length;i++){roll-=weights[i];if(roll<0){index=i;break}}out.push(pool[index]);pool.splice(index,1)}return out}
export function getRelicModifier(game,key,fallback=1){for(const id of game.relics||[]){const value=relicById(id)?.effects?.[key];if(Number.isFinite(value))return value}return fallback}
