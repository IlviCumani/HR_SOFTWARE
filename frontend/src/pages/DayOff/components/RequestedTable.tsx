import { useEffect, useState } from "react";
import { TableProps } from "antd";
import Modal from "../../../components/Shared/Modal";
import Table from "../../../components/Table/Table";
import { RequestedDataType, valueSubmit } from "../types/RequestedLeave";
import TableHeader from "../../../components/Table/TableHeader";
import Drawer from "../../../components/Shared/Drawer";
import RequestForm from "../../DayOff/components/RequestForm";
import { createColumns } from "../utils/tableColumns";
import useHttp from "../../../hooks/useHttp";
import { useTranslation } from "react-i18next";
import { getFromLocalStorage } from "../../../utils/utils";

export interface RequestedTableProps {
  data?: RequestedDataType[];
  onAdd?: (newRequest: RequestedDataType) => void;
}

const API = import.meta.env.REACT_APP_DAYOFF_API;

const RequestedTable = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<RequestedDataType[]>([]);
  const [isDrawerOpen, setisDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, , fetchData] = useHttp();
  const [selectedRecord, setSelectedRecord] = useState<
    RequestedDataType | undefined
  >(undefined);

  function handleDrawerClose() {
    setisDrawerOpen(false);
  }

  function handleApprove(id: string) {
    fetchData(
      {
        endpoint: `${API}/${id}/approve`,
        method: "PATCH",
      },
      () => {
        setData((prev) =>
          prev.map((item) => {
            if (item._id === id) {
              return { ...item, isApproved: true };
            }
            return item;
          })
        );
      }
    );
  }

  useEffect(() => {
    const user = getFromLocalStorage();
    const employeeId = user?._id;

    if (employeeId) {
      fetchData(
        {
          endpoint: `${API}/${employeeId}`,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        },
        (response) => {
          setData(response);
        }
      );
    } else {
      console.error("No employee ID found");
    }
  }, []);

  function handleDecline(id?: string) {
    fetchData(
      {
        endpoint: `${API}/${id}/soft-delete`,
        method: "DELETE",
      },
      () => {
        setData((prev) => prev.filter((item) => item._id !== id));
      }
    );
  }

  const onDecline = (record: RequestedDataType) => {
    setIsModalOpen(true);
    setSelectedRecord(record);
    // setData((prevData) => prevData.filter((item) => item.id !== record.id))
  };

  function handleAddNew(data: RequestedDataType) {
    setData((prev) => [data, ...prev]);
  }

  function handleAddNewRequest(newRequest: valueSubmit) {
    fetchData(useHttp.postRequestHelper(API, newRequest), (response) => {
      handleAddNew(response);
      setisDrawerOpen(false);
    });
  }

  const columns: TableProps<RequestedDataType>["columns"] = createColumns(
    data,
    handleApprove,
    onDecline
  );

  return (
    <>
      <Drawer
        placement="right"
        title={t("leaveRequestForm")}
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
      >
        <RequestForm onAdd={handleAddNewRequest} isSubmitting={isLoading} />
      </Drawer>
      <Modal
        isOpen={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => {
          handleDecline(selectedRecord?._id);
          setIsModalOpen(false);
        }}
        title={t("deleteRequest")}
      >
        <p>
          {t("Areyousureyouwanttodeclinethisrequest")}? {t("madeby")}{" "}
          {selectedRecord?.EmployeeName}
        </p>
      </Modal>
      <TableHeader
        title={t("requestedLeave")}
        onClick={() => setisDrawerOpen(true)}
      />
      <Table columns={columns} data={data} />
    </>
  );
};

export default RequestedTable;
