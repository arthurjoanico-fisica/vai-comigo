# Vai Comigo — primeira versão

Objetivo: uma pessoa prepara e revisa uma rota e a outra acompanha esse caminho no iPhone, com GPS e o mapa aberto. Publicação estática pelo GitHub Pages, sem conta, backend ou chave secreta.

## Escopo
- Mapa OpenStreetMap, busca explícita de endereço via Photon, editor por pontos arrastáveis e desenho à mão.
- Ajuste opcional às ruas por Valhalla, perfil motor_scooter com top_speed=50 e preferências baixas por vias principais, rodovias, pedágio e balsa. Preferências não são proibições nem validação jurídica.
- O ajuste às ruas exige revisão do usuário e nunca ocorre durante a navegação. Mudança no traçado remove instruções anteriores.
- Rotas pessoais salvas apenas neste navegador. Envio por link contendo a rota, ou por arquivo JSON/GPX; não existe sincronização automática entre aparelhos.
- Navegação em primeiro plano, posição real e precisão visíveis, distância restante, instruções quando fornecidas pelo roteador, voz opcional, alerta de desvio e GPS desatualizado. Retomada distante exige confirmação manual com veículo parado.
- Instalação PWA, modo noturno e tentativa de manter tela acesa quando suportada. O app e os traçados são guardados localmente; mapas e busca dependem da rede. Não baixar mapas OSM para uso offline.
- Não oferecer tráfego ao vivo, recálculo automático, garantias de vias permitidas, rastreamento remoto ou funcionamento com tela bloqueada.

## Experiência
Mapa ocupa a tela. Painel lateral no computador e painel inferior no iPhone. Cores: azul profundo, verde vivo para ações, branco limpo. Estados distintos de planejar, ver rota e navegar. Rotas recebidas aparecem para revisão, nunca começam o GPS sozinhas. Compartilhamento depende de ação da pessoa.

## Limites e validação
GPS simulado verifica alertas e progresso; teste físico no iPhone e em percurso curto ainda será necessário. Não tratar velocidade habitual de 50 km/h como velocidade média incluindo paradas. O tempo mostrado é estimado e usa média configurável. Não concluir categoria legal apenas por 50 cc.
