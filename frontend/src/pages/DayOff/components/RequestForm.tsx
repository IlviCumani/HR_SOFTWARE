import { Form } from "antd";
import FormInputs from "../../../components/Shared/InputTypes/FormInputs";
import Button from "../../../components/Shared/Button";
import { getFromLocalStorage, getFullName } from "../../../utils/utils";
import { ButtonType } from "../../../enums/Button";
import { RequestedDataType } from "../types/RequestedLeave";
import { useEffect, useRef, useState } from "react";
import useHttp from "../../../hooks/useHttp";
import { valueSubmit } from "../types/RequestedLeave";
import { t } from "i18next";

const EMPLOYEE = import.meta.env.REACT_APP_EMPLOYEE_API;

type RequestFormProps = {
	onAdd: (value: valueSubmit) => void;
	isSubmitting: boolean;
};

const RequestForm = ({ onAdd, isSubmitting }: RequestFormProps) => {
	const userData = getFromLocalStorage();
	const isHr = userData?.role === "hr";
	const [form] = Form.useForm<RequestedDataType>();
	const [, , fetchData] = useHttp();
	const [employee, setEmployee] = useState<any[]>([]);
	const lastChange = useRef<number | null>(null);

	// useEffect(() => {
	// 	isHr &&
	// 		fetchData({ endpoint: `${EMPLOYEE}/search` }, (responseData: any) =>
	// 			setEmployee(responseData),
	// 		);
	// }, []);

	function onSearch(value: string) {
		if (lastChange.current) {
			clearTimeout(lastChange.current);
		}

		const name = value.split(" ")[0];
		const surname = value.split(" ")[1] || "";

		lastChange.current = setTimeout(() => {
			lastChange.current = null;
			if (value.trim() !== "") {
				fetchData(
					{
						endpoint: `${EMPLOYEE}/search?name=${name}&surname=${surname}`,
					},
					(responseData: any) => setEmployee(responseData),
				);
			} else {
				setEmployee([]);
			}
		}, 500);
	}

	const handleSubmit = (value: any) => {
		const selected = employee.find((e) => getFullName(e.name, e.surname) === value.username);
		const values: valueSubmit = {
			employeeId: isHr ? selected._id : userData?.employID,
			StartTime: value.StartTime.format("YYYY-MM-DD"),
			EndTime: value.EndTime ? value.EndTime.format("YYYY-MM-DD") : null,
			leaveType: value.leaveType,
			description: value.reason,
		};
		onAdd(values);
	};

	const type = [
		{ label: t("annual"), value: "annual" },
		{ label: t("sick"), value: "sick" },
		{ label: t("other"), value: "other" },
	];

	return (
		<Form form={form} name="basic" layout="vertical" onFinish={handleSubmit} autoComplete="off">
			{isHr && (
				<FormInputs.AutoComplete
					name="username"
					label={t("fullname")}
					required
					options={employee.map((e) => ({
						label: getFullName(e.name, e.surname),
						value: getFullName(e.name, e.surname),
					}))}
					isMatchWithOption
					onChange={onSearch}
				/>
			)}
			<FormInputs.DatePicker name="StartTime" label={t("startLEaveDate")} required isDisabledDate />
			<FormInputs.DatePicker
				name="EndTime"
				label={t("endLeaveDate")}
				isDisabledDate
				dependsOn="StartTime"
			/>
			<FormInputs.Select name="leaveType" label={t("leaveType")} options={type} required />
			<FormInputs.Input name="reason" label={t("reason")} type="textarea" />
			<Button
				type={ButtonType.PRIMARY}
				htmlType="submit"
				block
				size="large"
				disabled={isSubmitting}
			>
				{t("submit")}
			</Button>
		</Form>
	);
};
export default RequestForm;
