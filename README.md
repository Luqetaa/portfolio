# Marathon Portfolio // `lcdev`

Um portfólio pessoal imersivo com uma estética inspirada em **interfaces HUD de jogos AAA, ficção científica e no clássico *Marathon***. Elaborado para entregar uma experiência de navegação contínua, combinando desempenho e dezenas de animações polidas.

## 🔗 Deploy / Produção
O projeto está disponível online. Acesse o portfólio completo em:
👉 **[lcdev-rust.vercel.app](https://lcdev-rust.vercel.app/)**

---

## 🚀 Tecnologias e Ferramentas

Desenvolvido para máxima performance e interatividade utilizando as melhores tecnologias modernas:

- **[React 19](https://react.dev/)** - Biblioteca JavaScript para construção da interface.
- **[Vite](https://vitejs.dev/)** - Ferramenta de build de alta performance.
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Framework utilitário para estilização rápida e flexível.
- **[Framer Motion](https://www.framer.com/motion/)** - Motor de animação para transições fluídas baseadas scroll e viewport.
- **[Three.js](https://threejs.org/) & [React Three Fiber / Drei](https://r3f.docs.pmnd.rs/)** - Renderização de cenários 3D e partículas.
- **[Cobe](https://cobe.vercel.app/)** - Renderização leve (WebGL) do globo interativo.
- **[Lucide React](https://lucide.dev/)** - Ícones limpos e escaláveis.

## ✨ Destaques e Funcionalidades

- **Design "Military-Grade" e Sci-Fi:** Estética visual ousada que utiliza paletas escuras rigorosas, acentos neons (`colors`), fragmentos de texto "sistema/terminal" e grids matemáticos espalhados pela UI.
- **Boot Screen & Efeitos CRT:** Uma introdução simulando inicialização de sistema de um terminal antigo.
- **Animações Cinematográficas (Scroll-driven):** O comportamento da página muda conforme a rolagem. Elementos aparecem, rotacionam, brilham e se expandem usando `Framer Motion` de forma complexa, mas suave.
- **Custom Cursor:** Um cursor interativo com "brackets" e animações que responde aos cliques e movimentos do usuário (HUD Cursor).
- **Cenários e Assets 3D:** Backgrounds interativos utilizando partículas estelares ou dinâmicas via `Three.js` e a renderização do globo no About Section.
- **Grid de "Outpost" Dinâmico (Projetos):** Lista cinemática com background gerado matematicamente com reatividade via scroll, ajustado com precisão para todas as telas (Desktop & Mobile).

## 🛠️ Como Executar Localmente

Siga os passos abaixo para rodar o projeto em sua máquina:

1. **Clone o repositório:**
```bash
git clone https://github.com/Luqetaa/portfolio.git
cd portfolio
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Inicie o servidor de desenvolvimento:**
```bash
npm run dev
```

4. **Acesse no navegador:**  
O Vite iniciará o projeto localmente. Por padrão, estará em `http://localhost:5173`.

---
Desenvolvido com ☕ por **Lucas Cavalcante**.
