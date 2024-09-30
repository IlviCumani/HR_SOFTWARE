import { Button, Dropdown, Space, Tag } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { createTableColumns } from "../../../../components/Table/Table";
import { ButtonType } from "../../../../enums/Button";
import { capitalizeFirstLetter, getMonthName } from "../../../../utils/generals";
import { Salary } from "../../../../types/SalaryProps";
import { isHR } from "../../../../utils/utils";

interface ColumnsParams {
	handleAddBonus: (employeeID: string) => void;
	handleModal: (employeeID: string) => void;
	updateSalary: (salaryID: string, newSalary: Salary) => Promise<void>;
}

const columns = ({ handleAddBonus, handleModal, updateSalary }: ColumnsParams) => {
	const isHr = isHR();

	return [
		createTableColumns({
			dataIndex: "employeeDetails",
			title: "Employee Details",
			key: "_id",
			displayAs: (employeeDetails) => {
				if (!employeeDetails) {
					return <span>No Details</span>;
				}
				return (
					<span>
						{capitalizeFirstLetter(employeeDetails.name)}{" "}
						{capitalizeFirstLetter(employeeDetails.surname)}
					</span>
				);
			},
		}),
		createTableColumns({
			dataIndex: "dateTaken",
			title: "Date Taken",
			key: "_id",
			displayAs: (dateTaken) => {
				const dateObj = new Date(dateTaken);
				if (dateObj instanceof Date && !isNaN(dateObj.getTime())) {
					const year = dateObj.getFullYear();
					const monthName = getMonthName(dateObj);
					return <span style={{ width: "200px" }}>{`${monthName} ${year}`}</span>;
				}
				return <span>Invalid Date</span>;
			},
		}),
		createTableColumns({
			dataIndex: "netSalary",
			title: "Net Salary",
			key: "_id",
		}),

		createTableColumns({
			dataIndex: "workDays",
			title: "Work Days",
			key: "_id",
		}),
		createTableColumns({
			dataIndex: "bonuses",
			title: "Bonuses Total",
			key: "_id",
			displayAs: (bonuses: { desc: string; amount: number }[]) => {
				const totalBonuses = bonuses.reduce((acc, bonus) => acc + bonus.amount, 0);
				return <span>{totalBonuses}</span>;
			},
		}),
		createTableColumns({
			dataIndex: "grossSalary",
			title: "Gross Salary",
			key: "_id",
		}),
		createTableColumns({
			dataIndex: "total",
			title: "Total",
			key: "_id",
		}),
		...(isHr
			? [
					createTableColumns({
						title: "Paid",
						dataIndex: "paid",
						key: "action",
						align: "center",
						width: 120,
						displayAs: (_, record) =>
							record.paid ? (
								<Tag color={"blue"}>Paid</Tag>
							) : (
								<Space size="middle">
									<Button
										onClick={() => updateSalary(record._id, { ...record, paid: true })}
										type={ButtonType.PRIMARY}
									>
										Compensate
									</Button>
								</Space>
							),
					}),
					createTableColumns({
						title: "Action",
						dataIndex: "_id",
						key: "action",
						displayAs: (salaryID: string) => {
							return (
								<Dropdown
									menu={{
										items: [
											{
												key: "Add Bonus",
												label: (
													<Button
														style={{ width: "80px" }}
														type={ButtonType.TEXT}
														onClick={() => handleAddBonus(salaryID)}
													>
														Add Bonus
													</Button>
												),
											},
											{
												key: "Edit",
												label: (
													<Button
														style={{ width: "80px", alignItems: "center" }}
														type={ButtonType.TEXT}
														onClick={() => handleModal(salaryID)}
													>
														Edit
													</Button>
												),
											},
										],
									}}
									trigger={["click"]}
								>
									<Button type={ButtonType.TEXT} icon={<MoreOutlined />} />
								</Dropdown>
							);
						},
						fixed: "right",
						width: 40,
					}),
			  ]
			: []),
	];
};

export default columns;
