import mongoose from 'mongoose';

const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://fptbamien:Fptbamien2026Pass@cluster0.dnakr7t.mongodb.net/fptbamien?retryWrites=true&w=majority&appName=Cluster0';

async function setTestEventCode() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Đã kết nối MongoDB');

    const db = mongoose.connection.db;
    const settingsColl = db.collection('settings');

    const existing = await settingsColl.findOne({ key: 'tracking_config' });
    const currentValue = existing?.value || {};

    const updatedValue = {
      ...currentValue,
      testEventCode: 'TEST48072',
      isEnabled: true,
    };

    await settingsColl.updateOne(
      { key: 'tracking_config' },
      { $set: { value: updatedValue } },
      { upsert: true }
    );

    console.log('🎉 Đã cập nhật testEventCode: TEST48072 vào MongoDB thành công!');
    console.log('Cấu hình mới:', updatedValue);
  } catch (err) {
    console.error('❌ Lỗi khi cập nhật MongoDB:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

setTestEventCode();
