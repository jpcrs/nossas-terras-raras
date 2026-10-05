# Registro de verificação — 05/10/2026

## Fontes e escolhas

- USGS MCS 2026, versão 1.3, 27/05/2026. A revisão altera a reserva brasileira de ETR de 21 para 11 milhões de toneladas de REO. Reservas, recursos, produção e minério são categorias distintas. Valores de produção são estimativas de 2025.
- SGB Panorama 2026, p. 9, figura 4.1: cobertura até 2025 de aproximadamente 50% em 1:250.000 e 28% em 1:100.000. Substitui o balanço até 2023 do PlanGeo (49% e 27%). Escudos pré-cambrianos têm denominador diferente e não representam a Amazônia.
- IEA Rare Earth Elements: cesta de ETR magnéticas de 2024, distinta da cesta USGS. 60% mineração, 91% refino, 94% ímãs sinterizados. Atualização IEA de julho de 2026 para refino em 2025: 85%, exibida separadamente.
- IBGE: malhas estaduais e municipais. Localizadores são centros das caixas geográficas municipais, não coordenadas dos depósitos. Poços de Caldas agrupa três fichas; seletor permite abrir todas.
- SGB Panorama 2026 sustenta as referências a províncias minerais. Dados nacionais continuam na mesma edição USGS para preservar comparabilidade; o Panorama usa estatísticas de outros anos.
- Projetos: fontes diretas dos operadores, com data em cada ficha. Colossus distingue recurso histórico de 2025 e reserva atual; Pitinga e Morro do Ferro usam referência geológica CETEM 2013 e não afirmam operação comercial atual de ETR.
- Homerun: relatório de abril de 2026 registra recurso de sílica de abril de 2025. Pureza de SiO2 não é pureza de silício eletrônico. Recursos de projeto não são reserva nacional.

## Critérios

Ausência de valor individualizado, informação W e zero permanecem distintos. Percentuais são calculados apenas com denominadores conhecidos. Indicadores nacionais de urânio não foram harmonizados e são identificados como indisponíveis. Recursos ou teores não transcritos são explicitamente assinalados; nenhuma estimativa é inventada.

Tecnologias são esquemas qualitativos: NMC/LFP e motores com/sem ímãs alteram materiais; Dy, Tb e Nb não são universais. Crescimento de valor é ilustrativo, sem multiplicadores econômicos.

## Validação

Verificações automatizadas em `scripts/check.mjs`: estrutura dos dados, cardinalidade, fontes, nulos/zeros, versão USGS, base JSON e geometrias. Revisão no navegador: mapas, filtros, modal, escalas, indicadores, seletores tecnológicos, matriz, exportações e responsividade. Sem erros de console durante os fluxos testados.
