import { pbkdf2Sync, randomBytes } from "node:crypto";

const password = process.env.ADMIN_PASSWORD_PLAIN;
if (!password || password.length < 12) {
  console.error("Set ADMIN_PASSWORD_PLAIN to a password of at least 12 characters, then run this command again.");
  process.exit(1);
}

const iterations = 310_000;
const salt = randomBytes(16);
const hash = pbkdf2Sync(password, salt, iterations, 32, "sha256");
console.log(`ADMIN_PASSWORD_HASH=${iterations}:${salt.toString("hex")}:${hash.toString("hex")}`);
console.log(`ADMIN_SESSION_SECRET=${randomBytes(32).toString("base64url")}`);
