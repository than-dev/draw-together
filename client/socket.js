let ws;

(async function () {
    ws = await connectToServer()
    
    ws.send(JSON.stringify({
        event: 'teste',
        data: 'It\'s a test'
    }))
    
    ws.onmessage = (webSocketMessage) => {
        const messageBody = JSON.parse(webSocketMessage.data);
        
        console.log('Data received successfully', messageBody);
    };
})();

async function connectToServer() {
    const ws = new WebSocket('ws://localhost:7071/ws');
    return new Promise((resolve, reject) => {
        setInterval(() => resolve(ws), 100)
    });
}
