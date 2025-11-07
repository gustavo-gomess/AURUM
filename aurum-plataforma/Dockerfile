
# Use a imagem oficial do Node.js como base
FROM node:20-alpine

# Defina o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copie os arquivos package.json e package-lock.json
COPY package*.json ./

# Instale as dependências do projeto
RUN npm install

# Copie o restante do código da aplicação para o contêiner
COPY . .

# Construa a aplicação Next.js para produção
RUN npm run build

# Exponha a porta em que a aplicação Next.js será executada
EXPOSE 3000

# Comando para iniciar a aplicação em modo de produção
CMD ["npm", "start"]


