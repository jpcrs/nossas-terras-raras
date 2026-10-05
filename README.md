# Terras Raras — O futuro sob nossos pés

Atlas editorial interativo em português. A experiência começa pelo território: projetos e minerais, folhas geológicas publicadas e tipos de depósito. Os detalhes e as fontes aparecem conforme a seleção, com comparações e aplicações tecnológicas em seguida.

## Executar

Requer Node.js 22 ou superior (Node.js 24 recomendado).

```sh
npm ci
npm run dev
```

Abra http://127.0.0.1:4174. `PORT=4180 npm run dev` usa outra porta. A publicação continua sendo inteiramente estática: basta servir `dist/` por HTTP. Não há backend, chamadas a APIs em tempo de execução, dependência de CDN ou etapa de build. D3 e fontes tipográficas estão incluídos com suas licenças.

## Explorar

- **Projetos e minerais:** sete registros em cinco referências municipais IBGE, seleção direta no mapa, zoom, fichas e fontes. Poços de Caldas reúne três registros independentes.
- **Quanto conhecemos:** 874 polígonos oficiais do inventário SGB, com escalas 1:1.000.000, 1:250.000 e 1:100.000, sempre no recorte completo até 2025. As folhas são selecionadas diretamente no mapa, por clique ou teclado, para consultar a publicação e a fonte. As geometrias ficam recortadas ao Brasil.
- **Tipos de depósito:** classificação dos projetos e seção conceitual de argilas iônicas ou sistemas de rocha/alteração.
- **Comparações:** reservas versus produção, com a estimativa histórica de 21 Mt identificada, produção e reservas lado a lado para 12 minerais com pelo menos um valor disponível, seleção pelas células e exportação conjunta em CSV. Perfis sem valores nas duas séries (cobalto, urânio e titânio) não aparecem no seletor; o catálogo completo continua disponível nas fichas de aplicações e no JSON.
- **Materiais e tecnologias:** um explorador integrado conecta terras raras a sete aplicações: carro elétrico, eólica, telas e vidros, fibra óptica, lasers, ligas e usos especiais. Selecionar um item mostra todos os materiais do recorte com explicações breves de uso. As fichas mantêm fontes e links para projetos no mapa; a referência completa dos 17 elementos fica em uma seção expansível.

- **Da mina ao ímã:** perfis D3 de China e Estados Unidos na extração, no refino e na fabricação de ímãs, com a diferença de escala e as implicações de cada etapa. Seleção por clique ou teclado, escala comum de 0–100% e CSV original da IEA (2024) preservados. Painéis complementares documentam metalização e ligas (Canadá, sem ano-base), mineração no recorte USGS de 2025 e marcos industriais da MP Materials em 2025, sem misturar esses dados na série do gráfico.

## Estrutura

- `dist/index.html` e `dist/style.css`: estrutura editorial e layout responsivo. O espaçamento entre conteúdos de seções usa `--section-gap` (72/64/56 px), dividido entre a margem anterior e `--section-lead` após uma linha sutil alinhada ao conteúdo. Divisórias internas mais claras agrupam controles, notas e fontes; os rótulos dos capítulos compartilham a cor de destaque.
- `dist/maps.js`: projeção D3, camadas, zoom, seleção, filtros de cobertura e inspector.
- `dist/app.js`: gráficos, minerais, diálogos e exportação.
- `dist/applications.js`, `dist/applications.css` e `dist/applications-data.js`: seleção de aplicações, lista de materiais com seus usos e referência de elementos.
- `dist/supply-chain.js`, `dist/supply-chain.css` e `dist/supply-chain-data.js`: comparação da cadeia, detalhes por etapa e valores com proveniência.
- `dist/data.js`: pesquisa original, fontes e unidades, preservadas.
- `dist/mineral-comparisons.js`: pares de produção/reservas por mineral, lacunas explícitas e exportação CSV. Reutiliza as séries comparativas e os valores brasileiros já presentes nas fichas.
- `dist/editorial.js`: valores estruturados de apresentação, classes de recursos e funções de filtragem.
- `dist/assets/geological-coverage.geojson`: polígonos SGB e metadados de consulta.
- `dist/data-snapshot.json`: dados completos, incluindo proveniência cartográfica e edições de reservas.
- `tests/interactions.test.mjs`: testes de integração DOM (jsdom, sem navegador externo).

## Verificar e manter

```sh
npm test                # integridade dos dados + 14 cenários de interação
npm run snapshot        # regera o download JSON após mudanças nos dados
npm run check           # unidades, filtros, projeção e proveniência
npm run vendor          # recopia o D3 e sua licença após atualizar a dependência
npm run refresh:coverage # consulta SGB e salva um candidato .geojson.next para revisão
```

A atualização das folhas é deliberada: não modifica automaticamente a edição publicada. Revise metadados, datas, contagens esperadas e diferenças antes de substituir o arquivo e regenerar o snapshot.

## Cuidados editoriais

Os pontos e as áreas municipais não são coordenadas ou perímetros de jazidas. Os polígonos SGB delimitam folhas geológicas publicadas; sobreposições, reedições e lacunas cadastrais estão preservadas. Os percentuais nacionais (28% e 50%, até 2025) vêm de outro balanço do SGB e não são recalculados pela contagem de folhas ou pelo filtro de ano.

Recursos, reservas, material total e óxidos contidos não são somados. As fichas não inventam quantidades por elemento. Teores são convertidos de ppm para porcentagem e kg por tonelada apenas para explicar a concentração química; não representam recuperação industrial. Dados ausentes, sigilosos e zero continuam distintos. Fontes corporativas mantêm datas e ressalvas. A série histórica de 21 Mt é identificada como histórica e a revisão de maio permanece documentada nas fontes e no download JSON.

Consulte `research/VERIFICATION.md` para o registro de pesquisa e validação. `.openai/hosting.json` mantém `dist` como diretório estático; as alterações locais não publicam automaticamente uma nova versão do site.
