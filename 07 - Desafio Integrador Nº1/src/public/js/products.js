const socket = io();

//Tomamos los elementos del DOM
const responseFetch = document.getElementById("responseFetch");
const postProductForm = document.getElementById("postProductForm");

//Escuchamos el evento del formulario
postProductForm.addEventListener("submit", async (event) => {
  event.preventDefault(); //Le decimos que vamos a manejar el envio manualmente

  const dataForm = new FormData(postProductForm); // Utlizxamos el metodo FormData de JS para que haga el "clave-valor" con la info del form

  //Fetch a API
  try {
    fetch("http://localhost:3000/api/products", {
      method: "POST",
      body: dataForm,
    })
      .then((response) => response.json()) //Debemos dejar uttilizable la respuesta del Fetch por eso la convertimos en .json
      .then((data) => {
        if (data.error) {
          return (responseFetch.innerHTML = `<p style="background-color:red;">${data.error} </p>`);
        }
        postProductForm.reset();

        return (responseFetch.innerHTML = `<p style="background-color:green;">Producto Agregado Con Exito</p>`);
      });
  } catch (error) {
      return (responseFetch.innerHTML = `<p style="background-color:red;">Error inesperado del Servidor </p>`);
  }
});


socket.on('listProducts', (products)=>{
    let containerProducts = document.getElementById('containerProducts')
    containerProducts.innerHTML = ''

    products.forEach(product => {
      const productDOM = `
      <ul>
        <li >
        Nombre: <span style="font-weight: bold;">${product.title}</span><br>
        Descripcion: <span>${product.description} </span><br>
        ID: <span>${product._id} </span>
        </li>
      </ul>
    });
    `
    containerProducts.innerHTML += productDOM
  })
})
