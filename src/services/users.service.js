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

    
    async deleteInactiveUsers() {
        try {
            const twoDaysAgo = new Date();
            twoDaysAgo.setHours(twoDaysAgo.getHours() - 48);
            const result = await userManagerMongoDB.deleteMany(twoDaysAgo);
            return result;
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
            }else{
                throw new Error("Usuario no encontrado");
            }

        } catch (error) {
            console.log(error);
            return error.message;
        }
    
}

}




export default new UserService();