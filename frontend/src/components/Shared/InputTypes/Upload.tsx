import { Upload as UP, Form, Flex } from "antd";
import { RcFile } from "antd/lib/upload/interface";
import Button from "../Button";
import { UploadOutlined } from "@ant-design/icons";

import { useCallback, useState } from "react";
import { getFromLocalStorage } from "../../../utils/utils";
import FormItemLabel from "./FormItemLabel";
const main_api = import.meta.env.REACT_APP_MAIN;

export default function Upload({
	fileList,
	addNewFilesHandler,
	updateFilesUrlHandler,
	name,
	label,
	required,
}: any) {
	const [isUploading, setIsUploading] = useState(false);
	const token = getFromLocalStorage().token;
	const handleUpload = useCallback(async (files: (RcFile | undefined)[]) => {
		setIsUploading(true);
		const formData = new FormData();
		files = files.filter((file) => file !== undefined);

		files.forEach((file) => {
			formData.append("files", file as File);
		});

		addNewFilesHandler(files);

		try {
			const uploadResponse = await fetch(`${main_api}/files/upload`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
				},
				body: formData,
			});
			const uploadData = await uploadResponse.json();
			const fileUrls = uploadData.fileUrls;

			updateFilesUrlHandler(fileUrls);
		} catch (error) {
			console.error("File upload error:", error);
		} finally {
			setIsUploading(false);
		}
	}, []);

	return (
		<Form.Item
			label={<FormItemLabel>{label}</FormItemLabel>}
			name={name}
			rules={[
				{
					required: required,
					message: `Please input your ${label}!`,
				},
			]}
		>
			<Flex className="event-attachment-container">
				<UP
					beforeUpload={() => {
						return false;
					}}
					listType="picture-card"
					multiple
					maxCount={4}
					fileList={fileList}
					onChange={(info) => {
						const files: (RcFile | undefined)[] = info.fileList.map((file) => file.originFileObj);
						if (files) {
							handleUpload(files);
						}
					}}
					disabled={isUploading || fileList.length >= 8}
				>
					<Button
						icon={<UploadOutlined />}
						type="dashed"
						size="large"
						shape="circle"
						disabled={isUploading}
					></Button>
				</UP>
			</Flex>
		</Form.Item>
	);
}
