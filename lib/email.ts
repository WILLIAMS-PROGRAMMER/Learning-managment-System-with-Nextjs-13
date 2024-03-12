import nodemailer from 'nodemailer';

// Configurar el transportador
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

//tambien puede ser interface, la diferencia es que type es mas flexible en cuanto a la creacion de tipos
type Correo = {
    name: string;
    email: string;
    comment: string;
    phoneNumber: string;
}

export default async function enviarCorreo({name, email, comment, phoneNumber}:Correo) {
    try {
        // Enviar correo electrónico
        await transporter.sendMail({
            from: email,
            to: 'avendano.balarezo.williams@gmail.com',
            subject: 'UN USUARIO QUIERE CONTACTARSE CONTIGO',
            html: `
            <div style="background-color: #3490dc; color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <h1 style="font-size: 28px; font-weight: bold; margin-bottom: 16px;">Hola Williams Avendaño</h1>
                <hr style="border-top: 2px solid #ffffff; margin-bottom: 16px;">
                <p style="margin-bottom: 12px;"><strong style="color: #ffd700;">Nombre:</strong> ${name}</p>
                <p style="margin-bottom: 12px;"><strong style="color: #ffd700;">Correo:</strong> ${email}</p>
                <p style="margin-bottom: 12px;"><strong style="color: #ffd700;">Comentario:</strong> ${comment}</p>
                <p><strong style="color: #ffd700;">Número de Celular:</strong> ${phoneNumber}</p>
            </div>
            `
        });
        console.log('Correo electrónico enviado exitosamente');
    } catch (error) {
        console.error('Error al enviar el correo electrónico:', error);
    }
}


