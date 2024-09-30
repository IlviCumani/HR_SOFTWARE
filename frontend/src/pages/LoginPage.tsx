import { Form, Typography } from "antd";
import Button from "../components/Shared/Button";
import "../styles/LoginPage.css";
import FormInputs from "../components/Shared/InputTypes/FormInputs";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useHttp from "../hooks/useHttp";
import Login from "../assets/login.svg";
import LoginLogo from "../assets/loginlogo.png";
import { setToLocalStorage } from "../utils/utils";

const LoginPage: React.FC = () => {
  const [form] = Form.useForm();
  const [isLoading, error, sendRequest] = useHttp();
  const navigate = useNavigate();

	function handleSubmit() {
		const dataToSubmit = {
			username: form.getFieldValue("username"),
			password: form.getFieldValue("password"),
		};

		sendRequest(useHttp.postRequestHelper("login", dataToSubmit), async (responseData: {
			_id: string;
			accessToken: string;
			email: string;
			role: string;
			employID: string;
			username: string;
		}) => {
			const { accessToken, ...rest } = responseData;
			const userData = {
				...rest,
				token: accessToken,
			};
			setToLocalStorage("userData", userData);

			navigate("/dashboard");
		});
	}

	useEffect(() => {
		const userData = localStorage.getItem("userData");
		if (userData) {
			navigate("/dashboard");
		}
	}, []);

	return (
		<div className="login-page">
			<div className="login-form-image-container">
				<div className="image-container">
					<img src={Login} alt="Logo" />
				</div>

				<div className="login-inputs">
					<img src={LoginLogo} className="loginlogo"></img>
					<Form
						layout="vertical"
						form={form}
						initialValues={{ remember: true }}
						onFinish={handleSubmit}
						onFinishFailed={() => console.log("Failed")}
					>
						<h2 className="login-title">Login</h2>

						<FormInputs.Input name="username" label="Email" defaultValidateRule="email" required />
						<FormInputs.Input name="password" label="Password" type="password" required />

						{error && <Typography.Text type="danger">Invalid Email or Password</Typography.Text>}
						<Button htmlType="submit" type="primary" size="large" block>
							{isLoading ? "Loading..." : "Log in"}
						</Button>
					</Form>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
