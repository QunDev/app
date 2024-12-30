import {signUpUserSchema} from "~/validations/auth.validation.ts";
import UserRepository from "~/repositories/user.repository.ts";
import {AuthFailureError} from "~/core/error.response.ts";
import {hashPassword} from "~/utils/password.utils.ts";

export class AuthService {
  /**
   * Signs up a new user
   * @param name - Name of the user
   * @param email - Email of the user
   * @param password - Password of the user
   */
  static async signup(name: string, email: string, password: string) {
    // Check if the user already exists
    const existingUser = await UserRepository.findUserByEmail(email);
    if (existingUser) {
      throw new AuthFailureError('Email already exists');
    }

    // Hash the user's password
    const hashedPassword = await hashPassword(password);

    // Construct data to insert into the database
    const userData = {
      name: name,
      email: email,
      password: hashedPassword,
    };

    // Save the user to the database
    const createdUser = await UserRepository.createUser(userData);

    // Return the user data (without the password)
    return {
      user: {
        id: createdUser.id,
        name: createdUser.name,
        email: createdUser.email,
      },
    };
  }
}