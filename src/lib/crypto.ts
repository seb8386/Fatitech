import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const SECRET_KEY = process.env.ENCRYPTION_KEY || process.env.JWT_SECRET || "super-secret-key-32-chars-length!!";

// Ensure a 32-byte key
function getDerivedKey(): Buffer {
  return crypto.createHash("sha256").update(SECRET_KEY).digest();
}

/**
 * Encrypts sensitive text (e.g., OAuth access_token or refresh_token)
 */
export function encryptToken(text: string): string {
  if (!text) return text;
  const iv = crypto.randomBytes(12);
  const key = getDerivedKey();
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");

  // Format: iv:authTag:encrypted
  return `${iv.toString("hex")}:${authTag}:${encrypted}`;
}

/**
 * Decrypts sensitive text
 */
export function decryptToken(encryptedData: string): string {
  if (!encryptedData || !encryptedData.includes(":")) return encryptedData;
  
  try {
    const [ivHex, authTagHex, encryptedText] = encryptedData.split(":");
    if (!ivHex || !authTagHex || !encryptedText) return encryptedData;

    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");
    const key = getDerivedKey();
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    console.error("Token decryption failed:", error);
    return encryptedData;
  }
}
