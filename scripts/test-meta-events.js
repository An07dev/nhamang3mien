// Script bắn kiểm tra toàn bộ chuỗi sự kiện với mã TEST48072
async function runTests() {
  const baseUrl = 'http://localhost:3000';
  const testCode = 'TEST48072';

  console.log(`🚀 Đang bắn chuỗi sự kiện lên Meta với mã test: ${testCode}...\n`);

  const events = [
    {
      name: '1. ViewContent (Khách xem chi tiết Gói Sky 1 Gbps)',
      payload: {
        eventName: 'ViewContent',
        eventId: `test_vc_${Date.now()}`,
        testEventCode: testCode,
        eventSourceUrl: 'https://fpt3mien.com/goi-cuoc/sky',
        customData: {
          content_name: 'Gói Sky (1 Gbps)',
          content_category: 'Internet Cá Nhân & Gia Đình',
          content_ids: ['sky'],
          content_type: 'product',
          value: 225000,
          currency: 'VND',
          speed: '1 Gbps / 300 Mbps',
        },
      },
    },
    {
      name: '2. InitiateCheckout (Khách bấm Đăng ký gói Meta)',
      payload: {
        eventName: 'InitiateCheckout',
        eventId: `test_ic_${Date.now()}`,
        testEventCode: testCode,
        eventSourceUrl: 'https://fpt3mien.com/#packages',
        customData: {
          content_name: 'Gói Meta (1 Gbps đối xứng)',
          content_category: 'Internet Cá Nhân',
          value: 295000,
          currency: 'VND',
          source: 'Bảng Giá Trang Chủ',
        },
      },
    },
    {
      name: '3. Contact (Khách bấm gọi Hotline tư vấn)',
      payload: {
        eventName: 'Contact',
        eventId: `test_contact_${Date.now()}`,
        testEventCode: testCode,
        eventSourceUrl: 'https://fpt3mien.com/',
        customData: {
          method: 'hotline_floating',
          href: 'tel:0819900530',
        },
      },
    },
    {
      name: '4. CompleteRegistration (Khách hoàn tất thủ tục đăng ký)',
      payload: {
        eventName: 'CompleteRegistration',
        eventId: `test_cr_${Date.now()}`,
        testEventCode: testCode,
        eventSourceUrl: 'https://fpt3mien.com/dang-ky',
        customData: {
          content_name: 'Gói Combo FPT Play Box',
          value: 265000,
          currency: 'VND',
          status: 'success',
        },
      },
    },
    {
      name: '5. Lead (Khách submit form đăng ký thực tế qua /api/dang-ky)',
      isLeadApi: true,
      payload: {
        name: 'Nguyễn Văn Test TEST48072',
        phone: '0819900530',
        province: 'TP. Hồ Chí Minh',
        packageInterest: 'Gói Sky (1 Gbps) - Mã Test TEST48072',
        source: 'Thử Nghiệm Sự Kiện TEST48072',
        note: 'Kiểm tra khớp mã TEST48072 trên Meta Events Manager',
      },
    },
  ];

  for (const item of events) {
    try {
      const url = item.isLeadApi
        ? `${baseUrl}/api/dang-ky`
        : `${baseUrl}/api/tracking/event`;

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item.payload),
      });

      const data = await res.json();
      console.log(`✅ [${item.name}]:`);
      console.log(`   - HTTP Status: ${res.status}`);
      console.log(`   - Phản hồi Meta:`, JSON.stringify(data));
      console.log('--------------------------------------------------');
      
      // Delay nhỏ 1 giây giữa các event để dễ quan sát trên màn hình Meta
      await new Promise((r) => setTimeout(r, 800));
    } catch (err) {
      console.error(`❌ [${item.name}] Lỗi:`, err.message);
    }
  }

  console.log('\n🎉 Hoàn tất gửi tất cả sự kiện với mã TEST48072 lên Meta!');
}

runTests();
