# Registro de execução — 2026-09-22

Plano: docs/plan.md. Retomada dos arquivos existentes após pedido de continuidade.

- Task 1: cálculos existentes verificados, 12 testes aprovados no início.
- Task 2: controlador implementado; editor por pontos/mão livre, revisão do ajuste, persistência, importação, compartilhamento, GPS, avisos de confiança, retomada manual, voz e tema.
- Task 3: manifest, ícones, service worker e documentação de GitHub Pages adicionados.
- Revisão independente identificou travamento após retorno distante, descarte prematuro de conversão e enquadramento da geometria anterior. Corrigidos. Regressões de retorno e conversão falharam antes das correções e passaram depois.
- Observação de cache do revisor descrevia uma versão anterior: todos os assets atuais usam rede prioritária. Documentado incremento de versão a cada publicação.
- Decisão: manter progresso ao ocultar documento e invalidar apenas a posição; evita perder contexto da rota.
- Decisão: posição distante exige confirmação explícita antes de retomar, em vez de saltar para outro trecho automaticamente; exige interação apenas com veículo parado.
- Decisão: trocar Nominatim por Photon após ler a política atual do endpoint público. Sem conta/backend, uso pessoal e baixo volume, busca explícita e cache em memória.
- Decisão: preservar o projeto independente e entregar ZIP para GitHub Pages; nenhum repositório ou destino de publicação foi fornecido. Nenhuma publicação executada.
- Validação final: 21 testes Node aprovados; integração de interface usa DOM/Leaflet/GPS simulados.
- Limites: sem navegador executável. Download do Playwright Chromium falhou por conexão indisponível. Teste visual, gestos, integração de serviços ao vivo e teste físico no iPhone pendentes e informados no LEIA-ME.
