import { MapState } from './map.js';

// constructor del nodo
export class Nodo {
	/**
    	* Constructor para crear un nuevo nodo.
    	* @param {estado} estado - El estado del nodo.
    	* @param {Nodo} padre - El nodo padre del actual (puede ser null)
    	* @param {number} operador - La dirección desde la que se llegó al nodo actual
    	* @param {number} profundidad - La profundidad del nodo en el árbol de búsqueda
    	* @param {number} costo - El costo acumulado de llegar al nodo
    	* @param {number|null} heuristica - El valor de la heurística
     */
	constructor(estado, padre = null, operador = null, profundidad = 0, costo = 0, heuristica = null){
		this.estado = estado
		this.padre = padre
		this.operador = operador
		this.profundidad = profundidad
		this.costo = costo
		this.heuristica = heuristica
	}

	// compara dos nodos para ver si son iguales (mismo estado)
	isEqualTo(node){
		return JSON.stringify(this.estado.getMatrix()) === JSON.stringify(node.estado.getMatrix());
	}

	// Verifica si el nodo es el nodo meta
    esMeta() {
        const { start, destination } = this.estado.getPositions();
		return JSON.stringify(start) === JSON.stringify(destination);
    }

	// Aplica un operador y retorna un nuevo nodo con el estado actualizado
	aplicarOperador(operador) {
    	// Crea una copia del estado actual
    	const nuevoEstado = new MapState();
    	nuevoEstado.matrix = JSON.parse(JSON.stringify(this.estado.getMatrix()));
    	nuevoEstado.start = [...this.estado.start];
    	nuevoEstado.passenger = [...this.estado.passenger];
    	nuevoEstado.destination = [...this.estado.destination];

    	const [x, y] = nuevoEstado.start; // Posición actual del vehículo

    	// Aplicar movimiento dependiendo del operador (0 = arriba, 1 = derecha, 2 = abajo, 3 = izquierda)
    	let nuevoX = x, nuevoY = y;
    	switch (operador) {
    	    case 0: nuevoX = x - 1; break; // arriba
    	    case 1: nuevoY = y + 1; break; // derecha
    	    case 2: nuevoX = x + 1; break; // abajo
    	    case 3: nuevoY = y - 1; break; // izquierda
    	}

    	// Validar si el movimiento es posible
    	if (this.esMovimientoValido(nuevoX, nuevoY)) {
    	    // Actualizar la matriz: quitar la antigua posición del vehículo
    	    nuevoEstado.matrix[x][y] = 0;  // 0 es celda vacía

    	    // Colocar el vehículo en la nueva posición
    	    nuevoEstado.start = [nuevoX, nuevoY];
    	    nuevoEstado.matrix[nuevoX][nuevoY] = 2;  // 2 representa el vehículo

    	    return new Nodo(nuevoEstado, this, operador, this.profundidad + 1, this.costo + 1);
    	}

    	return null; // Si el movimiento no es válido, no se genera un nuevo nodo
	}

	// Verifica si un movimiento es válido (dentro de los límites del mapa y no es un obstáculo)
    esMovimientoValido(x, y) {
        const matriz = this.estado.getMatrix();
        return (x >= 0 && x < matriz.length && y >= 0 && y < matriz[0].length && matriz[x][y] !== 1); // 1 es muro
    }

	// Obtiene los posibles movimientos (operadores válidos) desde el estado actual
    posiblesMovimientos() {
        const movimientos = [];
        for (let i = 0; i < 4; i++) { // 0 = arriba, 1 = derecha, 2 = abajo, 3 = izquierda
            if (this.aplicarOperador(i) !== null) {
                movimientos.push(i); // Agrega el operador si genera un estado válido
            }
        }
        return movimientos;
    }
}