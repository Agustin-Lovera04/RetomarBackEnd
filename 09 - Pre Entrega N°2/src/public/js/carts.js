const socket = io();
const postCartForm = document.getElementById("postCartForm");
const responseFetch = document.getElementById("responseFetch");

postCartForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  let title = document.getElementById("titleCart").value;
  try {
    fetch(`http://localhost:3000/api/carts/${title}`, {
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          return (responseFetch.innerHTML = `<p style="background-color:red;">${data.error} </p>`);
        }

        postCartForm.reset();
        responseFetch.innerHTML = `<p style="background-color:green;">Carrito Creado Con Exito</p>`;
      });
  } catch (error) {
    console.log(error);
    return (responseFetch.innerHTML = `<p style="background-color:red;">Error inesperado del Servidor </p>`);
  }
});

const putCartForm = document.getElementById("putCartForm");
putCartForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  let putIdCart = document.getElementById("putIdCart").value;

  let formData = new FormData(putCartForm);
  try {
    fetch(`http://localhost:3000/api/carts/modCart/${putIdCart}`, {
      method: "PUT",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          return (responseFetch.innerHTML = `<p style="background-color:red;">${data.error} </p>`);
        }

        putCartForm.reset();
        responseFetch.innerHTML = `<p style="background-color:green;">Carrito Modificado Con Exito</p>`;
      });
  } catch (error) {
    console.log(error);
    return (responseFetch.innerHTML = `<p style="background-color:red;">Error inesperado del Servidor </p>`);
  }
});

const deleteCartForm = document.getElementById("deleteCartForm");
deleteCartForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  let deleteIdCart = document.getElementById("deleteIdCart").value;

  try {
    fetch(`http://localhost:3000/api/carts/deleteCart/${deleteIdCart}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          return (responseFetch.innerHTML = `<p style="background-color:red;">${data.error} </p>`);
        }

        deleteCartForm.reset();
        responseFetch.innerHTML = `<p style="background-color:green;">Carrito Eliminado Con Exito</p>`;
      });
  } catch (error) {
    console.log(error);
    return (responseFetch.innerHTML = `<p style="background-color:red;">Error inesperado del Servidor </p>`);
  }
});

socket.on("listCarts", (carts) => {
  let containerCarts = document.getElementById("containerCarts");
  containerCarts.innerHTML = "";
  carts.forEach((cart) => {

//SI ES MAYOR A 0 USAMOS UN O.TERNARIO PARA QUE LISTE LOS PRODUCTOS CON MAP, Y VAYA HACIENDO LA LISTA CON JOIN, Y SI NO HAY PRODUCTOS, QUE DIGA QUE NO HAY PRODUCTOS
    let productsList = cart.products.length > 0 ? cart.products.map(product => `
        <li>- Id: ${product.product._id} - Title: ${product.product.title}</li>
    `).join('') 
    : "<li>No hay productos en este carrito.</li>"



    let cartDOM = `
        <ul>
            <li >
            Nombre: <span style="font-weight: bold;">${cart.title}</span><br>  
                Productos: <br>
                <ul>
                    ${productsList}
                </ul>
            ID de Carrito: <span>${cart._id} </span>
            <hr>
            </li>
        </ul>
        `;

    containerCarts.innerHTML += cartDOM;
  });
});
