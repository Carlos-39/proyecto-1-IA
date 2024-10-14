import { MapState } from './map.js';

// Costos de movimiento
const costos = {
    0: 1,  // tráfico liviano
    1: Infinity, // muro (no se puede atravesar)
    2: 0,  // posición del vehículo (costo inicial)
    3: 4,  // tráfico medio
    4: 7,  // tráfico pesado
    5: 1,  // pasajero
    6: 1   // destino
};

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
	constructor(estado, padre = null, operador = null, profundidad = 0, costo = 0, heuristica = null, tienePasajero = false){
		this.estado = estado
		this.padre = padre
		this.operador = operador
		this.profundidad = profundidad
		this.costo = costo
		this.heuristica = heuristica,
		this.tienePasajero = tienePasajero
	}

	// Estático para contar nodos expandidos
	static nodosExpandidos = 0;

	// compara dos nodos para ver si son iguales (mismo estado)
	isEqualTo(node){
		return JSON.stringify(this.estado.getMatrix()) === JSON.stringify(node.estado.getMatrix());
	}

	// Verifica si el nodo es el nodo meta
    esMeta() {
        const { start, destination } = this.estado.getPositions();
		return JSON.stringify(start) === JSON.stringify(destination) && this.tienePasajero;
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
			// Calcula el costo de movimiento a la nueva posición
			const costoMovimiento = costos[nuevoEstado.matrix[nuevoX][nuevoY]];

    	    // Actualizar la matriz: quitar la antigua posición del vehículo
    	    nuevoEstado.matrix[x][y] = 0;  // 0 es celda vacía

    	    // Colocar el vehículo en la nueva posición
    	    nuevoEstado.start = [nuevoX, nuevoY];

    	    nuevoEstado.matrix[nuevoX][nuevoY] = 2;  // Coloca el vehículo en la nueva posición

			let tienePasajero = this.tienePasajero;

			// Si el vehículo llega a la posición del pasajero, actualizamos el estado
			if (JSON.stringify(nuevoEstado.start) === JSON.stringify(nuevoEstado.passenger)) {
				tienePasajero = true;
			}

			// return del nuevo nodo
    	    return new Nodo(nuevoEstado, this, operador, this.profundidad + 1, this.costo + costoMovimiento, null, tienePasajero);
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

	// Al expandir un nodo, incrementa el contador
	expandir() {
		Nodo.nodosExpandidos++; // Incrementar el contador de nodos expandidos
	}
}