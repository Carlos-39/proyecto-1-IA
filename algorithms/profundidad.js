import { Nodo } from '../nodo.js';
import { MapState } from '../map.js';

export function profundidad(initialState) {
    const stack = [];
    const explored = new Set();
    let profundidadMaxima = 0;

    const initialNode = new Nodo(initialState);
    stack.push(initialNode);

    while (stack.length > 0) {
        const currentNode = stack.shift(); 
        currentNode.expandir();

        // Verifica si es el nodo meta
        if (currentNode.esMeta()) {
            console.log(`Nodos expandidos: ${Nodo.nodosExpandidos}`);
            console.log(`Profundidad del árbol: ${currentNode.profundidad}`);
            console.log(`Profundidad máxima alcanzada: ${profundidadMaxima}`);
            console.log(`El pasajero ha sido recogido: ${currentNode.tienePasajero ? 'Sí' : 'No'}`);
            return constructPath(currentNode); // Retornar el camino hacia la meta
        }

        // Marca el nodo como explorado
        const estadoActual = JSON.stringify({
            position: currentNode.estado.getPositions().start,
            tienePasajero: currentNode.tienePasajero
        });
        explored.add(estadoActual);

        // Obtener movimientos posibles y ordenarlos
        let movements = currentNode.posiblesMovimientos();
        movements.sort((a, b) => ['arriba', 'abajo', 'izquierda', 'derecha'].indexOf(a) - ['arriba', 'abajo', 'izquierda', 'derecha'].indexOf(b));

        for (let move of movements) {
            const childNode = currentNode.aplicarOperador(move);
            if (childNode) {
                const estadoHijo = JSON.stringify({
                    position: childNode.estado.getPositions().start,
                    tienePasajero: childNode.tienePasajero
                });

                if (!explored.has(estadoHijo)) {
                    // Evitar ciclos
                    // if (!childNode.tienePasajero || !explored.has(JSON.stringify({
                    //     position: childNode.estado.getPositions().start,
                    //     tienePasajero: true
                    // }))) {
                    //     stack.push(childNode);
                    //     explored.add(estadoHijo);
                    // }
                    stack.push(childNode);
                    explored.add(estadoHijo);
                }
            }
        }

        // Actualiza la profundidad máxima
        if (currentNode.profundidad > profundidadMaxima) {
            profundidadMaxima = currentNode.profundidad;
        }
    }

    console.log(`No se encontró solución. Profundidad máxima alcanzada: ${profundidadMaxima}`);
    return [];
}

// Función para construir el camino hacia la meta
function constructPath(node) {
    const path = [];
    let currentNode = node;

    while (currentNode) {
        const position = currentNode.estado.getPositions().start; // Obtener posición del nodo
        path.push(position);
        currentNode = currentNode.padre; // Subir al nodo padre
    }

    return path.reverse(); // Retornar el camino en el orden correcto
}
