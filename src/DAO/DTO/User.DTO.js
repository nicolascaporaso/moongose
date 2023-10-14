export default class UserDTO {
    constructor(user) {
        this.id = user.id.toString(),
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.email = user.email;
        this.age = user.age;
        this.cartId = user.cartId;
        this.role = user.role;
    }
}