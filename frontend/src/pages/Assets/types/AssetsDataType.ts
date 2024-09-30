import { EmployeeDataType } from "../../Employment/types/Employee";

export type AssetDatatype = {
  _id: string;
  assetName: string;
  quantity: number;
  reserved: number;
  onRepair: number;
  inventories: InventaryDataType[];
};

export type InventaryDataType = {
	_id: string;
	assetCodes: string;
	assetID: string;
	employeeDetails: EmployeeDataType;
	assignedDate: Date;
	status: AssetStatus;
};

export enum AssetStatus {
  Available = "Available",
  Assigned = "Assigned",
  OnRepair = "OnRepair",
}
