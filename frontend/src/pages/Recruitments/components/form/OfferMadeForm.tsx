import { Form, Input } from "antd";
import { Col, Row, Select } from "antd/lib";
import FormInputs from "../../../../components/Shared/InputTypes/FormInputs";
import { ContractTypes } from "../../columns/constants";
import { useRecruitmentContext } from "../../context";
import { useEffect } from "react";
import moment from "moment";
import { t } from "i18next";

const OfferMadeForm: React.FC = () => {
	const contactTypeOptions = Object.values(ContractTypes).map((type) => ({
		label: type,
		value: type,
	}));
	const { editingRecord, form } = useRecruitmentContext();
	useEffect(() => {
		if (editingRecord.offerMade) {
			form.setFieldsValue({
				offeredSalary: editingRecord.offerMade.offeredSalary,
				contractType: editingRecord.offerMade.contractType,
				startDate: moment(editingRecord.offerMade.startDate),
			});
		}
	}, [editingRecord, form]);

	return (
		<>
			<Row gutter={16}>
				<Col span={12}>
					<Form.Item
						label={t("offeredSalary")}
						name="offeredSalary"
						rules={[
							{
								required: true,
								message: "Offered Salary is required is required",
							},
						]}
					>
						<Input type="number" style={{ height: "40px" }}></Input>
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item
						label={t("contractType")}
						name="contractType"
						rules={[
							{
								required: true,
								message: "Contract type is required is required",
							},
						]}
					>
						<Select options={contactTypeOptions} style={{ width: "100%", height: "40px" }}></Select>
					</Form.Item>
				</Col>
			</Row>
			<Row>
				<Col span={12}>
					<FormInputs.DatePicker label={t("startingOn")}name="startDate" required />
				</Col>
			</Row>
		</>
	);
};

export default OfferMadeForm;
