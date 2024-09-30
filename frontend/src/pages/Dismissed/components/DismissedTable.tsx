import React, { useEffect, useState } from "react";
import TableHeader from "../../../components/Table/TableHeader";
import Table from "../../../components/Table/Table";
import { LeftDataType } from "../types/Left";
import useHttp from "../../../hooks/useHttp";
import Loader from "../../../components/Shared/Loader";
import { getColumns } from "../utils/LeftColumn";
import { TablePaginationConfig } from "antd/lib/table";

const API = import.meta.env.REACT_APP_DELETE_EMPLOYEE_API;

const DismissedPage: React.FC = () => {
  const [tableData, setTableData] = useState<LeftDataType[]>([]);
  const [isLoading, error, sendRequest] = useHttp();
  const [isDeleting, setIsDeleting] = useState(false);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchData = (page: number, pageSize: number) => {
    sendRequest(
      {
        endpoint: `left?page=${page}&limit=${pageSize}`,
        headers: {
          "Content-Type": "application/json",
        },
      },
      (response) => {
        setTableData(response.data);
        setPagination((prev) => ({
          ...prev,
          current: response.page,
          pageSize: response.limit,
          total: response.total,
        }));
      }
    );
  };

  useEffect(() => {
    fetchData(pagination.current!, pagination.pageSize!);
  }, []);

  const handleTableChange = (newPagination: TablePaginationConfig) => {
    fetchData(newPagination.current!, newPagination.pageSize!);
  };

  const columns = getColumns(tableData);

  return (
    <>
      <TableHeader title="Dismissed" hideButton />
      <section className="test">
        {isLoading && !isDeleting ? (
          <Loader />
        ) : (
          <Table
            columns={columns}
            data={tableData}
            fixed
            pagination={pagination}
            onChange={handleTableChange}
          />
        )}
      </section>
    </>
  );
};

export default DismissedPage;
