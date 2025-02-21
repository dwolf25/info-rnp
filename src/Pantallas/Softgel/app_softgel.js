const sheetId = "1bZCQKsq1X2Av4HKpT-a101cA44H4Z7IYfP7R3wuFy6w"; // ID de la hoja
const sheetName = "prueba"; // Nombre de la pestaña codificado
const rangoEspecifico = "A1:G5"; // Rango específico a leer
import { apiKey } from "../api_key.js";

// Función para verificar la conexión con la API y la hoja de cálculo
async function verificarConexion() {
  const estadoElement = document.getElementById('estado-conexion');
  
  try {
    // Verificar que el apiKey existe
    if (!apiKey) {
      estadoElement.innerHTML = "Error: No se ha encontrado la API key";
      estadoElement.style.color = "red";
      console.error("Error: No se ha encontrado la API key");
      return false;
    }

    // Intentar acceder a la hoja de cálculo
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}?key=${apiKey}`;
    
    estadoElement.innerHTML = "Conectando con Google Sheets...";
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Verificar que existe la hoja específica
    const hojaExiste = data.sheets.some(sheet => 
      sheet.properties.title === sheetName
    );
    
    if (!hojaExiste) {
      throw new Error(`La hoja "${sheetName}" no existe en el documento`);
    }
    
    // Conexión exitosa
    estadoElement.innerHTML = `Conexión exitosa - ${data.properties.title}`;
    estadoElement.style.color = "green";
    console.log("Conexión establecida correctamente");
    return true;
    
  } catch (error) {
    estadoElement.innerHTML = `Error de conexión: ${error.message}`;
    estadoElement.style.color = "red";
    console.error("Error al verificar la conexión:", error);
    return false;
  }
}

// Función para cargar los datos de la hoja de cálculo incluyendo imágenes
async function cargarDatos() {
  const tableElement = document.getElementById('data-table');
  const estadoElement = document.getElementById('estado-conexion');
  
  if (!await verificarConexion()) {
    tableElement.innerHTML = '<tr><td>No se pudieron cargar los datos</td></tr>';
    return;
  }
  
  try {
    estadoElement.innerHTML = "Cargando datos...";
    
    // 1. Obtener valores básicos
    const range = `${sheetName}!${rangoEspecifico}`;
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(range)}?key=${apiKey}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    const { values } = await response.json();
    
    if (!values || values.length === 0) {
      throw new Error("No se encontraron datos en el rango especificado");
    }
    
    // 2. Obtener información adicional de celdas (formato, imágenes, etc.)
    const gridDataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}?key=${apiKey}&includeGridData=true&ranges=${encodeURIComponent(range)}`;
    const gridResponse = await fetch(gridDataUrl);
    
    if (!gridResponse.ok) {
      console.warn("No se pudo obtener información detallada de las celdas");
    }
    
    let gridData = null;
    try {
      const gridResponseData = await gridResponse.json();
      gridData = gridResponseData.sheets[0].data[0];
    } catch (e) {
      console.warn("Error al procesar datos de formato:", e);
    }
    
    // Construir tabla HTML
    let tableHTML = '';
    
    values.forEach((row, rowIndex) => {
      tableHTML += '<tr>';
      
      // Determinar el número de columnas total para el colspan
      const totalColumns = values[0].length;
      
      // Manejar cada celda de la fila
      if (rowIndex === 0 && row.length > 0) {
        // Primera fila: usar como encabezado principal con colspan
        tableHTML += `<th colspan="${totalColumns}">${procesarContenidoCelda(row[0], 0, 0, gridData)}</th>`;
      } else {
        // Otras filas: celdas normales
        row.forEach((cell, cellIndex) => {
          // Determinar si es un título de columna (fila 2, índice 1)
          if (rowIndex === 1) {
            tableHTML += `<th class="column-title">${procesarContenidoCelda(cell, rowIndex, cellIndex, gridData)}</th>`;
          } else if (rowIndex === 2) {
            tableHTML += `<th class="column-subtitle">${procesarContenidoCelda(cell, rowIndex, cellIndex, gridData)}</th>`;
          } else {
            tableHTML += `<td>${procesarContenidoCelda(cell, rowIndex, cellIndex, gridData)}</td>`;
          }
        });
      }
      
      tableHTML += '</tr>';
    });
    
    tableElement.innerHTML = tableHTML;
    estadoElement.innerHTML = "Datos cargados correctamente";
    estadoElement.style.color = "green";
    
  } catch (error) {
    tableElement.innerHTML = `<tr><td>Error al cargar datos: ${error.message}</td></tr>`;
    estadoElement.innerHTML = `Error: ${error.message}`;
    estadoElement.style.color = "red";
    console.error("Error al cargar datos:", error);
  }
}

// Función auxiliar para procesar el contenido de cada celda
function procesarContenidoCelda(cellValue, rowIndex, cellIndex, gridData) {
  // Si no hay datos de formato disponibles, simplemente devolver el valor
  if (!gridData || !gridData.rowData || !gridData.rowData[rowIndex]) {
    return cellValue || '';
  }
  
  try {
    const cellInfo = gridData.rowData[rowIndex].values[cellIndex];
    
    // Verificar si la celda contiene una imagen
    if (cellInfo && cellInfo.effectiveFormat && cellInfo.effectiveFormat.backgroundImage) {
      const imageUrl = cellInfo.effectiveFormat.backgroundImage.imageUrl;
      return `<img src="${imageUrl}" alt="Imagen en celda" style="max-width: 100%; height: auto;">`;
    }
    
    // Verificar fórmulas de imagen
    if (cellInfo && cellInfo.userEnteredValue && cellInfo.userEnteredValue.formulaValue) {
      const formula = cellInfo.userEnteredValue.formulaValue;
      if (formula.includes('IMAGE')) {
        const urlMatch = formula.match(/IMAGE\("([^"]+)"/);
        if (urlMatch && urlMatch[1]) {
          return `<img src="${urlMatch[1]}" alt="Imagen en celda" style="max-width: 100%; height: auto;">`;
        }
      }
    }
    
    // Verificar si contiene un enlace
    if (cellInfo && cellInfo.hyperlink) {
      return `<a href="${cellInfo.hyperlink}" target="_blank">${cellValue || cellInfo.hyperlink}</a>`;
    }
    
    // Si hay formato de texto enriquecido
    if (cellInfo && cellInfo.textFormatRuns) {
      // Aquí se podría implementar lógica para manejar formato enriquecido
      // Por simplicidad, devolvemos el valor simple
      return cellValue || '';
    }
    
    // Si no hay nada especial, devolver el valor normal
    return cellValue || '';
    
  } catch (e) {
    console.warn("Error al procesar celda:", e);
    return cellValue || '';
  }
}

// Iniciar el proceso cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
  cargarDatos();
  
  // Actualizar datos automáticamente cada 5 minutos
  setInterval(cargarDatos, 5 * 60 * 1000);
});

// Exportar funciones para uso en otros módulos
export {
  verificarConexion,
  cargarDatos
}
