let ws;
let firstExecution = true;

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const stroke_weight = document.querySelector('.stroke-weight');
const color_picker = document.querySelector('.color-picker');
let isDrawing = false

const drawer = {
    draw(data, emitSocket = true) {
        const colorHex = `#${color_picker.value}`
        const strokeWeight = stroke_weight.value
        
        const {
            clientX: x,
            clientY: y,
            lineWidth,
            color
        } = data
        
        if (emitSocket && isDrawing) {
            ws.emit('draw', {
                clientX: x,
                clientY: y,
                lineWidth: strokeWeight,
                color: colorHex
            })
        }

        if (!isDrawing && emitSocket) return;

        ctx.lineWidth = lineWidth ? lineWidth : strokeWeight;
        ctx.lineCap = "round";
        ctx.strokeStyle = color ? color : colorHex;

        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    },

    beginPath() {
        ctx.beginPath()
    },

    stop() {
        isDrawing = false;
        ctx.beginPath();
    },

    clearCanvas(emitSocket = true) {
        if (emitSocket) {
            ws.emit('clearCanvas')
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    },

    resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    },
    
    start(event) {
        ws.emit('beginPath')
        ctx.beginPath()
        isDrawing = true;
        drawer.draw(event);
    }
}
    
function addEvents() {
    const clearButton = document.querySelector('.clear');

    const colorInput = document.querySelector('.colors input')
    const colorSection = document.querySelector('.colors')
    colorInput.addEventListener('blur', (input) => {
        colorSection.style.backgroundColor = `#${input.target.value}`
    })

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
        const { data, event } = JSON.parse(webSocketMessage.data);

        if (event === 'draw') {
            drawer[event](data, false)
        }

        drawer[event](false)
    };

    ws.emit = (event, data = null) => {
        ws.send(JSON.stringify({
            event,
            data
        }))
    }

    addEvents()
})();
