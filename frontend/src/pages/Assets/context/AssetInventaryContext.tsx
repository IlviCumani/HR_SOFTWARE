import { createContext, useState } from "react";
import { AssetDatatype, InventaryDataType } from "../types/AssetsDataType";
import useHttp from "../../../hooks/useHttp";

const INVENTARY_API = import.meta.env.REACT_APP_INVENTARY_API;
const ASSETS_API = import.meta.env.REACT_APP_ASSET_API;

export const AssetInventaryContext = createContext({
  assetData: [] as AssetDatatype[],
  getAssetData: () => {},
  addAssetTypeHandler: (_newAssets: string[]) => {},
  addQuantityHandler: (_values: string[], _assetType: string) => {},
  updateInventaryItemHandler: (
    _updatedRecord: InventaryDataType,
    _modifiers: {
      onRepairModifier: number;
      reservedModifier: number;
    }
  ) => {},
  deleteFromInventaryHandler: (_deletedINventart: InventaryDataType) => {},
  isLoading: false,
  errorMsg: null as string | null,
});

export default function AssetInventaryContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [assetsData, setAssetsData] = useState<AssetDatatype[]>([]);
  const [isLoading, error, fetchData] = useHttp();

  function getAssetData() {
    fetchData(
      {
        endpoint: `${ASSETS_API}`,
      },
      (response) => {
        const assets = response.map((asset: AssetDatatype) => {
          if (Object.keys(asset.inventories[0]).length > 0) {
            return asset;
          } else {
            return {
              ...asset,
              quantity: 0,
              onRepair: 0,
              reserved: 0,
              inventories: [],
            };
          }
        });
        setAssetsData(assets);
      }
    );
  }

  function addAssetTypeHandler(newAssets: string[]) {
    fetchData(
      useHttp.postRequestHelper(ASSETS_API, { assetName: newAssets }),
      (response) => {
        const newAssets = response.map((asset: AssetDatatype) => {
          return {
            ...asset,
            quantity: 0,
            onRepair: 0,
            reserved: 0,
            inventories: [],
          };
        });
        setAssetsData((prev) => [...prev, ...newAssets]);
      }
    );
  }

  function addQuantityHandler(newAssets: string[], assetType: string) {
    console.log(assetType, "assets Type");
    console.log(newAssets, "CODES");
    fetchData(
      useHttp.postRequestHelper("inventory", {
        assetName: assetType,
        assetCodes: newAssets,
      }),
      (response: InventaryDataType[]) => {
        setAssetsData((prev) => {
          const updatedAssets = prev.map((asset) => {
            if (asset.assetName === assetType) {
              return {
                ...asset,
                quantity: asset.quantity + response.length,
                inventories: [...asset.inventories, ...response],
              };
            }
            return asset;
          });
          return updatedAssets;
        });
      }
    );
  }

  function deleteFromInventaryHandler(deletedInventary: InventaryDataType) {
    setAssetsData((prev) => {
      const updatedAssets = prev.map((asset) => {
        if (asset._id === deletedInventary.assetID) {
          const deletedInventaryStatus = deletedInventary.status;
          return {
            ...asset,
            quantity: asset.quantity - 1,
            onRepair:
              deletedInventaryStatus === "OnRepair"
                ? asset.onRepair - 1
                : asset.onRepair,
            reserved:
              deletedInventaryStatus === "Assigned"
                ? asset.reserved - 1
                : asset.reserved,
            inventories: asset.inventories.filter(
              (item) => item._id !== deletedInventary._id
            ),
          };
        }
        return asset;
      });
      return updatedAssets;
    });
  }

  function updateInventaryItemHandler(
    updatedRecord: InventaryDataType,
    modifiers: {
      onRepairModifier: number;
      reservedModifier: number;
    }
  ) {
    setAssetsData((prev) => {
      const updatedAssets = prev.map((asset) => {
        if (asset._id === updatedRecord.assetID) {
          return {
            ...asset,
            inventories: asset.inventories.map((item) =>
              item._id === updatedRecord._id ? updatedRecord : item
            ),
            onRepair: asset.onRepair + modifiers.onRepairModifier,
            reserved: asset.reserved + modifiers.reservedModifier,
          };
        }
        return asset;
      });
      return updatedAssets;
    });
  }

  const ctxValue = {
    assetData: assetsData,
    getAssetData,
    addAssetTypeHandler,
    addQuantityHandler,
    updateInventaryItemHandler,
    deleteFromInventaryHandler,
    isLoading,
    errorMsg: error,
  };

  return (
    <AssetInventaryContext.Provider value={ctxValue}>
      {children}
    </AssetInventaryContext.Provider>
  );
}
