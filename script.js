// Leer archivo txt de la entrada
document.getElementById('fileInput').addEventListener('change', handleFileUpload)

// función que maneja el evento que dispara la carga del archivo
function handleFileUpload(event) {
	// Obtener el txt
	const file = event.target.files[0]

	// validar que sea txt el archivo
	if (!file || !file.name.endsWith('.txt')) {
		alert('Por favor selecciona un archivo .txt valido')
	}

	// leer el txt
	const reader = new FileReader()

	reader.onload = (e) => {
		const content = e.target.result
		
		// convertir el txt en matriz
		const matrix = parseFileUpload(content)
		console.log(matrix)
	}

	// iniciar la lectura del archivo
	reader.readAsText(file)
}

// función que convierte el txt a matriz
function parseFileUpload(content) {
	// Divide el contenido del archivo por líneas y luego por espacios
    return content.trim().split('\n').map(line => line.split(' ').map(Number));
}