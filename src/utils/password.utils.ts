import bcrypt from 'bcrypt';
import {InternalServerError} from "~/core/error.response.ts";

/**
 * Secures the given password by hashing it using bcrypt.
 * @param password - The plain text password to be hashed.
 * @returns {Promise<string>} A promise that resolves to the hashed password.
 */
export const hashPassword = async (password: string): Promise<string> => {
  try {
    // Define the cost factor (salt rounds) for bcrypt
    const saltRounds = 12; // Higher = more secure, but slower. Default recommendation is between 10-12.

    // Generate a salt
    const salt = await bcrypt.genSalt(saltRounds);

    // Hash the password with the generated salt
    const hashedPassword = await bcrypt.hash(password, salt);

    // Return the hashed password
    return hashedPassword;

  } catch (error) {
    throw new InternalServerError('Failed to hash the password. Please try again.');
  }
};