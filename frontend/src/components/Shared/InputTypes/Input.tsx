import { Input as I, Form } from "antd";
import FormItemLabel from "./FormItemLabel";
import { t } from "i18next";

type InputProps = {
	label: string;
	name: string;
	type?: "password" | "textarea";
	required?: boolean;
	defaultValidateRule?: "email" | "password" | "personalNumber" | "phoneNumber" | "number";
	[prop: string]: any;
};

type RulePatterns = {
	email: {
		regex: RegExp;
		template: string;
	};
	password: {
		regex: RegExp;
		template: string;
	};
	personalNumber: {
		regex: RegExp;
		template: string;
	};
	phoneNumber: {
		regex: RegExp;
		template: string;
	};
	number: {
		regex: RegExp;
		template: string;
	};
};

const rulePatterns: RulePatterns = {
	email: {
		regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
		template: "examp@examp.com",
	},
	password: {
		regex: /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/,
		template: "At least 8 characters, 1 uppercase letter and 1 number",
	},
	personalNumber: {
		regex: /^[A-Z]\d{8}[A-Z]$/,
		template: "A12345678Z",
	},
	phoneNumber: {
		regex: /^06[789]\d{7}$/,
		template: "0681234567",
	},
	number: {
		regex: /^\d+$/,
		template: "123",
	},
};

const Input = ({
	label,
	name,
	type,
	required = false,
	defaultValidateRule,
	...prop
}: InputProps) => {
	const Input = type === "password" ? I.Password : type === "textarea" ? I.TextArea : I;

	const rulesList: any = [
		{
			required: required,
			message: `${t("errorMessages")} ${label}!`,
		},
	];

	if (defaultValidateRule) {
		rulesList.push({
			pattern: rulePatterns[defaultValidateRule].regex,
			message: `${t("errorMsgValidim")} ${rulePatterns[defaultValidateRule].template}`,
		});
	}

	const inputProps = type === "textarea" ? { autoSize: { minRows: 2, maxRows: 6 } } : {};

	return (
		<Form.Item
			style={{ width: "100%" }}
			label={<FormItemLabel>{label}</FormItemLabel>}
			name={name}
			rules={rulesList}
			validateDebounce={1000}
		>
			<Input size="large" placeholder={`${label}`} {...inputProps} {...prop} />
		</Form.Item>
	);
};

export default Input;
