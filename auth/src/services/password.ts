import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

export class Password {
  static async toHash(password: string) {
    const salt = randomBytes(8).toString("hex");
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;

    return `${buf.toString("hex")}.${salt}`;
  }

  static async compare(storedPassword: string, suppliedPassword: string) {
    const [hashedPassword, salt] = storedPassword.split("."); // Extract the hashed password

    const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer; // hash the supplied password

    return buf.toString("hex") === hashedPassword; // compare the hash with stored hash
  }
}
