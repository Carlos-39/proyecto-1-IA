export class MapState {
	constructor() {
		this.matrix = []
		this.start = null
		this.passenger = null
		this.destination = null
	}

	// función que convierte el txt a matriz
	parseFileUpload(content) {
		// Divide el contenido del archivo por líneas y luego por espacios
    	this.matrix = content.trim().split('\n').map(line => line.split(' ').map(Number));
	}

	// función que encuentra una posición en el mapa
	findPosition(value) {
		for (let i = 0; i < this.matrix.length; i++) {
			for (let j = 0; j < this.matrix[i].length; j++) {
				if (this.matrix[i][j] === value) {
					return [i, j]; // Retorna la posición como tupla [x,y]
				}
			}
		}
		return null; // Retorna null si no se encuentra el valor
	}

	// Inicializar posiciones del vehículo, pasajero y destino
    initializePositions() {
        this.start = this.findPosition(2); // Vehículo
        this.passenger = this.findPosition(5); // Pasajero
        this.destination = this.findPosition(6); // Destino
    }

	// Obtener la matriz actual
    getMatrix() {
        return this.matrix;
    }

	// Obtener la posición del vehículo, pasajero, y destino
    getPositions() {
        return {
			start: this.start,
			passenger: this.passenger,
			destination: this.destination
		};
    }
}