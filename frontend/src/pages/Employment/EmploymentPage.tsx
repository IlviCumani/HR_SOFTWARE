import Table from "../../components/Table/Table";
import TableHeader from "../../components/Table/TableHeader";
import Drawer from "../../components/Shared/Drawer";
import Loader from "../../components/Shared/Loader";
import AddEmployeeForm from "./components/AddEmployeeForm";
import { useEffect, useState, useRef } from "react";
import type { EmployeeDataType } from "./types/Employee";
import { getColumns } from "./utils/EmployeeColumn";
import useHttp from "../../hooks/useHttp";
import Modal from "../../components/Shared/Modal";
import PromoteForm from "./components/PromoteForm";
import { useTranslation } from "react-i18next";
import FormInputs from "../../components/Shared/InputTypes/FormInputs";
import { Form } from "antd";
import { useNavigate } from "react-router-dom";
import { isEmployee, isCEO, getFromLocalStorage } from "../../utils/utils";

const API = import.meta.env.REACT_APP_EMPLOYEE_API;
const API_DELETE_EMPLOYEE = import.meta.env.REACT_APP_DELETE_EMPLOYEE_API;

const EmploymentPage: React.FC = () => {
  const [tableData, setTableData] = useState<EmployeeDataType[]>([]);
  const [open, setOpen] = useState(false);
  const [editedData, setEditedData] = useState<EmployeeDataType | undefined>(
    undefined
  );
  const promoteRef = useRef<any>();
  const [isLoading, , sendRequest] = useHttp();
  const [form] = Form.useForm();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPromoted, setIsPromoted] = useState(false);
  const [promotedData, setPromotedData] = useState<
    EmployeeDataType | undefined
  >(undefined);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isEmp = isEmployee();
  const isCeo = isCEO();

  useEffect(() => {
    if (isEmp) {
      navigate("/error");
    }
  }, [isEmp]);

  useEffect(() => {
    sendRequest(
      {
        endpoint: API,
        headers: {
          "Content-Type": "application/json",
        },
      },
      setTableData
    );
  }, []);

  function handleEditButtonClick(record: EmployeeDataType) {
    setEditedData(record);
    setOpen(true);
  }

  function handlePromoteButtonClick(record: EmployeeDataType) {
    setPromotedData(record);
    setIsPromoted(true);
  }

  function handleDeleteButtonClick(record: EmployeeDataType) {
    setIsDeleting(true);
    setEditedData(record);
  }

  function handleEditEmployee(editedEmployee: EmployeeDataType) {
    setTableData((prev) =>
      prev.map((item) => {
        if (item._id === editedEmployee._id) {
          return editedEmployee;
        }
        return item;
      })
    );
  }

  function handleAddNewEmployee(newEmployee: EmployeeDataType) {
    setTableData((prev) => [...prev, newEmployee]);
  }


  function handleDeleteModalOk() {
    const date = form.getFieldValue("deletedAt").format("DD/MM/YYYY");
    sendRequest(
      {
        endpoint: `${API_DELETE_EMPLOYEE}/copy/${editedData?._id}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: { deletedAt: date },
      },
      () => {
        setTableData((prev) =>
          prev.filter((item) => item._id !== editedData?._id)
        );
        setIsDeleting(false);
      }
    );
    setIsDeleting(false);
    setEditedData(undefined);
  }

  function handlClose(fn: (arg: boolean) => void) {
    fn(false);
    setEditedData(undefined);
    setPromotedData(undefined);
  }

  function handlePromotionSubmit(value: any) {
    sendRequest(
      {
        endpoint: `promotions/${promotedData?._id}/promote`,
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: value,
      },
      () => {
        setTableData((prev) =>
          prev.map((employee) => {
            if (employee._id === promotedData?._id) {
              return {
                ...employee,
                salary: value.newSalary,
                position: value.newPosition,
              };
            }
            return employee;
          })
        );
        setIsPromoted(false);
      }
    );
  }

  const columns = getColumns(
    tableData,
    handleEditButtonClick,
    handleDeleteButtonClick,
    handlePromoteButtonClick
  );

  return (
    <>
      <Drawer height={500} isOpen={open} onClose={() => handlClose(setOpen)}>
        <AddEmployeeForm
          selectedEmployee={editedData}
          onAdd={handleAddNewEmployee}
          onEdit={handleEditEmployee}
        />
      </Drawer>

      <Modal
        title="Are you sure"
        isOpen={isDeleting}
        onOk={handleDeleteModalOk}
        onCancel={() => handlClose(setIsDeleting)}
      >
        Are you sure you want to delete {editedData?.name}?
        <Form layout="vertical" form={form} autoComplete="off">
          <FormInputs.DatePicker
            label={t("Leaving Date")}
            name="deletedAt"
            required
          />
        </Form>
      </Modal>
      <Modal
        title={t("promote")}
        isOpen={isPromoted}
        onCancel={() => handlClose(setIsPromoted)}
        onOk={() => promoteRef.current.submit()}
      >
        <PromoteForm
          ref={promoteRef}
          selectedEmployee={promotedData}
          onEdit={handlePromotionSubmit}
        />
      </Modal>
      <TableHeader
        title={t("employment")}
        onClick={() => setOpen(true)}
        hideButton={isCeo}
      />
      <section className="test">
        {isLoading && !isDeleting ? (
          <Loader />
        ) : (
          <Table columns={columns} data={tableData} fixed />
        )}
      </section>
    </>
  );
};

export default EmploymentPage;
