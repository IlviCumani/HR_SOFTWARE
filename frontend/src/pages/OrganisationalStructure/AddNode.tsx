import { Form, message, Modal, Select } from "antd";
import { EmployeeDataType } from "../Employment/types/Employee";
import React from "react";
import Axios from "../../helpers/axios";

const API = import.meta.env.REACT_APP_EMPLOYEE_SEARCH_API2;
const { Option } = Select;

interface AddNodeProps {
  visible: boolean;
  onCancel: () => void;
}

const AddNode: React.FC<AddNodeProps> = ({ visible, onCancel }) => {
  const [employeeDet, setEmployeeDet] = React.useState<
    EmployeeDataType[] | null
  >(null);
  const [loading, setLoading] = React.useState<boolean>(false);

  const handleSearch = async (value: string) => {
    setLoading(true);
    const [name, surname] = value.split(" ");
    const data = await fetchEmployee(name, surname);
    if (data) {
      setEmployeeDet(data);
    }
    setLoading(false);
  };

  const fetchEmployee = async (name: string, surname: string) => {
    try {
      const res = await Axios.get(API, {
        params: { name, surname },
      });
      return res.data;
    } catch (error) {
      message.error("Failed to fetch employee");
      return null;
    }
  };

  const options = [
    { value: "itdepartment", label: "IT Department" },
    { value: "hrdepartment", label: "HR Department" },
  ];

  return (
    <>
      <Modal open={visible} onCancel={onCancel}>
        <Form layout="vertical">
          <Form.Item label="Employee:" name="employee" required>
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
          <Form.Item label="Department:" name="department" required>
            <Select placeholder="Choose a department" options={options} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddNode;
