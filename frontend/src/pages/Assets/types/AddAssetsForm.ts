import { AssetDatatype } from "./AssetsDataType";

export type AssetFormProps = {
  onAdd: (data: any) => void;
};

export type QuantityFormProps = {
  selectedAsset?: AssetDatatype | null;
  onAddAssetType: (values: string[]) => void;
  onAddQuantity: (values: string[], assetType: string) => void;
};
