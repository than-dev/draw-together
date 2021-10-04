let ws;

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const stroke_weight = document.querySelector('.stroke-weight');
const color_picker = document.querySelector('.color-picker');
let isDrawing = false

const drawer = {
    draw({ clientX: x, clientY: y }) {
        ws.emit('draw', { clientX: x, clientY: y })

        if (!isDrawing) return;
        ctx.lineWidth = stroke_weight.value;
        ctx.lineCap = "round";
        ctx.strokeStyle = color_picker.value;

        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    },

    stop() {
        isDrawing = false;
        ctx.beginPath();
    },

    clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    },

    resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    },

    start(event) {
        isDrawing = true;
        drawer.draw(event);
    }
}
    
function addEvents() {
    const clearButton = document.querySelector('.clear');
    
    canvas.addEventListener('mousedown', drawer.start);
    canvas.addEventListener('mousemove', drawer.draw);
    canvas.addEventListener('mouseup', drawer.stop);

    clearButton.addEventListener('click', drawer.clearCanvas);

    window.addEventListener('resize', drawer.resizeCanvas);

    drawer.resizeCanvas()
}

async function connectToServer() {
    const ws = new WebSocket('ws://localhost:7071/ws');
    return new Promise((resolve, reject) => {
        setInterval(() => resolve(ws), 100)
    });
}

(async function () {
    ws = await connectToServer()

    ws.onmessage = (webSocketMessage) => {
        const messageBody = JSON.parse(webSocketMessage.data);
        console.log('Data received successfully', messageBody);
    };

    ws.emit = (event, data) => {
        ws.send(JSON.stringify({
            event,
            data
        }))
    }

    addEvents()
})();


