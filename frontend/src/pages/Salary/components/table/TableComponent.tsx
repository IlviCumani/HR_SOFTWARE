import Table from "../../../../components/Table/Table";
import usePagination from "../../../../hooks/usePagination";
import { useSalaryHook } from "../../context/hook";
import columns from "./TableColumns";

const TableComponent = () => {
  const { tableData, itemCount, handleModal, handleAddBonus, updateSalary } =
    useSalaryHook();
  const { page, limit, handlePageChange, handleLimitChange } = usePagination();
  return (
    <Table
      data={tableData}
      columns={columns({
        handleAddBonus,
        handleModal,
        updateSalary,
      })}
      fixed
      pagination={{
        position: ["bottomRight"],
        current: page,
        pageSize: limit,
        total: itemCount,
        onChange: handlePageChange,
        onShowSizeChange: handleLimitChange,
      }}
    />
  );
};

export default TableComponent;
