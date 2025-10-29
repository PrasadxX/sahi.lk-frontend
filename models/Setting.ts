import mongoose, { Schema, model, models } from "mongoose";

export interface ISetting extends mongoose.Document {
  name: string;
  value: any;
  createdAt: Date;
  updatedAt: Date;
}

const SettingSchema = new Schema<ISetting>(
  {
    name: { 
      type: String, 
      required: true, 
      unique: true 
    },
    value: { 
      type: Schema.Types.Mixed, 
      required: true 
    },
  },
  {
    timestamps: true,
  }
);

export const Setting = models?.Setting || model<ISetting>("Setting", SettingSchema);
