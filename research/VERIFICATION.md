# Registro de verificação — 05/10/2026

## Fontes e escolhas

- Escolha editorial atual: ETR usa a tabela histórica do USGS 2026 anterior à revisão de maio, com 21 Mt para o Brasil. Cópia intacta em `dist/assets/usgs-rare-earths-2026-before-may-revision.pdf`, verificada contra o PDF de pesquisa. Os demais indicadores usam USGS MCS 2026, versão 1.3, 27/05/2026. A revisão altera a reserva brasileira de ETR de 21 para 11 milhões de toneladas de REO. Reservas, recursos, produção e minério são categorias distintas. Valores de produção são estimativas de 2025.
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

## Redesenho interativo — 05/10/2026

- O atlas passa a usar D3 7.9 para projeção cônica conforme, recorte ao território brasileiro, zoom, escalas e gráficos. As malhas originais IBGE foram preservadas; a ordem dos anéis é normalizada em memória para a convenção esférica do D3.
- Camada vetorial consultada: `https://geoportal.sgb.gov.br/server/rest/services/sigs_especiais/mapeamento_geologico_brasil_manutencao/FeatureServer/1`. Consulta restrita a `SITUACAO = 'Publicado'`, escalas 100.000, 250.000 e 1.000.000 e `ANO_MAPA <= '2025'`. Foram retornadas 874 feições sem truncamento: 511 / 318 / 45, respectivamente. Geometrias WGS84 com cinco casas decimais, sem redesenho ou geração de áreas fictícias. Metadados e parâmetros estão no GeoJSON publicado.
- Os percentuais nacionais do Panorama 2026 permanecem independentes do inventário vetorial. O filtro temporal altera as folhas exibidas, nunca os percentuais de 2025. Folhas sobrepostas e nomes ausentes são preservados; nomes vazios recebem identificação pelo código, projeto ou registro SGB.
- Valores estruturados dos projetos em `editorial.js` são transcrições das fichas existentes, sem estimativa por elemento. Para Caldeira, 703 Mt medidos + indicados são derivados de 1.631 − 928 Mt inferidos. Araxá permanece em TREO contido e não é comparado como tonelagem de material.
- Teor em ppm é convertido para porcentagem (`ppm / 10.000`) e kg de TREO por tonelada de material (`ppm / 1.000`). A barra usa escala explicitamente ampliada de 0–1%; não representa uma taxa de recuperação.
- A comparação principal preserva a edição histórica da pesquisa original, identificada no número e na legenda. O leitor pode selecionar a revisão de maio (11 Mt), cuja proveniência consta do histórico oficial do USGS já preservado na pesquisa.
- D3, fontes e respectivas licenças são locais. O navegador não consulta serviços geográficos ao explorar o atlas; falhas nos servidores das fontes não impedem a navegação.
- Validação automatizada: integridade de fontes e unidades, geometrias e orientação, filtros de ano/escala, recursos versus óxidos, nulos versus zero; dez cenários de integração DOM cobrem as camadas, os sete registros, agrupamento, filtros combinados, estado vazio, fontes, diálogos, edições de reservas, tecnologias e os 17 indicadores. A inspeção visual e funcional usa o navegador local.
- Testes e inspeção final: os 10 cenários de integração passaram; larguras 360, 768, 1.024 e 1.440 px sem overflow horizontal ou transbordamento nas células de elementos. No navegador foram exercitados seleção por teclado, folhas e escalas, filtro de ano, agrupamento de projetos, zoom e filtros com resultado vazio. Nenhum erro de console nos fluxos exercitados.


## Ajustes de interface após revisão

- Removidos os seletores de elemento e estágio do mapa; todos os projetos ficam disponíveis para seleção direta. Escalas e filtro temporal da cobertura geológica permanecem.
- Removido o bloco “Como transformar potencial geológico em conhecimento, indústria e valor?” e seu diálogo de desafios.
- Reproduzido o retângulo ao clicar em um marcador: o navegador aplicava `outline: auto` ao grupo SVG mesmo sem `:focus-visible`. O estilo agora remove o contorno nativo em `:focus`, preservando o destaque circular de teclado em `:focus-visible`. A seleção também fecha o tooltip de hover.
- Verificados no navegador: clique em Araxá sem retângulo, Tab até Poços de Caldas com destaque circular e Enter abrindo Caldeira. O cenário de filtros de projetos foi substituído por seleção direta via ponteiro/teclado e fechamento do tooltip.
