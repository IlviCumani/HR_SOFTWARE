import {
  useRef,
  useImperativeHandle,
  forwardRef,
  useEffect,
  useState,
} from "react";
import { Form } from "antd";
import FormInputs from "../../../components/Shared/InputTypes/FormInputs";
import dayjs from "dayjs";
import useHttp from "../../../hooks/useHttp";
import { AssetFormProps } from "../types/AddAssetsForm";
import { EmployeeDataType } from "../../Employment/types/Employee";
import { getFullName } from "../../../utils/utils";
import { t } from "i18next";

const EMPLOYEE = import.meta.env.REACT_APP_EMPLOYEE_API;
const SEARCH_API = import.meta.env.REACT_APP_EMPLOYEE_SEARCH_API2;

const AssetForm = forwardRef(({ onAdd }: AssetFormProps, ref) => {
  const formRef = useRef<any>();
  const [form] = Form.useForm();
  const [employeeList, setEmployeeList] = useState<EmployeeDataType[]>([]);
  const lastChange = useRef<number | null>(null);
  const [, , sendRequest] = useHttp();

  // useEffect(() => {
  // 	sendRequest({ url: `${EMPLOYEE}/search` }, (responseData: EmployeeDataType[]) =>
  // 		setEmployeeList(responseData),
  // 	);
  // }, []);

  useImperativeHandle(ref, () => ({
    submit: () => {
      formRef.current.submit();
    },
  }));

  function onSearch(value: string) {
    if (lastChange.current) {
      clearTimeout(lastChange.current);
    }

    const name = value.split(" ")[0];
    const surname = value.split(" ")[1] || "";

    lastChange.current = setTimeout(() => {
      lastChange.current = null;
      if (value.trim() !== "") {
        sendRequest(
          {
            endpoint: `${SEARCH_API}?name=${name}&surname=${surname}`,
          },
          (responseData: EmployeeDataType[]) => setEmployeeList(responseData)
        );
      } else {
        setEmployeeList([]);
      }
    }, 500);
  }

  function onFinish(values: any) {
    const selectedEmployee = employeeList.find(
      (employee: EmployeeDataType) =>
        getFullName(employee.name, employee.surname) === values.userName
    )?._id;

    const dataToSubmit = {
      employeeDetails: selectedEmployee,
      assignDate: dayjs(values.dateGiven).format("YYYY-MM-DD"),
    };
    onAdd(dataToSubmit);
  }

  return (
    <Form
      form={form}
      ref={formRef}
      layout="vertical"
      autoComplete="off"
      onFinish={onFinish}
    >
      <FormInputs.DatePicker
        label={t("dateGiven")}
        name="assignDate"
        required
        isDisabledDate
      />
      <FormInputs.AutoComplete
        label={t("employee")}
        name="userName"
        required
        options={employeeList.map((employee: EmployeeDataType) => ({
          value: getFullName(employee.name, employee.surname),
          label: getFullName(employee.name, employee.surname),
        }))}
        isMatchWithOption
        onChange={onSearch}
      />
    </Form>
  );
});

export default AssetForm;
