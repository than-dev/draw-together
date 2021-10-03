const { randomUUID } = require('crypto')
const http = require('http')

const clients = new Map()

const server = http.createServer((req, res) => {
    res.writeHead(200,
        {
            'Content-Type': 'text/plain'
        }
    )
    res.end('okay')

})

server.on('upgrade', (req, socket, head) => {
    socket.write(
        'HTTP/1.1 101 Web Socket Protocol Handshake\r\n' +
        'Upgrade: WebSocket\r\n' +
        'Connection: Upgrade\r\n' +
        '\r\n'
    )
    
    socket.on('connection', (stream) => {
        const id = randomUUID()
        const color = Math.floor(Math.random() * 360);

        const metadata = {
            id,
            color
        }

        clients.set(stream, metadata)
    })
})

server.listen(3000, '127.0.0.1', () => {
    const options = {
        port: 3000,
        host: '127.0.0.1',
        headers: {
            'Connection': 'Upgrade',
            'Upgrade': 'websocket'
        }
    }

    const req = http.request(options)
    req.end()
})