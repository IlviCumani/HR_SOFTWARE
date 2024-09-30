import { AutoComplete as AC, Form } from "antd";
import FormItemLabel from "./FormItemLabel";

type AutoCompleteProps = {
	name: string;
	label: string;
	options: { value: string; label: string }[];
	required?: boolean;
	isMatchWithOption?: boolean;
	onChange?: (value: string) => void;
};

const AutoComplete = ({
	name,
	label,
	options,
	required,
	isMatchWithOption,
	onChange,
}: AutoCompleteProps) => {
	const rulesList: any = [
		{
			required: required,
			message: `Please enter ${label}!`,
		},
	];

	if (isMatchWithOption) {
		rulesList.push({
			validator: async (_: any, value: any) => {
				if (!options.some((option) => option.label === value)) {
					throw new Error(`There is no record of ${value} `);
				}
			},
		});
	}

	return (
		<Form.Item
			name={name}
			label={<FormItemLabel>{label}</FormItemLabel>}
			rules={rulesList}
			validateDebounce={1000}
			style={{ width: "100%" }}
		>
			<AC
				allowClear
				size="large"
				placeholder={label}
				options={options}
				filterOption={(inputValue, option) =>
					option?.label.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
				}
				onChange={(value) => onChange && onChange(value)}
			/>
		</Form.Item>
	);
};

export default AutoComplete;
