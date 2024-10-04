// Leer archivo txt de la entrada
document.getElementById('fileInput').addEventListener('change', handleFileUpload)

let matrix = []; // Variable para almacenar la matriz
let start, passenger, destination; // Variables para almacenar posiciones

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
		matrix = parseFileUpload(content)
		console.log(matrix)

		// renderizar la matriz en el DOM
		renderMatrix(matrix)

		// Cambiar el tamaño del header para ajustar la tabla
        document.querySelector('.header-container').classList.add('encoger');
		document.querySelector('.header--title-container').classList.add('encoger')
		document.querySelector('h1')
		document.querySelector('.header--info').classList.add('invisible')
        document.querySelector('.form-container').classList.add('encoger');

		// Encontrar las posiciones del vehículo, pasajero y destino
        start = findPosition(matrix, 2); // Posición del vehículo
        passenger = findPosition(matrix, 5); // Posición del pasajero
        destination = findPosition(matrix, 6); // Posición del destino

        if (!start || !passenger || !destination) {
            console.log("No se encontraron las posiciones requeridas.");
        }
	}

	// iniciar la lectura del archivo
	reader.readAsText(file)
}

// función que convierte el txt a matriz
function parseFileUpload(content) {
	// Divide el contenido del archivo por líneas y luego por espacios
    return content.trim().split('\n').map(line => line.split(' ').map(Number));
}

// función para encontrar la posición de un valor en la matriz
function findPosition(matrix, value) {
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] === value) {
                return { x: i, y: j }; // Retorna la posición como objeto
            }
        }
    }
    return null; // Retorna null si no se encuentra el valor
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
			break;
		case 'costoUniforme':
			console.log("Ejecutando costo uniforme")
			break;
		case 'profundidad':
			console.log("Ejecutando profundidad")
			break;
		case 'avara':
			console.log("Ejecutando avara")
			break;
		case 'AStar':
			console.log("Ejecutando A*")
			break;
	}
}