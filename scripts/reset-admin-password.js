const crypto = require('crypto');
const mongoose = require('mongoose');

// Kết nối tới CSDL đang chạy trên Netlify (cluster0.bfoyn.mongodb.net)
const uriOld = 'mongodb+srv://test:riCqjV5FUxEvjLyB@cluster0.bfoyn.mongodb.net/nhamang3mien?retryWrites=true&w=majority&appName=Cluster0';

// Kết nối tới CSDL trong .env.local (cluster0.dnakr7t.mongodb.net)
const uriNew = 'mongodb+srv://fptbamien:Fptbamien2026Pass@cluster0.dnakr7t.mongodb.net/fptbamien?retryWrites=true&w=majority&appName=Cluster0';

async function updateDb(name, uri, username, password) {
  try {
    const conn = await mongoose.createConnection(uri).asPromise();
    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = crypto.createHmac('sha256', salt).update(password).digest('hex');

    await conn.db.collection('settings').updateOne(
      { key: 'admin_account' },
      {
        $set: {
          value: {
            username: username,
            passwordHash: passwordHash,
            salt: salt,
          },
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );

    console.log(`[${name}] Đã đặt lại thành công: username = "${username}", password = "${password}"`);
    await conn.close();
  } catch (err) {
    console.error(`[${name}] Lỗi:`, err.message);
  }
}

async function run() {
  console.log('--- ĐỒNG BỘ MẬT KHẨU ADMIN VỀ "admin" / "admin123" CHO CẢ 2 DATABASE ---');
  await updateDb('Database Live (Netlify - nhamang3mien)', uriOld, 'admin', 'admin123');
  await updateDb('Database Local (.env.local - fptbamien)', uriNew, 'admin', 'admin123');
  console.log('--- HOÀN TẤT ---');
}

run();
