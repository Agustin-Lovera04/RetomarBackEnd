//IDea para el DTO (Como nosotros en JWT ya borramos los datos confidenciales, vamos a usar un DTO simbolico ( solo vamos a pasar las propiedaes a mayuscula o miniuscula yesas pavadas-
//ejemlo en el /current enviar el user al DTO 

export const currentDTO =(user)=>{
    user.first_name = user.first_name.toUpperCase()
    user.last_name = user.last_name.toUpperCase()
    return user
}
