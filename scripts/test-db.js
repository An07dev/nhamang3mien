const mongoose = require('mongoose');

const uri = process.argv[2] || process.env.MONGODB_URI;

if (!uri) {
  console.error('Vui lòng truyền chuỗi kết nối MONGODB_URI!');
  process.exit(1);
}

console.log('Đang thử kết nối tới:', uri.replace(/:([^:@]+)@/, ':****@'));

mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log('✅ KẾT NỐI THÀNH CÔNG TỚI CSDL MONGODB!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ KẾT NỐI THẤT BẠI:', err.message);
    process.exit(1);
  });
