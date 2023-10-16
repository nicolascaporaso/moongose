import nodemailer from 'nodemailer';

export async function sendEmailsToDeletedProducts(data, id) {
    console.log(id);
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: false, 
        auth: {
            user: 'gorjosocial@gmail.com',
            pass: 'zsoqacogrbstqqwp',
        },
        tls: {
            rejectUnauthorized: false
        }
        
    });

    const mailOptions = {
        from: "gorjosocial@gmail.com",
        to: data,
        subject: 'Aviso de eliminación de producto',
        text: `se ha eliminado el producto ${id}`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Correo enviado a ${data}`);
        return 'producto eliminado y correo enviado a usuario premium'
    } catch (error) {
        console.error(`Error al enviar el correo a ${data}: ${error.message}`);
    }


transporter.close();
}

