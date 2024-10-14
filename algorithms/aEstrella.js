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

export function aEstrella(initialState) {
    // Cola para los nodos por explorar
    const queue = [];
    const explored = new Set(); // Conjunto para almacenar nodos explorados
	let profundidadMaxima = 0; // Profundidad máxima del árbol

	// Obtener la posición del pasajero y el destino
	const { passenger, destination } = initialState.getPositions(); 	

    // Crear el nodo inicial y añadirlo a la cola
    const initialNode = new Nodo(initialState);

    // Agregar el valor de heuristica al nodo
	initialNode.heuristica = heuristica(initialState.start, passenger, destination, initialNode.tienePasajero);  // Calcular heurística
    
    queue.push(initialNode);

    // Tiempo de inicio
    const startTime = performance.now();

    while (queue.length > 0) {
		// Ordenar la cola de nodos por el valor total (costo acumulado + heurística) para priorizar el nodo con menor costo total
        queue.sort((a, b) => (a.costo + a.heuristica) - (b.costo + b.heuristica));

        const currentNode = queue.shift(); // Sacar el primer nodo de la cola
		currentNode.expandir(); // Incrementar el contador de nodos expandidos

        // Verificar si es el nodo meta
        if (currentNode.esMeta()) {
			const endTime = performance.now(); // Tiempo de fin de la búsqueda
            console.log('Termino la búsqueda')
			console.log(`Cantidad de nodos expandidos: ${Nodo.nodosExpandidos}`);
			console.log(`Profundidad del nodo meta encontrado: ${currentNode.profundidad}`);
			console.log(`Profundidad máxima del árbol alcanzada: ${profundidadMaxima}`)
            console.log(`Heurística inicial: ${initialNode.heuristica}`)
            console.log(`Heurística final de la solución encontrada: ${currentNode.heuristica}`)
            console.log(`Costo final de la solución encontrada: ${currentNode.costo}`)
            console.log(`Tiempo de cómputo: ${(endTime - startTime).toFixed(2)} ms`)
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
				// Calcular heurística para el nodo hijo
                const { start, passenger, destination } = childNode.estado.getPositions();
                childNode.heuristica = heuristica(start, passenger, destination, childNode.tienePasajero);
				
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
