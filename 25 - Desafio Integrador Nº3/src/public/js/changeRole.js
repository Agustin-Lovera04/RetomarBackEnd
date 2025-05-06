let formChangeRole = document.getElementById('formChangeRole')
let responseContainer = document.getElementById('response')

formChangeRole.addEventListener('submit', async (e) => {
  e.preventDefault()

  const dataForm = new FormData(formChangeRole)

  try {
    const res = await fetch('http://localhost:3000/api/sessions/changeRol', {
      method: "POST",
      body: dataForm
    })

    const data = await res.json()

    if (data.error) {
      return responseContainer.innerHTML = `<p style="background-color:red;">${data.error}</p>`
    }
    
    responseContainer.innerHTML = `<p style="background-color:green;">Cambio de rol realizado con éxito</p>`
    
    return setTimeout(()=> {
        window.location.href=('/api/sessions/logout')
      }, 3000)
    
  } catch (error) {
    return responseContainer.innerHTML = `<p style="background-color:red;">Error inesperado del Servidor - ${error}</p>`
  }
})
