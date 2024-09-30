import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum InventoryStatus {
  Available = 'Available',
  Assigned = 'Assigned',
  Broken = 'Broken',
  OnRepair = 'OnRepair',
}

@Schema({ timestamps: true })
export class Inventory extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Asset' })
  assetID: Types.ObjectId;

  @Prop({ unique: true })
  assetCodes: string;

  @Prop({
    type: String,
    enum: InventoryStatus,
    required: true,
  })
  status: InventoryStatus;

  @Prop({ type: Types.ObjectId, ref: 'Employee' })
  employeeDetails: Types.ObjectId;

  @Prop()
  assignDate: Date;

  @Prop()
  assetName: string;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop()
  deleteDate: Date;
}

const InventorySchema = SchemaFactory.createForClass(Inventory);
export { InventorySchema };
