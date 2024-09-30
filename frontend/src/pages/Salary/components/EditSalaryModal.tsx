import React, { MutableRefObject, useCallback, useContext } from "react";
import Modal from "../../../components/Shared/Modal";
import Form from "antd/es/form";
import {
  DatePicker,
  Input,
  message,
  Spin,
  Select,
  InputNumber,
  Button,
  Row,
  Col,
} from "antd";
import { ModalContext, SalaryContext } from "../context";
import moment from "moment";
import { AxiosError } from "axios";
import { EmployeeDataType } from "../../Employment/types/Employee";
import { Bonus } from "../../../types/BonusProps";
import { Payroll } from "../../../types/Payroll";
import { debounce } from "../../../helpers/debounce.helper";
import Title from "../../../components/Shared/Title";
import { useEmployeeAPI } from "../../../helpers/employee.helper";
import Axios from "../../../helpers/axios";

const SALARY_API = import.meta.env.REACT_APP_SALARY;
const { Option } = Select;

interface EditSalaryProps {
  editFormRef: MutableRefObject<any>;
  handleEditSubmit: (values: any) => void;
  handleCreateSubmit: (values: any) => void;
}

const getPayroll = async (
  grossSalary: number,
  workDays: number
): Promise<Payroll | null> => {
  try {
    const res = await Axios.get(`${SALARY_API}/net-salary`, {
      params: { grossSalary, workDays },
    });

    return res.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      message.error(error.response?.data.errorDetails.message || error.message);
    } else {
      message.error("Failed to calculate salary.");
    }
    return null;
  }
};

const EditSalaryModal: React.FC<EditSalaryProps> = ({
  editFormRef,
  handleEditSubmit,
  handleCreateSubmit,
}) => {
  const [employeeDet, setEmployeeDet] = React.useState<
    EmployeeDataType[] | null
  >(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const { fetchEmployee } = useEmployeeAPI();

  const { selectedSalary } = useContext(SalaryContext)!;
  const { isEditModalOpen, setIsEditModalOpen } = useContext(ModalContext)!;
  const defaultDate = selectedSalary?.dateTaken
    ? moment(new Date(selectedSalary.dateTaken))
    : moment();
  const title = selectedSalary ? "Edit Salary: " : "Add Salary";

  const handleSearch = useCallback(
    debounce(async (value: string) => {
      setLoading(true);
      const [name, surname] = value.split(" ");
      const response = await fetchEmployee(name, surname);
      if (response) {
        setEmployeeDet(response);
      }
      setLoading(false);
    }, 300),
    []
  );

  const handleFinish = async (values: any) => {
    selectedSalary ? handleEditSubmit(values) : handleCreateSubmit(values);
    setIsEditModalOpen(false);
    editFormRef.current.resetFields();
    setEmployeeDet(null);
  };

  const calculatePayroll = async () => {
    const values = await editFormRef.current.validateFields([
      "inGrossSalary",
      "workDays",
    ]);
    const { inGrossSalary, workDays, bonuses } = values;
    console.log("Form values:", { inGrossSalary, workDays, bonuses });

    if (inGrossSalary && workDays) {
      const payroll = await getPayroll(
        parseInt(inGrossSalary),
        parseInt(workDays)
      );

      if (payroll) {
        const bonusesTotal =
          bonuses?.reduce(
            (total: number, bonus: Bonus) => total + bonus.amount,
            0
          ) || 0;
        const total = payroll.netSalary + bonusesTotal;

        editFormRef.current.setFieldsValue({
          ...payroll,
          total: total,
        });
      }
    }
  };

  return (
    <Modal
      isOpen={isEditModalOpen}
      onCancel={() => {
        setIsEditModalOpen(false);
        editFormRef.current.resetFields();
        setEmployeeDet(null);
      }}
      title={title}
      onOk={() => editFormRef.current.submit()}
      width={700}
    >
      <Form
        ref={editFormRef}
        id="edit-salary-form"
        onFinish={handleFinish}
        initialValues={{
          ...selectedSalary,
          _id: selectedSalary?._id,
          employeeID: selectedSalary?.employeeID,
          employeeDetails: {
            name: selectedSalary?.employeeDetails?.name,
            surname: selectedSalary?.employeeDetails?.surname,
            NSSH: selectedSalary?.employeeDetails?.NSSH,
          },
          workDays: selectedSalary?.workDays ?? 22,
          dateTaken: defaultDate,
          bonusesTotal:
            selectedSalary?.bonuses?.reduce(
              (total, bonus) => total + bonus.amount,
              0
            ) || 0,
        }}
        style={{ padding: 35 }}
        layout="vertical"
      >
        <Spin spinning={loading}>
          <div>
            {selectedSalary?.employeeDetails ? (
              <>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="Name" name={["employeeDetails", "name"]}>
                      <Input disabled style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Surname"
                      name={["employeeDetails", "surname"]}
                    >
                      <Input disabled style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                </Row>
              </>
            ) : (
              <Form.Item
                label="Employee"
                name="employeeID"
                rules={[{ required: true, message: "Employee is required" }]}
              >
                <Select
                  showSearch
                  placeholder="Search for an employee"
                  onSearch={handleSearch}
                  filterOption={(input, option) =>
                    (option?.children as unknown as string)
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                  {employeeDet && employeeDet.length > 0 ? (
                    employeeDet.map((employee) => (
                      <Option key={employee._id} value={employee._id}>
                        {`${employee.name} ${employee.surname}`}
                      </Option>
                    ))
                  ) : (
                    <Option value="">No Employee Found</Option>
                  )}
                </Select>
              </Form.Item>
            )}
            {(selectedSalary || employeeDet) && (
              <>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Gross Salary"
                      name="inGrossSalary"
                      rules={[
                        { required: true, message: "Gross Salary is required" },
                      ]}
                    >
                      <InputNumber style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Date taken"
                      name="dateTaken"
                      rules={[
                        { required: true, message: "Date taken is required" },
                      ]}
                    >
                      <DatePicker picker="month" style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Work Days"
                      name="workDays"
                      rules={[
                        { required: true, message: "Work days are required" },
                      ]}
                    >
                      <InputNumber
                        type="number"
                        style={{ width: "100%" }}
                        min={0}
                        max={22}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Button
                      type="primary"
                      style={{ marginTop: "32px", width: "100%" }}
                      onClick={calculatePayroll}
                      color="primary"
                    >
                      Calculate Payroll
                    </Button>
                  </Col>
                </Row>
                <Row>
                  <Title
                    level={5}
                    style={{ fontWeight: "bold" }}
                    title={"Employee Taxes"}
                  />
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="New Gross Salary"
                      name="grossSalary"
                      rules={[
                        {
                          required: true,
                          message: "New Gross Salary is required",
                        },
                      ]}
                    >
                      <Input type="number" disabled />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      label="Income Tax"
                      name="incomeTax"
                      rules={[
                        {
                          required: true,
                          message: "Income Tax is required",
                        },
                      ]}
                    >
                      <Input type="number" disabled />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Health Insurance"
                      name="healthInsurance"
                      rules={[
                        {
                          required: true,
                          message: "Health Insurance is required",
                        },
                      ]}
                    >
                      <Input type="number" disabled style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Social Security Contributions"
                      name="socialSecurityContributions"
                      rules={[
                        {
                          required: true,
                          message: "Social Security Contributions is required",
                        },
                      ]}
                    >
                      <Input type="number" disabled style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Title
                    level={5}
                    style={{ fontWeight: "bold" }}
                    title={"Company's Taxes"}
                  />
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Social Insurance Company"
                      name="socialInsuranceCompany"
                      rules={[
                        {
                          required: true,
                          message: "Social Insurance Company is required",
                        },
                      ]}
                    >
                      <Input type="number" disabled style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Health Insurance Company"
                      name="healthInsuranceCompany"
                      rules={[
                        {
                          required: true,
                          message: "Health Insurance Company is required",
                        },
                      ]}
                    >
                      <Input type="number" disabled style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Title
                    level={5}
                    style={{ fontWeight: "bold" }}
                    title={"Salary Summary"}
                  />
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Net Salary"
                      name="netSalary"
                      rules={[
                        { required: true, message: "Net Salary is required" },
                      ]}
                    >
                      <Input type="number" disabled style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item label="Bonuses Total" name="bonusesTotal">
                      <Input type="number" disabled style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Total"
                      name="total"
                      rules={[{ required: true, message: "Total is required" }]}
                    >
                      <Input type="number" disabled style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                </Row>
              </>
            )}
          </div>
        </Spin>
      </Form>
    </Modal>
  );
};

export default EditSalaryModal;
