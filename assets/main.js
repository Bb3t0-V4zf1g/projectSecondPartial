//En cada operacion, primero poner el primer digito en la propiedad "acumulate", luego llamar el método a realizar, y poner como argumento el otro numero


//Si una fraccion tiene multiplicacion, estos encerrarlo entreparéntesis
class Calculadora {
    constructor() {
        this.acumulate = 0; //acumular el resultado
        this.result = "";
        this.error = false;
        this.message = "";
    }
    plus(num) {
        this.acumulate += num;
    }
    mainess(num) {
        this.acumulate -= num;
    }
    multiply(num) {
        this.acumulate *= num;
    }
    divideBy(num) {
        console.log(this.acumulate)
        if (num == 0) {
            this.error = true;
            this.message = "No se puede dividir por 0";
        } else {
            this.acumulate = this.acumulate / num;
            console.log(this.acumulate)
            console.log(num)
        }
    }
    potencia(num) {
        let timeBy = Math.abs(num);
        let acumTmp = this.acumulate;
        for (let i = 1; i < timeBy; i++) {
            acumTmp *= this.acumulate;
        }
        if (num < 0) {
            this.acumulate = 1 / acumTmp;
        } else {
            this.acumulate = acumTmp;
        }
    }
}

const C1 = new Calculadora();

//Arreglos para validaciones
const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const symbolsFirstPriority = ["^", "*", "/"];
const symbolsSecondPriority = ["+", "-"];

//Escoger elementos del DOM
//Cambiar main
let mainContent = document.getElementById("main");

//Section dentro del main
let calculatorContainer = document.getElementById("calculator-container");

//Eleccion para usar calculadora
let btnCalculator = document.getElementById("btn-calculator");

let btnInfografiaSalvador = document.getElementById("infografia-Salvador");

let  btnInfografiaAlberto = document.getElementById("infografia-Alberto");

//Obtener la ecuacion
let inputEcuacion = document.getElementById("ecuacion-resolver");

//Obtener los valores de xI y xF
let ecuacionXI = document.getElementById("ecuacion-xi");
let ecuacionXF = document.getElementById("ecuacion-xf");

//Boton para hacer la operacion
let buttonLineal = document.getElementById("btn-lineal");

//Seccion de la tabla dentro del main
let sectionTable = document.getElementById("section-table");
let containerTable = document.getElementById("container-table");

//Seleccionar el metodo biseccion
let selectBiseccion = document.getElementById("select-biseccion");

//Seleccionar el metodo regla falsa
let selectFalsa = document.getElementById("select-falsa");

//Titulo del metodo
let titleCalc = document.getElementById("metodoTitle");

//Aside
let aside = document.getElementById("aside");

//Variable para saber que metodo se seleccionó
let indice;

//Evento para mostrar la calculadora y ocultar el contenido principal
selectBiseccion.addEventListener("click", (e) => {
    e.preventDefault();

    calculatorContainer.style.display = "block";
    titleCalc.textContent = "Biseccion";
    indice = 1;
});

//Evento para mostrar la calculadora y ocultar el contenido principal
selectFalsa.addEventListener("click", (e) => {
    e.preventDefault();
    let calculatorContainer = document.getElementById("calculator-container");
    calculatorContainer.style.display = "block";
    titleCalc.textContent = "Regla Falsa";
    indice = 2;
});

//Evento para resolver la ecuacion
buttonLineal.addEventListener("click",(e)=>{
    e.preventDefault();
    //Obtener valores
    const ecuation = inputEcuacion.value;
    //Convertirlo a numero
    const xI = parseFloat(ecuacionXI.value);
    const xF = parseFloat(ecuacionXF.value);
    //Validar que no esten vacios
    if(ecuation === ""){
        alert("No se puede resolver la ecuacion sin valores");
        return;
    }else if(ecuacionXI.value === "" || ecuacionXF.value === ""){
        alert("No se puede resolver la ecuacion sin valores de xI y xF");
        return;
    }else if(isNaN(xI)){
        alert("El valor de xI no es un número");
        return;
    }else if(isNaN(xF)){
        alert("El valor de xF no es un número");
        return;
    }else{
    //Aparecer tabla
    sectionTable.style.display = "block";
    //Hacer formula y según el numero se adapta
    if(indice === 1){
        formIntegracion(ecuation, xI, xF, indice);
    }
    if(indice === 2){
        formIntegracion(ecuation, xI, xF, indice);
    }
    };
})

btnCalculator.addEventListener("click", (e) => {
    aside.style.display = "flex";
});

//Evento para mostrar la infografia de Salvador
btnInfografiaSalvador.addEventListener("click", (e) => {
    aside.style.display = "none";
    calculatorContainer.style.display = "none";
    sectionTable.style.display = "none";
/////////////////////////////////////
})

//Evento para mostrar la infografia de Alberto
btnInfografiaAlberto.addEventListener("click", (e) => {
    aside.style.display = "none";
    aside.style.display = "none";
    calculatorContainer.style.display = "none";
    sectionTable.style.display = "none";
/////////////////////////////////////
})

function replaceValues(ex, incognitaXarray, cb1, cb2) {
    //Borrar el espacio el blanco
    let cleanEcuation = "";
    for(let i = 0; i< ex.length; i++){
        if(ex[i]=== " "){
            continue;
        }else{
            cleanEcuation += ex[i];
        }
    }
    //Separar cada elemento
    let operation = cleanEcuation.split("");
    //Guardar la operacion ya con los digitos juntos
    let correctDigits = [];
    //Array alternativo por si hay parentesis
    let inParentesis = [];
    //Reemplaza valores y concatenar digitos
    operation = operation.map((item, index) => {
        let beforeIndex = index - 1;
        //Mas de 2 digitos
        if (numbers.includes(operation[beforeIndex]) && numbers.includes(item)) {
            //concatenar digitos
            let digits = operation[beforeIndex] + operation[index];
            //quitar el anterior ya que será parte del siguiente digito
            correctDigits.pop();
            //meter los digitos.
            correctDigits.push(digits.toString());
            //reemplazar las x
        } else if (item == "x") {
            item = incognitaXarray.toString();
            //Condicion para la multiplicacion con una variable
            if (numbers.includes(operation[beforeIndex])) {
                //Agregar signo multipliacion
                correctDigits.push("*");
                //Luego la variable
                correctDigits.push(item);
            } else {
                correctDigits.push(item);
            }
        } else {
            //si la x estaba sumando, restando o sola, pues agragarlo solo
            correctDigits.push(item);
        }
    });
    //Variable para ayudar a distinguir entre grupos
    let parentesisNum = 0;
    //Ciclo para separarlo por paréntesis
    while (correctDigits.includes("(") || correctDigits.includes(")")) {
        //indice parentesis
        let indexStart = correctDigits.indexOf("(");
        //indece ultimo parentesis
        let indexEnd = correctDigits.indexOf(")");
        //Cantidad de elementos dentro del parentesis
        let diff = indexEnd - indexStart;
        //Obtener los valores dentro del parentesis y meterlo como array
        inParentesis.push(correctDigits.splice(indexStart + 1, diff - 1)); //Mas 1 porque no toma en cuenta el ultimo
        //Quitar los parenteis
        //Actualizamos posiciones
        indexStart = correctDigits.indexOf("(");
        indexEnd = correctDigits.indexOf(")");
        diff = indexEnd - indexStart;
        //Por si no se indica "*" entre dos grupos de parentesis
        if (correctDigits[indexEnd + 1] === "(") {
            //Remplazar ")" por "*"
            correctDigits.splice(indexEnd, 1, "*");
            //Reemplazar el grupo por un string
            correctDigits.splice(indexStart, diff, `parentesis${parentesisNum}`);
        } else {
            //Reemplazar el grupo por un string
            correctDigits.splice(indexStart, diff + 1, `parentesis${parentesisNum}`); //Mas 1 porque no toma en cuenta el ultimo
        }
        //Distinguir los diferentes grupos
        parentesisNum++;
    }
    //Resolver parentesis y meterlo en donde esté "parentesis"
    for (let group in inParentesis) {
        //Hacer operaciones primera prioridad
        let firstStep = cb1(inParentesis[group]);
        //Hacer operaciones de segunda prioridad
        let secondStep = cb2(firstStep);
        //Identificar el lugar a meter el grupo
        let indexForAdd = correctDigits.indexOf(`parentesis${group}`);
        //Meterlo en array convirtiendolo en string
        correctDigits[indexForAdd] = secondStep.toString();
    }
    //Ahora realizar operaciones de toda la operacion en general, despues de resolver los parentesis;
    //Hacer operaciones de primer prioridad
    let firstStepOriginal = firstPriority(correctDigits);
    //Hacer operaciones de segunda prioridad
    let secondStepOriginal = secondPriority(firstStepOriginal);
    //Resultado final
    return secondStepOriginal; //////////////
}

function firstPriority(array) {
    let operation = array;
    //Ciclo para hacer operaciones de primera prioridad
    while (
        operation.includes("*") ||
        operation.includes("/") ||
        operation.includes("^")
    ) {
        while(operation.includes("^")) {
            let index = operation.indexOf("^");
            C1.acumulate = parseFloat(operation[index - 1]);
            //Potencia negativa o positiva
            if (operation[index + 1] == "-") {
                C1.potencia(operation[index + 1] + operation[index + 2]);
                //Quitar los valores ya operados
                operation.splice(index - 1, 4, C1.acumulate);
            } else {
                C1.potencia(parseFloat(operation[index + 1]));
                //Quitar los valores ya operados
                operation.splice(index - 1, 3, C1.acumulate);
            }
        }
        for (let i = 0; i < operation.length; i++) {
            //Potencia
            //Division
            if (operation[i] === "/") {
                let index = operation.indexOf("/");
                C1.acumulate = parseFloat(operation[index - 1]);
                C1.divideBy(parseFloat(operation[index + 1]));
                //Quitar los valores ya operados
                operation.splice(index - 1, 3, C1.acumulate);
            }
            //Multiplicacion
            if (operation[i] === "*") {
                let index = operation.indexOf("*");
                C1.acumulate = parseFloat(operation[index - 1]);
                C1.multiply(parseFloat(operation[index + 1]));
                //Quitar los valores ya operados
                operation.splice(index - 1, 3, C1.acumulate);
            }
        }
    }
    //retornar array, solo para que la siguiente funcion resuelva sumas y restas
    return operation;
}

function secondPriority(array) {
    let operation = array;
    // //Ciclo para hacer todas las operaciones de segunda prioridad
    while (operation.includes("+") || operation.includes("-")) {
        for (let i = 0; i < operation.length; i++) {
            let index;
            switch (operation[i]) {
                case "+":
                    index = operation.indexOf("+");
                    //Sumar anterior y posterior del signo
                    C1.acumulate = parseFloat(operation[i - 1]);
                    //Realizar operacion
                    C1.plus(parseFloat(operation[index + 1]));
                    //Quitar los valores usados y poner resultado
                    operation.splice(index - 1, 3, C1.acumulate);
                    i++;
                    break;
                case "-":
                    index = operation.indexOf("-");
                    //Restar anterior y posterior del signo
                    C1.acumulate = parseFloat(operation[i - 1]);
                    //Realizar operacion
                    C1.mainess(parseFloat(operation[index + 1]));
                    //Quitar los valores usados y poner resultado
                    operation.splice(index - 1, 3, C1.acumulate);
                    i++;
                    break;
            }
        }
    }
    //Retornar na operacion final
    return operation;
}

//FORMULAS
function formIntegracion(ecuation, xI, xF, form){
    let errorRelativo = 1000;
    let iteration = 1;//reflejar en la tabla
    let variableXI = xI;//reflejar tabla
    let variableXF = xF;//reflejar tabla
    let xM;//reflejar en la tabla
    let beforeXM = xM;
    let fxI;
    let fxF;
    let fxM;
    //Crear tabla
    const createTable = document.createElement("TABLE");
    //Crear encabezado de la tabla
    let fisrtRow = createTable.insertRow(0);
    fisrtRow.setAttribute("class", "table-header");
    fisrtRow.insertCell(0).textContent = "Iteración";
    fisrtRow.insertCell(1).textContent = "Xi";
    fisrtRow.insertCell(2).textContent = "Xf";
    fisrtRow.insertCell(3).textContent = "Xm";
    fisrtRow.insertCell(4).textContent = "Error Relativo";
            //Ponerle una clase a la primera fila
    createTable.setAttribute("class", "table-result");


    //Ciclo para hacer las iteraciones y operaciones
    do{
    //Averguar cual variable reemplazar
    console.log("-------------------"+ iteration + "-------------------");
    //Determinar funciones de xI, xF
    fxI = replaceValues(ecuation, [variableXI], firstPriority, secondPriority);
    fxF = replaceValues(ecuation, [variableXF], firstPriority, secondPriority);
    console.log(fxI);
    console.log(fxF);
    console.log(variableXI);
    console.log(variableXF);
    //Guardar el valor de xM anterior
    beforeXM = xM;
    //Determinar xM
    if(form == 1){
        //Biseccion
        //Xm con solo 6 decimanles
        xM = ((parseFloat(variableXI) + parseFloat(variableXF))/2).toFixed(6);
    }
    if( form == 2){
        //Regla Falsa
        //Xm con solo 6 decimanles
        xM = (variableXF-(fxF*(parseFloat(variableXF)-parseFloat(variableXI))/(fxF-fxI))).toFixed(6);
    }
    console.log(xM);
    //Determinar f(xM)
    fxM = replaceValues(ecuation, [xM], firstPriority, secondPriority);
    console.log(fxM);
    

//Crear fila de tabla antes de hacer la validación de cual variable cambiar
let rowTable = createTable.insertRow();
rowTable.setAttribute("class", "table-body");
rowTable.insertCell(0).textContent = iteration;
rowTable.insertCell(1).textContent = variableXI;
rowTable.insertCell(2).textContent = variableXF;
rowTable.insertCell(3).textContent = xM;

//Porque la primera iteración no tiene error relativo
if(xM == 0){
    rowTable.insertCell(4).textContent = `0%`;//Porque ya es exacto
    break
}else if(iteration>1){
    errorRelativo = (Math.abs((xM-beforeXM)/xM)*100).toFixed(2);
    rowTable.insertCell(4).textContent = `${errorRelativo}%`;
}else{
    rowTable.insertCell(4).textContent = "-";
}
//Cambiar variables
    if(fxI*fxM<0){
        variableXF = xM;
        console.log("cambioXF");
    }
    if(fxF*fxM<0){
        variableXI = xM;
        console.log("cambioXI");
    }
    iteration++;
    //condicion para seguir iterando
    }while(errorRelativo >= 1)


    //Limpiar contenido del contenedor
    containerTable.innerHTML = "";
    //Agregar tabla al contenedor
    containerTable.appendChild(createTable);
}

//Obtener botones del DOM
let buttonsCalcular = document.querySelectorAll(".calcButton .btn");

//Evento para el input de la ecuacion
let focusEcuacion = 0;
inputEcuacion.addEventListener("click", ()=>{
    focusEcuacion =  0;//El focus esta en este input de ecuacion
});

//Evento para el input de xf de la ecuacion
ecuacionXF.addEventListener("click", ()=>{
    focusEcuacion = 2;//El focus esta en este input de xF
});

//Evento para el input de xi de la ecuacion
ecuacionXI.addEventListener("click", ()=>{
    focusEcuacion = 1;//El focus esta en este input de xi
});


buttonsCalcular.forEach((button) => {
    //Poner el evento click a cada uno
    button.addEventListener("click", ()=>{
        if(button.textContent.trim() === "C"){
            if(focusEcuacion === 2){
                ecuacionXF.value = "";
            }else if(focusEcuacion === 1){
                ecuacionXI.value = "";
            }else{
                inputEcuacion.value = "";
            }
        }else if(button.textContent.trim() === "<="){
            if(focusEcuacion === 2){
                ecuacionXF.value = ecuacionXF.value.slice(0, -1);
            }else if(focusEcuacion === 1){
                ecuacionXI.value = ecuacionXI.value.slice(0, -1);
            }else{
            inputEcuacion.value = inputEcuacion.value.slice(0, -1);            
            }
        }else{
            if(focusEcuacion === 2){
                ecuacionXF.value+= button.textContent.trim();   
            }else if(focusEcuacion === 1){
                ecuacionXI.value += button.textContent.trim();   
            }else{
                inputEcuacion.value += button.textContent.trim();           
            }
        }    
    })
})

