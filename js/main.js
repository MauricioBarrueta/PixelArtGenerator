const gridWrapper = document.querySelector(".grid-wrapper"), gridContainer = document.querySelector(".grid-container")
const paintBtn = document.getElementById("paint-btn"), eraseBtn = document.getElementById("erase-btn"), clearGridBtn = document.getElementById("clear-grid-btn"),
    colorPickerBtn = document.getElementById("color-input")
const rows = 20, col = 30,  pixel = 16

let isDrawing = false
let isErasing = false
let deviceType = ''

/* Detecta el tipo de dispositivo */
const isTouchDevice = () => {
    try {
        document.createEvent("TouchEvent")
        deviceType = "touch"
        return true
    } catch {
        deviceType = "mouse"
        return false
    }
}
isTouchDevice()

/* Objeto que contiene los eventos de acuerdo al tipo de dispositivo */
const deviceEvents = {
    mouse: { down: "mousedown", move: "mousemove", up: "mouseup" },
    touch: { down: "touchstart", move: "touchmove", up: "touchend" }
};

window.onload = () => {
    createGrid(rows, col);
};

/* Se genera la cuadrícula */
const createGrid = (rows, cols) => {
    gridContainer.innerHTML = ''

    for (let i = 0; i < rows; i++) {
        const row = document.createElement('div')
        row.classList.add('grid-row')

        for (let j = 0; j < cols; j++) {
            const col = document.createElement('div')
            col.classList.add('grid-col')
            col.addEventListener(deviceEvents[deviceType].down, (e) => {
                e.preventDefault()
                isDrawing = true
                paintCell(col)
            });
            col.addEventListener(deviceEvents[deviceType].move, (e) => {
                if (!isDrawing) return

                const x = deviceType === "mouse" ? e.clientX : e.touches[0].clientX
                const y = deviceType === "mouse" ? e.clientY : e.touches[0].clientY
                const el = document.elementFromPoint(x, y)
                if (el && el.classList.contains('grid-col')) {
                    paintCell(el)
                }
            });
            col.addEventListener(deviceEvents[deviceType].up, () => {
                isDrawing = false
            });

            row.appendChild(col)
        }
        gridContainer.appendChild(row)
    }

    autoScaleGrid()
}

/* Controla si se pinta o se borra el pixel */
const paintCell = (cell) => {
    cell.style.backgroundColor = isErasing ? 'transparent' : colorPickerBtn.value
}

/* Controla el estado de la variable, si es que se esta pintando o borrando */
paintBtn.addEventListener('click', () => isErasing = false)
eraseBtn.addEventListener('click', () => isErasing = true)

/* Limpia toda la cuadrícula */
clearGridBtn.addEventListener('click', () => {
    document.querySelectorAll('.grid-col').forEach(col => {
        col.style.backgroundColor = 'transparent'
    });
});

/* Controla cuál botón está seleccionado (pintar o borrar) y le agrega la clase .active */
function setActiveButton(activeBtn) {
    [paintBtn, eraseBtn].forEach(btn => btn.classList.remove("active"))
    activeBtn.classList.add("active")
}
paintBtn.addEventListener("click", () => {
    isErasing = false
    setActiveButton(paintBtn)
});
eraseBtn.addEventListener("click", () => {
    isErasing = true
    setActiveButton(eraseBtn)
});

/* Escala automáticamente la cuadrícula dentro del contenedor, manteniendo la proporción y evitando desbordes */
const autoScaleGrid = () => {
    if (!gridWrapper) return

    const wrapperWidth = gridWrapper.clientWidth
    const wrapperHeight = gridWrapper.clientHeight

    const gridWidth = col * pixel
    const gridHeight = rows * pixel

    const scaleX = wrapperWidth / gridWidth;
    const scaleY = wrapperHeight / gridHeight;

    let scale = Math.min(scaleX, scaleY)

    scale = Math.max(1, Math.min(scale, 3))

    gridContainer.style.transform = `scale(${scale})`
}

/* Recalcula la cuadrícula cuando la página cambia de tamaño */
window.addEventListener("resize", autoScaleGrid)