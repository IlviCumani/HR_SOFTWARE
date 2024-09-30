import { Tag, Typography, Dropdown } from "antd";
import { AssetStatus } from "../../types/AssetsDataType";
import { createTableColumns, getAllUniqueValues } from "../../../../components/Table/Table";
import Button from "../../../../components/Shared/Button";
import { InventaryDataType } from "../../types/AssetsDataType";
import { DeleteOutlined, MoreOutlined, SearchOutlined, ToolOutlined } from "@ant-design/icons";
import { FaRegCheckCircle } from "react-icons/fa";
import { BsFillPersonCheckFill } from "react-icons/bs";
import { BsFillPersonDashFill } from "react-icons/bs";
import { t } from "i18next";
import { isCEO } from "../../../../utils/utils";

export function expandedColumns(
	inventaryData: InventaryDataType[],
	onChangeStatus: (newStatus: AssetStatus, record: InventaryDataType) => void,
	onAddAsset: (record: InventaryDataType) => void,
	handleUnassign: (record: InventaryDataType) => void,
	onDeleteAsset: (id: InventaryDataType) => void,
	onCeoAssign: (recordID: string) => void,
) {
	const isCeo = isCEO();
	return [
		createTableColumns({
			title: t("code"),
			dataIndex: "assetCodes",
			key: "code",
			filterDropdown: true,
			filterIcon: <SearchOutlined className="nav-menu-icon" />,
			onFilter(value, record) {
				return record.assetCodes.includes(value);
			},
		}),
		createTableColumns({
			title: t("employee"),
			dataIndex: "_id",
			key: "userName",
			displayAs: (_: string, record: InventaryDataType) => {
				const employee = record.employeeDetails ? record.employeeDetails.fullName : "Not assigned";
				return (
					<Typography.Text>
						{record.status === AssetStatus.Assigned ? employee : t("notAssigned")}
					</Typography.Text>
				);
			},
		}),
		createTableColumns({
			title: t("dateGiven"),
			dataIndex: "assignDate",
			key: "dateGiven",
			displayAs: (text: string) => {
				return (
					<Typography.Text>
						{text ? new Date(text).toLocaleDateString() : t("notAssigned")}
					</Typography.Text>
				);
			},
		}),
		createTableColumns({
			title: t("status"),
			dataIndex: "status",
			key: "status",
			displayAs: (_, record) => {
				const isAvailable = record.status === AssetStatus.Available;
				const isOnRepair = record.status === AssetStatus.OnRepair;
				return (
					<Tag color={isAvailable ? "success" : isOnRepair ? "warning" : "red"}>
						{t(record.status)}
					</Tag>
				);
			},
			align: "center",
			width: 20,
			filters: getAllUniqueValues(inventaryData, "status"),
			onFilter: (value, record) => {
				return record.status.includes(value as string);
			},
		}),
		createTableColumns({
			title: t("dateBought"),
			dataIndex: "createdAt",
			key: "assetName",
			displayAs: (text) => {
				const date = new Date(text);
				return <Typography.Text>{date.toLocaleDateString()}</Typography.Text>;
			},
		}),
		createTableColumns({
			title: t("action"),
			dataIndex: "_id",
			key: "actions",
			displayAs: (_, record) => {
				const { status } = record;
				const isAvailable = status === "Available";
				const isOnRepair = status === "OnRepair";

				return (
					<Dropdown
						menu={{
							items: [
								!isOnRepair
									? {
											key: "Assign",
											label: (
												<Button
													type="text"
													size="large"
													block
													icon={isAvailable ? <BsFillPersonCheckFill /> : <BsFillPersonDashFill />}
													iconPosition="end"
													onClick={
														isAvailable
															? isCeo
																? () => onCeoAssign(record._id)
																: () => onAddAsset(record)
															: () => handleUnassign(record)
													}
												>
													{isAvailable ? (isCeo ? t("get") : t("assign")) : t("unassign")}
												</Button>
											),
									  }
									: null,
								isCeo
									? null
									: {
											key: "Repair",
											label: (
												<Button
													type="text"
													size="large"
													icon={isOnRepair ? <FaRegCheckCircle /> : <ToolOutlined />}
													style={{ color: isOnRepair ? "green" : "orange" }}
													block
													onClick={() =>
														onChangeStatus(
															isOnRepair ? AssetStatus.Available : AssetStatus.OnRepair,
															record,
														)
													}
													iconPosition="end"
												>
													{!isOnRepair ? t("repair") : t("repaired")}
												</Button>
											),
									  },
								{
									key: "Delete",
									label: (
										<Button
											type="text"
											size="large"
											danger
											icon={<DeleteOutlined />}
											block
											onClick={() => onDeleteAsset(record)}
											iconPosition="end"
										>
											{t("remove")}
										</Button>
									),
								},
							],
						}}
						arrow
						placement="bottom"
						trigger={["click"]}
					>
						<Button type="text" block icon={<MoreOutlined />} />
					</Dropdown>
				);
			},
			align: "center",
			width: 20,
		}),
	];
}
