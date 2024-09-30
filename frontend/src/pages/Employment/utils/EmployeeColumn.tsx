import { createTableColumns, getAllUniqueValues } from "../../../components/Table/Table";
import { EditOutlined, MoreOutlined, SearchOutlined } from "@ant-design/icons";
import Button from "../../../components/Shared/Button";
import { ButtonType } from "../../../enums/Button";
import { TableProps, Dropdown, Tag, Typography } from "antd";
import { EmployeeDataType } from "../types/Employee";
import { PiChartLineUpBold } from "react-icons/pi";
import { TbUserCancel } from "react-icons/tb";
import { t } from "i18next";
import { Link } from "react-router-dom";
import { IoDocumentAttach } from "react-icons/io5";
import { isHR } from "../../../utils/utils";

export function getColumns(
  tableData: EmployeeDataType[],
  onEdit: (record: EmployeeDataType) => void,
  onDelete: (id: EmployeeDataType) => void,
  onPromote: (record: EmployeeDataType) => void
): TableProps<EmployeeDataType>["columns"] {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const isHr = isHR();
  return [
    createTableColumns({
      title: t("name"),
      dataIndex: "name",
      key: "name",
      filterDropdown: true,
      onFilter: (inputValue, filter) => {
        const value = filter.name + " " + filter.surname;

        return value.toLowerCase().includes(inputValue.toLowerCase());
      },
      filterIcon: <SearchOutlined className="nav-menu-icon" />,
      displayAs: (_, record) => {
        const value = record.name + " " + record.surname;

				return <span>{value}</span>;
			},
		}),
		createTableColumns({
			title: "Email",
			dataIndex: "email",
			key: "email",
		}),
		createTableColumns({
			title: t("phoneNumber"),
			dataIndex: "phoneNumber",
			key: "phoneNumber",
		}),
		createTableColumns({
			title: t("position"),
			dataIndex: "position",
			key: "position",
			filters: getAllUniqueValues(tableData, "position"),
			onFilter: (value, record) => record.position.includes(value),
		}),
		createTableColumns({
			title: t("status"),
			dataIndex: "status",
			key: "status",
			displayAs: (value) => {
				return (
					<Tag color={value === "On Site" ? "green" : "blue"} key={value}>
						{value}
					</Tag>
				);
			},
			filters: getAllUniqueValues(tableData, "status"),
			align: "center",
			onFilter: (value, record) => record.status.indexOf(value) === 0,
		}),
		createTableColumns({
			title: t("salary"),
			dataIndex: "salary",
			key: "salary",
			displayAs: (value) => {
				return <span>{value} €</span>;
			},
		}),
		createTableColumns({
			title: t("contract"),
			dataIndex: "contract",
			key: "contract",
			displayAs: (value) =>
				value.trim() ? (
					<Link to={value} target="_blank" rel="noopener noreferrer">
						<Button size="large" type="link" icon={<IoDocumentAttach />}>
							<span> {t("yesContract")} </span>
						</Button>
					</Link>
				) : (
					<span>{t("noContrat")}</span>
				),
			align: "center",
		}),
		createTableColumns({
			title: t("startingOn"),
			dataIndex: "startingDate",
			key: "startDate",
			displayAs: (text: string) => {
				return <Typography.Text>{new Date(text).toLocaleDateString()}</Typography.Text>;
			},
		}),
		...(isHr
			? [
					createTableColumns({
						title: t("action"),
						dataIndex: "id",
						key: "action",
						displayAs: (_, record) => (
							<Dropdown
								menu={{
									items: [
										{
											key: "Edit",
											label: (
												<Button
													type={ButtonType.TEXT}
													block
													onClick={() => onEdit(record)}
													icon={<EditOutlined />}
												>
													{t("edit")}
												</Button>
											),
										},
										{
											key: "Promote",
											label: (
												<Button
													type={ButtonType.TEXT}
													style={{ color: "#FFA500" }}
													block
													onClick={() => onPromote(record)}
													icon={<PiChartLineUpBold />}
												>
													{t("promote")}
												</Button>
											),
										},
										{
											key: "Delete",
											label: (
												<Button
													type={ButtonType.TEXT}
													block
													onClick={() => onDelete(record)}
													danger
													icon={<TbUserCancel />}
												>
													{t("remove")}
												</Button>
											),
										},
									],
								}}
								trigger={["click"]}
							>
								<Button block type={ButtonType.TEXT} icon={<MoreOutlined />} />
							</Dropdown>
						),
						fixed: "right",
						align: "center",
						width: 40,
					}),
			  ]
			: []),
	];
}
