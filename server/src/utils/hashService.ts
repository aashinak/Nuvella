import bcryptjs from "bcryptjs";

 class hashService {
    async hashPassword(password: string): Promise<string> {
        const salt = await bcryptjs.genSalt(10);
        return await bcryptjs.hash(password, salt);
    }
    async comparePassword(
        password: string,
        hashedPassword: string
    ): Promise<boolean> {
        return await bcryptjs.compare(password, hashedPassword);
    }
}

export default new hashService()