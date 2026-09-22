# Vai Comigo — versão 1.0 de teste

Você prepara um caminho no mapa e envia uma cópia para outra pessoa acompanhar pelo GPS do iPhone. O projeto é independente do CAHK: publique em outro repositório ou em uma pasta própria.

## Publicar pelo GitHub Pages

1. Crie um repositório chamado `vai-comigo` na sua conta do GitHub. Para o caminho gratuito mais simples, use um repositório público. Não coloque nele arquivos com endereços ou rotas pessoais.
2. Extraia este ZIP. Envie o conteúdo da pasta `vai-comigo` para a raiz do repositório, preservando as pastas `icons` e `vendor`. O arquivo `index.html` precisa ficar na raiz, junto com `app.js` e `styles.css`.
3. Abra **Settings → Pages**. Em **Build and deployment**, escolha **Deploy from a branch**, selecione a branch que recebeu os arquivos (normalmente `main`) e a pasta **/(root)**. Salve.
4. Aguarde a publicação. O GitHub exibirá o endereço do site na própria página. Normalmente será `https://SEU-USUARIO.github.io/vai-comigo/`.
5. Abra esse endereço por HTTPS. Abrir o HTML diretamente pelo aplicativo Arquivos não substitui a publicação e não serve para validar o GPS.

Não é necessário instalar pacotes, configurar banco de dados ou inserir chaves de API. A disponibilidade de busca, mapas e ajuste depende de serviços públicos de terceiros. Este pacote não cria nem publica um repositório automaticamente.

Documentação oficial: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Instalar no iPhone

Abra o endereço do site no Safari. Toque em Compartilhar → Adicionar à Tela de Início. Ative “Abrir como App da Web”, se essa opção aparecer. Abra pelo ícone criado e autorize a localização quando iniciar um trajeto.

**Use com o app aberto e a tela ligada.** Um site instalado como app não ganha navegação confiável com tela bloqueada. O app tenta manter a tela acesa quando há suporte; confirme esse comportamento no aparelho. Não promete funcionamento em segundo plano, em chamadas ou após trocar de aplicativo.

## Criar e enviar

- Toque em **Desenhar uma rota**. No modo **Por pontos**, toque no mapa em ordem: saída, passagens desejadas e destino. Arraste os marcadores para ajustar. A busca leva o mapa até um lugar; toque no mapa para acrescentar o ponto.
- No modo **À mão livre**, arraste sobre o mapa. Volte a **Por pontos** para mover o mapa. O desenho acompanha exatamente os pontos registrados e pode atravessar quarteirões: revise-o.
- Para conectar pontos pelas ruas, use **Ajustar às ruas**. Nesta versão, o serviço aceita até 40 pontos selecionados. Para desenhos longos, use o traçado manual ou crie uma sequência menor de pontos. O serviço pode escolher um trajeto diferente entre eles: confira todo o resultado e use **Desfazer** se necessário.
- O perfil considera moto leve com velocidade de referência de 50 km/h e preferência por vias menores. Isso não assegura ruas permitidas, ausência de rodovias, condições de segurança ou sentidos atualizados. Confira a sinalização e a categoria do veículo. Planeje a volta separadamente.
- Salve o caminho e toque em **Enviar rota**. Envie o link por um app de mensagens ou baixe o arquivo JSON. Para links longos, prefira o arquivo.
- Ela abre o link, revisa e toca em **Salvar caminho** no próprio aparelho. Depois, toca em **Seguir este caminho** e inicia o GPS com a moto parada.

Não há sincronização automática: editar uma rota depois de enviá-la não muda a cópia recebida. Envie novamente. As rotas ficam no navegador em que foram salvas; Safari e o app instalado podem ter armazenamento separado. Abra/importe a rota no ambiente que será utilizado.

## Durante o trajeto

O ponto azul mostra a posição; o círculo mostra a incerteza indicada pelo GPS. A rota não é recalculada. Há indicação de distância restante e tempo estimado, e conversões quando fornecidas pelo ajuste às ruas. Rotas manuais não têm instruções de virar.

GPS com mais de 12 segundos ou precisão pior que 45 metros suspende as orientações. O alerta de desvio depende da precisão. Após um desvio longo ou salto de posição, pare em local seguro, confira o trecho e use **Retomar a rota deste ponto** se adequado. Em caminhos que cruzam a si mesmos, confira visualmente o segmento. O GPS sozinho pode confundir ruas paralelas e cruzamentos.

A média de viagem inicia em 30 km/h e pode ser alterada. Andar a 50 km/h durante parte do percurso não equivale a uma média de 50 km/h com semáforos e paradas.

Voz é opcional e depende do navegador. Mantenha a tela aberta; não dependa somente de avisos sonoros. Não manipule o editor ou confirme retomadas enquanto conduz.

## Internet e privacidade

- O app e os traçados salvos podem abrir sem rede depois do primeiro carregamento bem-sucedido. **Isso não fornece mapas offline.** Áreas não carregadas podem ficar vazias. Busca e ajuste às ruas exigem conexão.
- Não há conta, servidor próprio, rastreamento remoto ou envio de GPS ao seu parceiro. O código trata o GPS localmente. Os servidores de mapas recebem as áreas visualizadas, Photon recebe a busca e Valhalla recebe os pontos enviados ao pedir ajuste.
- Quem tem um link ou arquivo pode ver o caminho. Não envie a desconhecidos. As rotas não são anexadas automaticamente ao repositório público.
- Apagar os dados do navegador pode apagar as rotas; exporte uma cópia JSON. GPX preserva o traçado, mas não conserva as instruções de conversão e observações do JSON.
- Serviços: OpenStreetMap (mapa), Photon/Komoot (busca) e Valhalla/FOSSGIS (ajuste). Uso pessoal e pequeno; sem garantia de disponibilidade. A busca só ocorre ao enviar o formulário, tem intervalo mínimo entre consultas e cache em memória. Sem coleta em massa ou pré-download de mapas.

Políticas/documentação: https://operations.osmfoundation.org/policies/tiles/ ; https://github.com/komoot/photon ; https://valhalla.openstreetmap.de/ . Os endereços dos serviços ficam em `services.js` para manutenção.

## Validação e limites desta entrega

Passaram 21 testes automatizados de cálculos, compartilhamento, validação de dados, ajuste com respostas simuladas e controlador de interface com DOM/Leaflet/GPS simulados. Esses testes não comprovam o funcionamento dos serviços externos ao vivo, a renderização do mapa nem os gestos no Safari.

O navegador automatizado não pôde ser instalado no ambiente desta entrega. **Não foi realizado teste visual nem teste físico no iPhone.** Antes de depender do app na moto:

1. Publique e abra no Safari; confirme que o mapa carrega e a busca localiza um lugar conhecido.
2. Crie uma rota curta conhecida, revise o ajuste às ruas, envie para o outro aparelho e confira a cópia.
3. Com o celular parado e depois caminhando, teste permissão, precisão, deslocamento, alerta de desvio e voz.
4. Bloqueie e desbloqueie a tela para confirmar a pausa e retomada; não conte com funcionamento bloqueado.
5. Teste modo noturno, desenho por toque, tela de início e recarga. Confira bateria, dados móveis e suporte do celular.

É uma primeira versão para validação, não um substituto já homologado para um navegador de trânsito. Não tem trânsito ao vivo, radares, limite de velocidade por via ou garantias de autorização viária.

## Manutenção

Código estático em HTML/CSS/JavaScript. Leaflet 1.9.4 está incluído em `vendor`, com a licença. Testes: `npm test` (Node). Servidor local: `npm start` (Python 3); abra `http://localhost:8080`.

Ao atualizar, publique todos os arquivos juntos, altere a versão do cache em `sw.js` e feche/reabra todas as janelas do app para ativar o novo service worker. A rede tem prioridade para os arquivos do app; sem rede, usa-se a cópia em cache. Não publique atualizações enquanto ela depende de uma navegação ativa. Exporte as rotas antes de manutenção.
