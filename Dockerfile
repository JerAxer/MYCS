# Utiliser une image officielle Node.js
FROM node:20

# Définir le dossier de travail
WORKDIR /usr/src/app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le code source
COPY . .

# Exposer le port
EXPOSE 3000

# Lancer l'application
CMD ["npm", "start"]
