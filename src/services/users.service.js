import UserDTO from '../DAO/DTO/User.DTO.js';
import userManagerMongoDB from '../DAO/mongo/user.ManagerMongoDB.js';
import nodemailer from 'nodemailer';

class UserService {
    
    async sendEmailsToDeletedUsers(deletedUsers) {
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

    for (const user of deletedUsers) {
        const mailOptions = {
            from: "gorjosocial@gmail.com",
            to: user.email,
            subject: 'Aviso de eliminación de cuenta',
            text: 'Tu cuenta ha sido eliminada. Si tienes alguna pregunta, por favor contáctanos.',
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log(`Correo enviado a ${user.email}`);
        } catch (error) {
            console.error(`Error al enviar el correo a ${user.email}: ${error.message}`);
        }
    }

    transporter.close();
}


    async getAllUsers() {
    try {
        const users = await userManagerMongoDB.getAllUsers();
        const usersDTO = [];
        for (const user of users) {
            usersDTO.push(new UserDTO(user));
        }

        return usersDTO;

    } catch (error) {
        console.error(error);
        throw new Error("Error al obtener la lista de usuarios");
    }
}


    async deleteInactiveUsers() {
    try {
        const twoDaysAgo = new Date();
        twoDaysAgo.setHours(twoDaysAgo.getHours() - 48);
        const deletedUsers = await userManagerMongoDB.findDelete(twoDaysAgo);
        const result = await userManagerMongoDB.deleteMany(twoDaysAgo);
        await this.sendEmailsToDeletedUsers(deletedUsers);
        return { result: result, deletedUsers: deletedUsers };
    } catch (error) {
        console.error(error);
        throw new Error("Error al eliminar usuarios inactivos");
    }
}

    async saveLoginTime(userId) {
    try {
        const user = await userManagerMongoDB.getUserById(userId);
        if (user) {
            user.lastLogin = new Date();
            await userManagerMongoDB.updateUser(userId, user);
        } else {
            throw new Error('Usuario no encontrado');
        }
    } catch (error) {
        console.error(error);
        throw new Error('Error al guardar la fecha de inicio de sesión');
    }
}


deleteUser = async (id) => {
    try {
        const deletedUsers = await userManagerMongoDB.deleteUser(id);
        if (deletedUsers !== null) {
            return deletedUsers
        } else {
            throw new Error("Usuario no encontrado");
        }

    } catch (error) {
        console.log(error);
        return error.message;
    }
}

    async changeRole(userId, newRole) {
    try {

        const validRoles = ['user', 'premium', 'admin'];

        if (!validRoles.includes(newRole)) {
            throw new Error('Rol no válido. Los roles válidos son: user, premium, admin.');
        }

        if (typeof newRole !== 'string') {
            throw new Error('El nuevo rol debe ser una cadena válida.');
        }

        const user = await userManagerMongoDB.updateRole(userId, newRole);

        if (!user) {
            throw new Error("Usuario no encontrado");
        }
        return 'Rol de usuario actualizado con éxito.';

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ha ocurrido un error al actualizar el rol del usuario.' });
    }
}

    }

export default new UserService();