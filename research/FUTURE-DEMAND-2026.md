# Demanda futura — edição de 5 de outubro de 2026

Capítulo 05, depois da dimensão da oportunidade (04). Desenvolvimento e prévia locais; sem publicação no OpenAI Sites.

## Série principal — mercado agregado de óxidos

A pedido do usuário, o gráfico passou a cobrir o mercado agregado de óxidos de terras raras (TREO), além do recorte de quatro elementos magnéticos da IEA. A fonte é a análise de mercado preparada pela **Adamas Intelligence**, contratada pela Mkango, no [relatório técnico Songwe Hill, de 29/04/2026, pp. 54–55](https://minedocs.com/32/Songwe-Hill-Update-DFS-06302025.pdf#page=54). O relatório tem data efetiva de 30/06/2025. O capítulo 19 atribui sua elaboração à Adamas.

| Ano | Classificação | Demanda anual, mil t de TREO |
| --- | --- | ---: |
| 2024 | Estimativa de mercado | 234 |
| 2040 | Projeção | 607 |

O agregado inclui ímãs, catalisadores, ligas de bateria, cerâmicas/pigmentos, vidro/polimento, metalurgia, fósforos e demais aplicações. A documentação pública não estabelece cobertura individual dos 17 elementos; não rotular como uma soma verificada de todos eles. TREO é massa de óxidos, incluindo oxigênio, e não se mistura com a antiga série em massa de elementos da IEA. Trata-se de uma projeção comercial de demanda, não uma garantia de consumo, produção ou déficit.

Cálculos a partir dos dois pontos: 607 / 234 = 2,594… → **2,6×**; (607 / 234 − 1) × 100 = 159,401… → **+159%**; 607 − 234 = **373 mil t adicionais por ano**. Sem valores inventados para anos intermediários. Os controles CPS/STEPS/HDS e a parcela de energia limpa foram removidos por pertencerem a outra fonte e outro escopo. Os pontos estão em `dist/assets/adamas-rare-earth-demand-2040.csv` e no snapshot JSON.

## Série anterior — IEA (substituída no gráfico)

[IEA, Global Critical Minerals Outlook 2026](https://www.iea.org/reports/global-critical-minerals-outlook-2026), publicado em 16/07/2026. [PDF, anexo p. 362](https://iea.blob.core.windows.net/assets/19c60aa0-ee07-4a20-a138-33c967ac5008/GlobalCriticalMineralsOutlook2026.pdf#page=362), CC BY 4.0. Tabela transcrita em `dist/assets/iea-rare-earth-demand-2026.csv`.

Unidade: mil toneladas de **Nd, Pr, Dy e Tb**. Não é a demanda agregada dos 17 elementos, massa de óxidos ou massa de ímãs. Energia limpa é parte do total. Totais originais preservados, mesmo quando componentes arredondados não somam exatamente.

| Cenário | 2025 histórico total / energia limpa | 2030 | 2040 | 2050 |
| --- | --- | --- | --- | --- |
| CPS, políticas vigentes | 93 / 21 | 112 / 33 | 131 / 36 | 151 / 40 |
| STEPS, políticas declaradas | 93 / 21 | 116 / 37 | 140 / 44 | 167 / 56 |
| HDS, alta demanda | 93 / 21 | 127 / 48 | 160 / 64 | 192 / 80 |

Definições de cenários na p. 18. CPS considera as políticas em vigor. STEPS explora a direção das políticas atuais, sem assumir cumprimento integral de metas aspiracionais. HDS representa maior implantação tecnológica, consistente com APS do WEO 2024; **não é NZE**. Todos os cenários compartilham histórico e escala vertical de 0–200 mil t.

O destaque de 2040 divide demanda de energia limpa pelo valor de 2025: 36/21 = 1,7×; 44/21 = 2,1×; 64/21 = 3,0× (uma casa decimal). Crescimento total: +41%, +51% e +72%, respectivamente. Projeções não são garantias, déficit de oferta nem receitas.

## Indicadores de tecnologia

- **2–4 kg de ímãs por motor de tração com NdFeB:** [IEA, Rare Earth Elements: Pathways to secure and diversified supply chains, p. 28](https://iea.blob.core.windows.net/assets/88d2b060-4c5b-46cc-8727-c60576cb937d/RareearthelementsPathwaystosecureanddiversifiedsupplychains.pdf#page=28), abril de 2026, revisto em maio. O denominador é motor, não veículo; a massa é de ímãs, não NdPr puro. Não afirma que todos os motores elétricos usam terras raras.
- **Até 600 kg de ímãs de neodímio/MW de eólica:** [Comissão Europeia/JRC, JRC134499](https://publications.jrc.ec.europa.eu/repository/handle/JRC134499), 2023; [PDF, p. impressa 147 / página 154 do arquivo](https://publications.jrc.ec.europa.eu/repository/bitstream/JRC134499/JRC134499_01.pdf#page=154). Intensidade varia com porte e tecnologia. Não generalizar para toda turbina offshore ou confundir capacidade em MW com geração em MWh.
- **806 mil novas instalações anuais de robôs industriais em 2029:** [IFR, Five million robots now operate in factories globally](https://ifr.org/ifr-press-releases/news/five-million-robots-now-operate-in-factories-globally), 24/09/2026. É previsão de instalações, não estoque nem demanda mineral medida. Não se converte em toneladas de terras raras.
- **Robótica e infraestrutura digital:** IEA Outlook 2026, pp. 202–203, sobre motores compactos e precisos e possíveis perdas de desempenho nas substituições. [IEA Rare Earth Elements, resumo executivo](https://www.iea.org/reports/rare-earth-elements/executive-summary) também identifica discos rígidos, robótica e centros de dados. Texto curto, sem estimativa inventada de demanda exclusivamente de IA.

## Ajustes em relação aos exemplos iniciais

A projeção de 3× a 7× veio do [relatório IEA de 2021](https://www.iea.org/reports/the-role-of-critical-minerals-in-clean-energy-transitions/mineral-requirements-for-clean-energy-transitions): base 2020, horizonte 2040, cenários STEPS e SDS — não NZE. Foi substituída pela edição de julho de 2026, com base, escopo e cenários explícitos. A participação de mais de 80% dos motores de veículos não foi usada sem fonte primária atual confirmada. Evitou-se a afirmação absoluta de que não existem substitutos sem terras raras.

## Verificação

Os checks comparam os dois pontos publicados com o CSV, verificam unidade e origem e conferem o snapshot JSON e os três cálculos. O teste DOM confere anos, estimativa/projeção, proporção e base zero das barras, fonte, descrição acessível, ausência dos antigos controles e sequência dos capítulos. Revisão visual local em 1280 px e 360 px, sem transbordamento horizontal e sem avisos ou erros no console. Os 17 testes passaram. Captura da versão atual: `screenshots/future-demand-treo.png`.
