let btnFinallyBuy = document.getElementById('btn-FinallyBuy')

btnFinallyBuy.addEventListener('click', async ()=>{
    try {
        await fetch('http://localhost:3000/api/carts/finallyBuy',{
            method: " POST",
           /*  body: */
            
        })
    } catch (error) {
        
    }
})