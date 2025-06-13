# AlertPay - Frontend do Projeto

Este é o código-fonte do frontend para o projeto **AlertPay**, uma aplicação web criada para ajudar usuários a gerenciar e rastrear suas faturas. A interface foi desenvolvida com **React** e utiliza o **Vite** como ferramenta de construção, garantindo um ambiente de desenvolvimento rápido e moderno.

## 📋 Índice

- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Pré-requisitos](#️-pré-requisitos)
- [Como Executar o Projeto](#-como-executar-o-projeto)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Configuração da API](#️-configuração-da-api)

## ✨ Tecnologias Utilizadas

O projeto utiliza um conjunto de tecnologias modernas para o desenvolvimento web:

- **Vite**: Ferramenta de construção e servidor de desenvolvimento local.
- **React**: Biblioteca para construção da interface de usuário.
- **React Router**: Para gerenciamento de rotas e navegação na aplicação.
- **Axios**: Cliente HTTP para realizar requisições à API do backend.
- **React Big Calendar**: Para a exibição de faturas em um calendário interativo.
- **ESLint**: Para garantir a qualidade e a padronização do código.
- **Context API (React)**: Para gerenciamento de estado global, como o token de autenticação do usuário.

## 🛠️ Pré-requisitos

Antes de começar, certifique-se de que você tem os seguintes softwares instalados em sua máquina:

- [Node.js](https://nodejs.org/) (versão 18.x ou superior recomendada)
- [npm](https://www.npmjs.com/) (geralmente instalado junto com o Node.js)
- **Backend do AlertPay**: Esta aplicação é apenas o frontend. É crucial que o servidor do backend esteja em execução, pois o frontend fará requisições a ele.

## 🚀 Como Executar o Projeto

### 1. Clone o Repositório

```bash
git clone https://github.com/Kroth09/AlertPay-NewProject-Front.git
```

### 2. Navegue até o Diretório

```bash
cd AlertPay-NewProject-front
```

### 3. Instale as Dependências

```bash
npm install
```

### 4. Configure o Backend

Certifique-se de que o servidor backend do AlertPay esteja em execução e acessível na URL:

```
http://localhost:4000
```

### 5. Inicie o Servidor de Desenvolvimento

```bash
npm run dev
```

Abra o navegador e acesse: [http://localhost:5173](http://localhost:5173)

## 📜 Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento do Vite com HMR.
- `npm run build`: Compila e otimiza a aplicação para produção.
- `npm run lint`: Executa o ESLint para análise de código.
- `npm run preview`: Visualiza a versão de produção da aplicação.

## 📁 Estrutura do Projeto

```
/
├── public/               # Arquivos estáticos
├── src/
│   ├── components/       
│   │   ├── dashboard/    
│   │   └── ProtectedRoute.jsx 
│   ├── pages/            
│   ├── services/
│   │   └── api.js        
│   ├── Store/            
│   │   ├── context.js
│   │   └── storeprovider.jsx
│   ├── App.jsx           
│   ├── main.jsx          
│   └── index.css         
├── .gitignore            
├── package.json          
└── vite.config.js        
```

## ⚙️ Configuração da API

A comunicação com o backend é centralizada no arquivo `src/services/api.js`:

```js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000', // URL do Backend
});

export default api;
```

Se o backend estiver em outro endereço ou porta, altere a `baseURL` de acordo.

---

💡 Para dúvidas ou contribuições, sinta-se à vontade para abrir uma *issue* ou *pull request*.
