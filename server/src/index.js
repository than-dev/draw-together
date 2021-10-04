let currentWS;

const socketFunctions = require('./socket-functions')

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 7071 });

const clients = new Map()

wss.on('connection', (ws) => {
    currentWS = ws
    const id = uuidv4();
    const color = Math.floor(Math.random() * 360);
    const metadata = { id, color };

    clients.set(ws, metadata);
  
  console.log(clients.get(ws));
  
    ws.addListener('send', (message) => {
      ws.send(JSON.stringify({
        message
      }))  
    })
    console.log(ws.eventNames())
    
    
    ws.addListener('message', async (messageAsString) => {
      const message = await JSON.parse(messageAsString);
      console.log(message);
      const messageEvent = message.event

      await socketFunctions[messageEvent]()

      const metadata = clients.get(ws);

      message.sender = metadata.id;
      message.color = metadata.color
    })
    
    ws.on('close', () => {
        clients.delete(ws);
    });
  
    setTimeout(() => ws.emit('send', 'TESTANDOOOOOO'), 5000)
})


function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}