const socket = io()

socket.on('newUser', dato =>{
    
    let ulFamilia = document.querySelector('ul')
    let liNewUser = document.createElement('li')
    liNewUser.innerHTML = dato.nombre
    ulFamilia.append(liNewUser)
})