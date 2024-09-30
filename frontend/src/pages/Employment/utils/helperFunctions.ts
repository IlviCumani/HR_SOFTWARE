import dayjs from "dayjs";
import { EmployeeDataType } from "../types/Employee";

const exporter = {
	getInitialFormValues,
	validate,
	getDevRoles,
	getFormValues,
};

export default exporter;

export function getInitialFormValues(data: EmployeeDataType | undefined) {
	const initialValues = data
		? prepareInitialValues(data)
		: {
				name: "",
				surname: "",
				email: "",
				phoneNumber: "",
				salary: "",
				teamLeader: "",
				status: "",
				profilePhoto: "",
				position: "",
				startingDate: "",
				nID: "",
				gender: "",
				contract: "",
		  };

	return initialValues;
}

function prepareInitialValues(selectedEmployee: EmployeeDataType) {
	return {
		...selectedEmployee,
		birthDay: dayjs(selectedEmployee.birthDay),
		startingDate: dayjs(selectedEmployee.startingDate),
		contract: [selectedEmployee.contract],
		email: selectedEmployee.email.split("@")[0],
	};
}

export function validate(salary: number | null | undefined) {
	return salary === undefined || salary === null || salary <= 0;
}

export function getDevRoles() {
	return [
		"Junior FrontEnd",
		"Junior BackEnd",
		"Senior FrontEnd",
		"Senior BackEnd",
		"FullStack",
		"DevOps",
	];
}

export function getFormValues(form: any) {
	const contract = form.getFieldValue("contract");

	return {
		name: form.getFieldValue("name"),
		surname: form.getFieldValue("surname"),
		email: form.getFieldValue("email") + "@codevider.com",
		phoneNumber: form.getFieldValue("phoneNumber"),
		position: form.getFieldValue("position"),
		salary: parseInt(form.getFieldValue("salary")),
		status: form.getFieldValue("status"),
		profilePhoto: form.getFieldValue("profilePhoto"),
		teamLeaders: form.getFieldValue("teamLeaders") || [],
		startingDate: form.getFieldValue("startingDate"),
		contract: contract[0] || "",
		nID: form.getFieldValue("nID"),
		birthDay: form.getFieldValue("birthDay"),
		gender: form.getFieldValue("gender"),
	};
}
