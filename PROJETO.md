# Marathon Portfolio

## Visao Geral
O Marathon Portfolio e um portfolio interativo construido para transformar navegacao em experiencia.
Em vez de uma pagina estatica, ele adota uma linguagem visual inspirada em terminal, HUD de jogo e interfaces retro, combinando isso com transicoes suaves, efeitos de profundidade e componentes dinamicos em React.

O objetivo do projeto e apresentar identidade, projetos e stack tecnica de forma memoravel, com forte assinatura visual e foco em imersao.

## Funcionalidades Principais
- Tela de boot animada, simulando inicializacao de sistema.
- Cursor customizado com comportamento contextual para elementos interativos.
- Navegacao por secoes com destaque automatico da area ativa.
- Hero com tipografia pixelada animada em canvas.
- Secao About com transicao de tema, curva dinamica e efeito de foto com pixel reveal.
- Marquee horizontal continuo guiado por scroll.
- Grid de projetos com preview dinamico e modal detalhado.
- Secao de skills com animacao de digitacao progressiva por categoria.
- Secao de contato com cards animados e links externos.
- Barra de progresso de scroll fixa.
- Console de desenvolvedor interativo com comandos.
- Minigame ASCII (Space Invaders) integrado ao console.
- Sistema de temas dinamicos com multiplas paletas.
- Layout responsivo para desktop e mobile.

## Features de Experiencia e Interacao
- Alternancia de console por tecla de atalho.
- Console arrastavel e redimensionavel.
- Historico de comandos no console com navegacao por setas.
- Comandos utilitarios como ajuda, navegacao por secoes, troca de tema e limpeza de tela.
- Mini game com tela de start, gameplay, colisoes, pontuacao e restart.
- Abertura de modal de projeto com backdrop desfocado e animacao de entrada/saida.
- Feedback visual consistente em hover, foco e transicoes de estado.

## Design do Projeto (Descricao Detalhada)

### Direcao Visual
A direcao estetica combina tres referencias:
- Terminal classico de alta legibilidade.
- Visual de monitor CRT com scanlines, vinheta e flicker.
- Interface de jogo contemporanea com acentos fortes e dinamica cinematografica.

O resultado e um design hibrido: nostalgico na textura e moderno na execucao.

### Linguagem de Cor
A base trabalha com contraste elevado:
- Fundos escuros profundos para sensacao de imersao.
- Tipografia clara e elementos de brilho para leitura e presenca.
- Cores de acento fortes para navegacao e chamadas visuais.

O sistema de tema permite trocar personalidade visual sem mudar estrutura:
- Royal, Acid, Blaze, Pulse e Ember.
- Cada tema redefine primaria, secundaria, acento e bordas.
- A interface preserva coerencia de contraste entre areas claras e escuras.

### Tipografia e Hierarquia
O projeto usa uma combinacao proposital:
- Monoespacada para linguagem tecnica, terminal e microcopy funcional.
- Serif display para titulos de impacto e assinatura editorial.
- Peso e italico como recurso de ritmo visual, nao apenas decoracao.

A hierarquia e clara:
- Headings grandes e expressivos para marcos de secao.
- Labels em caixa alta e tracking amplo para orientacao.
- Texto corrido enxuto e tecnico para manter escaneabilidade.

### Composicao de Layout
A pagina e organizada como narrativa vertical:
- Boot de entrada.
- Hero de impacto visual.
- About de transicao (escuro para claro).
- Projetos em bloco editorial com preview lateral.
- Skills e Contact em sequencia com sobreposicao sticky.

O uso de secoes sticky cria leitura em camadas:
- Cada bloco encosta no topo.
- O proximo bloco cobre o anterior com controle de profundidade por z-index.
- A sensacao e de cards de tela deslizando em pilha.

### Movimento e Animacao
A animacao e usada como estrutura de experiencia:
- Entrada de conteudo com easing suave.
- Revelacao progressiva por viewport.
- Marquee continuo sincronizado ao scroll.
- Barra lateral de progresso para reforcar orientacao de leitura.
- Glitch e pixelation para reforco de identidade digital.

O movimento nao e apenas decorativo: ele comunica estado, foco e transicao de contexto entre secoes.

### Textura e Atmosfera
Elementos de textura adicionam carater:
- Scanlines e grao suave na navegacao.
- Vinheta e brilho em camadas no boot.
- Efeitos de blend para manter contraste ativo sobre fundos variados.
- Sombras e overlays para sensacao de profundidade.

Essa camada atmosferica faz o projeto parecer vivo, como um sistema em execucao.

### Elementos Visuais Distintivos
- Cursor bracket com modo contextual de clique.
- Titulos pixelados em canvas com resolucao progressiva.
- Foto do About com efeito de despixelizacao por scroll.
- Preview de projetos com gradientes de sobreposicao e informacoes de metadata.
- Modal com estetica tecnica e CTA direto para demo e repositorio.

### Responsividade
A experiencia foi pensada para multiplos tamanhos:
- Ajustes de spacing, tipografia e composicao entre mobile e desktop.
- Navegacao mobile com menu colapsavel animado.
- Adaptacao de logos e blocos visuais pesados para telas menores.
- Preservacao de legibilidade mesmo com forte linguagem grafica.

## Arquitetura e Organizacao
O projeto e modular, com separacao por responsabilidade:
- Secoes principais para conteudo narrativo.
- Componentes de UI reutilizaveis para efeitos e padroes visuais.
- Utilitarios para dados, tema e contexto.
- Hooks para comportamento de interacao e animacao.

Essa estrutura facilita manutencao, evolucao de design e adicao de novos blocos sem acoplamento excessivo.

## Stack Tecnologica
- React
- Vite
- Tailwind CSS
- Framer Motion
- Three.js
- Lucide React
- ESLint

## Diferenciais do Projeto
- Identidade visual forte e reconhecivel.
- Integracao entre estetica retro e motion moderno.
- Interatividade real (console + comandos + minigame), nao apenas animacao superficial.
- Forte coerencia entre narrativa pessoal, tecnologia e direcao de arte.
- Base pronta para expansao com novos temas, comandos, secoes e demos.

## Resumo
O Marathon Portfolio e um portfolio de alto carater visual, com foco em experiencia imersiva, interacao rica e consistencia estetica ponta a ponta.
Ele nao apenas mostra projetos: ele demonstra, na propria interface, dominio de front-end, motion design e construcao de produto digital com identidade.
