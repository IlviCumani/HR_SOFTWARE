import Steps from "../../../components/Shared/Steps";
import DrowerButton from "./DrowerButton";
import getStepItems from "./StepItem";
import { Form, Layout } from "antd";
import useHttp from "../../../hooks/useHttp";
import { useState } from "react";
import exporter from "../utils/helperFunctions";
import { AddEmployeeFormProps } from "../types/EmployeeFormTypes";
import { EmployeeDataType } from "../types/Employee";
import "../styles/steps.css";
import { RecruitmentStage } from "../../Recruitments/columns/constants";
import { useRecruitmentContext } from "../../Recruitments/context";
import { ApplicantProps } from "../../../types/ApplicantProps";
import Axios from "../../../helpers/axios";
const API = import.meta.env.REACT_APP_EMPLOYEE_API;
const Applicant_Api = import.meta.env.REACT_APP_RECRUITMENT_API;

const { Content, Sider } = Layout;

const AddEmployeeForm = ({
  selectedEmployee,
  onAdd,
  onEdit,
  applicant = false,
}: AddEmployeeFormProps) => {
  const [current, setCurrent] = useState(0);
  const [form] = Form.useForm<EmployeeDataType>();
  const [isLoading, error, sendRequest] = useHttp();
  const initialValues = exporter.getInitialFormValues(selectedEmployee);
  let recruitmentContext;
  try {
    recruitmentContext = useRecruitmentContext();
  } catch (error) {
    recruitmentContext = null;
  }

  const { editingRecord, setEditingRecord, setTableData } =
    recruitmentContext || {};

  function handleStepChanges(changer: number) {
    if (changer > 0) {
      form.validateFields().then(() => {
        setCurrent((prev) => prev + changer);
      });
    } else {
      setCurrent((prev) => prev + changer);
    }
  }

  function handleFinish() {
    form.validateFields().then(() => {
      const data = exporter.getFormValues(form);
      setCurrent((prev) => prev + 1);
      form.submit();
      const submitFN = selectedEmployee
        ? useHttp.patchRequestHelper
        : useHttp.postRequestHelper;
      sendRequest(
        submitFN(
          `${API}/${selectedEmployee ? selectedEmployee._id : ""}`,
          data
        ),
        (responseData: any) => {
          selectedEmployee ? onEdit(responseData) : onAdd(responseData);
        }
      );
    });
  }

  const hireApplicant = () => {
    form.validateFields().then(() => {
      const data = exporter.getFormValues(form);
      const submitData = {
        ...data,
        profilePhoto: data.profilePhoto || "",
        contract: data.contract || "",
      };

      setCurrent((prev) => prev + 1);
      form.submit();

      Axios.post(`${API}`, submitData)
        .then((postResponse: { data: any }) => {
          console.log("POST response:", postResponse.data);

          return Axios.patch(`${Applicant_Api}/${selectedEmployee?._id}`, {
            stage: RecruitmentStage.Hired,
          });
        })
        .then(() => {
          setEditingRecord({ ...editingRecord, stage: RecruitmentStage.Hired });
          setTableData((prev: ApplicantProps[]) =>
            prev.map((item) => {
              if (item._id === editingRecord._id) {
                item.stage = RecruitmentStage.Hired;
              }
              return item;
            })
          );
        })
        .catch((err: any) => {
          console.error("API call error:", err);
        });
    });
  };

  const item = getStepItems(current, setCurrent, form, isLoading, error);

  return (
    <Layout style={{ height: "100%", background: "#fff" }}>
      <Content>
        <Form
          layout="vertical"
          form={form}
          name="basic"
          initialValues={initialValues}
          autoComplete="off"
        >
          <div>{item[current].content}</div>
          <DrowerButton
            current={current}
            item={item}
            onChange={handleStepChanges}
            onFinish={applicant ? hireApplicant : handleFinish}
          />
        </Form>
      </Content>
      <Sider className="steps-container" theme={"light"}>
        <Steps
          status={error ? "error" : "finish"}
          direction="vertical"
          responsive
          current={current}
          items={item}
        />
      </Sider>
    </Layout>
  );
};

export default AddEmployeeForm;
