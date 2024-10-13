import { MapState } from './map.js'
import { profundidad } from './profundidad.js'; 
import { amplitud } from './amplitud.js';
import { costoUniforme } from './costo.js';
import { avara } from './avara.js';
import { aEstrella } from './aEstrella.js';

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

// función para ejecutar el algoritmo seleccionado
function executeAlgorithm(algorithm) {
	switch (algorithm) {
		case 'amplitud':
			console.log("Ejecutando amplitud")
			const initialStateAmp = new MapState();
            initialStateAmp.matrix = mapState.getMatrix(); // Usar la matriz actual
            initialStateAmp.initializePositions(); // Inicializar posiciones
            const pathAmp = amplitud(initialStateAmp); // Llamar al algoritmo de amplitud
            console.log("Camino encontrado:", pathAmp);
			break;
		case 'costoUniforme':
			console.log("Ejecutando costo uniforme")
			const initialStateCost = new MapState();
            initialStateCost.matrix = mapState.getMatrix(); // Usar la matriz actual
            initialStateCost.initializePositions(); // Inicializar posiciones
            const pathCost = costoUniforme(initialStateCost); // Llamar al algoritmo de amplitud
            console.log("Camino encontrado:", pathCost);
			break;
		case 'profundidad':
			console.log("Ejecutando profundidad");
            const initialStateProf = new MapState();
            initialStateProf.matrix = mapState.getMatrix(); // Usar la matriz actual
            initialStateProf.initializePositions(); // Inicializar posiciones
            const pathProf = profundidad(initialStateProf); // Llamar al algoritmo de profundidad
            console.log("Camino encontrado:", pathProf);
			break;
		case 'avara':
			console.log("Ejecutando avara")
			const initialStateAva = new MapState();
            initialStateAva.matrix = mapState.getMatrix(); // Usar la matriz actual
            initialStateAva.initializePositions(); // Inicializar posiciones
            const pathAva = avara(initialStateAva); // Llamar al algoritmo de búsqueda avara
            console.log("Camino encontrado:", pathAva);
			break;
		case 'AStar':
			console.log("Ejecutando A*")
			const initialStateAst = new MapState();
            initialStateAst.matrix = mapState.getMatrix(); // Usar la matriz actual
            initialStateAst.initializePositions(); // Inicializar posiciones
            const pathAst = aEstrella(initialStateAst); // Llamar al algoritmo de búsqueda A*
            console.log("Camino encontrado:", pathAst);
			break;
	}
}