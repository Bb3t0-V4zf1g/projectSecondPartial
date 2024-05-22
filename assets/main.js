//En cada operacion, primero poner el primer digito en la propiedad "acumulate", luego llamar el método a realizar, y poner como argumento el otr numero

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
        if (num == 0) {
            this.error = true;
            this.message = "No se puede dividir por 0";
        } else {
            this.acumulate = this.acumulate / num;
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
let ex = "34-5x";

let ex1 = "3x";

let ex3 = "1/3x";

let ex4 = "4^-3+1/3*4";

let ex5 = "(88x*6)*87+9x*(9-8)(6-1)";

const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

const symbolsFirstPriority = ["^", "*", "/"];

const symbolsSecondPriority = ["+", "-"];

function replaceValues(ex, arrayIncognitas, cb1, cb2) {
    //Separar cada elemento
    let operation = ex.split("");
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
            item = arrayIncognitas[0].toString();
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
    console.log(`f(x)= ${secondStepOriginal.toString()}`);
    return secondStepOriginal; //////////////
}

///LLAMAR FUNCION
replaceValues(ex5, [5, 4], firstPriority, secondPriority);

function firstPriority(array) {
    let operation = array;
    //Ciclo para hacer operaciones de primera prioridad
    while (
        operation.includes("*") ||
        operation.includes("/") ||
        operation.includes("^")
    ) {
        for (let i = 0; i < operation.length; i++) {
            //Potencia
            if (operation[i] === "^") {
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
    return operation;
}
