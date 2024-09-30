import { Form, Input, Button, Card } from "antd";
import { usePassword } from "../context";
import { usePasswordValidation } from "../context/hook";
import { useTranslation } from "react-i18next";
import "../styles/ChangePassword.css";
import { useEffect, useState } from "react";
import { t } from "i18next";

const ChangePasswordForm = () => {
	const [form] = Form.useForm();
	const { t } = useTranslation();
	const [formLayout, setFormLayout] = useState<"horizontal" | "vertical" | "inline">("horizontal");
	const { changePassword } = usePassword();
	const { validateConfirmPassword, validateNewPasswordNotOldPassword } =
		usePasswordValidation(form);

	const onChangePassword = async (values: any) => {
		const { oldPassword, newPassword } = values;

		try {
			await changePassword(oldPassword, newPassword);
			form.resetFields();
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		const updateLayout = () => {
			if (window.innerWidth < 997) {
				setFormLayout("vertical");
			} else {
				setFormLayout("horizontal");
			}
		};

		window.addEventListener("resize", updateLayout);
		updateLayout();

		return () => window.removeEventListener("resize", updateLayout);
	}, []);

	return (
		<div className="main-passwod-div">
			<Card title={t(`changePassoword`)}>
				<Form
					className="form-password"
					form={form}
					id="change-password-form"
					onFinish={onChangePassword}
					layout={formLayout}
				>
					<Form.Item
						label={t(`oldPassword`)}
						name="oldPassword"
						rules={[{ required: true, message: "Please input your old password!" }]}
					>
						<Input.Password className="password-input" />
					</Form.Item>
					<Form.Item
						label={t(`newPassword`)}
						name="newPassword"
						rules={[
							{ required: true, message: "Please input your new password!" },
							{
								validator: validateNewPasswordNotOldPassword,
							},
						]}
					>
						<Input.Password className="password-input" />
					</Form.Item>
					<Form.Item
						label={t(`confirmPassword`)}
						name="confirmPassword"
						dependencies={["newPassword"]}
						rules={[
							{ required: true, message: "Please confirm your new password!" },
							{
								validator: validateConfirmPassword,
							},
						]}
					>
						<Input.Password className="password-input" />
					</Form.Item>
					<Form.Item>
						<Button type="primary" htmlType="submit" style={{ float: "right" }}>
							{t(`changePassoword`)}
						</Button>
					</Form.Item>
				</Form>
			</Card>
		</div>
	);
};

export default ChangePasswordForm;
