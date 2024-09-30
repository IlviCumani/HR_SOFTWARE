import { Col, Form, Row, Flex, Upload, Button, Select } from "antd";
import { RcFile } from "antd/lib/upload/interface";
import { EuroCircleOutlined } from "@ant-design/icons";
import FormInputs from "../../../components/Shared/InputTypes/FormInputs";
import { getDevRoles } from "../utils/helperFunctions";
import { UploadOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { getAuthToken } from "../../../utils/utils";

const TEAM_LEADERS = import.meta.env.REACT_APP_TEAM_LEADERS_SEARCH_API;
const main_api = import.meta.env.REACT_APP_MAIN;

//!THIS MIGHT NEED ATTENTION

const SecondStep = ({ form }: any) => {
	// const form = Form.useFormInstance();
	const { t } = useTranslation();
	const [file, setFile] = useState<File | undefined>(undefined);
	const [selectTeamLeader, setSelectTeamLeader] = useState<any[]>([]);
	const position = getDevRoles().map((role) => ({ label: role, value: role }));
	position.push({ label: "Project Manager", value: "projectManager" });

	useEffect(() => {
		const fetchTeamLeaders = async () => {
			try {
				const response = await fetch(`${main_api}/${TEAM_LEADERS}`, {
					headers: {
						Authorization: `Bearer ${getAuthToken()}`,
					},
				});
				if (!response.ok) {
					throw new Error(`Failed to fetch team leaders: ${response.statusText}`);
				}

				const data = await response.json();
				const teamLeaderOptions = data.map((leader: any) => ({
					label: `${leader.name} ${leader.surname}`,
					value: leader._id,
				}));
				setSelectTeamLeader(teamLeaderOptions);
			} catch (error) {
				console.error("Error fetching team leaders:", error);
			}
		};

		fetchTeamLeaders();
	}, []);

	console.log(selectTeamLeader, "selecteddTeamLeader");

	const handleUpload = async (files: RcFile[]) => {
		const formData = new FormData();
		files.forEach((file) => {
			formData.append("files", file as File);
		});

		try {
			const uploadResponse = await fetch(`${main_api}/files/upload`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${getAuthToken()}`,
				},
				body: formData,
			});
			const uploadData = await uploadResponse.json();
			const fileUrls = uploadData.fileUrls;

			form.setFieldsValue({ contract: fileUrls });
		} catch (error) {
			console.error("File upload error:", error);
		}
	};

	const handleFileChange = (info: any) => {
		const files = info.fileList.map((file: any) => file.originFileObj as RcFile);
		if (files.length > 0) {
			handleUpload(files);
		}
	};

	const handleTeamLeaderChange = (selectedTeamLeaders: any[]) => {
		form.setFieldsValue({ teamLeaders: selectedTeamLeaders });
	};

	return (
		<Flex vertical>
			<Row gutter={16}>
				<Col xs={{ offset: 1, span: 23 }} md={{ offset: 1, span: 10 }}>
					<FormInputs.Select label={t("position")} name="position" options={position} required />
				</Col>
				<Col xs={{ offset: 1, span: 23 }} md={{ offset: 1, span: 10 }}>
					<FormInputs.Input
						label={t("salary")}
						name="salary"
						required
						defaultValidateRule="number"
						prefix={<EuroCircleOutlined />}
					/>
				</Col>
			</Row>
			<Row gutter={16}>
				<Col xs={{ offset: 1, span: 23 }} md={{ offset: 1, span: 5 }}>
					<Form.Item label={t("teamLeader")} name="teamLeaders">
						<Select
							mode="multiple"
							options={selectTeamLeader}
							placeholder={t("Select Team Leaders")}
							onChange={handleTeamLeaderChange}
							size="large"
						/>
					</Form.Item>
				</Col>
				<Col xs={{ offset: 1, span: 23 }} md={{ offset: 0, span: 5 }}>
					<FormInputs.Select
						required
						label={t("status")}
						name="status"
						options={[
							{ label: "On Site", value: "On Site" },
							{ label: "Remote", value: "Remote" },
						]}
					/>
				</Col>
				<Col xs={{ offset: 1, span: 23 }} md={{ offset: 1, span: 10 }} lg={{ offset: 1, span: 5 }}>
					<FormInputs.DatePicker label={t("startingOn")} name="startingDate" required />
				</Col>

				<Col>
					<Form.Item
						name="contract"
						style={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<Upload
							listType="text"
							showUploadList={{
								showPreviewIcon: false,
							}}
							maxCount={1}
							beforeUpload={() => {
								return false;
							}}
							onChange={handleFileChange}
						>
							<Button
								style={{
									borderColor: "lightgrey",
									marginTop: 30,
									width: "200px",
								}}
								icon={<UploadOutlined />}
								type="text"
								size="large"
								shape="default"
							>
								Upload Contract
							</Button>
						</Upload>
					</Form.Item>
				</Col>
			</Row>
		</Flex>
	);
};

export default SecondStep;
