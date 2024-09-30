import React, { useEffect } from "react";
import { Form, Button, Col, Row, Upload, UploadProps, message } from "antd";
import { useRecruitmentContext } from "../../context";
import { getDevRoles } from "../../../Employment/utils/helperFunctions";
import FormInputs from "../../../../components/Shared/InputTypes/FormInputs";
import { UploadOutlined } from "@ant-design/icons";
import { references } from "../../columns/constants";
import moment from "moment";
import { t } from "i18next";

const ApplicantForm: React.FC = () => {
	const { handleFileChange, setFile, form, editingRecord } = useRecruitmentContext();
	const positions = getDevRoles().map((role) => ({ value: role, label: role }));
	useEffect(() => {
		if (editingRecord) {
			form.setFieldsValue({
				name: editingRecord.name,
				surname: editingRecord.surname,
				email: editingRecord.email,
				phoneNumber: editingRecord.phoneNumber,
				position: editingRecord.position,
				reference: editingRecord.reference,
				submittedDate: editingRecord.submittedDate
					? moment(editingRecord.submittedDate)
					: undefined,
				rejectReason: editingRecord.rejectReason,
			});
		}
	}, [editingRecord, form]);

	const allowedFileTypes = ["application/pdf", "application/msword"];

	const props: UploadProps = {
		beforeUpload: (file) => {
			console.log(file.type);
			const isSupported = allowedFileTypes.includes(file.type);
			if (!isSupported) {
				message.error(`${file.name} is not a supported file type.`);
			}
			return isSupported || Upload.LIST_IGNORE;
		},
		onChange: async (info) => {
			if (info.file.status === "done") {
				console.log(info.file.originFileObj);
				setFile(info.file.originFileObj);
				handleFileChange();
			}
		},
		progress: {
			trailColor: "red",
			strokeWidth: 2,
			showInfo: true,
		},
		onRemove: () => setFile(null),
		maxCount: 1,
		multiple: false,
		customRequest: async ({ file, onSuccess, onError }) => {
			const formData = new FormData();
			formData.append("file", file);

			try {
				setFile(file as File);
				if (onSuccess) {
					onSuccess("Upload successful!");
				}
			} catch (error) {
				message.error("File upload failed.");
				if (onError) {
					onError(new Error("Upload failed"));
				}
			} finally {
				handleFileChange();
			}
		},
	};

	return (
		<>
			<Row gutter={16}>
				<Col span={12}>
					<FormInputs.Input label={t("name")} name="name" required />
				</Col>
				<Col span={12}>
					<FormInputs.Input label={t("surname")} name="surname" required />
				</Col>
			</Row>
			<Row gutter={16}>
				<Col span={12}>
					<FormInputs.Input label="Email" name="email" required />
				</Col>
				<Col span={12}>
					<FormInputs.Select name="position" label={t("position")} options={positions} required />
				</Col>
			</Row>
			<Row gutter={16}>
				<Col span={12}>
					<FormInputs.Select
						name="reference"
						label={t("reference")}
						options={references}
						required
					/>
				</Col>
				<Col span={12}>
					<FormInputs.Input label={t("phoneNumber")} name="phoneNumber" />
				</Col>
			</Row>
			<Row gutter={16}>
				<Col span={12}>
					<FormInputs.DatePicker label={t("submittedDate")} name="submittedDate" required />
				</Col>

				<Col span={12}>
					<Form.Item label={t("resume")} name="cv" valuePropName="cv">
						<Upload {...props}>
							<Button
								icon={<UploadOutlined />}
								style={{
									width: "315px",
									height: "40px",
								}}
							>
								{t("clickToUpload")}
							</Button>
						</Upload>
					</Form.Item>
				</Col>
			</Row>
			{editingRecord?.rejectReason && (
				<Row>
					<FormInputs.Input label={t("rejectReason")} name="rejectReason" type="textarea" required />
				</Row>
			)}
		</>
	);
};

export default ApplicantForm;
