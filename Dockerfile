FROM node:22-alpine

WORKDIR /site
COPY . .

ENV PORT=3000
EXPOSE 3000

USER node
CMD ["node", "server.js"]
