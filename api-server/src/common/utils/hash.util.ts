import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export class HashUtil {
  /**
   * Băm mật khẩu
   */
  static async hash(plainText: string): Promise<string> {
    return bcrypt.hash(plainText, SALT_ROUNDS);
  }

  /**
   * Kiểm tra mật khẩu
   */
  static async compare(plainText: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plainText, hash);
  }
}
