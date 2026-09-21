'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  Clock,
  CheckCircle2,
  Search,
  Filter,
  Download,
  RefreshCw,
  LogOut,
  ExternalLink,
  Shield,
  Copy,
  Check,
  Trash2,
  Edit3,
  X,
  MapPin,
  Calendar,
  Layers,
  Phone,
  Flame,
  Plus,
  Wifi,
  Tv,
  Building2,
  FolderOpen,
  Sparkles,
  Tag,
  Gauge,
  DollarSign,
  ToggleLeft,
  ToggleRight,
  Eye,
  EyeOff,
  Sliders,
  PhoneCall,
  Save,
  MessageSquare,
  Zap,
  AlertCircle,
  Lock,
  KeyRound,
} from 'lucide-react';
import Link from 'next/link';

export interface LeadItem {
  _id: string;
  name: string;
  phone: string;
  province?: string;
  packageInterest?: string;
  source?: string;
  note?: string;
  status: 'pending' | 'contacted' | 'completed';
  capiEvents?: Array<{
    eventName: string;
    eventId?: string;
    sentAt: string;
    success: boolean;
    response?: string;
  }>;
  clientMetadata?: {
    clientIp?: string;
    userAgent?: string;
    fbp?: string;
    fbc?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface KPIStats {
  total: number;
  pending: number;
  contacted: number;
  completed: number;
  today: number;
}

export interface PackageData {
  _id: string;
  name: string;
  categoryKey: string;
  speed: string;
  price: string;
  originalPrice?: string;
  isPopular: boolean;
  tag?: string;
  theme:
    | 'orange'
    | 'red'
    | 'purple'
    | 'slate'
    | 'emerald'
    | 'blue'
    | 'cyan'
    | 'amber'
    | 'rose'
    | 'indigo'
    | 'teal'
    | 'dark';
  suitableFor: string;
  features: string[];
  order: number;
  isActive: boolean;
}

export interface CategoryData {
  _id: string;
  key: string;
  name: string;
  description?: string;
  icon?: string;
  order: number;
  isActive: boolean;
  packageCount?: number;
}

interface AdminDashboardClientProps {
  username: string;
}

export default function AdminDashboardClient({ username }: AdminDashboardClientProps) {
  const router = useRouter();

  // Top Tabs
  const [activeTab, setActiveTab] = useState<'leads' | 'packages' | 'categories' | 'settings'>('leads');

  // Leads State
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [stats, setStats] = useState<KPIStats>({
    total: 0,
    pending: 0,
    contacted: 0,
    completed: 0,
    today: 0,
  });
  const [leadSearch, setLeadSearch] = useState('');
  const [leadStatusFilter, setLeadStatusFilter] = useState<'all' | 'pending' | 'contacted' | 'completed'>('all');
  const [isLeadLoading, setIsLeadLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(null);
  const [editStatus, setEditStatus] = useState<'pending' | 'contacted' | 'completed'>('pending');
  const [editNote, setEditNote] = useState('');
  const [isSavingLead, setIsSavingLead] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

  // Packages State
  const [packages, setPackages] = useState<PackageData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [packageCategoryFilter, setPackageCategoryFilter] = useState<string>('all');
  const [packageSearch, setPackageSearch] = useState('');
  const [isPackageLoading, setIsPackageLoading] = useState(false);

  // Package Modal (Thêm / Sửa)
  const [isPkgModalOpen, setIsPkgModalOpen] = useState(false);
  const [editingPkgId, setEditingPkgId] = useState<string | null>(null);
  const [pkgName, setPkgName] = useState('');
  const [pkgCategoryKey, setPkgCategoryKey] = useState('personal');
  const [pkgSpeed, setPkgSpeed] = useState('');
  const [pkgPrice, setPkgPrice] = useState('');
  const [pkgOriginalPrice, setPkgOriginalPrice] = useState('');
  const [pkgTag, setPkgTag] = useState('');
  const [pkgTheme, setPkgTheme] = useState<PackageData['theme']>('orange');
  const [pkgSuitableFor, setPkgSuitableFor] = useState('');
  const [pkgFeatures, setPkgFeatures] = useState<string[]>(['']);
  const [pkgIsPopular, setPkgIsPopular] = useState(false);
  const [pkgOrder, setPkgOrder] = useState(1);
  const [pkgIsActive, setPkgIsActive] = useState(true);
  const [isSavingPkg, setIsSavingPkg] = useState(false);

  // Category Modal (Thêm / Sửa)
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [catKey, setCatKey] = useState('');
  const [catName, setCatName] = useState('');
  const [catDescription, setCatDescription] = useState('');
  const [catIcon, setCatIcon] = useState('Wifi');
  const [catOrder, setCatOrder] = useState(1);
  const [catIsActive, setCatIsActive] = useState(true);
  const [isSavingCat, setIsSavingCat] = useState(false);

  // Clock
  const [currentTime, setCurrentTime] = useState('');
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString('vi-VN', {
          weekday: 'long',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // 1. Fetch Leads
  const fetchLeads = useCallback(async () => {
    setIsLeadLoading(true);
    try {
      const params = new URLSearchParams();
      if (leadSearch.trim()) params.append('search', leadSearch.trim());
      if (leadStatusFilter !== 'all') params.append('status', leadStatusFilter);

      const res = await fetch(`/api/admin/leads?${params.toString()}`);
      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }
      const json = await res.json();
      if (json.success) {
        setLeads(json.data || []);
        if (json.stats) setStats(json.stats);
      }
    } catch (err) {
      console.error('Lỗi tải danh sách khách hàng:', err);
    } finally {
      setIsLeadLoading(false);
    }
  }, [leadSearch, leadStatusFilter, router]);

  useEffect(() => {
    if (activeTab === 'leads') {
      const debounceTimer = setTimeout(() => {
        fetchLeads();
      }, 250);
      return () => clearTimeout(debounceTimer);
    }
  }, [activeTab, fetchLeads]);

  // 2. Fetch Packages & Categories
  const fetchPackagesAndCategories = useCallback(async () => {
    setIsPackageLoading(true);
    try {
      const [pkgRes, catRes] = await Promise.all([
        fetch('/api/admin/packages'),
        fetch('/api/admin/categories'),
      ]);

      if (pkgRes.status === 401 || catRes.status === 401) {
        router.push('/admin/login');
        return;
      }

      const pkgData = await pkgRes.json();
      const catData = await catRes.json();

      if (pkgData.success) {
        setPackages(pkgData.data || []);
      }
      if (catData.success) {
        setCategories(catData.data || []);
      }
    } catch (err) {
      console.error('Lỗi tải gói cước:', err);
    } finally {
      setIsPackageLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (activeTab === 'packages' || activeTab === 'categories') {
      fetchPackagesAndCategories();
    }
  }, [activeTab, fetchPackagesAndCategories]);

  // ==================== SETTINGS (HOTLINE & ZALO) ====================
  const [settingsHotline, setSettingsHotline] = useState('0819 900 530');
  const [settingsHotlineTel, setSettingsHotlineTel] = useState('0819900530');
  const [settingsZaloUrl, setSettingsZaloUrl] = useState('https://zalo.me/0819900530');
  const [settingsZaloPhone, setSettingsZaloPhone] = useState('0819900530');
  const [settingsSupportHours, setSettingsSupportHours] = useState('Phục vụ 24/7 (Kể cả Thứ 7, Chủ Nhật & Ngày Lễ)');
  const [settingsConsultTitle, setSettingsConsultTitle] = useState('Tư Vấn & Lắp Đặt Siêu Tốc Trong 24h');
  const [isSettingsLoading, setIsSettingsLoading] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsSavedSuccess, setSettingsSavedSuccess] = useState(false);

  const fetchSettings = useCallback(async () => {
    setIsSettingsLoading(true);
    try {
      const res = await fetch('/api/admin/settings');
      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }
      const data = await res.json();
      if (data.success && data.data) {
        setSettingsHotline(data.data.hotline || '');
        setSettingsHotlineTel(data.data.hotlineTel || '');
        setSettingsZaloUrl(data.data.zaloUrl || '');
        setSettingsZaloPhone(data.data.zaloPhone || '');
        setSettingsSupportHours(data.data.supportHours || '');
        setSettingsConsultTitle(data.data.consultTitle || '');
      }
    } catch (err) {
      console.error('Lỗi tải cấu hình:', err);
    } finally {
      setIsSettingsLoading(false);
    }
  }, [router]);

  // ==================== TRACKING SETTINGS (META PIXEL & CAPI) ====================
  const [trackingPixelId, setTrackingPixelId] = useState('');
  const [trackingCapiToken, setTrackingCapiToken] = useState('');
  const [trackingTestEventCode, setTrackingTestEventCode] = useState('');
  const [trackingIsEnabled, setTrackingIsEnabled] = useState(false);
  const [showCapiToken, setShowCapiToken] = useState(false);
  const [isTrackingLoading, setIsTrackingLoading] = useState(false);
  const [isSavingTracking, setIsSavingTracking] = useState(false);
  const [trackingSavedSuccess, setTrackingSavedSuccess] = useState(false);
  const [isTestingCapi, setIsTestingCapi] = useState(false);
  const [testCapiResult, setTestCapiResult] = useState<{
    success: boolean;
    message: string;
    details?: any;
  } | null>(null);

  const fetchTrackingSettings = useCallback(async () => {
    setIsTrackingLoading(true);
    try {
      const res = await fetch('/api/admin/tracking');
      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }
      const data = await res.json();
      if (data.success && data.data) {
        setTrackingPixelId(data.data.pixelId || '');
        setTrackingCapiToken(data.data.capiToken || '');
        setTrackingTestEventCode(data.data.testEventCode || '');
        setTrackingIsEnabled(Boolean(data.data.isEnabled));
      }
    } catch (err) {
      console.error('Lỗi tải cấu hình tracking:', err);
    } finally {
      setIsTrackingLoading(false);
    }
  }, [router]);

  // ==================== ADMIN PROFILE & SECURITY ====================
  const [currentAdminUser, setCurrentAdminUser] = useState(username);
  const [adminCurrentPassword, setAdminCurrentPassword] = useState('');
  const [adminNewUsername, setAdminNewUsername] = useState(username);
  const [adminNewPassword, setAdminNewPassword] = useState('');
  const [adminConfirmPassword, setAdminConfirmPassword] = useState('');
  const [showAdminCurrentPass, setShowAdminCurrentPass] = useState(false);
  const [showAdminNewPass, setShowAdminNewPass] = useState(false);
  const [showAdminConfirmPass, setShowAdminConfirmPass] = useState(false);
  const [isSavingAdminProfile, setIsSavingAdminProfile] = useState(false);
  const [adminProfileSuccess, setAdminProfileSuccess] = useState(false);
  const [adminProfileError, setAdminProfileError] = useState<string | null>(null);
  const [adminIsCustom, setAdminIsCustom] = useState(false);

  const fetchAdminProfile = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/profile');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setCurrentAdminUser(json.data.username || username);
          setAdminNewUsername(json.data.username || username);
          setAdminIsCustom(Boolean(json.data.isCustom));
        }
      }
    } catch (err) {
      console.error('Lỗi tải thông tin tài khoản admin:', err);
    }
  }, [username]);

  useEffect(() => {
    if (activeTab === 'settings') {
      fetchSettings();
      fetchTrackingSettings();
      fetchAdminProfile();
    }
  }, [activeTab, fetchSettings, fetchTrackingSettings, fetchAdminProfile]);

  const handleSaveAdminProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminProfileError(null);
    setAdminProfileSuccess(false);

    if (!adminCurrentPassword) {
      setAdminProfileError('Vui lòng nhập mật khẩu hiện tại để xác thực');
      return;
    }

    if (adminNewUsername.trim().length < 3) {
      setAdminProfileError('Tên đăng nhập mới phải có ít nhất 3 ký tự');
      return;
    }

    if (adminNewPassword && adminNewPassword.trim().length < 6) {
      setAdminProfileError('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    if (adminNewPassword && adminNewPassword !== adminConfirmPassword) {
      setAdminProfileError('Mật khẩu mới và mật khẩu xác nhận không khớp');
      return;
    }

    setIsSavingAdminProfile(true);
    try {
      const res = await fetch('/api/admin/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: adminCurrentPassword,
          newUsername: adminNewUsername.trim(),
          newPassword: adminNewPassword.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAdminProfileSuccess(true);
        setCurrentAdminUser(data.data.username);
        setAdminIsCustom(true);
        setAdminCurrentPassword('');
        setAdminNewPassword('');
        setAdminConfirmPassword('');
        setTimeout(() => setAdminProfileSuccess(false), 6000);
      } else {
        setAdminProfileError(data.error || 'Lỗi khi cập nhật tài khoản quản trị');
      }
    } catch (err: any) {
      setAdminProfileError(err.message || 'Lỗi kết nối khi cập nhật tài khoản');
    } finally {
      setIsSavingAdminProfile(false);
    }
  };

  const handleSaveTrackingSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingTracking(true);
    setTrackingSavedSuccess(false);
    try {
      const res = await fetch('/api/admin/tracking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pixelId: trackingPixelId,
          capiToken: trackingCapiToken,
          testEventCode: trackingTestEventCode,
          isEnabled: trackingIsEnabled,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTrackingSavedSuccess(true);
        setTimeout(() => setTrackingSavedSuccess(false), 5000);
      } else {
        alert(data.error || 'Lỗi khi lưu cấu hình tracking');
      }
    } catch (err) {
      console.error('Lỗi khi lưu cấu hình tracking:', err);
      alert('Đã xảy ra lỗi kết nối');
    } finally {
      setIsSavingTracking(false);
    }
  };

  const handleTestCapi = async () => {
    if (!trackingPixelId.trim()) {
      alert('Vui lòng nhập Pixel ID trước khi test');
      return;
    }
    if (!trackingCapiToken.trim()) {
      alert('Vui lòng nhập CAPI Access Token trước khi test');
      return;
    }
    setIsTestingCapi(true);
    setTestCapiResult(null);
    try {
      const res = await fetch('/api/admin/tracking/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pixelId: trackingPixelId,
          capiToken: trackingCapiToken,
          testEventCode: trackingTestEventCode,
        }),
      });
      const data = await res.json();
      setTestCapiResult({
        success: data.success,
        message: data.message || data.error || 'Kết quả kiểm tra CAPI',
        details: data.data || data.details,
      });
    } catch (err: any) {
      setTestCapiResult({
        success: false,
        message: err.message || 'Lỗi kết nối khi test CAPI',
      });
    } finally {
      setIsTestingCapi(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settingsHotline.trim()) {
      alert('Vui lòng nhập số Hotline');
      return;
    }
    setIsSavingSettings(true);
    setSettingsSavedSuccess(false);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hotline: settingsHotline,
          hotlineTel: settingsHotlineTel,
          zaloUrl: settingsZaloUrl,
          zaloPhone: settingsZaloPhone,
          supportHours: settingsSupportHours,
          consultTitle: settingsConsultTitle,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSettingsSavedSuccess(true);
        setTimeout(() => setSettingsSavedSuccess(false), 5000);
      } else {
        alert(data.error || 'Lỗi khi lưu cấu hình');
      }
    } catch (err) {
      console.error('Lỗi khi lưu cấu hình:', err);
      alert('Đã xảy ra lỗi kết nối');
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      console.error('Lỗi khi đăng xuất:', err);
    }
  };

  // Copy phone number
  const handleCopyPhone = (phone: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(phone);
    setCopiedPhone(phone);
    setTimeout(() => setCopiedPhone(null), 2000);
  };

  // Quick inline status change for lead
  const handleQuickStatusChange = async (
    id: string,
    newStatus: 'pending' | 'contacted' | 'completed',
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setLeads((prev) =>
          prev.map((item) => (item._id === id ? { ...item, status: newStatus } : item))
        );
        fetchLeads();
      }
    } catch (err) {
      console.error('Lỗi đổi trạng thái:', err);
    }
  };

  // Open lead detail modal
  const handleOpenLeadDetail = (lead: LeadItem) => {
    setSelectedLead(lead);
    setEditStatus(lead.status);
    setEditNote(lead.note || '');
  };

  // Save lead note/status
  const handleSaveLeadModal = async () => {
    if (!selectedLead) return;
    setIsSavingLead(true);
    try {
      const res = await fetch(`/api/admin/leads/${selectedLead._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: editStatus,
          note: editNote,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSelectedLead(null);
        fetchLeads();
      }
    } catch (err) {
      console.error('Lỗi cập nhật khách hàng:', err);
    } finally {
      setIsSavingLead(false);
    }
  };

  // Delete lead
  const handleDeleteLead = async (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Quý khách có chắc chắn muốn xóa khách hàng "${name}"?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setLeads((prev) => prev.filter((item) => item._id !== id));
        if (selectedLead?._id === id) setSelectedLead(null);
        fetchLeads();
      }
    } catch (err) {
      console.error('Lỗi xóa khách hàng:', err);
    }
  };

  // Export CSV
  const handleExportCsv = () => {
    window.open('/api/admin/leads/export', '_blank');
  };

  // ==================== PACKAGE ACTIONS ====================

  const handleOpenNewPackage = () => {
    setEditingPkgId(null);
    setPkgName('');
    setPkgCategoryKey(categories[0]?.key || 'personal');
    setPkgSpeed('1 Gbps / 300 Mbps');
    setPkgPrice('225.000đ');
    setPkgOriginalPrice('320.000đ');
    setPkgTag('BÁN CHẠY NHẤT');
    setPkgTheme('orange');
    setPkgSuitableFor('Gia đình đa thiết bị, xem phim 4K');
    setPkgFeatures([
      'Trang bị Modem Wi-Fi 6 thế hệ mới nhất',
      'Lắp đặt siêu tốc từ 12h - 36h',
      'Miễn phí lắp đặt khi thanh toán trước',
      'Hỗ trợ kỹ thuật 24/7',
    ]);
    setPkgIsPopular(false);
    setPkgOrder(packages.length + 1);
    setPkgIsActive(true);
    setIsPkgModalOpen(true);
  };

  const handleOpenEditPackage = (pkg: PackageData) => {
    setEditingPkgId(pkg._id);
    setPkgName(pkg.name);
    setPkgCategoryKey(pkg.categoryKey);
    setPkgSpeed(pkg.speed);
    setPkgPrice(pkg.price);
    setPkgOriginalPrice(pkg.originalPrice || '');
    setPkgTag(pkg.tag || '');
    setPkgTheme(pkg.theme || 'orange');
    setPkgSuitableFor(pkg.suitableFor || '');
    setPkgFeatures(pkg.features && pkg.features.length > 0 ? pkg.features : ['']);
    setPkgIsPopular(pkg.isPopular);
    setPkgOrder(pkg.order || 1);
    setPkgIsActive(pkg.isActive);
    setIsPkgModalOpen(true);
  };

  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pkgName || !pkgSpeed || !pkgPrice) {
      alert('Vui lòng điền đủ Tên gói, Tốc độ và Giá cước!');
      return;
    }

    setIsSavingPkg(true);
    try {
      const payload = {
        name: pkgName,
        categoryKey: pkgCategoryKey,
        speed: pkgSpeed,
        price: pkgPrice,
        originalPrice: pkgOriginalPrice,
        tag: pkgTag,
        theme: pkgTheme,
        suitableFor: pkgSuitableFor,
        features: pkgFeatures.filter((f) => f.trim().length > 0),
        isPopular: pkgIsPopular,
        order: Number(pkgOrder),
        isActive: pkgIsActive,
      };

      let res;
      if (editingPkgId) {
        res = await fetch(`/api/admin/packages/${editingPkgId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/admin/packages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (data.success) {
        setIsPkgModalOpen(false);
        fetchPackagesAndCategories();
      } else {
        alert(data.error || 'Có lỗi xảy ra');
      }
    } catch (err) {
      console.error('Lỗi lưu gói cước:', err);
    } finally {
      setIsSavingPkg(false);
    }
  };

  const handleDeletePackage = async (pkg: PackageData) => {
    if (!confirm(`Quý khách có chắc chắn muốn xóa gói cước "${pkg.name}"?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/packages/${pkg._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        fetchPackagesAndCategories();
      } else {
        alert(data.error || 'Không thể xóa');
      }
    } catch (err) {
      console.error('Lỗi xóa gói cước:', err);
    }
  };

  const handleTogglePackageActive = async (pkg: PackageData) => {
    try {
      const res = await fetch(`/api/admin/packages/${pkg._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !pkg.isActive }),
      });
      const data = await res.json();
      if (data.success) {
        setPackages((prev) =>
          prev.map((p) => (p._id === pkg._id ? { ...p, isActive: !p.isActive } : p))
        );
      }
    } catch (err) {
      console.error('Lỗi bật tắt gói:', err);
    }
  };

  // Features list in Package modal
  const handleAddFeatureLine = () => {
    setPkgFeatures((prev) => [...prev, '']);
  };

  const handleUpdateFeatureLine = (index: number, val: string) => {
    setPkgFeatures((prev) => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  };

  const handleRemoveFeatureLine = (index: number) => {
    setPkgFeatures((prev) => prev.filter((_, i) => i !== index));
  };

  // ==================== CATEGORY ACTIONS ====================

  const handleOpenNewCategory = () => {
    setEditingCatId(null);
    setCatKey('');
    setCatName('');
    setCatDescription('');
    setCatIcon('Wifi');
    setCatOrder(categories.length + 1);
    setCatIsActive(true);
    setIsCatModalOpen(true);
  };

  const handleOpenEditCategory = (cat: CategoryData) => {
    setEditingCatId(cat._id);
    setCatKey(cat.key);
    setCatName(cat.name);
    setCatDescription(cat.description || '');
    setCatIcon(cat.icon || 'Wifi');
    setCatOrder(cat.order || 1);
    setCatIsActive(cat.isActive);
    setIsCatModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName || (!editingCatId && !catKey)) {
      alert('Vui lòng điền đủ Tên và Mã đầu mục!');
      return;
    }

    setIsSavingCat(true);
    try {
      let res;
      if (editingCatId) {
        res = await fetch(`/api/admin/categories/${editingCatId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: catName,
            description: catDescription,
            icon: catIcon,
            order: Number(catOrder),
            isActive: catIsActive,
          }),
        });
      } else {
        res = await fetch('/api/admin/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            key: catKey,
            name: catName,
            description: catDescription,
            icon: catIcon,
            order: Number(catOrder),
            isActive: catIsActive,
          }),
        });
      }

      const data = await res.json();
      if (data.success) {
        setIsCatModalOpen(false);
        fetchPackagesAndCategories();
      } else {
        alert(data.error || 'Có lỗi xảy ra');
      }
    } catch (err) {
      console.error('Lỗi lưu đầu mục:', err);
    } finally {
      setIsSavingCat(false);
    }
  };

  const handleDeleteCategory = async (cat: CategoryData) => {
    if (!confirm(`Quý khách có chắc chắn muốn xóa đầu mục "${cat.name}"?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/categories/${cat._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        fetchPackagesAndCategories();
      } else {
        alert(data.error || 'Không thể xóa');
      }
    } catch (err) {
      console.error('Lỗi xóa đầu mục:', err);
    }
  };

  // Filtered packages
  const filteredPackages = packages.filter((p) => {
    const matchCategory =
      packageCategoryFilter === 'all' || p.categoryKey === packageCategoryFilter;
    const matchSearch =
      !packageSearch.trim() ||
      p.name.toLowerCase().includes(packageSearch.toLowerCase()) ||
      p.speed.toLowerCase().includes(packageSearch.toLowerCase()) ||
      p.price.toLowerCase().includes(packageSearch.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#0E131F] text-zinc-100 flex flex-col font-sans selection:bg-[#FF6320] selection:text-white">
      {/* 1. Header Bar */}
      <header className="sticky top-0 z-30 bg-[#141A29]/95 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-lg">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF6320] to-[#FFA153] p-0.5 shadow-md shadow-orange-500/30">
            <div className="w-full h-full bg-[#182030] rounded-[10px] flex items-center justify-center overflow-hidden">
              <img src="/logo.png" alt="Logo FPT 3 Miền" className="w-8 h-8 object-contain" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-white text-base sm:text-lg tracking-tight">
                FPT 3 Miền
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                <Shield className="w-2.5 h-2.5" />
                ADMIN PORTAL
              </span>
            </div>
            <div className="text-[11px] text-zinc-400 font-medium">
              Quản lý đăng ký &amp; Cấu hình gói cước trực tuyến
            </div>
          </div>
        </div>

        {/* Right: Clock, User Badge, Action Buttons */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          <div className="hidden lg:block text-right">
            <div className="text-xs font-mono font-bold text-zinc-300 capitalize">{currentTime}</div>
            <div className="text-[11px] text-emerald-400 font-semibold flex items-center justify-end gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>MongoDB Kết nối ổn định</span>
            </div>
          </div>

          <div className="h-6 w-px bg-white/10 hidden sm:block" />

          <Link
            href="/"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-zinc-300 hover:text-white border border-white/10 transition-colors"
            title="Mở trang chủ khách hàng"
          >
            <span>Trang Chủ</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-300 hidden md:inline">
              Chào, <span className="text-[#FFA153] font-bold">{currentAdminUser}</span>
            </span>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-300 hover:text-red-200 border border-red-500/30 text-xs font-semibold transition-colors cursor-pointer"
              title="Đăng xuất khỏi hệ thống"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Đăng Xuất</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Top Navigation Tabs */}
      <div className="bg-[#141A29]/60 border-b border-white/10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2 sm:gap-4 overflow-x-auto py-2.5 scrollbar-none">
          <button
            onClick={() => setActiveTab('leads')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'leads'
                ? 'bg-gradient-to-r from-[#FF6320] to-[#FFA153] text-white shadow-lg shadow-orange-500/25'
                : 'bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Khách Hàng Đăng Ký ({stats.total})</span>
          </button>

          <button
            onClick={() => setActiveTab('packages')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'packages'
                ? 'bg-gradient-to-r from-[#FF6320] to-[#FFA153] text-white shadow-lg shadow-orange-500/25'
                : 'bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Quản Lý Gói Cước ({packages.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'categories'
                ? 'bg-gradient-to-r from-[#FF6320] to-[#FFA153] text-white shadow-lg shadow-orange-500/25'
                : 'bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white'
            }`}
          >
            <FolderOpen className="w-4 h-4" />
            <span>Đầu Mục Gói Cước ({categories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-gradient-to-r from-[#FF6320] to-[#FFA153] text-white shadow-lg shadow-orange-500/25'
                : 'bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Cấu Hình Hotline & Zalo</span>
          </button>
        </div>
      </div>

      {/* 3. Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">

        {/* ============================================================ */}
        {/* TAB 1: QUẢN LÝ KHÁCH HÀNG (LEADS) */}
        {/* ============================================================ */}
        {activeTab === 'leads' && (
          <div className="space-y-6">
            {/* KPI Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
              <div className="rounded-2xl bg-[#151D2C] border border-white/10 p-4 sm:p-5 shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-semibold text-zinc-400">Tổng Khách Đăng Ký</span>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white mt-2 font-mono">{stats.total}</div>
                <div className="text-[11px] text-zinc-500 mt-1">Toàn bộ dữ liệu từ trước đến nay</div>
              </div>

              <div className="rounded-2xl bg-[#151D2C] border border-orange-500/30 p-4 sm:p-5 shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-semibold text-orange-400">Đăng Ký Hôm Nay</span>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-orange-500/15 text-orange-400 flex items-center justify-center">
                    <Flame className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white mt-2 font-mono flex items-center gap-2">
                  <span>{stats.today}</span>
                  {stats.today > 0 && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 font-sans">
                      Mới
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-orange-400/80 mt-1">Khách đăng ký trong 24h qua</div>
              </div>

              <div className="rounded-2xl bg-[#151D2C] border border-amber-500/30 p-4 sm:p-5 shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-semibold text-amber-400">Chờ Gọi Tư Vấn</span>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-amber-400 mt-2 font-mono flex items-center gap-2">
                  <span>{stats.pending}</span>
                  {stats.pending > 0 && <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />}
                </div>
                <div className="text-[11px] text-amber-400/80 mt-1">Cần chuyên viên liên hệ trong 5p</div>
              </div>

              <div className="rounded-2xl bg-[#151D2C] border border-emerald-500/30 p-4 sm:p-5 shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-semibold text-emerald-400">Đã Lắp Đặt Xong</span>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-2 font-mono">{stats.completed}</div>
                <div className="text-[11px] text-emerald-400/80 mt-1">Đã ký hợp đồng &amp; nghiệm thu</div>
              </div>
            </div>

            {/* Toolbar */}
            <div className="bg-[#141A29] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={leadSearch}
                  onChange={(e) => setLeadSearch(e.target.value)}
                  placeholder="Tìm theo tên, số điện thoại, tỉnh thành..."
                  className="w-full h-10 pl-10 pr-9 rounded-xl bg-black/40 border border-white/15 text-white placeholder-zinc-500 text-xs sm:text-sm focus:outline-none focus:border-[#FF6320] focus:ring-1 focus:ring-[#FF6320] transition-colors"
                />
                {leadSearch && (
                  <button
                    onClick={() => setLeadSearch('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                <button
                  onClick={() => setLeadStatusFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    leadStatusFilter === 'all'
                      ? 'bg-white text-zinc-900 shadow-md font-bold'
                      : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Tất cả ({stats.total})
                </button>
                <button
                  onClick={() => setLeadStatusFilter('pending')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                    leadStatusFilter === 'pending'
                      ? 'bg-amber-500 text-zinc-950 font-bold shadow-md shadow-amber-500/20'
                      : 'bg-amber-500/10 text-amber-300 hover:bg-amber-500/20'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  Chờ gọi ({stats.pending})
                </button>
                <button
                  onClick={() => setLeadStatusFilter('contacted')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                    leadStatusFilter === 'contacted'
                      ? 'bg-blue-500 text-white font-bold shadow-md shadow-blue-500/20'
                      : 'bg-blue-500/10 text-blue-300 hover:bg-blue-500/20'
                  }`}
                >
                  Đã gọi ({stats.contacted})
                </button>
                <button
                  onClick={() => setLeadStatusFilter('completed')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                    leadStatusFilter === 'completed'
                      ? 'bg-emerald-500 text-white font-bold shadow-md shadow-emerald-500/20'
                      : 'bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
                  }`}
                >
                  Hoàn tất ({stats.completed})
                </button>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => fetchLeads()}
                  disabled={isLeadLoading}
                  className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-zinc-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  title="Làm mới danh sách"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLeadLoading ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Làm mới</span>
                </button>

                <button
                  onClick={handleExportCsv}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-600/25 flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Tải danh sách ra file Excel / CSV UTF-8"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Xuất Excel</span>
                </button>
              </div>
            </div>

            {/* Desktop Table */}
            <div className="bg-[#141A29] border border-white/10 rounded-2xl shadow-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-white text-sm sm:text-base">Danh Sách Khách Hàng Đăng Ký</h2>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-zinc-300 font-mono font-semibold">
                    {leads.length} đơn
                  </span>
                </div>
                {isLeadLoading && (
                  <span className="text-xs text-[#FFA153] flex items-center gap-1.5">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span>Đang đồng bộ...</span>
                  </span>
                )}
              </div>

              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-[#0E131F]/80 text-zinc-400 font-semibold border-b border-white/10 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-4">STT</th>
                      <th className="py-3 px-4">Khách Hàng</th>
                      <th className="py-3 px-4">Số Điện Thoại</th>
                      <th className="py-3 px-4">Khu Vực &amp; Gói Cước</th>
                      <th className="py-3 px-4">Nguồn</th>
                      <th className="py-3 px-4">Meta CAPI</th>
                      <th className="py-3 px-4">Trạng Thái Xử Lý</th>
                      <th className="py-3 px-4 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {leads.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-zinc-400">
                          <div className="max-w-xs mx-auto space-y-2">
                            <Users className="w-10 h-10 text-zinc-600 mx-auto" />
                            <p className="font-semibold text-zinc-300">Không tìm thấy khách hàng nào</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      leads.map((item, index) => {
                        const createdDate = new Date(item.createdAt).toLocaleString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit',
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        });

                        return (
                          <tr
                            key={item._id}
                            onClick={() => handleOpenLeadDetail(item)}
                            className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                          >
                            <td className="py-3.5 px-4 font-mono text-zinc-500 text-xs">{index + 1}</td>
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-white group-hover:text-[#FFA153] transition-colors">
                                {item.name}
                              </div>
                              <div className="text-[11px] text-zinc-500 flex items-center gap-1 mt-0.5">
                                <Calendar className="w-3 h-3" />
                                <span>{createdDate}</span>
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-white tracking-wide text-sm">
                                  {item.phone}
                                </span>
                                <a
                                  href={`tel:${item.phone}`}
                                  onClick={(e) => e.stopPropagation()}
                                  className="w-7 h-7 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 flex items-center justify-center transition-colors"
                                  title={`Gọi: ${item.phone}`}
                                >
                                  <Phone className="w-3.5 h-3.5" />
                                </a>
                                <button
                                  onClick={(e) => handleCopyPhone(item.phone, e)}
                                  className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                                  title="Sao chép số"
                                >
                                  {copiedPhone === item.phone ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="inline-block px-2.5 py-0.5 rounded-lg bg-orange-500/15 text-[#FFA153] text-xs font-bold border border-orange-500/20">
                                {item.packageInterest || 'Gói Sky (1 Gbps)'}
                              </div>
                              <div className="text-[11px] text-zinc-400 flex items-center gap-1 mt-1">
                                <MapPin className="w-3 h-3 text-zinc-500" />
                                <span>{item.province || 'Toàn quốc'}</span>
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="text-[11px] font-semibold text-zinc-400 bg-white/5 px-2 py-1 rounded-md">
                                {item.source || 'Website'}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              {item.capiEvents && item.capiEvents.length > 0 ? (
                                <div className="flex flex-col gap-0.5">
                                  <span
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/25 whitespace-nowrap"
                                    title={item.capiEvents.map((e) => `${e.eventName}: ${e.response || (e.success ? 'OK' : 'Lỗi')}`).join('\n')}
                                  >
                                    <Zap className="w-3 h-3 text-emerald-400" />
                                    <span>{item.capiEvents[item.capiEvents.length - 1].eventName}</span>
                                  </span>
                                  <span className="text-[10px] text-zinc-500 font-mono">
                                    {item.capiEvents.length} event(s)
                                  </span>
                                </div>
                              ) : (
                                <span className="text-zinc-600 text-xs font-mono">-</span>
                              )}
                            </td>
                            <td className="py-3.5 px-4">
                              {item.status === 'pending' && (
                                <button
                                  onClick={(e) => handleQuickStatusChange(item._id, 'contacted', e)}
                                  className="px-2.5 py-1 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold border border-amber-500/30 flex items-center gap-1.5 cursor-pointer"
                                  title="Đánh dấu: Đã gọi"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                                  <span>Chờ liên hệ</span>
                                </button>
                              )}
                              {item.status === 'contacted' && (
                                <button
                                  onClick={(e) => handleQuickStatusChange(item._id, 'completed', e)}
                                  className="px-2.5 py-1 rounded-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-xs font-bold border border-blue-500/30 flex items-center gap-1.5 cursor-pointer"
                                  title="Đánh dấu: Hoàn tất"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                  <span>Đã gọi điện</span>
                                </button>
                              )}
                              {item.status === 'completed' && (
                                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 inline-flex items-center gap-1.5">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>Đã hoàn tất</span>
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenLeadDetail(item);
                                  }}
                                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                                  title="Chi tiết &amp; Ghi chú"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={(e) => handleDeleteLead(item._id, item.name, e)}
                                  className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                                  title="Xóa"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card Layout */}
              <div className="md:hidden divide-y divide-white/10">
                {leads.map((item, index) => (
                  <div
                    key={item._id}
                    onClick={() => handleOpenLeadDetail(item)}
                    className="p-4 space-y-3 active:bg-white/[0.02]"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-bold text-white text-base">
                          {index + 1}. {item.name}
                        </div>
                        <div className="text-[11px] text-zinc-400 mt-0.5">
                          {item.province || 'Toàn quốc'} &bull; {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {item.capiEvents && item.capiEvents.length > 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                            <Zap className="w-2.5 h-2.5" /> CAPI
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-bold">
                          {item.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between bg-black/30 p-2.5 rounded-xl border border-white/5">
                      <div className="text-xs font-bold text-[#FFA153]">{item.packageInterest}</div>
                      <a
                        href={`tel:${item.phone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500 text-zinc-950 font-bold text-xs flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" /> Gọi
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: QUẢN LÝ GÓI CƯỚC (PACKAGES) */}
        {/* ============================================================ */}
        {activeTab === 'packages' && (
          <div className="space-y-6">
            {/* Toolbar for Packages */}
            <div className="bg-[#141A29] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Category Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                <button
                  onClick={() => setPackageCategoryFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    packageCategoryFilter === 'all'
                      ? 'bg-white text-zinc-900 shadow-md'
                      : 'bg-white/5 text-zinc-400 hover:text-white'
                  }`}
                >
                  Tất cả ({packages.length})
                </button>
                {categories.map((cat) => {
                  const count = packages.filter((p) => p.categoryKey === cat.key).length;
                  return (
                    <button
                      key={cat._id}
                      onClick={() => setPackageCategoryFilter(cat.key)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                        packageCategoryFilter === cat.key
                          ? 'bg-[#FF6320] text-white shadow-md shadow-orange-500/25'
                          : 'bg-white/5 text-zinc-300 hover:text-white'
                      }`}
                    >
                      {cat.name.split('.')[1] || cat.name} ({count})
                    </button>
                  );
                })}
              </div>

              {/* Action: Add Package Button */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetchPackagesAndCategories()}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white text-xs font-semibold cursor-pointer"
                  title="Làm mới gói cước"
                >
                  <RefreshCw className={`w-4 h-4 ${isPackageLoading ? 'animate-spin' : ''}`} />
                </button>

                <button
                  onClick={handleOpenNewPackage}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6320] to-[#FFA153] hover:brightness-105 active:scale-95 text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-orange-500/25 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Thêm Gói Cước Mới</span>
                </button>
              </div>
            </div>

            {/* Packages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredPackages.map((pkg) => {
                const categoryObj = categories.find((c) => c.key === pkg.categoryKey);
                return (
                  <div
                    key={pkg._id}
                    className={`rounded-2xl bg-[#151D2C] border transition-all relative flex flex-col justify-between overflow-hidden shadow-xl ${
                      pkg.isActive
                        ? pkg.isPopular
                          ? 'border-[#FF6320] shadow-orange-500/10'
                          : 'border-white/10 hover:border-white/20'
                        : 'border-zinc-800 opacity-60'
                    }`}
                  >
                    {/* Top Tag & Active status */}
                    <div className="p-5 pb-0">
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white/10 text-zinc-300">
                          {categoryObj?.name.split('.')[0] || pkg.categoryKey}
                        </span>

                        <div className="flex items-center gap-1.5">
                          {pkg.isPopular && (
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30">
                              HOT
                            </span>
                          )}
                          <button
                            onClick={() => handleTogglePackageActive(pkg)}
                            className={`p-1 rounded-md text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                              pkg.isActive
                                ? 'text-emerald-400 hover:text-emerald-300'
                                : 'text-zinc-500 hover:text-zinc-400'
                            }`}
                            title={pkg.isActive ? 'Gói đang hiển thị - Nhấn để ẩn' : 'Gói đang ẩn - Nhấn để hiện'}
                          >
                            {pkg.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            <span className="text-[10px]">{pkg.isActive ? 'Hiện' : 'Ẩn'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Package Name & Speed */}
                      <h3 className="text-xl font-black text-white">{pkg.name}</h3>
                      <div className="text-xs text-orange-400 font-semibold flex items-center gap-1.5 mt-1">
                        <Gauge className="w-3.5 h-3.5 shrink-0" />
                        <span>{pkg.speed}</span>
                      </div>

                      {/* Price Banner */}
                      <div className="mt-4 pt-3 border-t border-white/10 flex items-baseline gap-2">
                        <span className="text-2xl font-black text-white font-mono">{pkg.price}</span>
                        <span className="text-xs text-zinc-400">/tháng</span>
                        {pkg.originalPrice && (
                          <span className="text-xs text-zinc-500 line-through font-mono">
                            {pkg.originalPrice}
                          </span>
                        )}
                      </div>

                      {pkg.suitableFor && (
                        <p className="text-[11px] text-zinc-400 mt-2 italic line-clamp-2">
                          &bull; {pkg.suitableFor}
                        </p>
                      )}

                      {/* Features preview */}
                      <div className="mt-4 space-y-1.5 border-t border-white/5 pt-3">
                        {pkg.features.slice(0, 3).map((feat, i) => (
                          <div key={i} className="text-xs text-zinc-300 flex items-start gap-1.5">
                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{feat}</span>
                          </div>
                        ))}
                        {pkg.features.length > 3 && (
                          <div className="text-[11px] text-zinc-500 pl-5">
                            + {pkg.features.length - 3} tính năng khác
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom Action Buttons */}
                    <div className="p-4 mt-5 bg-black/20 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[11px] text-zinc-500 font-mono">Thứ tự: {pkg.order}</span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEditPackage(pkg)}
                          className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Sửa</span>
                        </button>

                        <button
                          onClick={() => handleDeletePackage(pkg)}
                          className="p-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                          title="Xóa gói cước này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: QUẢN LÝ ĐẦU MỤC GÓI CƯỚC (CATEGORIES) */}
        {/* ============================================================ */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="bg-[#141A29] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-md flex items-center justify-between">
              <div>
                <h2 className="font-bold text-white text-base">Danh Sách Đầu Mục Gói Cước</h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Phân loại các nhóm gói cước chính hiển thị các tab ngoài trang chủ
                </p>
              </div>

              <button
                onClick={handleOpenNewCategory}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6320] to-[#FFA153] hover:brightness-105 active:scale-95 text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-orange-500/25 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Thêm Đầu Mục</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {categories.map((cat) => (
                <div
                  key={cat._id}
                  className="rounded-2xl bg-[#151D2C] border border-white/10 p-5 shadow-xl flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-[#FFA153] flex items-center justify-center">
                        {cat.icon === 'Tv' ? (
                          <Tv className="w-5 h-5" />
                        ) : cat.icon === 'Building2' ? (
                          <Building2 className="w-5 h-5" />
                        ) : (
                          <Wifi className="w-5 h-5" />
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-white/5 text-zinc-400">
                          Thứ tự: {cat.order}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            cat.isActive
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-zinc-700 text-zinc-400'
                          }`}
                        >
                          {cat.isActive ? 'Kích hoạt' : 'Tạm ẩn'}
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="text-[11px] font-mono text-[#FFA153] uppercase font-bold">
                        Key: {cat.key}
                      </div>
                      <h3 className="text-base font-bold text-white mt-0.5">{cat.name}</h3>
                      <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                        {cat.description || 'Không có mô tả'}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-white/5 text-xs text-zinc-300 font-semibold flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5 text-blue-400" />
                      <span>{cat.packageCount ?? 0} gói cước thuộc nhóm này</span>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleOpenEditCategory(cat)}
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Sửa</span>
                    </button>

                    <button
                      onClick={() => handleDeleteCategory(cat)}
                      className="p-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                      title="Xóa đầu mục này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 4: CẤU HÌNH LIÊN HỆ & HOTLINE, ZALO (SETTINGS) */}
        {/* ============================================================ */}
        {activeTab === 'settings' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
                  <Sliders className="w-6 h-6 text-[#FF6320]" />
                  <span>Cấu Hình Hotline &amp; Zalo Trực Tuyến</span>
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  Thay đổi số điện thoại tổng đài, số hotline và đường link Zalo tư vấn hiển thị đồng bộ trên toàn bộ website
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={fetchSettings}
                  disabled={isSettingsLoading}
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-zinc-300 font-semibold flex items-center gap-2 border border-white/10 transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSettingsLoading ? 'animate-spin' : ''}`} />
                  <span>Tải lại</span>
                </button>
              </div>
            </div>

            {settingsSavedSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div className="text-xs sm:text-sm font-semibold">
                  Đã lưu cấu hình thành công! Mọi thay đổi về Hotline và Zalo đã được đồng bộ lên MongoDB và hiển thị trực tiếp trên trang chủ.
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Form Settings (Col span 2) */}
              <div className="lg:col-span-2 bg-[#141A29] border border-white/10 rounded-3xl p-6 shadow-xl space-y-5">
                <form onSubmit={handleSaveSettings} className="space-y-5">
                  {/* Hotline Display & Tel */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-white mb-1.5 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#FF6320]" />
                        <span>Số điện thoại Hotline hiển thị</span>
                        <span className="text-[#FF6320]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={settingsHotline}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSettingsHotline(val);
                          const stripped = val.replace(/[^\d+]/g, '');
                          setSettingsHotlineTel(stripped);
                        }}
                        placeholder="Ví dụ: 0819 900 530"
                        className="w-full h-11 px-3.5 rounded-xl bg-black/40 border border-white/15 text-white font-mono font-bold text-sm focus:outline-none focus:border-[#FF6320] focus:ring-1 focus:ring-[#FF6320]"
                      />
                      <span className="text-[11px] text-zinc-400 mt-1 block">
                        Định dạng hiển thị đẹp mắt trên banner, header, nút gọi (VD: 0819 900 530).
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-white mb-1.5 flex items-center gap-1.5">
                        <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Số quay gọi trực tiếp (tel:)</span>
                        <span className="text-[#FF6320]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={settingsHotlineTel}
                        onChange={(e) => setSettingsHotlineTel(e.target.value)}
                        placeholder="Ví dụ: 0819900530"
                        className="w-full h-11 px-3.5 rounded-xl bg-black/40 border border-white/15 text-white font-mono font-bold text-sm focus:outline-none focus:border-[#FF6320] focus:ring-1 focus:ring-[#FF6320]"
                      />
                      <span className="text-[11px] text-zinc-400 mt-1 block">
                        Số quay máy tự động khi khách bấm nút gọi trên điện thoại (viết liền không khoảng trắng).
                      </span>
                    </div>
                  </div>

                  {/* Zalo Url & Support Hours */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-white mb-1.5 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <img src="/zalo.svg" alt="Zalo" className="w-3.5 h-3.5 rounded-xs" />
                          <span>Đường link Zalo tư vấn</span>
                          <span className="text-[#FF6320]">*</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const clean = settingsHotlineTel.replace(/[^\d+]/g, '');
                            if (clean) setSettingsZaloUrl(`https://zalo.me/${clean}`);
                          }}
                          className="text-[10px] text-blue-400 hover:text-blue-300 underline font-semibold cursor-pointer"
                        >
                          Lấy theo Hotline
                        </button>
                      </label>
                      <input
                        type="text"
                        required
                        value={settingsZaloUrl}
                        onChange={(e) => setSettingsZaloUrl(e.target.value)}
                        placeholder="Ví dụ: https://zalo.me/0819900530"
                        className="w-full h-11 px-3.5 rounded-xl bg-black/40 border border-white/15 text-white font-mono text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                      <span className="text-[11px] text-zinc-400 mt-1 block">
                        Đường link mở chat Zalo trực tiếp khi khách click (chuẩn: https://zalo.me/số_điện_thoại).
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-white mb-1.5 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>Khung giờ hỗ trợ khách hàng</span>
                      </label>
                      <input
                        type="text"
                        value={settingsSupportHours}
                        onChange={(e) => setSettingsSupportHours(e.target.value)}
                        placeholder="Ví dụ: Phục vụ 24/7 (Kể cả Thứ 7, CN &amp; Lễ)"
                        className="w-full h-11 px-3.5 rounded-xl bg-black/40 border border-white/15 text-white text-sm focus:outline-none focus:border-[#FF6320]"
                      />
                      <span className="text-[11px] text-zinc-400 mt-1 block">
                        Hiển thị tại Header &amp; Footer để tạo niềm tin cho khách hàng.
                      </span>
                    </div>
                  </div>

                  {/* Consult Title */}
                  <div>
                    <label className="block text-xs font-bold text-white mb-1.5 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                      <span>Thông điệp cam kết / Tiêu đề tư vấn</span>
                    </label>
                    <input
                      type="text"
                      value={settingsConsultTitle}
                      onChange={(e) => setSettingsConsultTitle(e.target.value)}
                      placeholder="Ví dụ: Tư Vấn &amp; Lắp Đặt Siêu Tốc Trong 24h"
                      className="w-full h-11 px-3.5 rounded-xl bg-black/40 border border-white/15 text-white text-sm focus:outline-none focus:border-[#FF6320]"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="text-xs text-zinc-400">
                      Cấu hình được lưu trực tiếp vào CSDL MongoDB Cloud
                    </div>
                    <button
                      type="submit"
                      disabled={isSavingSettings}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6320] to-[#FFA153] hover:brightness-105 active:scale-[0.99] text-white text-xs sm:text-sm font-bold shadow-lg shadow-orange-500/25 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isSavingSettings ? 'Đang lưu cấu hình...' : 'Lưu Cấu Hình Mới'}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Live Preview Panel */}
              <div className="bg-[#141A29] border border-white/10 rounded-3xl p-6 shadow-xl space-y-5">
                <div className="border-b border-white/10 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-orange-400 block">
                    Xem Trước Trực Quan (Live Preview)
                  </span>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Giao diện các nút liên hệ sẽ hiển thị thực tế trên website:
                  </p>
                </div>

                {/* 1. Header button preview */}
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <div className="text-[10px] font-bold text-zinc-400 uppercase">Nút trên thanh Header:</div>
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#FF6320] to-[#FFA153] text-white shadow-md font-bold text-xs">
                    <Phone className="w-3.5 h-3.5 fill-white" />
                    <div>
                      <span className="text-[9px] block uppercase text-orange-100 leading-none">Hotline 24/7</span>
                      <span className="text-xs font-black">{settingsHotline || '0819 900 530'}</span>
                    </div>
                  </div>
                </div>

                {/* 2. Floating action buttons preview */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                  <div className="text-[10px] font-bold text-zinc-400 uppercase">Bong bóng nổi (Góc dưới phải):</div>
                  <div className="flex items-center gap-3 pt-1">
                    {/* Zalo */}
                    <a
                      href={settingsZaloUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-11 h-11 rounded-2xl bg-[#0068FF] shadow-lg flex items-center justify-center p-0.5 hover:scale-105 transition-transform"
                      title="Click thử link Zalo"
                    >
                      <img src="/zalo.svg" alt="Zalo" className="w-full h-full object-cover rounded-xl" />
                    </a>

                    {/* Phone button */}
                    <a
                      href={`tel:${settingsHotlineTel}`}
                      className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center relative hover:scale-105 transition-transform"
                      title="Click thử gọi điện"
                    >
                      <img src="/phone-icon.png" alt="Phone" className="w-full h-full object-contain rounded-full" />
                    </a>

                    <div className="text-xs">
                      <div className="font-bold text-white">Gọi ngay: {settingsHotline}</div>
                      <div className="text-[11px] text-zinc-400">Click vào icon để test liên kết</div>
                    </div>
                  </div>
                </div>

                {/* 3. Link check info */}
                <div className="text-[11px] text-zinc-400 space-y-1.5 p-3 rounded-xl bg-black/30 border border-white/5">
                  <div className="flex items-center justify-between">
                    <span>Lệnh quay số:</span>
                    <code className="text-emerald-400 font-mono">tel:{settingsHotlineTel}</code>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Đích đến Zalo:</span>
                    <code className="text-blue-400 font-mono truncate max-w-[150px]">{settingsZaloUrl}</code>
                  </div>
                </div>
              </div>
            </div>

            {/* ============================================================ */}
            {/* CARD 2: CẤU HÌNH META PIXEL & CONVERSIONS API (CAPI) */}
            {/* ============================================================ */}
            <div className="bg-[#141A29] border border-white/10 rounded-3xl p-6 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <span>Cấu Hình Meta Pixel &amp; Conversions API (CAPI)</span>
                      <span className="text-[10px] uppercase px-2 py-0.5 rounded-full font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        Facebook Ads 2026
                      </span>
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1">
                      Đo lường chuyển đổi kép (Client Pixel + Server CAPI) tối ưu hóa chi phí quảng cáo Facebook Ads, theo dõi vòng đời khách hàng và chống trùng lặp (Deduplication).
                    </p>
                  </div>
                </div>

                {/* Tracking Enabled Switch */}
                <label className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-black/40 border border-white/10 cursor-pointer self-start sm:self-auto hover:bg-black/60 transition-colors">
                  <input
                    type="checkbox"
                    checked={trackingIsEnabled}
                    onChange={(e) => setTrackingIsEnabled(e.target.checked)}
                    className="w-5 h-5 rounded accent-blue-500 cursor-pointer"
                  />
                  <div className="text-xs">
                    <div className={`font-bold ${trackingIsEnabled ? 'text-emerald-400' : 'text-zinc-400'}`}>
                      {trackingIsEnabled ? 'Đang Kích Hoạt' : 'Đang Tắt Tracking'}
                    </div>
                    <div className="text-[10px] text-zinc-500">Pixel &amp; CAPI</div>
                  </div>
                </label>
              </div>

              {trackingSavedSuccess && (
                <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 flex items-center gap-3 animate-in fade-in">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div className="text-xs sm:text-sm font-semibold">
                    Đã lưu cấu hình Meta Pixel &amp; CAPI thành công! Hệ thống sẵn sàng ghi nhận chuyển đổi.
                  </div>
                </div>
              )}

              {testCapiResult && (
                <div
                  className={`p-4 rounded-2xl border flex items-start gap-3 animate-in fade-in ${
                    testCapiResult.success
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                      : 'bg-red-500/15 border-red-500/40 text-red-300'
                  }`}
                >
                  {testCapiResult.success ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  )}
                  <div className="text-xs space-y-1">
                    <div className="font-bold">{testCapiResult.message}</div>
                    {testCapiResult.details && (
                      <pre className="text-[11px] font-mono bg-black/40 p-2 rounded-lg mt-1 overflow-x-auto">
                        {JSON.stringify(testCapiResult.details, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              )}

              <form onSubmit={handleSaveTrackingSettings} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Pixel ID */}
                  <div>
                    <label className="block text-xs font-bold text-white mb-1.5 flex items-center justify-between">
                      <span>Meta Pixel ID (Dataset ID)</span>
                      <span className="text-zinc-500 font-normal text-[11px]">Bắt buộc để gắn Pixel</span>
                    </label>
                    <input
                      type="text"
                      value={trackingPixelId}
                      onChange={(e) => setTrackingPixelId(e.target.value)}
                      placeholder="Ví dụ: 1234567890123456"
                      className="w-full h-11 px-3.5 rounded-xl bg-black/40 border border-white/15 text-white font-mono text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                    <span className="text-[11px] text-zinc-400 mt-1 block">
                      Lấy tại: Meta Events Manager (Trình quản lý sự kiện) &gt; Cài đặt &gt; ID Tập dữ liệu / Pixel ID.
                    </span>
                  </div>

                  {/* Test Event Code */}
                  <div>
                    <label className="block text-xs font-bold text-white mb-1.5 flex items-center justify-between">
                      <span>Mã Thử Nghiệm Sự Kiện (Test Event Code)</span>
                      <span className="text-amber-400 font-normal text-[11px]">Tùy chọn (để test live)</span>
                    </label>
                    <input
                      type="text"
                      value={trackingTestEventCode}
                      onChange={(e) => setTrackingTestEventCode(e.target.value)}
                      placeholder="Ví dụ: TEST12345"
                      className="w-full h-11 px-3.5 rounded-xl bg-black/40 border border-white/15 text-white font-mono text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    />
                    <span className="text-[11px] text-zinc-400 mt-1 block">
                      Lấy tại tab <strong>Thử nghiệm sự kiện</strong> trên Meta Events Manager. Nhập mã này để thấy sự kiện xuất hiện tức thời trên màn hình test của Facebook.
                    </span>
                  </div>
                </div>

                {/* CAPI Access Token */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-white">
                      Meta CAPI Access Token (Mã truy cập API chuyển đổi)
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowCapiToken(!showCapiToken)}
                      className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                    >
                      {showCapiToken ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{showCapiToken ? 'Ẩn token' : 'Hiện token'}</span>
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={trackingCapiToken}
                    onChange={(e) => setTrackingCapiToken(e.target.value)}
                    placeholder="Dán token bắt đầu bằng EAAG... (Tạo tại Trình quản lý sự kiện > Cài đặt > API chuyển đổi > Tạo mã truy cập)"
                    className="w-full p-3 rounded-xl bg-black/40 border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  <span className="text-[11px] text-zinc-400 mt-1 block">
                    Token này được bảo mật an toàn trên máy chủ và chỉ dùng để bắn Server CAPI, không bao giờ lộ ra ngoài trình duyệt khách hàng.
                  </span>
                </div>

                {/* Workflow Explainer Banner */}
                <div className="p-4 rounded-2xl bg-black/30 border border-white/5 space-y-2.5">
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#FFA153]" />
                    <span>Cơ Chế Theo Dõi Trạng Thái Khách Hàng Tự Động (Customer Lifecycle CAPI):</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                      <div className="font-bold text-amber-400 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                        <span>1. Khách Gửi Đơn</span>
                      </div>
                      <p className="text-zinc-300">
                        Bắn đồng thời Pixel &amp; CAPI sự kiện <strong>Lead</strong> kèm mã <code>event_id</code> chống trùng lặp.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                      <div className="font-bold text-blue-400 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-400" />
                        <span>2. Admin Gọi Tư Vấn</span>
                      </div>
                      <p className="text-zinc-300">
                        Đổi trạng thái sang <em>&quot;Đã gọi&quot;</em> -&gt; Server tự động bắn CAPI sự kiện <strong>Contact</strong>.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                      <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span>3. Lắp Đặt Hoàn Tất</span>
                      </div>
                      <p className="text-zinc-300">
                        Đổi sang <em>&quot;Đã hoàn tất&quot;</em> -&gt; Server tự động bắn CAPI sự kiện <strong>CompleteRegistration</strong>.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={handleTestCapi}
                    disabled={isTestingCapi || isSavingTracking}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isTestingCapi ? 'animate-spin' : ''}`} />
                    <span>{isTestingCapi ? 'Đang gửi test lên Meta...' : 'Bắn Thử Event Test CAPI'}</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isSavingTracking || isTestingCapi}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-500/25 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSavingTracking ? 'Đang lưu tracking...' : 'Lưu Cấu Hình Pixel & CAPI'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* ============================================================ */}
            {/* CARD 3: BẢO MẬT & ĐỔI TÀI KHOẢN QUẢN TRỊ VIÊN */}
            {/* ============================================================ */}
            <div className="bg-[#141A29] border border-white/10 rounded-3xl p-6 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <span>Bảo Mật &amp; Đổi Tài Khoản Quản Trị Viên</span>
                      <span className="text-[10px] uppercase px-2 py-0.5 rounded-full font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        Admin Security
                      </span>
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1">
                      Cập nhật Tên đăng nhập và Mật khẩu truy cập hệ thống Quản trị trực tiếp trên giao diện, tự động lưu vào CSDL MongoDB Cloud.
                    </p>
                  </div>
                </div>

                {/* Account Status Badge */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-black/40 border border-white/10 text-xs self-start sm:self-auto">
                  <span className={`w-2 h-2 rounded-full ${adminIsCustom ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                  <span className="text-zinc-300">
                    {adminIsCustom ? 'Tài khoản tùy biến (MongoDB)' : 'Tài khoản mặc định (.env)'}
                  </span>
                </div>
              </div>

              {adminProfileSuccess && (
                <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 flex items-center gap-3 animate-in fade-in">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div className="text-xs sm:text-sm font-semibold">
                    Đã cập nhật thông tin tài khoản quản trị thành công! Bạn có thể sử dụng thông tin mới cho lần đăng nhập tiếp theo.
                  </div>
                </div>
              )}

              {adminProfileError && (
                <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/40 text-red-300 flex items-center gap-3 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <div className="text-xs sm:text-sm font-semibold">
                    {adminProfileError}
                  </div>
                </div>
              )}

              <form onSubmit={handleSaveAdminProfile} className="space-y-5">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {/* Left: Current Password & New Username */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-white mb-1.5 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-amber-400" />
                          <span>Mật khẩu hiện tại</span>
                          <span className="text-red-400">*</span>
                        </span>
                        <span className="text-[11px] text-zinc-500 font-normal">Bắt buộc để xác thực</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showAdminCurrentPass ? 'text' : 'password'}
                          required
                          value={adminCurrentPassword}
                          onChange={(e) => setAdminCurrentPassword(e.target.value)}
                          placeholder="Nhập mật khẩu đang dùng để xác thực..."
                          className="w-full h-11 px-3.5 pr-10 rounded-xl bg-black/40 border border-white/15 text-white font-mono text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowAdminCurrentPass(!showAdminCurrentPass)}
                          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-white cursor-pointer"
                        >
                          {showAdminCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <span className="text-[11px] text-zinc-400 mt-1 block">
                        Nhập mật khẩu hiện tại (mặc định ban đầu: <code>admin123</code>).
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-white mb-1.5 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-blue-400" />
                          <span>Tên đăng nhập mới</span>
                          <span className="text-red-400">*</span>
                        </span>
                        <span className="text-[11px] text-zinc-400 font-mono">Hiện tại: {currentAdminUser}</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={adminNewUsername}
                        onChange={(e) => setAdminNewUsername(e.target.value)}
                        placeholder="Nhập tên đăng nhập mới (tối thiểu 3 ký tự)..."
                        className="w-full h-11 px-3.5 rounded-xl bg-black/40 border border-white/15 text-white font-mono text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  {/* Right: New Password & Confirm Password */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-white mb-1.5 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <KeyRound className="w-3.5 h-3.5 text-purple-400" />
                          <span>Mật khẩu mới</span>
                        </span>
                        <span className="text-[11px] text-zinc-500 font-normal">Để trống nếu chỉ đổi tên đăng nhập</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showAdminNewPass ? 'text' : 'password'}
                          value={adminNewPassword}
                          onChange={(e) => setAdminNewPassword(e.target.value)}
                          placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)..."
                          className="w-full h-11 px-3.5 pr-10 rounded-xl bg-black/40 border border-white/15 text-white font-mono text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowAdminNewPass(!showAdminNewPass)}
                          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-white cursor-pointer"
                        >
                          {showAdminNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-white mb-1.5 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-purple-400" />
                          <span>Xác nhận mật khẩu mới</span>
                        </span>
                      </label>
                      <div className="relative">
                        <input
                          type={showAdminConfirmPass ? 'text' : 'password'}
                          value={adminConfirmPassword}
                          onChange={(e) => setAdminConfirmPassword(e.target.value)}
                          placeholder="Nhập lại mật khẩu mới..."
                          className="w-full h-11 px-3.5 pr-10 rounded-xl bg-black/40 border border-white/15 text-white font-mono text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowAdminConfirmPass(!showAdminConfirmPass)}
                          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-white cursor-pointer"
                        >
                          {showAdminConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Security Tips */}
                <div className="p-4 rounded-2xl bg-black/30 border border-white/5 text-[11px] text-zinc-400 leading-relaxed flex items-start gap-3">
                  <Shield className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block mb-0.5">Tiêu chuẩn bảo mật:</strong>
                    Mật khẩu được mã hóa một chiều bằng thuật toán <strong>HMAC-SHA256 kết hợp mã Salt ngẫu nhiên</strong> trước khi lưu vào MongoDB. Sau khi cập nhật, phiên đăng nhập hiện tại sẽ được cấp token mới tự động mà không làm gián đoạn công việc của bạn.
                  </div>
                </div>

                {/* Submit */}
                <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-xs text-zinc-400">
                    Cập nhật có hiệu lực ngay lập tức cho các lần đăng nhập tiếp theo
                  </div>

                  <button
                    type="submit"
                    disabled={isSavingAdminProfile}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-purple-500/25 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSavingAdminProfile ? 'Đang cập nhật tài khoản...' : 'Lưu Thay Đổi Tài Khoản'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* ============================================================ */}
      {/* MODAL 1: CHI TIẾT & GHI CHÚ KHÁCH HÀNG (LEAD DETAIL) */}
      {/* ============================================================ */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-[#182030] border border-white/15 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#FF6320]/20 text-[#FFA153] flex items-center justify-center">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Chi Tiết Đơn Đăng Ký</h3>
                  <div className="text-[11px] text-zinc-400">ID: {selectedLead._id}</div>
                </div>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-black/40 p-4 rounded-2xl border border-white/10">
              <div>
                <span className="text-zinc-400">Khách hàng:</span>
                <p className="font-bold text-white text-sm mt-0.5">{selectedLead.name}</p>
              </div>
              <div>
                <span className="text-zinc-400">Số điện thoại:</span>
                <p className="font-bold text-[#FFA153] font-mono text-sm mt-0.5 flex items-center gap-2">
                  <span>{selectedLead.phone}</span>
                  <a
                    href={`tel:${selectedLead.phone}`}
                    className="text-emerald-400 hover:underline inline-flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3" /> Gọi
                  </a>
                </p>
              </div>
              <div>
                <span className="text-zinc-400">Khu vực:</span>
                <p className="font-semibold text-zinc-200 mt-0.5">{selectedLead.province || 'Chưa rõ'}</p>
              </div>
              <div>
                <span className="text-zinc-400">Gói cước:</span>
                <p className="font-semibold text-zinc-200 mt-0.5">{selectedLead.packageInterest}</p>
              </div>
              <div>
                <span className="text-zinc-400">Nguồn:</span>
                <p className="font-semibold text-zinc-300 mt-0.5">{selectedLead.source || 'Website'}</p>
              </div>
              <div>
                <span className="text-zinc-400">Thời gian:</span>
                <p className="font-semibold text-zinc-300 mt-0.5">
                  {new Date(selectedLead.createdAt).toLocaleString('vi-VN')}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-2">Trạng thái xử lý:</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setEditStatus('pending')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    editStatus === 'pending'
                      ? 'bg-amber-500/25 border-amber-500 text-amber-300 shadow-md'
                      : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                  }`}
                >
                  Chờ gọi
                </button>
                <button
                  type="button"
                  onClick={() => setEditStatus('contacted')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    editStatus === 'contacted'
                      ? 'bg-blue-500/25 border-blue-500 text-blue-300 shadow-md'
                      : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                  }`}
                >
                  Đã gọi tư vấn
                </button>
                <button
                  type="button"
                  onClick={() => setEditStatus('completed')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    editStatus === 'completed'
                      ? 'bg-emerald-500/25 border-emerald-500 text-emerald-300 shadow-md'
                      : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                  }`}
                >
                  Đã lắp đặt
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Ghi chú nội bộ:</label>
              <textarea
                rows={3}
                value={editNote}
                onChange={(e) => setEditNote(e.target.value)}
                placeholder="Ghi chú lịch hẹn, địa chỉ lắp đặt hoặc yêu cầu của khách..."
                className="w-full p-3 rounded-xl bg-black/40 border border-white/15 text-white placeholder-zinc-500 text-xs sm:text-sm focus:outline-none focus:border-[#FF6320] focus:ring-1 focus:ring-[#FF6320]"
              />
            </div>

            {/* Meta CAPI Sync Logs */}
            <div className="bg-black/40 p-4 rounded-2xl border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-white">
                <span className="flex items-center gap-1.5 text-blue-400">
                  <Zap className="w-3.5 h-3.5 text-blue-400" />
                  <span>Đồng Bộ Meta Conversions API (CAPI):</span>
                </span>
                <span className="text-[11px] font-normal text-zinc-400 font-mono">
                  IP: {selectedLead.clientMetadata?.clientIp || 'Chưa ghi nhận'}
                </span>
              </div>
              {selectedLead.capiEvents && selectedLead.capiEvents.length > 0 ? (
                <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                  {selectedLead.capiEvents.map((evt, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-[11px] p-2 rounded-lg bg-white/5 border border-white/5"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${evt.success ? 'bg-emerald-400' : 'bg-red-400'}`} />
                        <span className="font-bold text-white">{evt.eventName}</span>
                        {evt.eventId && (
                          <span className="text-zinc-500 font-mono text-[10px] truncate max-w-[120px]">
                            ({evt.eventId})
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <span className={evt.success ? 'text-emerald-400 font-semibold' : 'text-red-400 font-semibold'}>
                          {evt.response || (evt.success ? 'Thành công' : 'Lỗi')}
                        </span>
                        <span className="text-zinc-500 text-[10px] block">
                          {new Date(evt.sentAt).toLocaleTimeString('vi-VN')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-[11px] text-zinc-500 italic py-1">
                  Chưa có sự kiện CAPI nào được ghi nhận cho khách hàng này.
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={(e) => handleDeleteLead(selectedLead._id, selectedLead.name, e)}
                className="px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa đơn này</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedLead(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-semibold cursor-pointer"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={handleSaveLeadModal}
                  disabled={isSavingLead}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#FF6320] to-[#FFA153] hover:brightness-105 active:scale-[0.99] text-white text-xs font-bold shadow-md shadow-orange-500/25 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSavingLead ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 2: THÊM / SỬA GÓI CƯỚC (PACKAGE MODAL) */}
      {/* ============================================================ */}
      {isPkgModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#182030] border border-white/15 rounded-3xl p-6 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#FF6320]/20 text-[#FFA153] flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">
                    {editingPkgId ? 'Chỉnh Sửa Gói Cước' : 'Thêm Gói Cước Mới'}
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    Cập nhật thông tin gói cước hiển thị trên trang chủ
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsPkgModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePackage} className="space-y-4">
              {/* Row 1: Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Tên gói cước <span className="text-[#FF6320]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={pkgName}
                    onChange={(e) => setPkgName(e.target.value)}
                    placeholder="Ví dụ: Gói Sky hoặc Combo Sky..."
                    className="w-full h-10 px-3.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs sm:text-sm focus:outline-none focus:border-[#FF6320]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Đầu mục gói cước <span className="text-[#FF6320]">*</span>
                  </label>
                  <select
                    value={pkgCategoryKey}
                    onChange={(e) => setPkgCategoryKey(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-black/40 border border-white/15 text-white text-xs sm:text-sm focus:outline-none focus:border-[#FF6320]"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c.key} className="bg-zinc-900">
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Speed, Price, Original Price */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Tốc độ băng thông <span className="text-[#FF6320]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={pkgSpeed}
                    onChange={(e) => setPkgSpeed(e.target.value)}
                    placeholder="VD: 1 Gbps / 300 Mbps"
                    className="w-full h-10 px-3.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs sm:text-sm focus:outline-none focus:border-[#FF6320]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Giá cước khuyến mãi <span className="text-[#FF6320]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={pkgPrice}
                    onChange={(e) => setPkgPrice(e.target.value)}
                    placeholder="VD: 225.000đ"
                    className="w-full h-10 px-3.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs sm:text-sm focus:outline-none focus:border-[#FF6320]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Giá gốc trước giảm
                  </label>
                  <input
                    type="text"
                    value={pkgOriginalPrice}
                    onChange={(e) => setPkgOriginalPrice(e.target.value)}
                    placeholder="VD: 320.000đ"
                    className="w-full h-10 px-3.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs sm:text-sm focus:outline-none focus:border-[#FF6320]"
                  />
                </div>
              </div>

              {/* Row 3: Tag, Theme, Suitable For */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Huy hiệu (Tag)</label>
                  <input
                    type="text"
                    value={pkgTag}
                    onChange={(e) => setPkgTag(e.target.value)}
                    placeholder="VD: BÁN CHẠY NHẤT, TIẾT KIỆM..."
                    className="w-full h-10 px-3.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs sm:text-sm focus:outline-none focus:border-[#FF6320]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Tông màu (Theme)</label>
                  <select
                    value={pkgTheme}
                    onChange={(e) => setPkgTheme(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-xl bg-black/40 border border-white/15 text-white text-xs sm:text-sm focus:outline-none focus:border-[#FF6320]"
                  >
                    <option value="orange" className="bg-zinc-900">🟠 Cam Hỏa Tiễn (Orange)</option>
                    <option value="red" className="bg-zinc-900">🔴 Đỏ Rực Rỡ (Red)</option>
                    <option value="purple" className="bg-zinc-900">🟣 Tím Hoàng Gia (Purple)</option>
                    <option value="slate" className="bg-zinc-900">🔘 Xám Titan / Gaming (Slate)</option>
                    <option value="emerald" className="bg-zinc-900">🟢 Xanh Lục Bảo (Emerald)</option>
                    <option value="blue" className="bg-zinc-900">🔵 Xanh Đại Dương / Công Nghệ (Blue)</option>
                    <option value="cyan" className="bg-zinc-900">💠 Xanh Cyan Siêu Tốc (Cyan)</option>
                    <option value="amber" className="bg-zinc-900">🟡 Vàng Hoàng Kim (Amber)</option>
                    <option value="rose" className="bg-zinc-900">🌸 Hồng Ruby (Rose)</option>
                    <option value="indigo" className="bg-zinc-900">🌌 Xanh Chàm Dạ Quang (Indigo)</option>
                    <option value="teal" className="bg-zinc-900">🦚 Xanh Mòng Két (Teal)</option>
                    <option value="dark" className="bg-zinc-900">⚫ Đen Carbon VIP (Dark)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Thứ tự &amp; Hiển thị</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={pkgOrder}
                      onChange={(e) => setPkgOrder(Number(e.target.value))}
                      className="w-20 h-10 px-3 rounded-xl bg-black/40 border border-white/15 text-white text-xs sm:text-sm text-center"
                      title="Thứ tự hiển thị"
                    />
                    <label className="flex items-center gap-1.5 text-xs text-zinc-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={pkgIsActive}
                        onChange={(e) => setPkgIsActive(e.target.checked)}
                        className="rounded accent-[#FF6320]"
                      />
                      <span>Hiện trên web</span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Đối tượng phù hợp</label>
                <input
                  type="text"
                  value={pkgSuitableFor}
                  onChange={(e) => setPkgSuitableFor(e.target.value)}
                  placeholder="VD: Hộ gia đình 5 - 10 thiết bị, xem phim 4K, video call..."
                  className="w-full h-10 px-3.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs sm:text-sm focus:outline-none focus:border-[#FF6320]"
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 text-xs font-bold text-[#FFA153] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pkgIsPopular}
                    onChange={(e) => setPkgIsPopular(e.target.checked)}
                    className="w-4 h-4 rounded accent-[#FF6320]"
                  />
                  <span>Đánh dấu là gói Bán chạy nhất / Nổi bật</span>
                </label>
              </div>

              {/* Dynamic Feature Lines */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-zinc-300">
                    Danh sách đặc quyền / Tính năng gói cước ({pkgFeatures.length})
                  </label>
                  <button
                    type="button"
                    onClick={handleAddFeatureLine}
                    className="text-xs text-[#FFA153] hover:underline flex items-center gap-1 font-bold cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Thêm dòng tính năng</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {pkgFeatures.map((feat, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={feat}
                        onChange={(e) => handleUpdateFeatureLine(index, e.target.value)}
                        placeholder={`Tính năng ${index + 1}...`}
                        className="flex-1 h-9 px-3 rounded-lg bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-[#FF6320]"
                      />
                      {pkgFeatures.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveFeatureLine(index)}
                          className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsPkgModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-semibold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSavingPkg}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6320] to-[#FFA153] hover:brightness-105 active:scale-95 text-white text-xs sm:text-sm font-bold shadow-lg shadow-orange-500/25 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSavingPkg ? 'Đang lưu...' : editingPkgId ? 'Cập Nhật Gói Cước' : 'Thêm Gói Cước'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 3: THÊM / SỬA ĐẦU MỤC (CATEGORY MODAL) */}
      {/* ============================================================ */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-[#182030] border border-white/15 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#FF6320]/20 text-[#FFA153] flex items-center justify-center">
                  <FolderOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">
                    {editingCatId ? 'Sửa Đầu Mục Gói Cước' : 'Thêm Đầu Mục Mới'}
                  </h3>
                  <p className="text-[11px] text-zinc-400">Quản lý nhóm gói cước hiển thị trên trang chủ</p>
                </div>
              </div>
              <button
                onClick={() => setIsCatModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Mã định danh (Key) <span className="text-[#FF6320]">*</span>
                </label>
                <input
                  type="text"
                  required
                  disabled={Boolean(editingCatId)}
                  value={catKey}
                  onChange={(e) => setCatKey(e.target.value)}
                  placeholder="Ví dụ: personal, combo, business..."
                  className="w-full h-10 px-3.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs sm:text-sm focus:outline-none focus:border-[#FF6320] disabled:opacity-50 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Tên đầu mục hiển thị <span className="text-[#FF6320]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder="Ví dụ: 1. Gói Internet Cá Nhân & Hộ Gia Đình..."
                  className="w-full h-10 px-3.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs sm:text-sm focus:outline-none focus:border-[#FF6320]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Mô tả ngắn</label>
                <textarea
                  rows={2}
                  value={catDescription}
                  onChange={(e) => setCatDescription(e.target.value)}
                  placeholder="Mô tả tóm tắt lợi ích của nhóm gói cước này..."
                  className="w-full p-3 rounded-xl bg-black/40 border border-white/15 text-white text-xs sm:text-sm focus:outline-none focus:border-[#FF6320]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Biểu tượng (Icon)</label>
                  <select
                    value={catIcon}
                    onChange={(e) => setCatIcon(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-black/40 border border-white/15 text-white text-xs sm:text-sm focus:outline-none focus:border-[#FF6320]"
                  >
                    <option value="Wifi" className="bg-zinc-900">Wifi</option>
                    <option value="Tv" className="bg-zinc-900">Tv (Truyền hình)</option>
                    <option value="Building2" className="bg-zinc-900">Building (Doanh nghiệp)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Thứ tự sắp xếp</label>
                  <input
                    type="number"
                    value={catOrder}
                    onChange={(e) => setCatOrder(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-xl bg-black/40 border border-white/15 text-white text-xs sm:text-sm text-center"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs font-bold text-zinc-300 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={catIsActive}
                  onChange={(e) => setCatIsActive(e.target.checked)}
                  className="w-4 h-4 rounded accent-[#FF6320]"
                />
                <span>Kích hoạt đầu mục này trên website</span>
              </label>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsCatModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-semibold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSavingCat}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6320] to-[#FFA153] hover:brightness-105 active:scale-95 text-white text-xs sm:text-sm font-bold shadow-lg shadow-orange-500/25 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSavingCat ? 'Đang lưu...' : editingCatId ? 'Cập Nhật Đầu Mục' : 'Thêm Đầu Mục'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
