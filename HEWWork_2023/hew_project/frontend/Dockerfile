FROM node:20.9.0

WORKDIR /app/frontend

# package.json と package-lock.json をコピー
COPY ./frontend/package*.json ./

# 依存関係のインストール
RUN npm install

CMD ["npm", "run", "dev"]
