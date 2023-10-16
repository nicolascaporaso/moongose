import UserManager from '../DAO/mongo/user.ManagerMongoDB.js'; // Importa tu modelo de usuario
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { createHash } from '../utils/bcrypt.js';


const User= UserManager;

class ResetPasswordController {
    async renderForgotPasswordForm(req, res) {
        // Renderiza el formulario para solicitar la recuperación de contraseña

        res.render('forgot-password');
    }

    async sendResetEmail(req, res) {
        const email  = req.body.email;

        try {
            // Busca el usuario por su dirección de correo electrónico
            const user = await User.findOneByEmail({ email });

            if (!user) {
                return res.status(404).send('se ha enviado un mail, al correo asociado');
            }

            // Genera un token de restablecimiento de contraseña con expiración de 1 hora
            const token = jwt.sign({ userId: user._id }, 'tu-secreto', { expiresIn: '1h' });

            // Envía un correo electrónico con el enlace de restablecimiento
            const resetLink = `http://127.0.0.1:8081/auth/recovery/reset-password/${token}`;
            const mailOptions = {
                from: 'gorjosocial@gmail.com',
                to: user.email,
                subject: 'Restablecer contraseña',
                text: `Para restablecer tu contraseña, haz clic en el siguiente enlace: ${resetLink}`,
            };

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                secure: false, // use SSL
                auth: {
                    user: 'gorjosocial@gmail.com',
                    pass: 'zsoqacogrbstqqwp',
                },
                tls: {
                    rejectUnauthorized: false
                }
                
            });

            await transporter.sendMail(mailOptions);

            return res.status(200).send('Correo de recuperación de contraseña enviado');
        } catch (error) {
            console.error('Error al enviar el correo:', error);
            return res.status(500).send('Error al enviar el correo');
        }
    }

    async renderResetPasswordForm(req, res) {
        const { token } = req.params;
        

        try {
            // Verificar y decodificar el token
            jwt.verify(token, 'tu-secreto', (err, decoded) => {
                if (err) {
                    return res.status(401).send('Token no válido');
                }

                // Renderiza el formulario para restablecer la contraseña
                res.render('resetPassword', { token });
            });
        } catch (error) {
            console.error('Error al verificar el token:', error);
            return res.status(500).send('Error al verificar el token');
        }
    }

    async resetPassword(req, res) {
        const { token } = req.params;
        const  newPassword  = req.body.confirmPassword;

        try {
            // Verificar y decodificar el token
            jwt.verify(token, 'tu-secreto', async (err, decoded) => {
                if (err) {
                    res.render('tokenExpired');
                }

                // Buscar el usuario por su ID
                const user = await User.getUserById(decoded.userId);

                if (!user) {
                    return res.status(404).send('Usuario no encontrado, vuelva a intentarlo');
                }

                if (newPassword === user.password) {
                    return res.status(400).send('La nueva contraseña no puede ser la misma que la anterior');
                }

                // Actualizar la contraseña en la base de datos
                const newPass = createHash(newPassword);
                user.password = newPass;
                await user.save();

                return res.status(200).send('Contraseña restablecida con éxito');
            });
        } catch (error) {
            console.error('Error al restablecer la contraseña:', error);
            return res.status(500).send('Error al restablecer la contraseña');
        }
    }
}

export const resetPasswordController = new ResetPasswordController();