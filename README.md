# Portfolio Interativo - Projeto "Marathon Portfolio"

## Descrição

Este é um projeto de portfólio interativo desenvolvido com React e Tailwind CSS. O objetivo é criar uma experiência imersiva e única para apresentar suas habilidades, projetos e informações pessoais de forma criativa e visualmente atraente. O design é inspirado em uma interface de terminal retro, com animações e efeitos visuais modernos.

## Funcionalidades

- **Tela de Boot**: Uma introdução animada que simula o boot de um sistema operacional fictício.
- **Cursor Personalizado**: Um cursor interativo que reage ao movimento do mouse e interage com elementos da interface.
- **Animações**: Uso de `framer-motion` para criar transições suaves e efeitos visuais dinâmicos.
- **Design Responsivo**: Interface otimizada para diferentes tamanhos de tela.

## Tecnologias Utilizadas

- **React**: Biblioteca JavaScript para construção de interfaces de usuário.
- **Tailwind CSS**: Framework CSS para estilização rápida e eficiente.
- **Framer Motion**: Biblioteca para animações e transições em React.
- **Vite**: Ferramenta de build rápida para desenvolvimento front-end.

## Estrutura do Projeto

```
eslint.config.js
index.html
package.json
README.md
tailwind.config.js
vite.config.js
public/
src/
  App.jsx
  index.css
  main.jsx
  assets/
  components/
    BootScreen.jsx
    TerminalCursor.jsx
```

- **`src/components`**: Contém os componentes principais, como `BootScreen` e `TerminalCursor`.
- **`src/index.css`**: Estilos globais e customizações do Tailwind CSS.
- **`vite.config.js`**: Configuração do Vite para o projeto.

## Como Executar o Projeto

1. Certifique-se de ter o [Node.js](https://nodejs.org/) instalado.
2. Clone este repositório:

   ```bash
   git clone <URL_DO_REPOSITORIO>
   ```

3. Navegue até o diretório do projeto:

   ```bash
   cd marathon-portfolio
   ```

4. Instale as dependências:

   ```bash
   npm install
   ```

5. Inicie o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

6. Abra o navegador e acesse:

   ```
   http://localhost:5173
   ```

## Como Personalizar

- **Alterar Linhas de Boot**: Edite o arquivo `BootScreen.jsx` e modifique o array `bootLines` para personalizar as mensagens exibidas na tela de boot.
- **Estilização**: Ajuste as cores, fontes e outros estilos no arquivo `index.css`.
- **Componentes**: Adicione ou edite componentes na pasta `src/components` para incluir novas funcionalidades ou seções no portfólio.

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests com melhorias, correções de bugs ou novas funcionalidades.

## Licença

Este projeto está licenciado sob a licença MIT. Consulte o arquivo `LICENSE` para mais informações.

---

Desenvolvido com ❤️ por Lucas.
