const socketFunctions = require('./socket-functions')

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 7071 });

const clients = new Map()

wss.on('connection', (ws) => {
    const id = uuidv4();
    const color = Math.floor(Math.random() * 360);
    const metadata = { id, color };

    clients.set(ws, metadata);
  
    console.log(clients.get(ws));

    ws.on('message', async (messageAsString) => {
      const message = await JSON.parse(messageAsString);
      
      const messageEvent = message.event

      await socketFunctions[messageEvent]()

      const metadata = clients.get(ws);

      message.sender = metadata.id;
      message.color = metadata.color

       ws.send(JSON.stringify({
        message: 'You communicate with server successfully'
      }))
    })
  
    ws.on('close', () => {
        clients.delete(ws);
    });
})

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}