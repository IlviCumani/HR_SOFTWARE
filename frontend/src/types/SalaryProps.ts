import { Bonus } from "./BonusProps";
import { EmployeeDetails } from "./EmployeeDetailsProps";

export interface Salary {
  _id: string;
  employeeID: string;
  NSSH: string;
  netSalary: number;
  dateTaken: Date;
  workDays: number;
  bonuses?: Bonus[];
  socialSecurityContributions: number;
  healthInsurance: number;
  grossSalary: number;
  total: number;
  paid?: boolean;
  incomeTax: number;
  socialInsuranceCompany: number;
  healthInsuranceCompany: number;
  employeeDetails?: EmployeeDetails;
}
