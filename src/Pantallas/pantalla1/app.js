const sheetId = "1Vxos6DxnA54F_mXPX1WdiXzfx-CDYFWX-M7nnwNqpQ8"; // ID de la hoja
    const sheetName = "PruebaJonas"; // Nombre de la pestaña codificado
    const apiKey = "AIzaSyDb5CuFLvb3YJLIPBaU1Gbs_y8oIURShLU"; // Reemplázalo con tu clave de API

    const fetchData = async () => {
      try {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}!A1:Z19?key=${apiKey}`;
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
                // Combina de A1 a I1
                td.setAttribute("colspan", "9");
                td.classList.add("center-text");
                td.textContent = row[0] || "";
                tr.appendChild(td);
                colIndex += 8; // Salta las columnas ya combinadas
              } else if (colIndex === 9 && rowIndex === 0) {
                // Combina de J1 a R1
                td.setAttribute("colspan", "9");
                td.classList.add("center-text");
                td.textContent = row[9] || "";
                tr.appendChild(td);
                colIndex += 8; // Salta las columnas ya combinadas
              } else if (colIndex === 0 && rowIndex === 1) {
                // Combina de A2 a I2
                td.setAttribute("colspan", "9");
                td.classList.add("center-text");
                td.textContent = row[0] || "";
                tr.appendChild(td);
                colIndex += 8; // Salta las columnas ya combinadas
              } else if (colIndex === 9 && rowIndex === 1) {
                // Combina de J2 a R2
                td.setAttribute("colspan", "9");
                td.classList.add("center-text");
                td.textContent = row[9] || "";
                tr.appendChild(td);
                colIndex += 8; // Salta las columnas ya combinadas
              } else {
                td.textContent = row[colIndex] || ""; // Inserta texto para otras celdas
                tr.appendChild(td);
              }
            }
          } else if (rowIndex === 2) {
            // Fila 3: aplicar fondo diferente para los títulos
            for (let colIndex = 0; colIndex < maxColumns; colIndex++) {
              const td = document.createElement("th");
              td.classList.add("column-title"); // Aplicar fondo a la fila 3
              td.textContent = row[colIndex] || ""; // Inserta texto de las celdas
              tr.appendChild(td);
            }
          } else {
            // Rellenar filas normales
            for (let colIndex = 0; colIndex < maxColumns; colIndex++) {
              const cell = row[colIndex] || ""; // Usa un valor vacío si no hay datos
              const td = document.createElement("td");

              // Aplicar el fondo según el valor de la celda
              if (cell.startsWith("R:")) {
                td.style.backgroundColor = "red"; // Fondo rojo si empieza con "R:"
              } else if (cell.startsWith("M:")) {
                td.style.backgroundColor = "yellow"; // Fondo amarillo si empieza con "M:"
              }
              else if (cell.startsWith("--")){
                td.style.backgroundColor = "orange"; // fondo naranja
              }
              else if (cell.startsWith("A:")){
                td.style.backgroundColor = "#3ce7fd";
              }

              // Comprobación de si el valor de la celda es TRUE o FALSE
              if (cell === "TRUE") {
                td.innerHTML = '<div class="true-circle"></div>'; // Circunferencia verde
              } else if (cell === "FALSE") {
                td.innerHTML = '<div class="false-circle"></div>'; // Circunferencia roja
              } else {
                td.textContent = cell; // Inserta el texto de la celda
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