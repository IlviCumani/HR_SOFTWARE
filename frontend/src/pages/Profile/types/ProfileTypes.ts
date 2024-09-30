import { EmployeeDataType } from "../../Employment/types/Employee";

export type ProfileProps = {
    selectedEmployee?: EmployeeDataType | undefined;
    onEdit: (editedEmployee: {
      phoneNumber: string;
    }) => void;
  };
  