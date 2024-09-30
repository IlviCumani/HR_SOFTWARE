import { TimePicker as TP, Form } from "antd";
import { t } from "i18next";
import FormItemLabel from "./FormItemLabel";

type TimePickerProps = {
	label: string;
	name: string;
	required?: boolean;
	dependsOn?: string;
	format?: string;
};

const TimePicker = ({ label, name, required, dependsOn, format = "h:mm" }: TimePickerProps) => {
	function timeValidator(getFieldValue: any, dependsOn?: string) {
		return {
			validator(rule: any, value: any) {
				const startTime = getFieldValue(dependsOn);
				if (value && startTime) {
					if (value.isAfter(startTime)) {
						return Promise.resolve();
					} else {
						return Promise.reject(t("errorMsgInvalidDate"));
					}
				}
				return Promise.resolve();
			},
		};
	}

	const rulesList: any = [
		{
			required: required,
			message: `${t("errorMessages")} ${label}!`,
		},
	];

	if (dependsOn) {
		rulesList.push(({ getFieldValue }: any) => timeValidator(getFieldValue, dependsOn));
	}

	return (
		<Form.Item
			label={<FormItemLabel>{label}</FormItemLabel>}
			style={{ width: "100%" }}
			name={name}
			dependencies={[dependsOn]}
			rules={rulesList}
			validateDebounce={1000}
		>
			<TP style={{ width: "100%" }} size="large" format={format} minuteStep={5} />
		</Form.Item>
	);
};

export default TimePicker;
