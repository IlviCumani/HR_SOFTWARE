import Select from "../Select";
import { t } from "i18next";
import { Form } from "antd";
import FormItemLabel from "./FormItemLabel";

type FormSelectProps = {
	name: string;
	label?: string;
	options: {
		value: string;
		label: string | JSX.Element;
	}[];
	required?: boolean;
	noStyle?: boolean;
	placeholder?: string;
	props?: any;
};

const FormSelect = ({
	name,
	label,
	options,
	required,
	noStyle = false,
	placeholder = "",
	props,
}: FormSelectProps) => {
	return (
		<Form.Item
			name={name}
			label={<FormItemLabel>{label}</FormItemLabel>}
			rules={[
				{
					required: required,
					message: `${t("errorMessages")} ${label}!`,
				},
			]}
			noStyle={noStyle}
			style={{ width: "100%" }}
		>
			<Select
				options={options}
				placeholder={placeholder ? placeholder : `Select ${label}`}
				{...props}
			/>
		</Form.Item>
	);
};

export default FormSelect;
