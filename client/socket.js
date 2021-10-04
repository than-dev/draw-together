let ws;

(async function () {
    ws = await connectToServer()
    
    ws.emit = (event, data) => {
        ws.send(JSON.stringify({
            event,
            data
        }))
    }
        
    ws.onmessage = (webSocketMessage) => {
        const messageBody = JSON.parse(webSocketMessage.data);
        
        console.log('Data received successfully', messageBody);
    };

   ws.emit('teste', 'Ola, its a test')
})();

async function connectToServer() {
    const ws = new WebSocket('ws://localhost:7071/ws');
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(ws), 100)
    });
}
