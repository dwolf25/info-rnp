const sheetId = "1Vxos6DxnA54F_mXPX1WdiXzfx-CDYFWX-M7nnwNqpQ8"; // ID de la hoja
const sheetName = "Monolab%2FMarchesini"; // Nombre de la pestaña codificado
const apiKey = "AIzaSyDb5CuFLvb3YJLIPBaU1Gbs_y8oIURShLU"; // Reemplázalo con tu clave de API


const fetchData = async () => {
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}!C1:T12?key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.values) {
      console.error("No se encontraron datos. Revisa el nombre de la pestaña o los permisos.");
      return;
    }

    const rows = data.values.map(row => row.filter((_, colIndex) => colIndex < 8 || colIndex > 9)); // Excluir K y L
    const table = document.getElementById("data-table");
    table.innerHTML = ""; // Limpiar contenido

    const maxColumns = rows.reduce((max, row) => Math.max(max, row.length), 0);

    rows.forEach((row, rowIndex) => {
      const tr = document.createElement("tr");

      if (rowIndex === 0) {
        for (let colIndex = 0; colIndex < maxColumns; colIndex++) {
          const td = document.createElement("th");

          if (colIndex === 0) {
            // Combinar C1:J2 (vertical y horizontalmente)
            td.setAttribute("colspan", "8");
            td.setAttribute("rowspan", "2");
            td.classList.add("center-text");
            td.textContent = row[colIndex] || "";
            tr.appendChild(td);
            colIndex += 7;
          } else if (colIndex === 8) {
            // Combinar M1:T2 (vertical y horizontalmente)
            td.setAttribute("colspan", "8");
            td.setAttribute("rowspan", "2");
            td.classList.add("center-text");
            td.textContent = row[colIndex] || "";
            tr.appendChild(td);
            colIndex += 7;
          } else {
            td.textContent = row[colIndex] || "";
            tr.appendChild(td);
          }
        }
      } else if (rowIndex === 1) {
        // Omitir C2:J2 y M2:T2 porque ya están combinadas con rowspan
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
          else if (cell.startsWith("-SI-")){
            td.style.backgroundColor = "red";
            td.style.color = "white";
          
          }
          else if (cell.startsWith("-NO-")){
            td.style.backgroundColor = "green";
            td.style.color = "white";
          
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
  } catch (error) {
    console.error("Error al obtener los datos:", error);
  }
};

// Llama a la función para cargar los datos
fetchData();

// Actualiza los datos cada 30 segundos
setInterval(fetchData, 10000);
