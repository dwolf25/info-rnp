const sheetId = "1Vxos6DxnA54F_mXPX1WdiXzfx-CDYFWX-M7nnwNqpQ8"; // ID de la hoja
const sheetName = "Sobres%2FPolvo%2FStick"; // Nombre de la pestaña codificado
const apiKey = "AIzaSyDb5CuFLvb3YJLIPBaU1Gbs_y8oIURShLU"; // Reemplázalo con tu clave de API

// Rango de celdas dinámico
const ranges = ["A2:T18", "A25:T42", "K54:T71"]; // Lista de rangos deseados
let currentRangeIndex = 0; // Índice inicial del rango

const fetchData = async () => {
  try {
    const range = ranges[currentRangeIndex]; // Selecciona el rango actual
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}!${range}?key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.values) {
      console.error("No se encontraron datos. Revisa el nombre de la pestaña o los permisos.");
      return;
    }

    const rows = data.values;
    const table = document.getElementById("data-table");
    table.innerHTML = ""; // Limpiar contenido

    const maxColumns = rows.reduce((max, row) => Math.max(max, row.length), 0);

    rows.forEach((row, rowIndex) => {
      const tr = document.createElement("tr");

      if (rowIndex === 0 || rowIndex === 1) {
        for (let colIndex = 0; colIndex < maxColumns; colIndex++) {
          const td = document.createElement(rowIndex === 0 ? "th" : "td");

          if (colIndex === 0 && rowIndex === 0) {
            td.setAttribute("colspan", "10");
            td.classList.add("center-text");
            td.textContent = row[0] || "";
            tr.appendChild(td);
            colIndex += 9;
          } else if (colIndex === 10 && rowIndex === 0) {
            td.setAttribute("colspan", "10");
            td.classList.add("center-text");
            td.textContent = row[10] || "";
            tr.appendChild(td);
            colIndex += 10;
          } else if (colIndex === 0 && rowIndex === 1) {
            td.setAttribute("colspan", "10");
            td.classList.add("center-text");
            td.textContent = row[0] || "";
            tr.appendChild(td);
            colIndex += 9;
          } else if (colIndex === 10 && rowIndex === 1) {
            td.setAttribute("colspan", "10");
            td.classList.add("center-text");
            td.textContent = row[10] || "";
            tr.appendChild(td);
            colIndex += 9;
          } else {
            td.textContent = row[colIndex] || "";
            tr.appendChild(td);
          }
        }
      } else if (rowIndex === 2) {
        for (let colIndex = 0; colIndex < maxColumns; colIndex++) {
          const td = document.createElement("th");
          td.classList.add("column-title");
          td.textContent = row[colIndex] || "";
          tr.appendChild(td);
        }
      } else {
        for (let colIndex = 0; colIndex < maxColumns; colIndex++) {
          const cell = row[colIndex] || "";
          const td = document.createElement("td");

          if (cell.startsWith("R:")) {
            td.style.backgroundColor = "red";
          } else if (cell.startsWith("M:")) {
            td.style.backgroundColor = "yellow";
          } else if (cell.startsWith("--")) {
            td.style.backgroundColor = "orange";
          } else if (cell.startsWith("A:")) {
            td.style.backgroundColor = "#3ce7fd";
          }

          if (cell === "TRUE") {
            td.innerHTML = '<div class="true-circle"></div>';
          } else if (cell === "FALSE") {
            td.innerHTML = '<div class="false-circle"></div>';
          } else {
            td.textContent = cell;
          }

          tr.appendChild(td);
        }
      }

      table.appendChild(tr);
    });

    // Cambiar al siguiente rango
    currentRangeIndex = (currentRangeIndex + 1) % ranges.length; // Alternar entre los rangos
  } catch (error) {
    console.error("Error al obtener los datos:", error);
  }
};

// Llama a la función para cargar los datos
fetchData();

// Actualiza los datos cada 10 segundos
setInterval(fetchData, 12000);
