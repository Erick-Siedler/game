# Garden / Last Stand

Protótipo de survival tower defense top-down. HTML, CSS e JavaScript modular, sem dependências externas ou assets oficiais.

## Executar
Sirva `dist/` com um servidor HTTP local, por exemplo `python -m http.server 8000 --directory dist`, e abra localhost:8000. Módulos ES precisam de HTTP, não file://.

## Controles
1–7 selecionam uma espécie. Clique num tile interior livre para plantar; clique numa planta para inspecionar. Espaço pausa; Esc cancela seleção; botão 1× alterna 1×/2×/3×. Inicie cada wave manualmente. Zumbis avançam ao jardim e atacam plantas próximas que bloqueiam seu caminho. A borda não aceita plantas.

## Progressão
Escolha um bônus ao terminar cada wave e receba Plant Food. Evoluir uma espécie afeta plantas existentes e futuras apenas na run atual. Ao perder, receba Seeds para três melhorias permanentes. O save no localStorage guarda metaprogressão, não a run ativa. Exporte/import TXT pelo menu; importe apenas saves versão 1. Reset é confirmado e só é recuperável com export prévio.

O custo de cada espécie cresce 20% por cópia viva no campo: `round(baseCost × 1.20^quantidade)`. A contagem é independente por espécie e cai assim que uma planta morre ou uma Potato Mine explode. A função central `getPlantCost(plantId)` aplica o scaling e depois descontos, limitados a 25%. Cards, tooltips, Almanac e placement usam essa mesma função.

## Arquitetura e balanceamento
`dist/js/data.js`: espécies, inimigos, bônus e parâmetros. `game.js`: simulação de passo fixo e combate. `render.js`: Canvas. `save.js`: validação e persistência. `main.js`: interface e estados.

Em data.js, altere `BALANCE.plantCostScaling.defaultMultiplier` para balancear o crescimento global. Uma planta pode futuramente sobrescrever a curva com `costGrowth`. Altere `BALANCE.debug` para true para expor gardenDebug no console, com sun(), food(), kill(), next(), damage() e seeds(). Desativado por padrão. Execute `npm test` para testes de lógica.

## Limitações do protótipo
Gráficos geométricos; artilharia simplificada, sem arco visual. IA direta com ataque a obstáculos, sem A*. Sem áudio. Balanceamento inicial ainda precisa de playtest humano. WebMCP read_garden_run é opcional; indisponibilidade não afeta gameplay.
