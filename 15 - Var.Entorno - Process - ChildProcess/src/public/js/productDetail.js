const btnAddCart = document.getElementById("btnIdProduct")
const responseFetch = document.getElementById('responseFetch')
btnAddCart.addEventListener("click", async (event) => {
    event.preventDefault()

    let productId = event.target.dataset.productId
    let cartUserID = document.getElementById('cartUserID').getAttribute('cartUserID')
    try {
        fetch(`http://localhost:3000/api/carts/${cartUserID}/product/${productId}`,{
        method:"POST"
       })

       .then((response) => response.json())
       .then((data) => {
        if (data.error) {
            return (responseFetch.innerHTML = `<p style="background-color:red;">${data.error} </p>`);
          }
          responseFetch.innerHTML = `<p style="background-color:green;">Producto Agregado al Carrito </p>`
        })
  
      } catch (error) {
        return (responseFetch.innerHTML = `<p style="background-color:red;"> ${error}</p>`);
      }  
})