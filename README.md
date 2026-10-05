# O Brasil sob nossos pés

Atlas editorial interativo em português, com corte de pesquisa em 5 de outubro de 2026. Implementação estática em HTML, CSS e JavaScript, sem dependências de execução ou serviços de backend.

## Executar

Na pasta `atlas`, execute `python3 -m http.server 4173 --directory dist` e abra `http://localhost:4173`. Módulos ES e mapas usam HTTP; abrir `index.html` diretamente via `file://` não é suportado.

## Estrutura

- `dist/index.html`: abertura, primeiro capítulo e estrutura acessível.
- `dist/chapters.js`: narrativa, filtros, comparações, downloads e componentes interativos.
- `dist/data.js`: dados editoriais, unidades, datas, fontes e ressalvas.
- `dist/maps.js`: localizadores municipais calculados da cartografia IBGE; não são coordenadas de jazidas.
- `dist/diagrams.js`: esquemas funcionais de tecnologias, sem escala ou proporção de massa.
- `dist/style.css`: tema, responsividade e preferência por movimento reduzido.
- `dist/data-snapshot.json`: exportação completa da edição.
- `research/VERIFICATION.md`: decisões metodológicas e validação.

Após alterar dados, execute `node scripts/snapshot.mjs` e `node scripts/check.mjs`. O HTML em `dist` é a fonte editável publicada, sem etapa de compilação. Para hospedagem, `.openai/hosting.json` declara `dist` como diretório estático.

## Limitações explícitas

Os dados são um retrato datado, não um feed automático. Fontes corporativas não garantem viabilidade, licenças ou execução. Números não comparáveis ou não divulgados aparecem como lacunas, nunca como zero. A pesquisa não confirmou cobertura percentual nacional chinesa equivalente nem percentual exclusivo da Amazônia. A interface informa essas limitações junto aos gráficos.
