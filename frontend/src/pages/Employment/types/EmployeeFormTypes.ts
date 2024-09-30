import { EmployeeDataType } from "./Employee";

export type AddEmployeeFormProps = {
  applicant?: boolean;
  selectedEmployee?: EmployeeDataType | undefined;
  onEdit: (editedEmployee: EmployeeDataType) => void;
  onAdd: (newEmployee: EmployeeDataType) => void;
};

export type PromotionFormProps = {
  selectedEmployee?: EmployeeDataType | undefined;
  onEdit: (editedEmployee: {
    newPosition: string;
    newSalary: number;
    trainedBy: string;
    dateOfPromotion: string;
  }) => void;
};
