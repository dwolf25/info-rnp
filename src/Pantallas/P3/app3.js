const sheetId = "1Vxos6DxnA54F_mXPX1WdiXzfx-CDYFWX-M7nnwNqpQ8";
const sheetName = "Sobres%2FPolvo%2FStick%2FManuales";
import { apiKey } from "../api_key.js";

const ranges = ["D1:T12", "D36:T46", "N48:T60"];
let currentRangeIndex = 0;

const fetchData = async () => {
  try {
    const range = ranges[currentRangeIndex];
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}!${range}?key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.values) {
      console.error("No se encontraron datos. Revisa el nombre de la pestaña o los permisos.");
      return;
    }

    // Identificar si estamos en el rango N39:T57
    const isLastRange = range === "N48:T60";
    
    // Filtrar las columnas K, L, M
    const rows = data.values.map(row => {
      if (isLastRange) {
        return row; // No filtramos columnas en el último rango
      }
      return row.filter((_, colIndex) => !(colIndex >= 7 && colIndex <= 9));
    });
    
    const table = document.getElementById("data-table");
    table.innerHTML = "";

    const maxColumns = rows.reduce((max, row) => Math.max(max, row.length), 0);

    // Crear un array para almacenar los subtítulos
    let subtitulos = [];
    if (rows[2]) {
        subtitulos = [...rows[2]];
    }

    rows.forEach((row, rowIndex) => {
      const tr = document.createElement("tr");

      if (rowIndex === 0) {
        // Primera celda
        const td1 = document.createElement("th");
        if (isLastRange) {
          td1.setAttribute("colspan", maxColumns);
        } else {
          td1.setAttribute("colspan", "7");
        }
        td1.setAttribute("rowspan", "2");
        td1.classList.add("center-text");
        td1.textContent = row[0] || "";
        tr.appendChild(td1);

        // Segunda celda (solo si no es el último rango)
        if (!isLastRange) {
          const td2 = document.createElement("th");
          td2.setAttribute("colspan", "7");
          td2.setAttribute("rowspan", "2");
          td2.classList.add("center-text");
          td2.textContent = row[7] || "";
          tr.appendChild(td2);
        }
      } else if (rowIndex === 1) {
        // No hacemos nada en la segunda fila
        table.appendChild(tr);
      } else if (rowIndex === 2) {
        // Crear las celdas de subtítulos una por una
        subtitulos.forEach(subtitulo => {
          const td = document.createElement("th");
          td.classList.add("column-title");
          td.textContent = subtitulo || "";
          tr.appendChild(td);
        });
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

    currentRangeIndex = (currentRangeIndex + 1) % ranges.length;
  } catch (error) {
    console.error("Error al obtener los datos:", error);
  }
};

fetchData();
setInterval(fetchData, 12000);