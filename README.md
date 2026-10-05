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
- **Quanto conhecemos:** 874 polígonos oficiais do inventário SGB, com escalas 1:1.000.000, 1:250.000 e 1:100.000, ano de publicação e consulta de cada folha. As geometrias ficam recortadas ao Brasil.
- **Tipos de depósito:** classificação dos projetos e seção conceitual de argilas iônicas ou sistemas de rocha/alteração.
- **Comparações:** reservas versus produção, escolha explícita entre a estimativa histórica de 21 Mt e a revisão de 11 Mt, produção e reservas lado a lado para os 15 perfis de minerais, com seleção pelas células e exportação conjunta em CSV.
- **Materiais e tecnologias:** um explorador integrado conecta 17 terras raras a oito vistas ilustradas: carro elétrico, eólica, telas e vidros, fibra óptica, lasers, ligas, usos especiais e solar. Elementos abrem aplicações; peças destacam seus materiais. Motor e química de bateria alteram a composição. As fichas mantêm a conexão com os projetos no mapa.

## Estrutura

- `dist/index.html` e `dist/style.css`: estrutura editorial e layout responsivo.
- `dist/maps.js`: projeção D3, camadas, zoom, seleção, filtros de cobertura e inspector.
- `dist/app.js`: gráficos, minerais, diálogos e exportação.
- `dist/applications.js`, `dist/applications.css` e `dist/applications-data.js`: seleção integrada de aplicações, componentes, elementos e projetos; composições qualitativas e variantes.
- `dist/data.js`: pesquisa original, fontes e unidades, preservadas.
- `dist/mineral-comparisons.js`: pares de produção/reservas por mineral, lacunas explícitas e exportação CSV. Reutiliza as séries comparativas e os valores brasileiros já presentes nas fichas.
- `dist/editorial.js`: valores estruturados de apresentação, classes de recursos e funções de filtragem.
- `dist/diagrams.js`: ilustrações vetoriais originais com componentes selecionáveis por ponteiro ou teclado.
- `dist/assets/geological-coverage.geojson`: polígonos SGB e metadados de consulta.
- `dist/data-snapshot.json`: dados completos, incluindo proveniência cartográfica e edições de reservas.
- `tests/interactions.test.mjs`: testes de integração DOM (jsdom, sem navegador externo).

## Verificar e manter

```sh
npm test                # integridade dos dados + 12 cenários de interação
npm run snapshot        # regera o download JSON após mudanças nos dados
npm run check           # unidades, filtros, projeção e proveniência
npm run vendor          # recopia o D3 e sua licença após atualizar a dependência
npm run refresh:coverage # consulta SGB e salva um candidato .geojson.next para revisão
```

A atualização das folhas é deliberada: não modifica automaticamente a edição publicada. Revise metadados, datas, contagens esperadas e diferenças antes de substituir o arquivo e regenerar o snapshot.

## Cuidados editoriais

Os pontos e as áreas municipais não são coordenadas ou perímetros de jazidas. Os polígonos SGB delimitam folhas geológicas publicadas; sobreposições, reedições e lacunas cadastrais estão preservadas. Os percentuais nacionais (28% e 50%, até 2025) vêm de outro balanço do SGB e não são recalculados pela contagem de folhas ou pelo filtro de ano.

Recursos, reservas, material total e óxidos contidos não são somados. As fichas não inventam quantidades por elemento. Teores são convertidos de ppm para porcentagem e kg por tonelada apenas para explicar a concentração química; não representam recuperação industrial. Dados ausentes, sigilosos e zero continuam distintos. Fontes corporativas mantêm datas e ressalvas. A série histórica de 21 Mt é identificada como histórica e a revisão de maio fica disponível no comparador.

Consulte `research/VERIFICATION.md` para o registro de pesquisa e validação. `.openai/hosting.json` mantém `dist` como diretório estático; as alterações locais não publicam automaticamente uma nova versão do site.
