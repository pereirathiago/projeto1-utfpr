# projeto1-utfpr
Repositório criado para a disciplina de Projeto 1 da UTFPR

---

## **📋 Pré-requisitos**
- **Node.js** (v20+ recomendado)
- **npm** ou **yarn**
- **Docker** (para o banco de dados)
- **Git**

---

## **⚙️ Configuração Inicial**

```bash
# clone o repositorio
git clone https://github.com/pereirathiago/projeto1-utfpr.git

# entre na pasta do projeto
cd projeto1-utfpr

# entre na pasta do backend
cd api-projeto-redes

#copie o env.template
cp .env.template .env

# suba o docker
docker compose up -d

# instale as dependencias, rode as migrations e inice o server
npm i
npm run migration:run
npm run dev
```


## **💻 Executando o Frontend (React)**
Navegue até a pasta `/frontend` e siga os passos:

### **1. Instale as dependências**
```bash
npm install
# ou
yarn install

# Inicie o servidor de desenvolvimento
npm start
```

**O frontend estará disponível em:**  
`http://localhost:3000`
