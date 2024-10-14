import { Nodo } from '../nodo.js';
import { MapState } from '../map.js';

export function profundidad(initialState) {
    // Pila para los nodos por explorar
    const stack = [];
    const explored = new Set(); // Conjunto para almacenar nodos explorados
    let profundidadMaxima = 0; // Profundidad máxima del árbol

    // Crear el nodo inicial y añadirlo a la pila
    const initialNode = new Nodo(initialState);
    stack.push(initialNode);

    // Tiempo de inicio
    const startTime = performance.now();

    while (stack.length > 0) {
        const currentNode = stack.pop(); 
        currentNode.expandir();

        // Verifica si es el nodo meta
        if (currentNode.esMeta()) {
            const endTime = performance.now(); // Tiempo de fin de la búsqueda
            const tiempoComputo = (endTime - startTime).toFixed(2)

            document.getElementById('nodosExpandidos').textContent = `Cantidad de nodos expandidos: ${Nodo.nodosExpandidos}`;
            document.getElementById('profundidadMeta').textContent = `Profundidad del nodo meta encontrado: ${currentNode.profundidad}`;
            document.getElementById('profundidadMaxima').textContent = `Profundidad máxima del árbol alcanzada: ${profundidadMaxima}`;
            document.getElementById('heuristicaInicial').textContent = `Heurística inicial no requerida`;
            document.getElementById('heuristicaFinal').textContent = `Heurística final no requerida`;
            document.getElementById('costo').textContent = `Costo final no requerido`;
            document.getElementById('tiempoComputo').textContent = `Tiempo de cómputo: ${tiempoComputo} ms`;
            
            document.getElementById('algorithmInfo').classList.remove('invisible')
            document.getElementById('algorithmInfo').classList.add('visible')

            return constructPath(currentNode); // Retornar el camino hacia la meta
        }

        // Marcar el nodo como explorado
        explored.add(JSON.stringify({
            position: currentNode.estado.getPositions().start,
            tienePasajero: currentNode.tienePasajero
        }));

        // Obtener movimientos posibles y ordenarlos
        const movements = currentNode.posiblesMovimientos();

        // se invirten los movimientos para que cumpla con el comportamiento de la pila
        for (const move of movements.reverse()) {
            const childNode = currentNode.aplicarOperador(move); // Aplicar el operador

            // Verificar si el nodo hijo no ha sido explorado
            if (childNode && !explored.has(JSON.stringify({
                position: childNode.estado.getPositions().start,
                tienePasajero: childNode.tienePasajero
            }))) {
                stack.push(childNode);
                explored.add(JSON.stringify({
                    position: childNode.estado.getPositions().start,
                    tienePasajero: childNode.tienePasajero
                }));
            }
        }

        // Actualiza la profundidad máxima
        if (currentNode.profundidad >= profundidadMaxima) {
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
        path.push(currentNode.estado.getPositions().start); // Añadir la posición del nodo
        currentNode = currentNode.padre; // Subir al nodo padre
    }

    return path.reverse(); // Retornar el camino en el orden correcto
}
