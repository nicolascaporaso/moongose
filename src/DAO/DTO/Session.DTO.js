

export default class SessionDTO {
    constructor(session) {
        this.firstName = session.user.firstName;
        this.lastName = session.user.lastName;
        this.role = session.user.role;
        this.email = session.user.email;
        this.cartId = session.user.cartId;
    }
}