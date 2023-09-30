
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
const scryptAsync = promisify(scrypt);
const SALT_SIZE = 32;
const RANDOM_BYTES_SIZE = 8;
export class Password {
    static async hash(password) {
        const salt = randomBytes(RANDOM_BYTES_SIZE).toString("hex");
        const buf = (await scryptAsync(password, salt, SALT_SIZE));
        return `${buf.toString("hex")}.${salt}`;
    }
    static async compare(
        suppliedPassword,
        storedPassword,
    ) {
        const [hashedPassword, salt] = storedPassword.split(".");
        const hashedPasswordBuf = Buffer.from(hashedPassword, "hex");
        const suppliedPasswordBuf = (await scryptAsync(suppliedPassword, salt, SALT_SIZE));
        return timingSafeEqual(hashedPasswordBuf, suppliedPasswordBuf);
    }
}