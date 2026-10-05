# Nossas terras raras — O futuro sob nossos pés

Atlas editorial interativo em português. A experiência começa pelo território: projetos e minerais, folhas geológicas publicadas e tipos de depósito. Os detalhes e as fontes aparecem conforme a seleção, com comparações e aplicações tecnológicas em seguida.

## Executar

Requer Node.js 22 ou superior (Node.js 24 recomendado).

```sh
npm ci
npm run dev
```

Abra http://127.0.0.1:4174. `PORT=4180 npm run dev` usa outra porta. A publicação continua sendo inteiramente estática: basta servir `dist/` por HTTP. Não há backend nem etapa de build. Os dados, D3 e fontes tipográficas são locais, com as respectivas licenças. O Cloudflare Web Analytics carrega um script externo para coletar métricas de acesso.

**Trabalho local:** por preferência do proprietário, não publicar no OpenAI Sites. Alterações e prévias devem permanecer locais, salvo nova solicitação explícita de publicação.

## Explorar

- **Projetos e minerais:** sete registros em cinco referências municipais IBGE, seleção direta no mapa, zoom, fichas e fontes. Poços de Caldas reúne três registros independentes.
- **Quanto conhecemos:** 874 polígonos oficiais do inventário SGB, com escalas 1:1.000.000, 1:250.000 e 1:100.000, sempre no recorte completo até 2025. As folhas são selecionadas diretamente no mapa, por clique ou teclado, para consultar a publicação e a fonte. As geometrias ficam recortadas ao Brasil.
- **Tipos de depósito:** classificação dos projetos e seção conceitual de argilas iônicas ou sistemas de rocha/alteração.
- **Comparações:** reservas versus produção, com a estimativa histórica de 21 Mt identificada, produção e reservas lado a lado para 12 minerais com pelo menos um valor disponível, seleção pelas células e exportação conjunta em CSV. Perfis sem valores nas duas séries (cobalto, urânio e titânio) não aparecem no seletor; o catálogo completo continua disponível nas fichas de aplicações e no JSON.
- **Materiais e tecnologias:** um explorador integrado reúne 15 aplicações auditadas em `research/APPLICATIONS-AUDIT-2026.md`. Os 78 cartões mostram apenas terras raras, com fontes do uso selecionado; exemplos históricos, etapas de fabricação e pesquisa ficam identificados. As notas gerais de composição e os blocos de contagem não são exibidos; os recortes continuam registrados nos dados e na pesquisa. O seletor combina 15 pictogramas SVG originais com rótulos, em uma grade de cinco colunas no desktop e duas linhas com rolagem horizontal no celular. Mantém seleção por clique e setas/Home/End no teclado.

- **Da mina ao ímã:** perfis D3 de China e Estados Unidos na extração, no refino e na fabricação de ímãs. Seleção por clique ou teclado, escala comum de 0–100% e descrição acessível dos valores. CSV original da IEA (2024) preservado nos dados.
- **Dependência dos Estados Unidos:** capítulo 04, depois da cadeia de ímãs (03) e antes da comparação brasileira (05). Mostra a dependência líquida de importações em 2024/2025 (53%/67%), volume de compostos importados e valor de compostos e metais. A origem dos fornecedores usa o período separado 2021–2024 (China: 71%). O quadro da IEA apresenta perdas diretas potenciais superiores a US$ 1,5 trilhão/ano nos EUA sob controles integrais, sem tratá-las como perdas realizadas. Pesquisa em `research/US-IMPORT-DEPENDENCE-2026.md`.
- **Demanda por terras raras:** capítulo 06. A projeção de mercado da Adamas Intelligence compara 234 mil t de óxidos de terras raras por ano em 2024 com 607 mil t em 2040: 2,6×, +159% e mais 373 mil t anuais. Usa somente os dois pontos publicados no relatório Songwe Hill de 2026, sem interpolação ou controles de cenários da IEA. O escopo é o mercado agregado de óxidos (TREO); não se afirma uma cobertura individual dos 17 elementos. Indicadores de motores elétricos, eólicas e robótica mantêm unidades e fontes próprias.

## Estrutura

- `dist/assets/logo.svg`: monograma N em facetas minerais; acompanha o nome Nossas terras raras no cabeçalho e rodapé. `dist/assets/favicon.svg`, `dist/favicon.ico` e `dist/assets/apple-touch-icon.png` compartilham o símbolo em formatos adequados a abas e atalhos.

- `dist/index.html` e `dist/style.css`: estrutura editorial e layout responsivo. O espaçamento entre conteúdos de seções usa `--section-gap` (72/64/56 px), dividido entre a margem anterior e `--section-lead` após uma linha sutil alinhada ao conteúdo. Divisórias internas mais claras agrupam controles, notas e fontes; os rótulos dos capítulos compartilham a cor de destaque.
- `dist/navigation.js`: menu compacto até 800 px; fecha ao escolher uma seção, pressionar Escape, clicar fora ou sair com Tab.
- `dist/maps.js`: projeção D3, camadas, zoom, seleção, filtros de cobertura e inspector.
- `dist/app.js`: gráficos, minerais, diálogos e exportação.
- `dist/applications.js`, `dist/applications.css` e `dist/applications-data.js`: seleção de aplicações, lista de materiais com seus usos e referência de elementos.
- `dist/supply-chain.js`, `dist/supply-chain.css` e `dist/supply-chain-data.js`: comparação da cadeia, detalhes por etapa e valores com proveniência.
- `dist/future.js`, `dist/future.css` e `dist/future-data.js`: demanda global de óxidos e indicadores de aplicação; pontos publicados em `dist/assets/adamas-rare-earth-demand-2040.csv`.
- `dist/us-dependence.js`, `dist/us-dependence.css` e `dist/us-dependence-data.js`: importações dos EUA, origem dos fornecedores e cenário de exposição industrial; transcrição USGS em `dist/assets/us-rare-earth-imports-2026.csv`.
- `dist/data.js`: pesquisa original, fontes e unidades, preservadas.
- `dist/mineral-comparisons.js`: pares de produção/reservas por mineral, lacunas explícitas e exportação CSV. Reutiliza as séries comparativas e os valores brasileiros já presentes nas fichas.
- `dist/editorial.js`: valores estruturados de apresentação, classes de recursos e funções de filtragem.
- `dist/assets/geological-coverage.geojson`: polígonos SGB e metadados de consulta.
- `dist/data-snapshot.json`: dados completos, incluindo proveniência cartográfica e edições de reservas.
- `tests/interactions.test.mjs`: testes de integração DOM (jsdom, sem navegador externo).

## Desempenho

As 11 fontes são servidas em WOFF2 (370.064 bytes, contra 1.044.300 bytes dos TTFs originais), preservando caracteres, métricas e licenças. O CSS das fontes é carregado diretamente no HTML; apenas as duas fontes do título principal recebem preload. Os TTFs continuam como originais para reprodução: instale `fonttools[woff]` em um ambiente Python separado e execute `python scripts/compress-fonts.py`.

O mapa reutiliza caminhos projetados de estados, municípios e folhas; as medidas dos rótulos são lidas em lote antes de reposicioná-los. Tooltips mantêm o conteúdo ao mover o ponteiro sobre a mesma área. As fichas usam um fundo escurecido sem o filtro de desfoque da página inteira. `npm test` verifica o orçamento das fontes, a reutilização das geometrias e o alinhamento das áreas clicáveis.

Essas reduções de bytes e trabalho de renderização não equivalem a um resultado de Core Web Vitals em produção. Compare LCP e INP no Cloudflare após publicar, separando celular e desktop e observando o tamanho da amostra.

## Verificar e manter

```sh
npm test                # integridade dos dados + cenários de interação
npm run snapshot        # regera o download JSON após mudanças nos dados
npm run check           # unidades, filtros, projeção e proveniência
npm run vendor          # recopia o D3 e sua licença após atualizar a dependência
npm run refresh:coverage # consulta SGB e salva um candidato .geojson.next para revisão
```

A atualização das folhas é deliberada: não modifica automaticamente a edição publicada. Revise metadados, datas, contagens esperadas e diferenças antes de substituir o arquivo e regenerar o snapshot.

## Cuidados editoriais

Os pontos e as áreas municipais não são coordenadas ou perímetros de jazidas. Os polígonos SGB delimitam folhas geológicas publicadas; sobreposições, reedições e lacunas cadastrais estão preservadas. Os percentuais nacionais (28% e 50%, até 2025) vêm de outro balanço do SGB e não são recalculados pela contagem de folhas ou pelo filtro de ano.

Recursos, reservas, material total e óxidos contidos não são somados. As fichas não inventam quantidades por elemento. Teores são convertidos de ppm para porcentagem e kg por tonelada apenas para explicar a concentração química; não representam recuperação industrial. Dados ausentes, sigilosos e zero continuam distintos. Fontes corporativas mantêm datas e ressalvas. A série histórica de 21 Mt é identificada como histórica e a revisão de maio permanece documentada nas fontes e no download JSON.

Consulte `research/VERIFICATION.md` para o registro de pesquisa e validação.
