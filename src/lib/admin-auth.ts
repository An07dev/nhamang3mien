import crypto from 'crypto';
import { connectDB } from './mongodb';
import Setting from '@/models/Setting';

export interface StoredAdminCredentials {
  username: string;
  passwordHash?: string;
  salt?: string;
  isCustom: boolean;
  updatedAt?: Date;
}

// 1. Băm mật khẩu với Salt sử dụng HMAC-SHA256
export function hashAdminPassword(password: string, salt: string): string {
  return crypto.createHmac('sha256', salt).update(password).digest('hex');
}

// 2. Lấy thông tin tài khoản Admin (Ưu tiên từ MongoDB, fallback về biến môi trường)
export async function getStoredAdminCredentials(): Promise<StoredAdminCredentials> {
  try {
    await connectDB();
    const doc = await Setting.findOne({ key: 'admin_account' }).lean();

    if (doc && doc.value && doc.value.username && doc.value.passwordHash && doc.value.salt) {
      return {
        username: doc.value.username,
        passwordHash: doc.value.passwordHash,
        salt: doc.value.salt,
        isCustom: true,
        updatedAt: doc.updatedAt,
      };
    }
  } catch (err) {
    console.error('Lỗi khi tải tài khoản admin từ CSDL:', err);
  }

  // Fallback về thông tin cấu hình trong .env.local hoặc mặc định
  return {
    username: process.env.ADMIN_USERNAME || 'admin',
    isCustom: false,
  };
}

// 3. Xác thực mật khẩu admin
export function verifyAdminPassword(inputPassword: string, creds: StoredAdminCredentials): boolean {
  if (!inputPassword) return false;

  if (creds.isCustom && creds.passwordHash && creds.salt) {
    const computedHash = hashAdminPassword(inputPassword, creds.salt);
    const bufA = Buffer.from(computedHash, 'hex');
    const bufB = Buffer.from(creds.passwordHash, 'hex');
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  }

  // Nếu chưa đổi qua giao diện admin, so khớp với .env
  const defaultPassword = process.env.ADMIN_PASSWORD || 'admin123';
  return inputPassword === defaultPassword;
}

// 4. Lưu thông tin tài khoản và mật khẩu mới vào MongoDB
export async function saveAdminCredentials(
  newUsername: string,
  newPassword?: string
): Promise<{ username: string; isCustom: boolean }> {
  await connectDB();

  const currentCreds = await getStoredAdminCredentials();
  const username = (newUsername || currentCreds.username || 'admin').trim();

  let passwordHash = currentCreds.passwordHash;
  let salt = currentCreds.salt;

  if (newPassword && newPassword.trim()) {
    salt = crypto.randomBytes(16).toString('hex');
    passwordHash = hashAdminPassword(newPassword.trim(), salt);
  } else if (!passwordHash || !salt) {
    // Nếu chưa có mật khẩu mã hóa, dùng mật khẩu mặc định/env để băm
    const defaultPassword = process.env.ADMIN_PASSWORD || 'admin123';
    salt = crypto.randomBytes(16).toString('hex');
    passwordHash = hashAdminPassword(defaultPassword, salt);
  }

  await Setting.findOneAndUpdate(
    { key: 'admin_account' },
    {
      $set: {
        value: {
          username,
          passwordHash,
          salt,
        },
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return { username, isCustom: true };
}
