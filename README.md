# Garden / Last Stand

## Multi-Garden Expansion + Garden Conditions

A run continua sendo uma única instância de `Game`, mas agora contém `GardenState`s locais. `frontYard`, `greenhouse`, `rooftop` e `backyard` têm mapa, base/HP, câmera, plantas, zombies, projéteis, zonas, efeitos, pickups de Sun, Condition e alerta próprios. Sun, Plant Food, seed cooldowns, níveis, Evolutions, upgrades, mastery, wave e progressão de bosses permanecem globais.

O Front Yard começa ativo. Greenhouse, Rooftop e Backyard são liberados após as waves 30, 60 e 90. Todas as áreas ativas são simuladas a cada tick, inclusive fora da tela; apenas o Garden selecionado é renderizado e aceita cursor, placement, Shovel, Gloves e Sun Magnet. Um Garden secundário destruído fica perdido até o fim da run, enquanto a queda do Front Yard encerra a run.

`dist/js/gardens.js` centraliza definitions, ordem, `unlockWave`, flag principal, pool de Conditions e a factory de estado. `dist/js/conditions.js` registra Conditions e expõe uma API única de modifiers. `dist/js/map.js` contém `GARDEN_MAPS`, mantendo `MAP` como alias compatível do Front Yard. Conditions são sorteadas pelo RNG da run a partir do pool de cada Garden, persistem durante a run e se acumulam com terrain local usando caps existentes.

O WavePlan global contém `gardenPlans`. O threat original recebe apenas +30% por Garden adicional, depois é repartido com limites controlados; as três primeiras waves após um unlock fazem onboarding gradual. Cada front sorteia tema e composição próprios. Em boss waves, um único Garden recebe o boss e os demais continuam sob pressão reduzida.

## Arte procedural e animação

A apresentação Canvas 2D fica em `dist/js/art/`: `palette.js` centraliza cores; `shapes.js` fornece formas, folhas, rostos e sombras; `animation.js` fornece easing, spring, pulse, blink e squash/stretch. `plants.js`, `zombies.js`, `bosses.js`, `projectiles.js`, `effects.js` e `environment.js` desenham as entidades e o cenário. `portraits.js` reutiliza a identidade visual em portraits próprios, cacheados para packets, Almanac, Evolutions e boss HUD.

`visualState.js` observa UIDs, HP, contadores de ataques, produção e projéteis sem escrever na simulação. Guarda snapshots de morte independentes, relógio cosmético, pulsos de animação e links de impacto; reutiliza o EventBus para nascimento, coleta, Evolution e expansão. Partículas têm limite de 280; snapshots de morte, 60; voos de coleta, 18. Terreno e portraits usam cache. Tremor afeta somente o mundo e respeita preferência por movimento reduzido. A ordenação por Y mantém a perspectiva 3/4.

Para adicionar arte, estenda o dispatch de `drawPlant` ou `drawZombie`/`drawBoss`; IDs desconhecidos usam fallback. Projéteis são desenhados em `drawProjectile` a partir dos campos já existentes, com metadados cosméticos opcionais. Cues de Evolution usam o ID de `selectedEvolutions` e também aparecem em `plantImage(plantId, evolutionId)`. Novos efeitos de gameplay existentes podem ser mapeados em `effectFamily` sem alterar dano ou timing.

Esta etapa de polimento foi implementada sem executar testes, QA, navegador, playtest ou benchmarks, conforme solicitado. A validação visual e funcional fica para uma etapa posterior.

Tower defense/RTS roguelike top-down em HTML, CSS e JavaScript modular, sem dependências de runtime nem assets oficiais. A run é dividida em capítulos de 10 waves: o jogador desenvolve uma build, enfrenta um boss e escolhe uma Evolution. A cada 30 waves, a expansão macro libera um novo Garden; expansões de setor continuam como crescimento local nos demais bosses.

## Executar e testar

Sirva `dist/` por HTTP (módulos ES não funcionam via `file://`):

```bash
python -m http.server 8000 --directory dist
```

Abra `http://localhost:8000`. Execute `npm test` para os testes de regressão e sistemas; `npm run test:balance` executa o jogador simulado de balanceamento. Para expor os controles de QA sem alterar o build, use `?debug=1`.

## Controles e UX

- `1–7`: seleciona uma espécie; clique num tile ativo e livre para plantar.
- `X` ou botão `PÁ`: remove a planta. Na preparação devolve 25% do custo efetivamente pago; durante a wave não há refund.
- Clique num Sun para coletar. `Q`/`E` alternam entre Gardens ativos, `Espaço` pausa, `Esc` cancela a seleção e o botão `1×` alterna 1×/2×/3×.
- Cada seed packet mostra custo progressivo, hotkey, quantidade, Plant Food em pips e overlay de cooldown próprio.
- A intermission mostra a composição, threat budget, grupos e entradas exatas do `WavePlan`; a wave 9 também avisa que o boss vem em seguida.

## Mapa, setores e terreno

`dist/js/map.js` é o registry de tamanho, tile, base, setores, terreno, spawn edges e conversões de coordenadas para cada Garden. Os helpers `worldToScreen`, `screenToWorld`, `gridToScreen`, `screenToGrid`, `isTileInsideActiveMap`, `isTilePlantable` e `getActiveSpawnEdges` recebem o map/state relevante e mantêm compatibilidade com o Front Yard.

O setor central de cada Garden começa ativo. Nos bosses que não são marcos de 30 waves, o jogador ainda pode liberar North, East, South ou West dentro do Garden atual. O espaço adicional sempre traz uma contrapartida: habilita ou reforça a rota correspondente. Os terrenos iniciais são:

- Sunny Patch: Sunflowers produzem 10% mais rápido.
- High Ground: artilharia recebe +1 de alcance.
- Fortified Soil: plantas de defesa recebem +15% HP.
- Fertile Soil: a primeira planta no setor custa 15% menos.

Setores bloqueados usam uma leitura visual própria e não aceitam placement. A IA continua usando movimento direto e obstáculos locais; não há A* recalculado por frame.

## WavePlan, threat budget e grupos

`dist/js/waves.js` gera toda a wave antes do início. `createMultiGardenWavePlan` produz um plano global com `gardenPlans`; cada plano local contém `gardenId`, `waveNumber`, `type`, tema opcional, composição, Elites, `spawnEdges`, `spawnGroups`, `threatBudget` e `spentThreat`. Normal, Sprinter, Conehead, Volatile, Sporekeeper, Buckethead e Brute custam progressivamente mais ameaça. `waveCap` limita a composição total e `groupCap` distribui ameaças especiais entre os grupos.

Os inimigos são distribuídos em grupos. Cada grupo possui atraso curto entre membros e uma pausa maior antes do próximo, evitando a fila contínua das waves altas. A UI consulta o mesmo objeto consumido pelo spawn — não há preview inventado.

## Boss waves

Toda wave múltipla de 10 é `type: "boss"`. `BOSSES` é um registro de definições com stats, habilidade, escala e configuração. A rotação começa com Crusher na 10, Collector na 20 e Foreman na 30; os três possuem comportamento completo.

The Crusher tem silhueta e barra próprias, escala por ciclo de boss e usa uma máquina de estados para `moving → telegraph → charging`. O telegraph dura 1,8s e desenha a trajetória antes da investida. A charge acerta a primeira planta no caminho, valorizando frontlines e Wall-Nuts sem torná-los obrigatórios. Eventos `boss:spawn`, `boss:telegraph` e `boss:defeated` permitem áudio futuro.

The Collector puxa fisicamente pickups reais de Sun e pode perder a disputa para o cursor/Sun Magnet; ao roubar, ganha bônus limitados e devolve 60% do valor na morte. Seus telegraphs e os reforços do Foreman usam tempo real em qualquer velocidade. O Sporekeeper prioriza e cura no máximo quatro aliados por pulso.

Derrotar um boss concede bônus de Plant Food, Seeds ao fim da run e +1 reroll. Enquanto houver espécies elegíveis, segue uma Evolution; depois que toda a build estiver evoluída, aparece um draft especial de Boss Reward priorizando upgrades Rare/Epic. Waves 30/60/90 liberam um novo Garden após qualquer uma dessas recompensas e oferecem uma preparação manual de 25s; os demais bosses mantêm a micro-expansão por setor.

## Evolutions

`dist/js/evolutions.js` define três caminhos por espécie. A escolha usa uma tela especial e é mutuamente exclusiva por planta na run. Os efeitos implementados incluem piercing/split/sniper, Gatling/focused fire/crossfire, Solar Bank/Golden/Healing Bloom, knockback/berserker/sweep, fragmentation/slow/siege, cluster/remote/napalm e taunt/thorns/regeneration.

Evolutions alteram comportamento: projéteis perfuram ou dividem, Suns podem valorizar no chão, impactos deixam zonas, minas criam cargas e formações passam a importar. A seção `Possible Evolutions` do Almanac explica os caminhos.

## Upgrades, reroll e sinergias

O draft prioriza duas opções ligadas às espécies/classes presentes e reserva um wildcard para economia, base ou pivô. Tags como `projectile`, `area`, `economy` e `adjacency` criam um bias suave de identidade de build. Raros e épicos priorizam chance, combos ou comportamento; o sistema ainda mantém comuns numéricos como sustentação.

Bosses concedem reroll. O botão `REROLL (n)` substitui as três opções respeitando caps, unicidade e relevância.

Há infraestrutura de vizinhança (`adjacentPlants`, `nearbyPlantTypes`, `distance`) e três sinergias completas:

- Bodyguard: Bonk Choy ao lado de Wall-Nut recebe +20% de velocidade.
- Garden Aura: Sunflower cura lentamente plantas adjacentes.
- Crossfire: Shooters adjacentes recebem +10% de velocidade.

O resumo da run separa Evolutions, Rare/Epic, sinergias, comuns e níveis de Plant Food. Drafts de upgrade e Evolution consideram plantas vivas em todos os Gardens ativos. O Progressive Cost também usa a quantidade viva global da espécie, enquanto adjacency, Solar Network, terrain e demais sinergias espaciais continuam locais. Strong Foundation afeta os fronts atuais e seus stacks são herdados por Gardens desbloqueados depois.

## Economia, cooldowns e Garden Tools

O custo por espécie continua sendo `round(baseCost × 1.20^quantidade)`, com descontos limitados a 25%. Todas as superfícies usam `getPlantCost`. Remover ou perder uma planta atualiza a contagem imediatamente.

Cada espécie tem cooldown de seed packet (2–7s), usa tempo de simulação e congela na pausa. A vida dos Suns usa tempo real compensado pela velocidade, dando aproximadamente o mesmo intervalo de clique em 1×, 2× e 3×.

O save v3 adiciona Garden Tools:

- Gardening Gloves amplia a hitbox e depois coleta vizinhos próximos.
- Sun Basket acrescenta 3s de vida por nível.
- Sun Magnet cria um campo local no cursor: Suns próximos reagem, aceleram até o mouse e então usam a animação de coleta até o HUD.
- Seed Satchel concede rerolls no início da run.

## Mastery e save

Os bônus percentuais modestos permanecem e agora cada espécie tem milestones 5/10: desconto inicial, chance extra, maior duração/valor de Sun, heavy punch antecipado, primeiro splash/explosão reforçado e recuperação/HP da primeira Wall-Nut. O Almanac mostra todos os marcos.

`dist/js/save.js` usa schema v3 e mantém migrações v1→v2→v3. O `localStorage` guarda metaprogressão, Garden Tools, masteries, estatísticas, bosses e favoritos; dados específicos da run não persistem. Export/import TXT passa pelo mesmo validador.

As estatísticas incluem bosses derrotados, maior boss wave, Suns coletados pelo Magnet (na chave compatível `sunsAutoCollected`), setores, Evolutions e favoritos. Game Over mostra bosses, setores e acesso ao build final.

## Eventos e debug

O `EventBus` enxuto desacopla hooks para `wave:start`, `wave:end`, `boss:spawn`, `boss:telegraph`, `boss:defeated`, `bossReward:selected`, `plant:placed`, `plant:removed`, `sun:collected`, `upgrade:selected`, `evolution:selected`, `sector:unlocked`, `garden:unlocked`, `garden:conditionAssigned`, `garden:switched`, `garden:alert`, `garden:underPressure`, `garden:lost` e `run:end`.

Com `BALANCE.debug = true` ou `?debug=1`, o painel oferece Spawn/Jump Boss, Wave 10/20/30/60/80/90, esgotar Evolutions, unlock/switch/loss de Greenhouse, dano da base atual, troca de Condition, reroll, setor, Evolution, Sun, Plant Food e reset da wave para QA rápido.

## Arquivos principais

- `dist/js/data.js`: plantas, inimigos, caps e balanceamento.
- `dist/js/map.js`: mapa, setores, terreno e coordenadas.
- `dist/js/waves.js`: planos, orçamento, grupos e bosses.
- `dist/js/evolutions.js`: caminhos comportamentais.
- `dist/js/roguelikeUpgrades.js`: pool, tags e draft.
- `dist/js/game.js`: simulação, combate, economia e estados da run.
- `dist/js/render.js`: Canvas, setores, entidades e telegraphs.
- `dist/js/main.js`: UI, input, modais, Almanac e metaprogressão.
- `tests/smoke.js` e `tests/systems.js`: regressão e sistemas integrados.
