import React, { useRef } from "react";
import AddBonusModal from "./components/AddBonusModal";
import EditSalaryModal from "./components/EditSalaryModal";
import TableHeader from "../../components/Table/TableHeader";
import { useSalaryHook } from "./context/hook";
import { Salary } from "../../types/SalaryProps";
import { useTranslation } from "react-i18next";
import { isHR } from "../../utils/utils";
import TableComponent from "./components/table/TableComponent";
import FilterComponent from "./components/FilterComponent";

const SalaryContent: React.FC = () => {
  const { t } = useTranslation();

  const addBonusRef = useRef<Salary>(null);
  const editFormRef = useRef<Salary>(null);
  const isHr = isHR();

  const {
    handleModal,
    handleAddBonusSubmit,
    handleEditSubmit,

    createSalary,
  } = useSalaryHook();

  return (
    <div style={{ margin: 20 }}>
      <TableHeader
        title={t("salaries")}
        onClick={handleModal}
        hideButton={!isHr}
      />
      <FilterComponent />

      <TableComponent />

      <AddBonusModal
        addBonusRef={addBonusRef}
        handleAddBonusSubmit={handleAddBonusSubmit}
      />
      <EditSalaryModal
        editFormRef={editFormRef}
        handleEditSubmit={handleEditSubmit}
        handleCreateSubmit={createSalary}
      />
    </div>
  );
};

export default SalaryContent;
