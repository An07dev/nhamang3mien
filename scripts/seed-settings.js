const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI || 'mongodb+srv://test:riCqjV5FUxEvjLyB@cluster0.bfoyn.mongodb.net/nhamang3mien?retryWrites=true&w=majority&appName=Cluster0';

async function run() {
  await mongoose.connect(uri);
  const db = mongoose.connection.db;

  const defaultContact = {
    hotline: '0819 900 530',
    hotlineTel: '0819900530',
    zaloUrl: 'https://zalo.me/0819900530',
    zaloPhone: '0819900530',
    supportHours: 'Phục vụ 24/7 (Kể cả Thứ 7, Chủ Nhật & Ngày Lễ)',
    consultTitle: 'Tư Vấn & Lắp Đặt Siêu Tốc Trong 24h',
  };

  await db.collection('settings').updateOne(
    { key: 'contact_config' },
    { $set: { value: defaultContact, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
    { upsert: true }
  );

  console.log('✅ Đã nạp cấu hình liên hệ (Hotline & Zalo) vào CSDL MongoDB Cloud!');
  const doc = await db.collection('settings').findOne({ key: 'contact_config' });
  console.log('Document trong DB:', JSON.stringify(doc.value, null, 2));

  await mongoose.disconnect();
}

run().catch(e => { console.error(e); process.exit(1); });
