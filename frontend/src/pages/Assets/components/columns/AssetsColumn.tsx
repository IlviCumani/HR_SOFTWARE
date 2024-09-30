import { createTableColumns, getAllUniqueValues } from "../../../../components/Table/Table";
import { SearchOutlined } from "@ant-design/icons";
import { TableProps } from "antd";
import { t } from "i18next";
import { AssetDatatype } from "../../types/AssetsDataType";

export function getColumns(tableData: AssetDatatype[]): TableProps<AssetDatatype>["columns"] {
	return [
		createTableColumns({
			title: t("employee"),
			dataIndex: "_id",
			key: "employee",
			filterDropdown: true,
			filterIcon: <SearchOutlined className="nav-menu-icon" />,
			width: 150,
			onFilter: (inputValue, filter) => {
				const { inventory } = filter;
				const employee = inventory.employeeDetails.fullName;
				return employee.toLowerCase().includes(inputValue.toLowerCase());
			},
			displayAs: (_, record) => {
				const { inventory } = record;
				const employee = inventory.employeeDetails.fullName;
				return <span> {employee} </span>;
			},
		}),
		createTableColumns({
			title: t("assetType"),
			dataIndex: "assetName",
			key: "type",
			width: 150,
			filters: getAllUniqueValues(tableData, "assetName"),
			onFilter: (value, record) => {
				return record.assetName.indexOf(value) === 0;
			},
		}),
		createTableColumns({
			title: t("dateGiven"),
			dataIndex: "assignDate",
			key: "date",
			width: 150,
			displayAs: (_, record) => {
				const { inventory } = record;
				const text = inventory.assignDate;
				return <span>{new Date(text).toLocaleDateString()}</span>;
			},
		}),
		createTableColumns({
			title: t("code"),
			dataIndex: "assetCode",
			key: "code",
			displayAs: (_, record) => {
				const { inventory } = record;
				return <span>{inventory.assetCodes}</span>;
			},
			width: 150,
		}),
	];
}
