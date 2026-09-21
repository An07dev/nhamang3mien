import mongoose, { Schema, Document, Model } from 'mongoose';

export type PackageTheme =
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

export interface IPackage extends Document {
  name: string;
  categoryKey: string;
  speed: string;
  price: string;
  originalPrice?: string;
  isPopular: boolean;
  tag?: string;
  theme: PackageTheme;
  suitableFor: string;
  features: string[];
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PackageSchema = new Schema<IPackage>(
  {
    name: {
      type: String,
      required: [true, 'Tên gói cước là bắt buộc'],
      trim: true,
    },
    categoryKey: {
      type: String,
      required: [true, 'Đầu mục gói cước là bắt buộc'],
      trim: true,
      index: true,
    },
    speed: {
      type: String,
      required: [true, 'Tốc độ gói cước là bắt buộc'],
      trim: true,
    },
    price: {
      type: String,
      required: [true, 'Giá gói cước là bắt buộc'],
      trim: true,
    },
    originalPrice: {
      type: String,
      default: '',
      trim: true,
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    tag: {
      type: String,
      default: '',
      trim: true,
    },
    theme: {
      type: String,
      enum: [
        'orange',
        'red',
        'purple',
        'slate',
        'emerald',
        'blue',
        'cyan',
        'amber',
        'rose',
        'indigo',
        'teal',
        'dark',
      ],
      default: 'orange',
    },
    suitableFor: {
      type: String,
      default: '',
      trim: true,
    },
    features: {
      type: [String],
      default: [],
    },
    order: {
      type: Number,
      default: 1,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

if (mongoose.models.Package) {
  delete mongoose.models.Package;
}

const Package: Model<IPackage> = mongoose.model<IPackage>('Package', PackageSchema);

export default Package;
