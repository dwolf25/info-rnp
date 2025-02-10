// Dirección del servidor WebSocket
const socket = new WebSocket('ws://192.168.11.15:4010');

// Evento cuando la conexión se establece
socket.addEventListener('open', () => {
  console.log('Conexión WebSocket establecida.');
});

// Evento cuando se recibe un mensaje del servidor
socket.addEventListener('message', (event) => {
  const data = JSON.parse(event.data);

  if (data.action === 'update') {
    console.log('Actualización periódica recibida. Recargando la página...');
    location.reload(); // Refresca la página
  }
});

// Evento cuando la conexión WebSocket se cierra
socket.addEventListener('close', () => {
  console.log('Desconectado del servidor WebSocket.');
  setTimeout(() => {
    console.log('Intentando reconectar...');
    socket = new WebSocket('ws://192.168.11.15:4010');
  }, 1000); // Intentará reconectar después de 1 segundo
});

// Evento para manejar errores de conexión
socket.addEventListener('error', (error) => {
  console.log('Error en la conexión WebSocket:', error);
});
