import * as argon2 from 'argon2';
export class HashService {
    static instance = null;
    constructor() { }
    static getInstance() {
        if (!HashService.instance) {
            HashService.instance = new HashService();
        }
        return HashService.instance;
    }
    async hashPassword(password) {
        return await argon2.hash(password, {
            type: argon2.argon2id,
        });
    }
    async comparePassword(password, hashedPassword) {
        return await argon2.verify(hashedPassword, password);
    }
}
export const hash = HashService.getInstance();
