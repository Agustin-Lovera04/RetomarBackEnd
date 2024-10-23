const socket = io()

const postCartForm = document.getElementById('postCartForm')
const responseFetch = document.getElementById('responseFetch')

postCartForm.addEventListener('click',async (event) =>{
    event.preventDefault()

    let title = document.getElementById('titleCart').value
    try {
        fetch(`http://localhost:3000/api/carts/${title}`, {
            method: 'POST'
        })

        .then((response) => response.json())
        .then((data)=>{
            if(data.error){
                return (responseFetch.innerHTML = `<p style="background-color:red;">${data.error} </p>`);
            }

            postCartForm.reset()
      responseFetch.innerHTML = `<p style="background-color:green;">Carrito Creado Con Exito</p>`

        })

    } catch (error) {
        console.log(error)
        return (responseFetch.innerHTML = `<p style="background-color:red;">Error inesperado del Servidor </p>`);
    }
})


socket.on('listCarts', (carts)=>{
    let containerCarts = document.getElementById('containerCarts')
    containerCarts.innerHTML = ''

    carts.forEach(cart =>{
        let cartDOM = `
        <ul>
            <li >
            Nombre: <span style="font-weight: bold;">${cart.title} </span><br>
            Productos: <span>${cart.products}  </span><br>
            ID: <span>${ cart._id }</span>
            </li>
        </ul>
        `

        containerCarts.innerHTML += cartDOM
    })
})