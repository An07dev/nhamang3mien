import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILead extends Document {
  name: string;
  phone: string;
  province?: string;
  packageInterest?: string;
  note?: string;
  source?: string;
  status: 'pending' | 'contacted' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new Schema<ILead>(
  {
    name: {
      type: String,
      required: [true, 'Họ và tên là bắt buộc'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Số điện thoại là bắt buộc'],
      trim: true,
    },
    province: {
      type: String,
      default: 'TP. Hồ Chí Minh',
      trim: true,
    },
    packageInterest: {
      type: String,
      default: 'Gói Sky (1 Gbps)',
      trim: true,
    },
    note: {
      type: String,
      default: '',
      trim: true,
    },
    source: {
      type: String,
      default: 'Đăng Ký Liền Tay',
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'contacted', 'completed'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

const Lead: Model<ILead> = mongoose.models.Lead || mongoose.model<ILead>('Lead', LeadSchema);

export default Lead;
