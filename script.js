import { MapState } from './map.js'
import { profundidad } from './algorithms/profundidad.js'; 
import { amplitud } from './algorithms/amplitud.js';
import { costoUniforme } from './algorithms/costo.js';
import { avara } from './algorithms/avara.js';
import { aEstrella } from './algorithms/aEstrella.js';

// Instancia de la clase para manejar el estado del mapa
const mapState = new MapState();

// Leer archivo txt de la entrada
document.getElementById('fileInput').addEventListener('change', handleFileUpload)

// función que maneja el evento que dispara la carga del archivo
function handleFileUpload(event) {
	// Obtener el txt
	const file = event.target.files[0]

	// validar que sea txt el archivo
	if (!file || !file.name.endsWith('.txt')) {
		alert('Por favor selecciona un archivo .txt valido')
		return
	}

	// leer el txt
	const reader = new FileReader()

	reader.onload = (e) => {
		const content = e.target.result
		
		// convertir el txt en matriz
		mapState.parseFileUpload(content)
		console.log(mapState.getMatrix())

		// Inicializar posiciones del vehículo, pasajero y destino
        mapState.initializePositions()

		// renderizar la matriz en el DOM
		renderMatrix(mapState.getMatrix())

		// Cambiar el tamaño del header para ajustar la tabla
        document.querySelector('.header-container').classList.add('encoger');
		document.querySelector('.header--title-container').classList.add('encoger')
		document.querySelector('h1')
		document.querySelector('.header--info').classList.add('invisible')
        document.querySelector('.form-container').classList.add('encoger');

		// Acceder a las posiciones del vehículo, pasajero, y destino
        const { start, passenger, destination } = mapState.getPositions();

        if (!start || !passenger || !destination) {
            console.log("No se encontraron las posiciones requeridas.");
        } else {
            console.log("Vehículo:", start, "Pasajero:", passenger, "Destino:", destination);
        }
	}

	// iniciar la lectura del archivo
	reader.readAsText(file)
}

// función para renderizar la matriz en el DOM
function renderMatrix(matrix) {
	// Traer el contenedor donde va a ir el mapa
	const mapContainer = document.getElementById('mapContainer');
	
	// limpiar el DOM por si hay algo ya renderizado
	mapContainer.innerHTML = ''

	// crear tabla
	const table = document.createElement('table');

	// iterar sobre la fila de la matriz
	matrix.forEach(row => {
		// Crear nueva fila
		const tr = document.createElement('tr');

		// iterar sobre las elementos de cada fila
		row.forEach(element => {
			// Crear el elemento
			const td = document.createElement('td');

			// Asignar clase de CSS dependiendo el valor de la celda
			td.classList.add(`elemento-${element}`)

			// añadir el elemento a la fila
			tr.appendChild(td);
		})

		// añadir la fila a la tabla
		table.appendChild(tr);
	})

	// añadir la tabla al contenedor
	mapContainer.appendChild(table)

	// mostrar la sección de selección del algoritmo
	const algorithmContainer = document.querySelector('.main-algorithm-container')
	algorithmContainer.classList.remove('invisible')
	algorithmContainer.classList.add('visible')
}

// Manejador de selección del algoritmo y su tipo de búsqueda
document.getElementById('algorithmTypeForm').addEventListener('change', () => {
	// traer el valor que el usuario seleccione
	const selectedType = document.querySelector('input[name="searchType"]:checked').value
	
	// Mostrar las opciones dependiendo de la elección
	if (selectedType === 'uninformed') {
		document.getElementById('uninformedOptions').classList.remove('invisible');
        document.getElementById('uninformedOptions').classList.add('visible');
        document.getElementById('informedOptions').classList.remove('visible');
        document.getElementById('informedOptions').classList.add('invisible');
	} else if (selectedType === 'informed') {
		document.getElementById('informedOptions').classList.remove('invisible');
        document.getElementById('informedOptions').classList.add('visible');
        document.getElementById('uninformedOptions').classList.remove('visible');
        document.getElementById('uninformedOptions').classList.add('invisible');
	}
})

// Manejador de la ejecución de algoritmos de búsqueda no informada
document.getElementById('uninformedAlgorithmForm').addEventListener('submit', (event) => {
	event.preventDefault();
	
	// algoritmo seleccionado
	const selectedAlgorithm = document.querySelector('input[name="uninformedAlgorithm"]:checked').value

	console.log("Algoritmo de búsqueda no informada: ", selectedAlgorithm)

	executeAlgorithm(selectedAlgorithm);
})

// Manejador de la ejecución de algoritmos de búsqueda informada
document.getElementById('informedAlgorithmForm').addEventListener('submit', (event) => {
	event.preventDefault();
	
	// algoritmo seleccionado
	const selectedAlgorithm = document.querySelector('input[name="informedAlgorithm"]:checked').value

	console.log("Algoritmo de búsqueda informada: ", selectedAlgorithm)

	executeAlgorithm(selectedAlgorithm);
})

// Función para animar el movimiento del vehículo por el camino encontrado
function animatePath(path) {
    const mapContainer = document.getElementById('mapContainer');
    const tableCells = mapContainer.getElementsByTagName('td');
    
    // Limpiar cualquier movimiento previo
    for (let cell of tableCells) {
        if (cell.classList.contains('vehicle')) {
            cell.classList.remove('vehicle');
        }
    }

	// Marcar la celda inicial casilla libre
    const startCell = path[0];
    const startCellIndex = startCell[0] * mapState.getMatrix()[0].length + startCell[1]; // fila * ancho + columna
    tableCells[startCellIndex].classList.remove('elemento-2');
	tableCells[startCellIndex].classList.add('elemento-0');

    let index = 0; // Inicializa el índice del camino
    const interval = setInterval(() => {
        // Limpiar la clase del vehículo en la celda anterior
        if (index > 0) {
            const prevCell = path[index - 1];
            const prevCellIndex = prevCell[0] * mapState.getMatrix()[0].length + prevCell[1]; // fila * ancho + columna
            tableCells[prevCellIndex].classList.remove('vehicle');
        }

        // Si hemos llegado al final del camino, limpiar el intervalo
        if (index >= path.length) {
            clearInterval(interval);
            return;
        }

        // Obtener la celda actual y añadir la clase de vehículo
        const currentCell = path[index];
        const currentCellIndex = currentCell[0] * mapState.getMatrix()[0].length + currentCell[1]; // fila * ancho + columna
        tableCells[currentCellIndex].classList.add('vehicle');

		// Verificar si el vehículo ha llegado a la casilla del pasajero
        const { passenger } = mapState.getPositions();
        if (currentCell[0] === passenger[0] && currentCell[1] === passenger[1]) {
            // Cambiar la clase de la celda del pasajero a una casilla libre
            tableCells[currentCellIndex].classList.remove('elemento-5');
            tableCells[currentCellIndex].classList.add('elemento-0');
        }

        index++; // Mover al siguiente índice
    }, 500); // tiempo de cambio de 500ms
}

// función para ejecutar el algoritmo seleccionado
function executeAlgorithm(algorithm) {
	let path

	switch (algorithm) {
		case 'amplitud':
			console.log("Ejecutando amplitud")
			const initialStateAmp = new MapState();
            initialStateAmp.matrix = mapState.getMatrix(); // Usar la matriz actual
            initialStateAmp.initializePositions(); // Inicializar posiciones
            const pathAmp = amplitud(initialStateAmp); // Llamar al algoritmo de amplitud
            console.log("Camino encontrado:", pathAmp);
			path = pathAmp;
			break;
		case 'costoUniforme':
			console.log("Ejecutando costo uniforme")
			const initialStateCost = new MapState();
            initialStateCost.matrix = mapState.getMatrix(); // Usar la matriz actual
            initialStateCost.initializePositions(); // Inicializar posiciones
            const pathCost = costoUniforme(initialStateCost); // Llamar al algoritmo de amplitud
            console.log("Camino encontrado:", pathCost);
			path = pathCost;
			break;
		case 'profundidad':
			console.log("Ejecutando profundidad");
            const initialStateProf = new MapState();
            initialStateProf.matrix = mapState.getMatrix(); // Usar la matriz actual
            initialStateProf.initializePositions(); // Inicializar posiciones
            const pathProf = profundidad(initialStateProf); // Llamar al algoritmo de profundidad
            console.log("Camino encontrado:", pathProf);
			path = pathProf
			break;
		case 'avara':
			console.log("Ejecutando avara")
			const initialStateAva = new MapState();
            initialStateAva.matrix = mapState.getMatrix(); // Usar la matriz actual
            initialStateAva.initializePositions(); // Inicializar posiciones
            const pathAva = avara(initialStateAva); // Llamar al algoritmo de búsqueda avara
            console.log("Camino encontrado:", pathAva);
			path = pathAva
			break;
		case 'AStar':
			console.log("Ejecutando A*")
			const initialStateAst = new MapState();
            initialStateAst.matrix = mapState.getMatrix(); // Usar la matriz actual
            initialStateAst.initializePositions(); // Inicializar posiciones
            const pathAst = aEstrella(initialStateAst); // Llamar al algoritmo de búsqueda A*
            console.log("Camino encontrado:", pathAst);
			path = pathAst
			break;
	}

	// Animar el camino encontrado
    animatePath(path);
}