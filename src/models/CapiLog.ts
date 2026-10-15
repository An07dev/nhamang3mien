import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICapiLog extends Document {
  eventName: string;
  eventId?: string;
  leadId?: string;
  leadName?: string;
  phone?: string;
  province?: string;
  packageName?: string;
  clientIp?: string;
  userAgent?: string;
  success: boolean;
  response?: string;
  fbtraceId?: string;
  sentAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CapiLogSchema = new Schema<ICapiLog>(
  {
    eventName: { type: String, required: true, index: true },
    eventId: { type: String, index: true },
    leadId: { type: String },
    leadName: { type: String, default: 'Khách truy cập' },
    phone: { type: String, default: '' },
    province: { type: String, default: '' },
    packageName: { type: String, default: '' },
    clientIp: { type: String },
    userAgent: { type: String },
    success: { type: Boolean, default: true, index: true },
    response: { type: String, default: '' },
    fbtraceId: { type: String, default: '' },
    sentAt: { type: Date, default: Date.now, index: true },
  },
  {
    timestamps: true,
  }
);

// Tự động hết hạn log sau 30 ngày để giải phóng dung lượng DB
CapiLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

if (mongoose.models && mongoose.models.CapiLog) {
  delete (mongoose.models as any).CapiLog;
}

const CapiLog: Model<ICapiLog> =
  mongoose.models?.CapiLog || mongoose.model<ICapiLog>('CapiLog', CapiLogSchema);

export default CapiLog;
