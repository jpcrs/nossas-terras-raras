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

## Aplicações e elementos integrados

- Substituídas as duas interfaces independentes por um explorador único: oito vistas vetoriais, peças selecionáveis e os 17 elementos conectados às aplicações. As relações reutilizam as descrições e fontes do catálogo original; não representam receitas universais ou fornecimento comprovado dos projetos brasileiros.
- Elementos abrem uma aplicação compatível; peças destacam os elementos pertinentes. Promécio permanece sem conexão a uma cadeia mineral comum. Solar e motores sem ímãs deixam explícito quando nenhuma terra rara é indicada no exemplo.
- Preservadas as variantes de motor/gerador e NMC/LFP. O cobalto agora aparece como material selecionável na NMC e nos ímãs SmCo. As composições e variantes estão incluídas no download JSON.
- Validação: 11 cenários de integração passaram; verificados fontes, materiais conhecidos, variantes, navegação por teclado com preservação de foco e links de volta ao mapa. Inspeção no navegador em 360, 390, 768 e 1.280 px; sem overflow horizontal. A seleção por toque de um elemento traz a ilustração correspondente à tela quando ela está fora de vista. Sem erros de console nos fluxos exercitados.
- Captura da interface integrada: `research/screenshots/applications-integrated.png`.

## Comparação de minerais por seleção

- “O Brasil além das terras raras” passa a vir antes de “A riqueza está também no que vem depois”, como capítulos 04 e 05.
- Removido o seletor de indicador. As 15 células de minerais selecionam simultaneamente os gráficos de produção e reservas; a ficha completa permanece em um botão separado. Cada gráfico mantém unidade, período, escala e fonte próprios.
- Pares definidos em `mineral-comparisons.js`: séries comparativas originais e números brasileiros já publicados nas fichas (Nb, Ni, Mn, Ta e V). Não foram estimados valores para os países ausentes. Recursos de urânio não viram reservas; dados não harmonizados, não individualizados, sigilosos e zero continuam distintos. Gráficos inteiramente sem valores não exibem uma escala numérica fictícia.
- CSV exporta os dois indicadores do mineral selecionado, com valores nulos vazios, status, períodos, notas e fontes. Os pares também estão no JSON completo.
- 12 testes passaram. No navegador: troca de mineral por clique e teclado, abertura separada da ficha, ordem dos capítulos, duas visualizações, ausência do dropdown e largura de 360 px sem overflow ou rótulos SVG cortados. Nenhum erro de console. Captura: `research/screenshots/mineral-comparisons.png`.

## Aplicações: acesso direto aos materiais

- Removidos os esquemas SVG, a seleção de componentes e os controles de motor/bateria. Selecionar uma aplicação agora exibe todos os materiais do recorte, sem duplicação, com uso e explicação breve.
- A cor distingue terras raras de outros materiais na mesma grade. As descrições preservam os usos condicionais (formulação dos ímãs, NMC/LFP, polimento de vidro) sem exigir configurações.
- As células abrem as fichas e fontes existentes. Fichas de terras raras agora permitem ir diretamente aos projetos no mapa. A referência completa dos 17 elementos permanece em uma seção recolhida, independente da aplicação selecionada.
- Navegação de aplicações permanece visível durante a rolagem. No celular, o seletor permite rolagem horizontal; a grade adapta-se a três, duas ou uma coluna.
- 12 cenários automatizados passaram, cobrindo todas as aplicações, materiais sem duplicação, fichas, navegação aos projetos e demais visualizações. Inspeção no navegador em 360, 390, 768 e 1.280 px: sem overflow horizontal da página ou das células. Captura: `research/screenshots/application-materials.png`.


## Cadeia de terras raras para ímãs — revisão visual de 05/10/2026

A seção escura com matrizes de pontos foi substituída por perfis D3 sobre uma escala comum de 0 a 100%, com comparação direta de China, Estados Unidos e Brasil. As etapas podem ser selecionadas pelos botões (inclusive setas/Home/End) ou pelo gráfico. Os detalhes incluem os demais países, uma explicação breve e ressalvas de arredondamento.

Fonte primária: [IEA, Share of global supply of magnet rare earths and magnet manufacturing, 2024](https://www.iea.org/data-and-statistics/charts/share-of-global-supply-of-magnet-rare-earths-and-magnet-manufacturing-2024), consulta em 05/10/2026, CC BY 4.0. O atributo público `data-chart-csv` foi preservado sem alterações em `dist/assets/iea-magnet-supply-2024.csv`. Cesta: Nd, Pr, Dy e Tb, diferente da estatística geral do USGS. Percentuais de produção em 2024, não capacidade anunciada ou valores de 2026.

| Etapa | China | Estados Unidos | Brasil | Demais países (soma) |
|---|---:|---:|---:|---:|
| Extração | 58,9% | 9,6% | 0,6% | 30,8% |
| Separação e refino | 91,3% | 1,2% | 0,0% | 7,5% |
| Ímãs | 94,4% | 0,0% | 0,0% | 5,6% |

O gráfico original tem mais precisão que os 60%/91%/94% arredondados no texto do sumário executivo anteriormente usado. As parcelas de extração somam 99,9%; não foram normalizadas. Zeros são valores publicados na série com uma casa decimal, não dados ausentes nem afirmação de inexistência de atividade. As linhas conectam participações entre etapas, não fluxos de material ou uma série temporal. Todos os valores estão no download JSON; a verificação compara a transcrição e os agregados com o CSV preservado.

Validação: `npm test` passou com 14 cenários; `git diff --check` sem erros. No navegador, seleção pelos botões e pelo gráfico, navegação por teclado, tabela e ausência de erros de console foram conferidas. Layouts de 1280×720 e 360×800 sem transbordamento horizontal. Captura desktop em `research/screenshots/chain-comparison.png`.

### Comparação reduzida a China e Estados Unidos

A pedido do usuário, o gráfico, a legenda, o painel por etapa, a tabela e os anúncios acessíveis passam a comparar somente China e Estados Unidos. O texto introdutório e o download JSON acompanham esse recorte. A série CSV original da IEA permanece intacta com todos os países; os percentuais exibidos continuam relativos ao total mundial, sem renormalização.

### Ritmo visual e redução de texto

As seções usam uma grade vertical única com intervalos de 96 px no desktop, 80 px no tablet e 64 px no celular. Cabeçalhos e áreas de conteúdo compartilham variáveis de espaçamento. Foram removidas as linhas decorativas dos capítulos, painéis, rodapés de fonte e listas, mantendo escalas e estados ativos dos controles.

Removidos os avisos solicitados do mapa de projetos, da comparação de reservas e das aplicações, além do acordeão de revisão. A comparação mantém 21 Mt com identificação histórica e fonte preservada; o histórico de revisão segue no JSON e nas fontes. Notas genéricas de comparabilidade e transcrição parcial deixam de aparecer sob os gráficos; unidades, indicações de dados ausentes e notas específicas dos indicadores continuam disponíveis.

Verificação desta revisão: 14 testes passaram. Medição no navegador confirmou todos os seis intervalos iguais em 1280 px (96 px), 768 px (80 px) e 360 px (64 px), sem transbordamento horizontal. Alternância de produção/reservas, seleção mineral e ajuda do mapa conferidas, sem erros de console. Captura em `research/screenshots/layout-spacing.png`.

### Assimetria China–EUA: evidências complementares de 05/10/2026

O gráfico mantém a mesma série IEA de 2024, reconferida no atributo público `data-chart-csv` em 05/10/2026. O destaque calcula a razão China/EUA na extração (58,9 ÷ 9,6 = 6,1×, arredondado) e no refino (91,3 ÷ 1,2 = 76,1×). Não se calcula razão para ímãs, pois o denominador publicado é 0,0% arredondado. Cada seleção explica a implicação industrial da etapa.

As evidências seguintes ficam em painéis separados, com fonte e período próprios:

- [Governo do Canadá, cadeia de ímãs permanentes](https://www.canada.ca/en/campaign/critical-minerals-in-canada/critical-minerals-an-opportunity-for-canada/permanent-magnets.html), página de 09/01/2025: China produz 90% dos metais e 90% das ligas. O ano-base e a parcela americana não são informados; ambos são `null` no modelo. Não apresentamos o valor sugerido de “EUA <1%” sem comprovação comparável.
- [USGS, MCS 2026, tabela Rare Earths](https://pubs.usgs.gov/periodicals/mcs2026/mcs2026.pdf): estimativas de mineração de 2025 de 270.000 t para China e 51.000 t para EUA, sobre 390.000 t mundiais. Parcelas calculadas: 69,2% e 13,1%. Recorte mais amplo que Nd/Pr/Dy/Tb, em equivalente de óxidos (REO). Conferido na cópia de pesquisa existente; o leitor web retornou 403 nesta consulta. Não confundir produção nacional com produção exclusiva de Mountain Pass.
- [MP Materials, 22/01/2025](https://investors.mpmaterials.com/investor-news/news-details/2025/MP-Materials-Restores-U.S.-Rare-Earth-Magnet-Production/): início de produção comercial de metal NdPr em Independence, Texas.
- [MP Materials, resultados anuais publicados em 26/02/2026](https://investors.mpmaterials.com/investor-news/news-details/2026/MP-Materials-Reports-Fourth-Quarter-and-Full-Year-2025-Results/): 2.599 t de óxidos de NdPr em 2025 e primeiros ímãs em equipamentos comerciais no quarto trimestre. São dados declarados pela empresa, sem conversão em participação mundial ou capacidade anual efetivamente atingida.

O [relatório IEA de 2026](https://www.iea.org/reports/rare-earth-elements/executive-summary) e o [DOE, avaliação da cadeia de ímãs de 2022](https://www.energy.gov/sites/default/files/2022-02/Neodymium%20Magnets%20Supply%20Chain%20Report%20-%20Final.pdf) fundamentam a distinção entre concentração, separação, metalização, ligas e ímãs. Não aplicamos uma pureza universal de 99,99% a todos os produtos: o requisito varia por material e uso.

As novas fontes e os dados estruturados integram o download JSON. As verificações comparam os totais USGS com a série já presente no atlas e mantêm as lacunas da metalização como `null`, nunca zero.

Validação da ampliação: `npm test` passou (13 cenários), incluindo proveniência e consistência do JSON; `git diff --check` sem erros. No navegador, seleção de refino atualizou o painel, layouts de 1.280 e 360 px sem transbordamento horizontal e nenhum erro de console capturado.
