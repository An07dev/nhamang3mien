import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICapiEventLog {
  eventName: string;
  eventId?: string;
  sentAt: Date;
  success: boolean;
  response?: string;
}

export interface ILead extends Document {
  name: string;
  phone: string;
  province?: string;
  packageInterest?: string;
  note?: string;
  source?: string;
  status: 'pending' | 'contacted' | 'completed';
  capiEvents?: ICapiEventLog[];
  clientMetadata?: {
    clientIp?: string;
    userAgent?: string;
    fbp?: string;
    fbc?: string;
    lastEventId?: string;
  };
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
    capiEvents: [
      {
        eventName: { type: String, required: true },
        eventId: { type: String },
        sentAt: { type: Date, default: Date.now },
        success: { type: Boolean, default: false },
        response: { type: String },
      },
    ],
    clientMetadata: {
      clientIp: { type: String },
      userAgent: { type: String },
      fbp: { type: String },
      fbc: { type: String },
      lastEventId: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

if (mongoose.models && mongoose.models.Lead) {
  delete (mongoose.models as any).Lead;
}

const Lead: Model<ILead> =
  mongoose.models?.Lead || mongoose.model<ILead>('Lead', LeadSchema);

export default Lead;
