import React, { useState } from "react";

import { ModalContext, SalaryContext, TableContext } from "./context";
import { Salary } from "../../types/SalaryProps";
import SalaryContent from "./SalaryContent";

const SalariesPage: React.FC = () => {
  const [selectedSalary, setSelectedSalary] = useState<Salary>();
  const [isAddBonusModalOpen, setIsAddBonusModalOpen] =
    useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [tableData, setTableData] = useState<Salary[]>([]);
  return (
    <SalaryContext.Provider value={{ selectedSalary, setSelectedSalary }}>
      <ModalContext.Provider
        value={{
          isAddBonusModalOpen,
          setIsAddBonusModalOpen,
          isEditModalOpen,
          setIsEditModalOpen,
        }}
      >
        <TableContext.Provider value={{ tableData, setTableData }}>
          <SalaryContent />
        </TableContext.Provider>
      </ModalContext.Provider>
    </SalaryContext.Provider>
  );
};

export default SalariesPage;
