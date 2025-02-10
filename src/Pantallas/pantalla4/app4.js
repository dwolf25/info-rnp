const sheetId = "1Vxos6DxnA54F_mXPX1WdiXzfx-CDYFWX-M7nnwNqpQ8";
const sheetName = "Liquidos%2FDoypack";
const apiKey = "AIzaSyDb5CuFLvb3YJLIPBaU1Gbs_y8oIURShLU";

let rangeIndex = 0;
const ranges = ["D1:R12", "D26:R35"];

const fetchData = async () => {
  try {
    const currentRange = ranges[rangeIndex];
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}!${currentRange}?key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.values) {
      console.error("No se encontraron datos. Revisa el nombre de la pestaña o los permisos.");
      return;
    }

    // Filtrar las columnas J, K, L
    const rows = data.values.map(row => 
      row.filter((_, colIndex) => !(colIndex >= 6 && colIndex <= 8))
    );

    const table = document.getElementById("data-table");
    table.innerHTML = "";

    const maxColumns = rows.reduce((max, row) => Math.max(max, row.length), 0);

    rows.forEach((row, rowIndex) => {
      const tr = document.createElement("tr");

      if (rowIndex === 0) {
        // Primera celda (D1:I2)
        const td1 = document.createElement("th");
        td1.setAttribute("colspan", "6");
        td1.setAttribute("rowspan", "2");
        td1.classList.add("center-text");
        td1.textContent = row[0] || "";
        tr.appendChild(td1);

        // Segunda celda (M1:R2)
        const td2 = document.createElement("th");
        td2.setAttribute("colspan", "6");
        td2.setAttribute("rowspan", "2");
        td2.classList.add("center-text");
        td2.textContent = row[6] || "";
        tr.appendChild(td2);
      } else if (rowIndex === 1) {
        // No hacemos nada en la segunda fila ya que está combinada con la primera
        table.appendChild(tr); // Importante: añadimos la fila vacía
      } else if (rowIndex === 2) {
        // Subtítulos
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
  } catch (error) {
    console.error("Error al obtener los datos:", error);
  }
};

const switchRange = () => {
  rangeIndex = (rangeIndex + 1) % ranges.length;
  fetchData();
};

fetchData();
setInterval(switchRange, 10000);