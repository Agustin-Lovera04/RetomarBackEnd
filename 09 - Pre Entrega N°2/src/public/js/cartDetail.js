const socket = io();

const formDeleteProductInCart = document.getElementById("deleteProductInCart");
const responseFetch = document.getElementById("responseFetch");
const idCartContain = document.getElementById("idCart");
const idCart = idCartContain.dataset.cartId;

formDeleteProductInCart.addEventListener("submit", async (event) => {
  event.preventDefault();

  let idProduct = document.getElementById("idValue").value;

  try {
    fetch(`/api/carts/${idCart}/product/${idProduct}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          return (responseFetch.innerHTML = `<p style="background-color:red;">${data.error} </p>`);
        }

        formDeleteProductInCart.reset()
        responseFetch.innerHTML = `<p style="background-color:green;">Producto Eliminado Con Exito</p>`;
      });
  } catch (error) {
    return (responseFetch.innerHTML = `<p style="background-color:red;">Error inesperado del Servidor </p>`);
  }
});



socket.on("cart", (cart) => {
 const containerCart = document.getElementById('containerCart')
 containerCart.innerHTML = ''

 //Debemos hacer esto de JSON.Stringify, ya que por mas de que el cart este poblado, JS no desglosa lo sobjetos como lo hace automaticamente handlebars, por lo tanto si yo queiro usar: {{this.product}} Como en habdlebars, no me va a mostrar el producto poblado, Solo muestra el ID.
 // por lo tanto debemos pasarlo a Cadena y ahi acceder a el producto completo ya poblado y accesible para JS
 
 let productsList = cart.products.length > 0 ? cart.products.map(product => `
    <li>
        Producto ID: ${JSON.stringify(product.product, null, 2)}
        <br>
        Cantidad: ${product.quantity}
    </li>
`).join('') 
: "<li>No hay productos en este carrito.</li>"


containerCart.innerHTML = `
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
});
  