import { EditOutlined } from "@ant-design/icons";
import { TableProps } from "antd";
import { createTableColumns } from "../../../components/Table/Table";
import { IoDocumentAttach } from "react-icons/io5";
import Button from "../../../components/Shared/Button";
import { selectOption } from "./constants";
import { Tag } from "antd";

import { Link } from "react-router-dom";
import { ButtonType } from "../../../enums/Button";
import { ApplicantProps } from "../../../types/ApplicantProps";
import { Dispatch, SetStateAction } from "react";
import { Col, Row, Tooltip } from "antd/lib";
import { t } from "i18next";
import { isCEO } from "../../../utils/utils";

type GenerateColumnsParams = {
	tableData: ApplicantProps[];
	setDrawerState: Dispatch<SetStateAction<boolean>>;
	setEditingRecord: Dispatch<SetStateAction<ApplicantProps | null>>;
};

export const columns = ({
	tableData,
	setDrawerState,
	setEditingRecord,
}: GenerateColumnsParams): TableProps<ApplicantProps>["columns"] => [
	createTableColumns({
		title: t("applicantName"),
		dataIndex: "_id",
		key: "_id",
		width: "70px",
		displayAs: (record) => {
			const applicant = tableData.find((applicant) => applicant._id === record);
			return (
				<span>
					{applicant?.name} {applicant?.surname}
				</span>
			);
		},
	}),
	createTableColumns({ title: "Email", dataIndex: "email", key: "email" }),
	createTableColumns({
		title: t("resume"),
		dataIndex: "cv",
		key: "cv",
		displayAs: (value) =>
			value ? (
				<Link to={value} target="_blank" rel="noopener noreferrer">
					<Button size="large" type={ButtonType.LINK} icon={<IoDocumentAttach />}>
						<span> {t("lookCV")} </span>
					</Button>
				</Link>
			) : (
				<span>{t("noCV")}</span>
			),

		align: "center",
		width: 60,
	}),
	createTableColumns({
		title: t("position"),
		dataIndex: "position",
		key: "position",
		width: "70px",
	}),
	createTableColumns({
		title: t("applicationStage"),
		dataIndex: "stage",
		key: "stage",
		displayAs: (value) => {
			const item = selectOption.find((item) => item.label === value);

			return <Tag color={item?.color}>{t(item!.label)}</Tag>;
		},
		align: "center",
		width: 60,
		onFilter: (value, record) => record.stage.indexOf(value) === 0,
	}),
	createTableColumns({
		title: t("submittedDate"),
		dataIndex: "submittedDate",
		key: "submittedDate",
		width: "70px",
		displayAs: (value) => (
			<span>
				{new Date(value).toLocaleDateString("en-GB", {
					day: "numeric",
					month: "long",
					year: "numeric",
				})}
			</span>
		),
	}),

	createTableColumns({
		title: t("reference"),
		dataIndex: "reference",
		key: "reference",
		width: "70px",
	}),

	...(!isCEO()
		? [
				createTableColumns({
					title: t("more"),
					dataIndex: "_id",
					key: "action",
					displayAs: (record) => {
						const applicant = tableData.find((applicant) => applicant._id === record);
						return (
							<>
								<Row gutter={15} justify={"center"}>
									<Col>
										<Tooltip title={t("editApplicant")} color="cyan">
											<Button
												type={ButtonType.TEXT}
												block
												icon={<EditOutlined />}
												onClick={() => {
													if (applicant) {
														setEditingRecord(applicant);
														setDrawerState(true);
													} else {
														setEditingRecord(null);
													}
												}}
											></Button>
										</Tooltip>
									</Col>
								</Row>
							</>
						);
					},
					fixed: "right",
					align: "center",
					width: 30,
				}),
		  ]
		: []),
];
