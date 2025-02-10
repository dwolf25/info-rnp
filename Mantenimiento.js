
//? ARCHIVO PARA ENLAZAR CUANDO SEA NECESARIO HACER UN MANTENIMIENTO DE LA PANTALLA.


document.addEventListener("DOMContentLoaded", () => {
    // Crear el contenedor principal
    const container = document.createElement("div");
    container.id = "container";
  
    // Crear el título
    const title = document.createElement("h1");
    title.textContent = "MANTENIMIENTO";
    title.style.marginBottom = "20px";
  
    // Crear el div para datos
    const dataContainer = document.createElement("div");
    dataContainer.id = "data-container";
    dataContainer.textContent = "Aquí se mostrarán los datos de la API.";
    
    // Estilo para el contenedor principal
    Object.assign(container.style, {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#f0f4f8",
      padding: "20px",
      boxSizing: "border-box",
      textAlign: "center",
    });
  
    // Estilo para el contenedor de datos
    Object.assign(dataContainer.style, {
      width: "100%",
      maxWidth: "600px",
      padding: "20px",
      backgroundColor: "#fff",
      borderRadius: "10px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      fontSize: "16px",
      lineHeight: "1.5",
    });
  
    // Añadir elementos al contenedor principal
    container.appendChild(title);
    container.appendChild(dataContainer);
  
    // Añadir el contenedor al cuerpo del documento
    document.body.appendChild(container);
  });
  