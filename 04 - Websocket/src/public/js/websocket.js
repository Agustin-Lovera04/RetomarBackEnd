const socket = io()

let nombre = prompt('Ingrese su nombre')
document.title = nombre

socket.on('saludo', (datos)=>{
    console.log(`${datos.emisor} dice: ${datos.mensaje}`)

    socket.emit('nombre', {nombre})
})

socket.on('newUser', (datos)=>{
    console.log(`${datos.emisor} Informa: ${datos.mensaje}`)
})