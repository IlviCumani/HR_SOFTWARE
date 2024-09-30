import { createContext, Dispatch, SetStateAction } from "react";
import { Salary } from "../../../types/SalaryProps";

interface SalaryContextProps {
  selectedSalary: Salary | undefined;
  setSelectedSalary: Dispatch<SetStateAction<Salary | undefined>>;
}

interface ModalContextProps {
  isAddBonusModalOpen: boolean;
  setIsAddBonusModalOpen: Dispatch<SetStateAction<boolean>>;
  isEditModalOpen: boolean;
  setIsEditModalOpen: Dispatch<SetStateAction<boolean>>;
}

interface TableDataProps {
  tableData: Salary[];
  setTableData: Dispatch<SetStateAction<Salary[]>>;
}

export const SalaryContext = createContext<SalaryContextProps | undefined>(
  undefined,
);
export const ModalContext = createContext<ModalContextProps | undefined>(
  undefined,
);
export const TableContext = createContext<TableDataProps | undefined>(
  undefined,
);
