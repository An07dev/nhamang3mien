import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { connectDB } from '@/lib/mongodb';
import Package from '@/models/Package';
import { DEFAULT_FALLBACK_PACKAGES, PackageItem } from '@/lib/default-packages';
import { ContactProvider } from '@/context/ContactContext';
import { PackagesProvider } from '@/context/PackagesContext';
import PackageDetailClient from '@/components/packages/package-detail-client';
import { matchPackageSlug, getPackageSlug } from '@/lib/package-utils';

interface PageProps {
  params: Promise<{ slug: string }>;
}

function serializePackage(pkg: any): PackageItem {
  return {
    _id: pkg._id ? pkg._id.toString() : undefined,
    id: pkg.id || (pkg._id ? pkg._id.toString() : undefined),
    name: pkg.name,
    categoryKey: pkg.categoryKey,
    speed: pkg.speed,
    price: pkg.price,
    originalPrice: pkg.originalPrice || '',
    isPopular: !!pkg.isPopular,
    tag: pkg.tag || '',
    theme: pkg.theme || 'orange',
    suitableFor: pkg.suitableFor || '',
    features: Array.isArray(pkg.features) ? [...pkg.features] : [],
    order: typeof pkg.order === 'number' ? pkg.order : 1,
    isActive: pkg.isActive !== false,
  };
}

async function getPackageAndRelated(slug: string): Promise<{
  packageData: PackageItem | null;
  relatedPackages: PackageItem[];
}> {
  let allPackages: PackageItem[] = [];

  try {
    await connectDB();
    const dbPackages = await Package.find({ isActive: true }).sort({ order: 1 }).lean();
    if (dbPackages && dbPackages.length > 0) {
      allPackages = dbPackages.map(serializePackage);
    }
  } catch (error) {
    console.warn('Không thể kết nối CSDL khi tải chi tiết gói cước, sử dụng fallback data:', error);
  }

  // Kết hợp cùng DEFAULT_FALLBACK_PACKAGES để không bao giờ bị thiếu dữ liệu
  if (allPackages.length === 0) {
    allPackages = DEFAULT_FALLBACK_PACKAGES;
  } else {
    // Đảm bảo các gói fallback có ID cố định vẫn khớp
    for (const fallback of DEFAULT_FALLBACK_PACKAGES) {
      if (!allPackages.some((p) => p.name.toLowerCase() === fallback.name.toLowerCase())) {
        allPackages.push(fallback);
      }
    }
  }

  const targetPackage = allPackages.find((p) => matchPackageSlug(p, slug)) || null;

  if (!targetPackage) {
    return { packageData: null, relatedPackages: [] };
  }

  // Lọc các gói cước liên quan cùng danh mục hoặc các gói nổi bật khác
  const related = allPackages
    .filter(
      (p) =>
        p.name !== targetPackage.name &&
        (p.categoryKey === targetPackage.categoryKey || p.isPopular)
    )
    .slice(0, 3);

  return {
    packageData: targetPackage,
    relatedPackages: related,
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { packageData } = await getPackageAndRelated(slug);

  if (!packageData) {
    return {
      title: 'Chi Tiết Gói Cước | FPT 3 Miền',
      description: 'Thông tin chi tiết các gói cước Internet cáp quang tốc độ cao FPT 3 Miền.',
    };
  }

  const title = `${packageData.name} (${packageData.speed}) - Chỉ ${packageData.price}/tháng | FPT 3 Miền`;
  const description = `Đăng ký ${packageData.name} tốc độ cao ${packageData.speed} giá cực sốc chỉ ${packageData.price}/tháng. ${packageData.suitableFor}. Trang bị miễn phí Modem Wi-Fi 6 thế hệ mới, lắp đặt siêu tốc 12h - 36h toàn quốc.`;

  return {
    title,
    description,
    keywords: [
      packageData.name,
      `Lắp wifi ${packageData.name}`,
      `Gói cước ${packageData.name}`,
      `Internet ${packageData.speed}`,
      'Lắp wifi FPT 3 miền',
      'Wifi 6 FPT',
    ],
    openGraph: {
      title,
      description,
      type: 'website',
      images: [
        {
          url: '/logo.png',
          width: 500,
          height: 500,
          alt: packageData.name,
        },
      ],
    },
  };
}

export async function generateStaticParams() {
  const slugs = DEFAULT_FALLBACK_PACKAGES.map((pkg) => ({
    slug: getPackageSlug(pkg),
  }));

  return slugs;
}

export default async function PackageDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const { packageData, relatedPackages } = await getPackageAndRelated(slug);

  if (!packageData) {
    notFound();
  }

  return (
    <ContactProvider>
      <PackagesProvider>
        <PackageDetailClient
          packageData={packageData}
          relatedPackages={relatedPackages}
        />
      </PackagesProvider>
    </ContactProvider>
  );
}
