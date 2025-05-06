import nodemailer from 'nodemailer'

const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: "agusrugbyy@gmail.com",
        pass: "qisb goud unza uioy"
    }
}
)

export const enviarMail = async ( to, subject, message) => { 
      let success = true
      try {
        
        let send = await transport.sendMail({
          to, subject,
          html: message
        })
        
        if(send.accepted.length === 0){
          return {success: false, error: 'Error Interno al enviar el emial - Intente mas tarde'}
        }
        
        return {success, send: 'Email Enviado correctmente - Revise su casilla de correo.'}
      } catch (error) {
        return {success: false, error: `Error Interno (${error}) - Intente mas tarde`}
      }
}      
