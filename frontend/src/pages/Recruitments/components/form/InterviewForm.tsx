import { Form, Input, Steps, Row, Select, Col } from "antd";
import { useRecruitmentContext } from "../../context";
import { evaluationSteps, interviewTypes, RecruitmentStage } from "../../columns/constants";
import { EmployeeDetails } from "../../../../types/EmployeeDetailsProps";

import { useState, useCallback, useEffect, useRef } from "react";
import tagRender from "../tagRenderer";
import { debounce } from "../../../../helpers/debounce.helper";
import FormInputs from "../../../../components/Shared/InputTypes/FormInputs";
import { getFromLocalStorage } from "../../../../utils/utils";
import { useEmployeeAPI } from "../../../../helpers/employee.helper";
import { t } from "i18next";

const InterviewForm: React.FC<{
  step: string;
  onInterviewersChange: (interviewers: EmployeeDetails[]) => void;
}> = ({ step, onInterviewersChange }) => {
  const { fetchEmployee, fetchEmployeeByID } = useEmployeeAPI();
  const { editingRecord } = useRecruitmentContext();
  const stage =
    step === RecruitmentStage.FirstInterview
      ? editingRecord?.firstInterview
      : editingRecord?.secondInterview;

  const [employeeOptions, setEmployeeOptions] = useState<EmployeeDetails[]>([]);
  const [selectedInterviewers, setSelectedInterviewers] = useState<
    EmployeeDetails[]
  >(stage?.interviewers || []);
  const [current, setCurrent] = useState<number>(0);
  const { employID } = getFromLocalStorage();
  const hasLoadedCurrentUser = useRef(false);

  const memoizedFetchEmployeeByID = useCallback(
    async (id: string) => {
      const existingEmployee = employeeOptions.find((emp) => emp._id === id);
      if (existingEmployee) return existingEmployee;

      const user = await fetchEmployeeByID(id);
      if (user) {
        setEmployeeOptions((prevOptions) => [...prevOptions, user]);
      }
      return user;
    },
    [employeeOptions, fetchEmployeeByID]
  );

  useEffect(() => {
    if (employID && !hasLoadedCurrentUser.current) {
      memoizedFetchEmployeeByID(employID);
      hasLoadedCurrentUser.current = true;
    }
  }, [employID, memoizedFetchEmployeeByID]);

  useEffect(() => {
    onInterviewersChange(selectedInterviewers);
  }, [selectedInterviewers, onInterviewersChange]);

  useEffect(() => {
    setSelectedInterviewers(stage?.interviewers || []);
    setCurrent(parseInt(stage?.evaluation || "0", 0));
  }, [stage, step]);

  const handleSearch = useCallback(
    debounce(async (value: string) => {
      if (value) {
        const [name, surname] = value.split(" ");
        const data = await fetchEmployee(name, surname);
        if (data) {
          setEmployeeOptions((prevOptions) => {
            const newOptions = data.filter(
              (newEmp: EmployeeDetails) =>
                !prevOptions.some((existing) => existing._id === newEmp._id)
            );
            return [...prevOptions, ...newOptions];
          });
        }
      }
    }, 300),
    []
  );

  const handleSelect = (value: string | undefined) => {
    if (value) {
      const selected = employeeOptions.find(
        (emp) => `${emp.name} ${emp.surname}` === value
      );
      if (
        selected &&
        !selectedInterviewers.some((emp) => emp._id === selected._id)
      ) {
        setSelectedInterviewers((prev) => [...prev, selected]);
      }
    }
  };
  return (
    <>
      <Row gutter={16}>
        <Col span={12}>
          <FormInputs.DatePicker
            label="Date"
            name={"date"}
            showTime
            format="YYYY-MM-DD HH:mm"
            placeholder="Select date and time"
            required
          />
        </Col>
        <Col span={12}>
          <FormInputs.Select
            name="type"
            label="Interview Type"
            options={interviewTypes}
            required
          />
        </Col>
      </Row>

      <Form.Item
        label="Interviewers"
        name={"interviewers"}
        rules={[
          {
            required: true,
            message: "Interviewers are required ",
          },
        ]}
      >
        <Row style={{ paddingBottom: "5px", width: "100%" }}>
          <Select
            mode="multiple"
            placeholder="Select interviewers"
            tagRender={tagRender}
            style={{ width: "100%", height: "40px" }}
            options={employeeOptions.map((item) => ({
              value: `${item.name} ${item.surname}`,
              label: `${item.name} ${item.surname}`,
            }))}
            onSearch={handleSearch}
            onSelect={handleSelect}
            value={selectedInterviewers.map(
              (emp) => `${emp.name} ${emp.surname}`
            )}
          />
        </Row>
      </Form.Item>

			<Form.Item label="Notes" name={"notes"}>
				<Input.TextArea />
			</Form.Item>
			<Form.Item label={t('evaluate')} name={"evaluation"}>
				<Row>
					<Steps
						direction="horizontal"
						onChange={(current) => {
							setCurrent(current);
						}}
						responsive
						size="small"
						labelPlacement="vertical"
						current={current}
					>
						{evaluationSteps.map((item, index) => (
							<Steps.Step
								key={index}
								title={t(item.title)}
								icon={<span style={{ width: "10px" }}>{item.content}</span>}
							/>
						))}
					</Steps>
				</Row>
			</Form.Item>
		</>
	);
};

export default InterviewForm;
