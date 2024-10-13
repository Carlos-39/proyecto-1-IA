import { Nodo } from '../nodo.js';
import { MapState } from '../map.js';

export function costoUniforme(initialState) {
    // Cola para los nodos por explorar
    const queue = [];
    const explored = new Set(); // Conjunto para almacenar nodos explorados
	let profundidadMaxima = 0; // Profundidad máxima del árbol

    // Crear el nodo inicial y añadirlo a la cola
    const initialNode = new Nodo(initialState);
    queue.push(initialNode);

    while (queue.length > 0) {
		// Ordenar la cola por costo acumulado y sacar el nodo con menor costo
        queue.sort((a, b) => a.costo - b.costo);

        const currentNode = queue.shift(); // Sacar el primer nodo de la cola
		currentNode.expandir(); // Incrementar el contador de nodos expandidos

        // Verificar si es el nodo meta
        if (currentNode.esMeta()) {
			console.log(`Nodos expandidos: ${Nodo.nodosExpandidos}`);
			console.log(`Profundidad del árbol: ${currentNode.profundidad}`);
			console.log(`Profundidad máxima alcanzada: ${profundidadMaxima}`)
            console.log(`El pasajero ha sido recogido: ${currentNode.tienePasajero ? 'Sí' : 'No'}`);
			console.log(`Costo final: ${currentNode.costo}`)
            return constructPath(currentNode); // Retornar el camino hacia la meta
        }

        // Marcar el nodo como explorado
        explored.add(JSON.stringify({
            position: currentNode.estado.getPositions().start,
            tienePasajero: currentNode.tienePasajero
        }));

        // Obtener los movimientos posibles desde el nodo actual
        const movements = currentNode.posiblesMovimientos();

        for (const move of movements) {
            const childNode = currentNode.aplicarOperador(move); // Aplicar el operador

            // Verificar si el nodo hijo no ha sido explorado
            if (childNode && !explored.has(JSON.stringify({
                position: childNode.estado.getPositions().start,
                tienePasajero: childNode.tienePasajero
            }))) {
                queue.push(childNode);
                explored.add(JSON.stringify({
                    position: childNode.estado.getPositions().start,
                    tienePasajero: childNode.tienePasajero
                }));
            }
        }

		// Actualizar la profundidad máxima
		if (currentNode.profundidad > profundidadMaxima) {
			profundidadMaxima = currentNode.profundidad;
		}
    }

	console.log(`No se encontró solución. Profundidad máxima alcanzada: ${profundidadMaxima}`); // Imprimir si no hay solución
    return []; // Si no se encuentra solución, retornar vacío
}

// Función para construir el camino hacia la meta
function constructPath(node) {
    const path = [];
    let currentNode = node;

    // Recorrer hacia atrás desde el nodo meta hasta el inicial
    while (currentNode) {
        path.push(currentNode.estado.getPositions().start); // Añadir la posición del nodo
        currentNode = currentNode.padre; // Subir al nodo padre
    }

    return path.reverse(); // Retornar el camino en el orden correcto
}
