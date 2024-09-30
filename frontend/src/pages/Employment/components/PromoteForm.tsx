import { Form, Checkbox } from "antd";
import FormInputs from "../../../components/Shared/InputTypes/FormInputs";
import { EmployeeDataType } from "../types/Employee";
import exporter, { getDevRoles } from "../utils/helperFunctions";
import { useTranslation } from "react-i18next";
import { useRef, useImperativeHandle, forwardRef, useState } from "react";
import { PromotionFormProps } from "../types/EmployeeFormTypes";
import dayjs from "dayjs";

const PromoteForm = forwardRef(
  ({ selectedEmployee, onEdit }: PromotionFormProps, ref) =>{ 
    const [form] = Form.useForm<EmployeeDataType>();
    const formRef = useRef<any>();
    const initialValues = exporter.getInitialFormValues(selectedEmployee);
    const position = getDevRoles().map((role) => ({
      label: role,
      value: role,
    }));
    const { t } = useTranslation();
    const [isTeamLeader, setIsTeamLeader] = useState(false);

    useImperativeHandle(ref, () => ({
      submit: () => {
        formRef.current.submit();
      },
    }));

    const onFinish = (values: any) => {
      const valuesToSubmit = {
        newPosition: values.position,
        newSalary: values.salary,
        trainedBy: values.trainedBy,
        dateOfPromotion: dayjs(values.dateOfPromotion).format("DD/MM/YYYY"),
        isTeamLeader,
      };
      onEdit(valuesToSubmit);
    };

    return (
      <div>
        <Form
          layout="vertical"
          form={form}
          ref={formRef}
          onFinish={onFinish}
          initialValues={initialValues}
        >
          <FormInputs.Select
            label={t("position")}
            name="position"
            options={position}
          />
          <FormInputs.Input
            label="Salary"
            name="salary"
            defaultValidateRule="number"
            required
          />
          <FormInputs.DatePicker
            label={t("promotedOn")}
            name="dateOfPromotion"
            required
            isDisabledDate
          />
          <FormInputs.Input label={t("Trained By")} name="trainedBy" required />
          <Form.Item>
            <Checkbox
              checked={isTeamLeader}
              onChange={(e) => setIsTeamLeader(e.target.checked)}
            >
              {t("Promote to Team Leader")}
            </Checkbox>
          </Form.Item>
        </Form>
      </div>
    );
  },
);

export default PromoteForm;
