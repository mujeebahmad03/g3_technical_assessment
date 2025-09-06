import crypto from "crypto";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { EncryptJWT, jwtDecrypt } from "jose";
import { TokenPair } from "@/types/auth";
import { env } from "../env";

const rawSecret = env.NEXT_PUBLIC_JWT_SECRET;

export class TokenStorage {
  private static async getEncryptionKey(): Promise<Uint8Array> {
    // Create a consistent key using SHA-256
    const hash = crypto.createHash("sha256").update(rawSecret).digest();
    return new Uint8Array(hash);
  }

  private static async encrypt(
    data: string,
    expirationInSeconds: number,
  ): Promise<string> {
    const encryptionKey = await this.getEncryptionKey();

    return await new EncryptJWT({ data })
      .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
      .setIssuedAt()
      .setExpirationTime(Math.floor(Date.now() / 1000) + expirationInSeconds)
      .encrypt(encryptionKey);
  }

  private static async decrypt(data: string): Promise<string | null> {
    try {
      const encryptionKey = await this.getEncryptionKey();

      const { payload } = await jwtDecrypt(data, encryptionKey);
      return payload.data as string;
    } catch (error) {
      console.error("Decryption failed:", error);
      return null;
    }
  }

  static async setTokens(tokens: TokenPair) {
    const { accessToken, refreshToken } = tokens;

    const encryptedAccessToken = await this.encrypt(accessToken, 24 * 60 * 60); // 15 minutes
    const encryptedRefreshToken = await this.encrypt(
      refreshToken,
      7 * 24 * 60 * 60,
    ); // 7 days

    setCookie("accessToken", encryptedAccessToken, {
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hrs
    });

    setCookie("refreshToken", encryptedRefreshToken, {
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });
  }

  static async getAccessToken(): Promise<string | null> {
    const encryptedToken = await getCookie("accessToken");
    return encryptedToken ? await this.decrypt(encryptedToken) : null;
  }

  static async getRefreshToken(): Promise<string | null> {
    const encryptedToken = await getCookie("refreshToken");
    return encryptedToken ? await this.decrypt(encryptedToken) : null;
  }

  static clearTokens() {
    deleteCookie("accessToken");
    deleteCookie("refreshToken");
  }
}
