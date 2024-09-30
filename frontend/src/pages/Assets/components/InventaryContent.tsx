import Table from "../../../components/Table/Table";
import Loader from "../../../components/Shared/Loader";
import createColumns from "./columns/InventaryColumn";
import { useState, useEffect, useRef, useContext } from "react";
import { AssetDatatype } from "../types/AssetsDataType";
import Modal from "../../../components/Shared/Modal";
import QuantityForm from "./InventaryForm";
import ExpandedRow from "./ExpandesRow";
import { t } from "i18next";
import { AssetInventaryContext } from "../context/AssetInventaryContext";

type InventaryContentProps = {
	isModalOpen: boolean;
	setIsModalOpen: (value: boolean) => void;
};

const InventaryContent = ({ isModalOpen, setIsModalOpen }: InventaryContentProps) => {
	const { assetData, getAssetData, addAssetTypeHandler, addQuantityHandler, isLoading } =
		useContext(AssetInventaryContext);
	const [selectedInventaryData, setSelectedAsset] = useState<AssetDatatype | null>(null);
	const formRef = useRef<any>();

	useEffect(() => {
		getAssetData();
	}, []);

	const columns = createColumns(assetData, handleQuantityChange);

	function handleQuantityChange(record: AssetDatatype) {
		setSelectedAsset(record);
		setIsModalOpen(true);
	}

	function handleAddAssetType(values: string[]) {
		const valueToSend = values.map(
			(value) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase(),
		);
		addAssetTypeHandler(valueToSend);
		setIsModalOpen(false);
	}

	function handleAddQuantity(values: string[], assetType: string) {
		addQuantityHandler(values, assetType);
		setIsModalOpen(false);
	}

	return (
		<>
			<Modal
				title={
					selectedInventaryData
						? `${t("add")} ${selectedInventaryData.assetName} ${t("toINventary")}`
						: t("addAssetType")
				}
				isOpen={isModalOpen}
				onCancel={() => {
					setIsModalOpen(false);
					setSelectedAsset(null);
				}}
				onOk={() => {
					formRef.current.submit();
				}}
				isLoading={isLoading}
			>
				<QuantityForm
					selectedAsset={selectedInventaryData}
					onAddAssetType={handleAddAssetType}
					onAddQuantity={handleAddQuantity}
					ref={formRef}
				/>
			</Modal>
			{!isLoading ? (
				<Table
					// identifier="assetID"
					pagination={false}
					data={assetData}
					columns={columns}
					expandable={{
						expandedRowRender: (record) => <ExpandedRow record={record} />,
						// rowExpandable: (record) => record.inventories.length > 0,
						expandRowByClick: true,
					}}
				/>
			) : (
				<Loader />
			)}
		</>
	);
};

export default InventaryContent;