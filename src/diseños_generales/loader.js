document.addEventListener('DOMContentLoaded', function() {

    const loader = document.querySelector('.contenedor_loader');
    
    //Asegurar de que el loader esté visible inicialmente
    if(loader){
        loader.computedStyleMap.display = 'flex';
    }
    
    // Función para ocultar el loader
    function hideLoader() {
        if (loader) {
            // Agregar una transición de fade out
            loader.style.opacity = '0';
            loader.style.transition = 'opacity 0.5s ease';
            
            // Después de la transición, quitar el elemento del flujo del documento
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }
    }
    
    // Esperar al menos 2 segundos antes de ocultar el loader
    setTimeout(function() {
        // Verificar si todas las imágenes y recursos están cargados
        if (document.readyState === 'complete') {
            hideLoader();
        } else {
            // Si aún no está todo cargado, agregar un evento para cuando termine
            window.addEventListener('load', hideLoader);
        }
    }, 1000);
    
    });


    
    
    
    
    // Función para refrescar la página
function refreshPage() {
    // Recargar la página actual
    window.location.reload();
    console.log("Página refrescada automáticamente: " + new Date().toLocaleTimeString());
}

// Calcular el tiempo en milisegundos (1 hora = 60 minutos * 60 segundos * 1000 milisegundos)
const oneHour = (120 * 60) * 1000;

// Configurar el intervalo para refrescar la página cada hora
const refreshInterval = setInterval(refreshPage, oneHour);

// Opcional: Para mostrar cuánto tiempo falta para el próximo refresco
function updateCountdown() {
    const nextRefresh = new Date(Date.now() + oneHour);
    console.log("Próximo refresco programado para: " + nextRefresh.toLocaleTimeString());
}

// Ejecutar la función de cuenta regresiva al cargar la página
updateCountdown();

// Para detener el refresco automático si es necesario (función opcional)
function stopAutoRefresh() {
    clearInterval(refreshInterval);
    console.log("Refresco automático detenido");
}

// Ejemplo de uso: stopAutoRefresh(); // Descomenta para utilizar