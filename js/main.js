let gridWidthValue = document.getElementById("grid-width"), gridHeightValue = document.getElementById("grid-height");
let gridContainer = document.querySelector(".grid-container");
let createGridBtn = document.getElementById("create-grid"), deleteGridBtn = document.getElementById("delete-grid");
let colorPickerBtn = document.getElementById("color-input"), eraseBtn = document.getElementById("erase-btn"), 
    drawBtn = document.getElementById("paint-btn");

window.onload = () => {
    gridWidthValue.value = '';
    gridHeightValue.value = '';    
    colorPickerBtn.disabled = true, eraseBtn.disabled = true, drawBtn.disabled = true
    if(window.innerWidth <= 768) $('#alert-modal').modal("show"); 
};

/* Objeto que contiene los eventos de acuerdo al tipo de dispositivo */
let deviceEvents = {
    mouse: {
        up: "mouseup",
        down: "mousedown",
        move: "mousemove"        
    },
    touch: {
        up: "touchend",
        down: "touchstart",
        mobe: "touchmove"        
    },
};

/* Verifica si se está ejecutando en un dispositivo touch */
let deviceType = "";
const isTouchDevice = () => {
    try {
        document.createEvent("TouchEvent");
        deviceType = "touch";
        return true;
    } catch (e) {
        deviceType = "mouse";
        return false;
    }
};
isTouchDevice();

/* Borra la cuadrícula creada */
deleteGridBtn.addEventListener("click", () => {
    gridContainer.innerHTML = "";
    colorPickerBtn.disabled = true, eraseBtn.disabled = true, drawBtn.disabled = true
});

/* Crea la cuadrícula de acuerdo a las filas y columnas ingresadas */
let isDrawing = false, isErasing = false;
createGridBtn.addEventListener("click", () => {
    gridContainer.innerHTML = "";
    colorPickerBtn.disabled = false, eraseBtn.disabled = false, drawBtn.disabled = false
    let count = 0;
    if (gridWidthValue.value <= 50 && gridHeightValue.value <= 25) {
        for (let i = 0; i < gridHeightValue.value; i++) {
            count += 2;
            let row = document.createElement("div");
            row.classList.add("grid-row");

            for (let j = 0; j < gridWidthValue.value; j++) {
                count += 2;
                let col = document.createElement("div");
                col.classList.add("grid-col");
                col.setAttribute("id", `col-#${count}`);
                col.addEventListener(deviceEvents[deviceType].down, () => {
                    isDrawing = true;
                    isErasing ? col.style.backgroundColor = 'transparent' : col.style.backgroundColor = colorPickerBtn.value;                   
                });

                col.addEventListener(deviceEvents[deviceType].move, (e) => {
                    let elementId = document.elementFromPoint(
                        !isTouchDevice() ? e.clientX : e.touches[0].clientX,
                        !isTouchDevice() ? e.clientY : e.touches[0].clientY,
                    ).id;
                    getColIdOnMoveEvnt(elementId);
                });
                col.addEventListener(deviceEvents[deviceType].up, () => {
                    isDrawing = false;
                });
                row.appendChild(col);
            }
            gridContainer.appendChild(row);
        }
    } else {
        alert('Has superado el límite, vuelve a intentarlo')
        gridHeightValue.value = '', gridWidthValue.value = '';
    }
});

/* Obtiene el id de la columna cuando el mouse/touch se está moviendo */
function getColIdOnMoveEvnt(columnId) {
    let gridColumns = document.querySelectorAll(".grid-col");
    gridColumns.forEach((element) => {
        if (columnId == element.id) {
            if (isDrawing && !isErasing) {
                element.style.backgroundColor = colorPickerBtn.value;
            } else if (isDrawing && isErasing) {
                element.style.backgroundColor = "transparent";
            }
        }
    });
}

/* Para borrar contenido seleccionado de la cuadrícula */
eraseBtn.addEventListener("click", () => {
    isErasing = true;
});

/* Para volver a dibujar sobre la cuadrícula */
drawBtn.addEventListener("click", () => {
    isErasing = false;
});