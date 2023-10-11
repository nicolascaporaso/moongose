import UserDTO from '../DAO/DTO/User.DTO.js';
import userManagerMongoDB from '../DAO/mongo/user.ManagerMongoDB.js';

class UserService {
    
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

    /*
    async deleteInactiveUsers() {
        try {
            // Supongamos que tienes un campo 'lastLogin' en el modelo User
            const twentyFourHoursAgo = new Date();
            twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

            // Eliminar usuarios que no se han conectado en las últimas 24 horas
            const result = await User.deleteMany({ lastLogin: { $lt: twentyFourHoursAgo } });
            return result;
        } catch (error) {
            console.error(error);
            throw new Error("Error al eliminar usuarios inactivos");
        }
    }*/
}

export default new UserService();