import { AssetDatatype, InventaryDataType } from "../../types/AssetsDataType";
import { createTableColumns } from "../../../../components/Table/Table";
import Button from "../../../../components/Shared/Button";
import { PlusCircleOutlined } from "@ant-design/icons";
import { TableProps, Typography } from "antd";
import Progress from "../../../../components/Shared/Progress";
import { t } from "i18next";
import { isHR } from "../../../../utils/utils";

type InventaryColumnType = (
	data: AssetDatatype[],
	onEdit: (record: AssetDatatype) => void,
) => TableProps<InventaryDataType>["columns"];

function calcPercantage(reserved: number, quantity: number) {
	return parseFloat(((reserved / quantity) * 100).toFixed(1));
}

const createColumns: InventaryColumnType = (data, onEdit) => {
	const isHr = isHR();
	return [
		createTableColumns({
			title: t("assetType"),
			dataIndex: "assetName",
			key: "assetType",
		}),
		createTableColumns({
			title: t("available"),
			dataIndex: "_id",
			key: "reserved",
			displayAs: (_, record) => {
				const quantity: number = data.find((item) => item._id === record._id)?.quantity || 0;
				const percentage = calcPercantage(quantity - record.reserved - record.onRepair, quantity);

				const available = quantity - record.reserved - record.onRepair;
				return (
					<Progress
						percentPosition={{ align: "end", type: "inner" }}
						format={(percent) =>
							`${available} / ${quantity} ${percent && percent > 20 ? t("available") : ""}`
						}
						percentage={percentage}
						status={
							percentage > 80
								? "success"
								: percentage <= 15 || quantity === 0
								? "exception"
								: "normal"
						}
					/>
				);
			},
			width: "40%",
		}),
		createTableColumns({
			title: t("totalQuantity"),
			dataIndex: "quantity",
			key: "quantity",
			displayAs: (value) => {
				return <Typography.Text>{value}</Typography.Text>;
			},
		}),
		createTableColumns({
			title: t("reserved"),
			dataIndex: "reserved",
			key: "reserved",
		}),
		createTableColumns({
			title: t("onRepair"),
			dataIndex: "onRepair",
			key: "onRepair",
		}),
		...(isHr ? [createTableColumns({
			title: t("edit"),
			dataIndex: "_id",
			key: "quantity",
			displayAs: (_, record) => {
				return (
					<Button type="text" icon={<PlusCircleOutlined />} onClick={() => onEdit(record)}>
						{t("add")}
					</Button>
				);
			},
			align: "center",
			width: 50,
		})] : []),
	];
};

export default createColumns;
