const socket = io()

const chatPageContainer = document.getElementById('chatPage-Container')
const identidad = document.getElementById('identidad')
let userName = identidad.dataset.userName
let userEmail = identidad.dataset.email
const chatForm = document.getElementById('chat-Form')
const messagesContainer = document.getElementById('messages-Container')


/* Swal.fire({
    title: "Ingrese su correo electronico",
    input: "email",
    inputPlaceholder: "Ingrese su email aqui",
  })

  .then((response) => {
    if(!response.value){
        chatPageContainer.innerHTML = ''
        chatPageContainer.innerHTML = `<h3 style="color:red;">Contenido Bloqueado - Debes ingresar un email para acceder</h3>`
        return null
    }
    socket.emit('correo' , response.value)
    identidad.innerHTML = `<h4 style="color:green;">Ingresaste con el email: ${response.value}</h4>`
    user = response.value
    return user
  }) */

  socket.on('newUser', (userName) => {
    Toastify({
        text: `Se a conectado un nuevo Usuario ${userName}`,
        className: "info",
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        }
      }).showToast();
  })

  chatForm.addEventListener('submit' , async (event)=>{
    event.preventDefault()
    let inputMessage = document.getElementById('message')
    let message = inputMessage.value

    if (message.trim().length === 0) {
        alert("Escriba un mensaje");
        return null;
      }


      socket.emit('message', {user: userEmail, message: message})
      inputMessage.value = ''
  })


  socket.on('newMessage', (datos)=>{
    let newMessage = document.createElement('p')
    newMessage.classList.add('message')
    newMessage.innerHTML = `
    <strong>${userName}</strong>
    <p>${datos.message}</p><hr>
    `
    messagesContainer.append(newMessage)
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
})