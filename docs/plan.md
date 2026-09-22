# GPS DA VIVICA Implementation Plan

**Goal:** entregar um app web de rotas pessoais pronto para GitHub Pages.
**Architecture:** módulos JavaScript sem etapa de build; biblioteca Leaflet incluída; dados pessoais locais e exportáveis.
**Tech Stack:** HTML, CSS, JavaScript, Leaflet 1.9.4, node:test.
**Spec:** docs/design.md

## Global Constraints
- GPS apenas em primeiro plano; sem recálculo automático.
- Sem dados pessoais incluídos no repositório.
- Falha do roteador preserva o desenho e informa o problema.
- Caminhos relativos compatíveis com subpastas do GitHub Pages.

## Review Focus
- GPS impreciso, parado, antigo ou em cruzamento com a própria rota.
- Importação malformada e rotas com vários segmentos desconectados.
- Falha de rede, permissão negada e armazenamento cheio.
- Links de compartilhamento longos e texto com caracteres especiais.
- iPhone estreito, diálogos e controles sobre o mapa.

## Task 1: Dados de rota e navegação
- [ ] Escrever testes de distância, progresso, validação, compartilhamento e bloqueio de GPS antigo.
- [ ] Executar testes, confirmar falhas por funções ausentes, implementar core.js, executar novamente.

## Task 2: Editor e GPS
- [ ] Criar interface de mapa, desenho, busca, ajuste às ruas e biblioteca local.
- [ ] Implementar acompanhamento, indicação explícita de precisão, voz e desvio sem recálculo.
- [ ] Verificar fluxo de criação, importação e localização no navegador com GPS simulado.

## Task 3: Instalação e entrega
- [ ] Manifest, ícones, service worker com cache somente do app, documentação de publicação e uso.
- [ ] Testar interface desktop/iPhone, falhas, recarga, subpasta e modo offline.
- [ ] Revisar código e empacotar ZIP com instruções em português.

## Resultado da execução
Implementação e empacotamento concluídos. Ver docs/validation.md: 21 testes aprovados; teste visual e físico no iPhone pendentes por indisponibilidade do navegador automatizado.
