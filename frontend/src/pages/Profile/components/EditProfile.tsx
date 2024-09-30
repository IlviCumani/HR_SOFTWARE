import { Form, Modal, Upload, Button } from "antd";
import { useContext, useEffect, useRef, useState } from "react";
import FormInputs from "../../../components/Shared/InputTypes/FormInputs";
import { EmployeeDataType } from "../../Employment/types/Employee";
import { useTranslation } from "react-i18next";
import { RcFile } from "antd/lib/upload/interface";
import { UploadOutlined } from "@ant-design/icons";
import useHttp from "../../../hooks/useHttp";
import { getAuthToken } from "../../../utils/utils";
import { AvatarContext } from "../../../store/AvatarContext";

const API = import.meta.env.REACT_APP_EMPLOYEE_API;
const main_api = import.meta.env.REACT_APP_MAIN;
const EditProfile = ({
	visible,
	handleCancel,
	currentData,
	setIsModal,
	setTablaData,
}: {
	visible: boolean;
	handleCancel: () => void;
	currentData: EmployeeDataType | undefined;
	setIsModal: any;
	setTablaData: any;
	handleOk: (values: EmployeeDataType) => void;
	onImageUpload: (url: string) => void;
}) => {
	const [form] = Form.useForm<EmployeeDataType>();
	const { t } = useTranslation();
	const [, , fetchData] = useHttp();
	const formRef = useRef<any>();
	const EmployeData = JSON.parse(localStorage.getItem("userData") || "{}").employID;
	const { setAvatarUrl } = useContext(AvatarContext);

	// useEffect(() => {
	// 	if (currentData) {
	// 		form.setFieldsValue({
	// 			phoneNumber: currentData.phoneNumber,
	// 			profilePhoto: [currentData.profilePhoto] ,
	// 		});
	// 	}
	// }, [currentData, form]);

	const handleFinish = (value: any) => {
		console.log("value", value.profilePhoto);
		console.log(form.getFieldsValue(), "form.getFieldsValue()");
		fetchData(
			useHttp.patchRequestHelper(`${API}/${EmployeData}`, {
				profilePhoto: value.profilePhoto[0],
				phoneNumber: value.phoneNumber,
			}),
			() => {
				setAvatarUrl(value.profilePhoto[0], value.phoneNumber);
			},
		);
		setIsModal();
	};

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

			form.setFieldsValue({ profilePhoto: fileUrls });
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

	return (
		<>
			<Modal
				title={t("editProfile")}
				open={visible}
				onOk={() => {
					formRef.current.submit();
				}}
				onCancel={handleCancel}
			>
				<Form
					form={form}
					ref={formRef}
					initialValues={{
						phoneNumber: currentData?.phoneNumber,
						profilePhoto: [currentData?.profilePhoto],
					}}
					layout="vertical"
					onFinish={handleFinish}
				>
					<Form.Item name="profilePhoto" style={{ display: "flex", justifyContent: "center" }}>
						<Upload
							listType="picture-circle"
							showUploadList={{
								showPreviewIcon: false,
							}}
							maxCount={1}
							className="avatar-uploader"
							beforeUpload={() => {
								return false;
							}}
							onChange={handleFileChange}
						>
							<Button icon={<UploadOutlined />} type="text" size="large" shape="circle"></Button>
						</Upload>
					</Form.Item>
					<FormInputs.Input
						label="Phone Number"
						name="phoneNumber"
						defaultValidateRule="phoneNumber"
					/>
				</Form>
			</Modal>
		</>
	);
};
export default EditProfile;
