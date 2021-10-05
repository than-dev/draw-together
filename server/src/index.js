const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 7071 });
const uuidv4 = require('./uuidv4')

const clients = new Map()

wss.on('connection', (ws) => {
  const id = uuidv4();
  
  clients.set(ws, id);

  ws.addListener('message', async (messageAsString) => {
    const message = await JSON.parse(messageAsString);

    [...clients.keys()].forEach(client => {
      const clientId = clients.get(client)

      if (clientId !== id) {
        client.send(JSON.stringify({
          event: message?.event,
          data: {
            ...message?.data
          }
        }))
      }
    })
  })

  ws.on('close', () => {
      clients.delete(ws);
  });
})
