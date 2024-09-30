import { Flex, Typography } from "antd";
import Table from "../../../components/Table/Table";
import "../styles/styles.css";
import { expandedColumns } from "./columns/ExpandesColumns";
import Modal from "../../../components/Shared/Modal";
import AssetForm from "./AssetForm";
import { useState, useRef, useContext } from "react";
import { AssetInventaryContext } from "../context/AssetInventaryContext";
import useHttp from "../../../hooks/useHttp";

import { AssetDatatype, InventaryDataType, AssetStatus } from "../types/AssetsDataType";
import { getFromLocalStorage, isCEO } from "../../../utils/utils";

const INVENTARY_API = import.meta.env.REACT_APP_INVENTARY_API;

const ExpandedRow = ({ record }: { record: AssetDatatype }) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const { updateInventaryItemHandler, deleteFromInventaryHandler } =
		useContext(AssetInventaryContext);
	const [selectedAsset, setSelectedAsset] = useState<InventaryDataType | null>(null);
	const formRef = useRef<any>();
	const [, , fetchData] = useHttp();
	const filterData = record.inventories;

	const handleOnRepairClick = (newStatus: string, updatedRecord: InventaryDataType) => {
		let onRepaieModifier = 0;
		let reservedModifier = 0;

		if (updatedRecord.status === AssetStatus.OnRepair) {
			onRepaieModifier = -1;
		} else {
			reservedModifier = updatedRecord.status === AssetStatus.Assigned ? -1 : 0;
			onRepaieModifier = 1;
		}

		fetchData(
			useHttp.patchRequestHelper(`${INVENTARY_API}/${updatedRecord._id}`, {
				assetName: record.assetName,
				assetCodes: updatedRecord.assetCodes,
				status: newStatus,
			}),
			(response) => {
				updateInventaryItemHandler(response, {
					onRepairModifier: onRepaieModifier,
					reservedModifier: reservedModifier,
				});
			},
		);
	};

	function handleOnAssign(dataToSubmit: {
		employeeDetails: string | undefined;
		dateGiven: string | undefined;
	}) {
		fetchData(
			useHttp.patchRequestHelper(`${INVENTARY_API}/assign/${selectedAsset?._id}`, dataToSubmit),
			(response) => {
				updateInventaryItemHandler(response, {
					onRepairModifier: 0,
					reservedModifier: 1,
				});
				setIsModalOpen(false);
				setSelectedAsset(null);
			},
		);
	}

	function handleOnCeoAssign(recordId: string) {
		const dataToSubmit = {
			employeeDetails: getFromLocalStorage().employID,
			assignDate: new Date().toISOString(),
		};

		fetchData(
			useHttp.patchRequestHelper(`${INVENTARY_API}/assign/${recordId}`, dataToSubmit),
			(response) => {
				updateInventaryItemHandler(response, {
					onRepairModifier: 0,
					reservedModifier: 1,
				});
			},
		);
	}

	function handleUnassign(record: InventaryDataType) {
		fetchData(useHttp.patchRequestHelper(`${INVENTARY_API}/unassign/${record._id}`), (response) => {
			updateInventaryItemHandler(response, {
				onRepairModifier: 0,
				reservedModifier: -1,
			});
		});
	}

	function handleDeleteFromInventary(deletedInventary: InventaryDataType) {
		fetchData(useHttp.deleteRequestHelper(`${INVENTARY_API}/${deletedInventary._id}`), () => {
			deleteFromInventaryHandler(deletedInventary);
		});
	}

	const handleAddAsset = (record: InventaryDataType) => {
		setIsModalOpen(true);
		setSelectedAsset(record);
	};

	const handleModalClose = () => {
		setIsModalOpen(false);
		setSelectedAsset(null);
	};

	const handleSubmit = () => {
		formRef.current.submit();
	};

	const columns = expandedColumns(
		record.inventories,
		handleOnRepairClick,
		handleAddAsset,
		handleUnassign,
		handleDeleteFromInventary,
		handleOnCeoAssign,
	);

	return (
		<Flex vertical align="center" className="inner-table-container test">
			<Modal isOpen={isModalOpen} onCancel={handleModalClose} onOk={handleSubmit}>
				<AssetForm onAdd={handleOnAssign} ref={formRef} />
			</Modal>
			<Typography.Text>{`View info about ${record.assetName}`}</Typography.Text>
			<Table
				pagination={false}
				data={filterData}
				columns={columns}
				rowClassName="inner-table-row"
			/>
			{/* <Button type="link">Scroll To Top</Button> */}
		</Flex>
	);
};

export default ExpandedRow;
