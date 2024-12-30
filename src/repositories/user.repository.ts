import {prisma} from "~/utils/prismaClient.ts";

class UserRepository {
    /**
     * Finds a user by their email
     * @param email - Email of the user
     */
    static async findUserByEmail(email: string) {
        return prisma.user.findUnique({
                where: {email},
            }
        );
    }

    /**
     * Creates a new user
     * @param userData - Object containing user data
     */
    static async createUser(userData: {
        name: string;
        email: string;
        password: string;
    }) {
        return prisma.user.create({
            data: userData,
        });
    }
}

export default UserRepository;