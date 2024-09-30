import { createTableColumns, getAllUniqueValues } from "../../../components/Table/Table";
import { Button, Space, Tag } from "antd";
import { RequestedDataType } from "../types/RequestedLeave";
import "../style/RequestLeaves.css";
import { useTranslation } from "react-i18next";
import { isHR } from "../../../utils/utils";

type createColumnsProps = {
	data: RequestedDataType[];
	onAcept: (id: string) => void;
	onDelete: (record: RequestedDataType) => void;
};

export const createColumns = (
	data: RequestedDataType[],
	onAcept: (id: string) => void,
	onDecline: (record: RequestedDataType) => void,
) => {
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const { t } = useTranslation();
	const isHr = isHR();
	return [
		createTableColumns({
			title: t("name"),
			dataIndex: "EmployeeName",
			key: "name",
			width: 120,
		}),
		createTableColumns({
			title: t("leaveType"),
			dataIndex: "leaveType",
			key: "leaveType",
			width: 120,
			filters: getAllUniqueValues(data, "leaveType"),
			onFilter: (value, record) => record.leaveType.indexOf(value) === 0,
			displayAs: (value) => <span>{t(value)}</span>,
		}),
		createTableColumns({
			title: t("totalDays"),
			dataIndex: "totalDays",
			key: "totalDays",
			width: 120,
		}),
		createTableColumns({
			title: t("leaveFrom"),
			dataIndex: "StartTime",
			key: "leaveFrom",
			width: 120,
			displayAs: (value) => <span>{new Date(value).toLocaleDateString()}</span>,
		}),
		createTableColumns({
			title: t("leaveTo"),
			dataIndex: "EndTime",
			key: "leaveTo",
			width: 120,
			displayAs: (value) => <span>{new Date(value).toLocaleDateString()}</span>,
		}),

		createTableColumns({
			title: isHr ? t("action") : t("status"),
			dataIndex: "_id",
			key: "action",
			align: "center",
			width: 120,
			displayAs: (_, record) =>
				isHr ? (
					<Space size="middle">
						<Button
							onClick={() => onAcept(record._id)}
							className={record.isApproved ? "approved" : "approve"}
							// disabled={record.isApproved}
						>
							{record.isApproved ? t("approved") : t("approve")}
						</Button>
						{!record.isApproved ? (
							<Button onClick={() => onDecline(record)} danger type="text">
								{t("decline")}
							</Button>
						) : null}
					</Space>
				) : (
					<Tag color={record.isApproved ? "green" : "blue"}>
						{record.isApproved ? t("approved") : t("pending")}
					</Tag>
				),
		}),
	];
};
