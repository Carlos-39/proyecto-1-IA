import { Nodo } from '../nodo.js';
import { MapState } from '../map.js';

// Función heuristica -> suma de la distancia hasta el pasajero y luego hasta el destino
function heuristica(posActual, posPasajero, posDestino, tienePasajero) {
	// posición actual del vehículo
    const [x1, y1] = posActual;

    // Si el vehículo ya tiene al pasajero, distancia1 es 0 y solo cuenta distancia2 (distancia hasta el destino)
    if (tienePasajero) {
        const [x2, y2] = posDestino;
        const distancia2 = Math.abs(x1 - x2) + Math.abs(y1 - y2); // Distancia hasta el destino
        return distancia2; // Solo interesa ir al destino
    } else {
        const [pasajeroX, pasajeroY] = posPasajero;
        const [distanciaX, distanciaY] = posDestino;
        const distancia1 = Math.abs(x1 - pasajeroX) + Math.abs(y1 - pasajeroY); // Distancia hasta el pasajero
        const distancia2 = Math.abs(pasajeroX - distanciaX) + Math.abs(pasajeroY - distanciaY); // Distancia desde el pasajero hasta el destino
        return distancia1 + distancia2; // Suma de las dos distancias
    }
}

export function avara(initialState) {
    // Cola para los nodos por explorar
    const queue = [];
    const explored = new Set(); // Conjunto para almacenar nodos explorados
	let profundidadMaxima = 0; // Profundidad máxima del árbol

	// Obtener la posición del pasajero y el destino
	const { passenger, destination } = initialState.getPositions(); 

    // Crear el nodo inicial y añadirlo a la cola
    const initialNode = new Nodo(initialState);
	initialNode.heuristica = heuristica(initialState.start, passenger, destination, initialNode.tienePasajero);  // Calcular heurística
    queue.push(initialNode);

    while (queue.length > 0) {
		// Ordenar la cola por el valor de la heurística
        queue.sort((a, b) => a.heuristica - b.heuristica);

        const currentNode = queue.shift(); // Sacar el primer nodo de la cola

		// Mostrar la posición actual y su heurística
		const currentPos = currentNode.estado.getPositions().start;
		console.log(`Expandiendo nodo en posición ${currentPos} con heurística: ${currentNode.heuristica}`);

		currentNode.expandir(); // Incrementar el contador de nodos expandidos

        // Verificar si es el nodo meta
        if (currentNode.esMeta()) {
			console.log(`Nodos expandidos: ${Nodo.nodosExpandidos}`);
			// console.log(`Profundidad del árbol: ${currentNode.profundidad}`);
			// console.log(`Profundidad máxima alcanzada: ${profundidadMaxima}`)
            console.log(`El pasajero ha sido recogido: ${currentNode.tienePasajero ? 'Sí' : 'No'}`);
			// console.log(`Costo final: ${currentNode.costo}`)
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
				// Calcular la heurística combinada para el nodo hijo
                childNode.heuristica = heuristica(
					childNode.estado.getPositions().start, 
					passenger, 
					destination, 
					childNode.tienePasajero
				);
                
				// Mostrar la heurística del nodo hijo antes de añadirlo a la cola
				const childPos = childNode.estado.getPositions().start;
				console.log(`Nodo hijo en posición ${childPos} con heurística: ${childNode.heuristica}`);
				
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
