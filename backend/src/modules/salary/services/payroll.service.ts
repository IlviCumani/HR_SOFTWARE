import { Injectable } from '@nestjs/common';
import { Payroll } from '../dto/PayrollDTO/payroll.dto';

@Injectable()
export class PayrollService {
  private readonly SOCIAL_INSURANCES_COMPANY_COEFICIENT = 0.15;
  private readonly SOCIAL_INSURANCES_EMPLOYEE_COEFICIENT = 0.095;
  private readonly HEALTH_INSURANCES_COMPANY_COEFICIENT = 0.017;
  private readonly HEALTH_INSURANCES_EMPLOYEE_COEFICIENT = 0.017;
  private readonly INCOME_TAX_INTERVAL_1_30000 = 30000;
  private readonly INCOME_TAX_INTERVAL_1_35000 = 35000;
  private readonly INCOME_TAX_INTERVAL_2_50000 = 50000;
  private readonly INCOME_TAX_INTERVAL_2_60000 = 60000;
  private readonly INCOME_TAX_INTERVAL_3_200000 = 200000;
  private readonly INCOME_TAX_COEFICIENT_1_13Percent = 0.13;
  private readonly INCOME_TAX_COEFICIENT_2_23Percent = 0.23;
  private readonly INCOME_TAX_INTERVAL_BY_NET_1_50000 = 44400;
  private readonly INCOME_TAX_INTERVAL_BY_NET_1_60000 = 50030;
  private readonly INCOME_TAX_INTERVAL_BY_NET_2_200000 = 157740.48;
  private readonly MIN_SALARY_SELF_EMPLOYED = 24000;
  private readonly MIN_SALARY = 26000;
  private readonly MAX_SALARY = 176416;
  private readonly MAX_SALARY_NET = 137623.33;
  private readonly TOTAL_WORK_DAYS = 22;

  calculateNetSalary(grossSalary: number, workDays: number): Payroll {
    const newGrossSalary = (grossSalary / this.TOTAL_WORK_DAYS) * workDays;

    const healthInsuranceEmployee =
      this.getHealthInsuranceEmployee(newGrossSalary);
    const socialInsuranceEmployee =
      this.getSocialInsuranceEmployee(newGrossSalary);
    const incomeTax = this.getIncomeTax(newGrossSalary);
    const socialInsuranceCompany =
      this.getSocialInsuranceCompany(newGrossSalary);
    const healthInsuranceCompany =
      this.getHealthInsuranceCompany(newGrossSalary);

    const netSalary =
      newGrossSalary -
      socialInsuranceEmployee -
      healthInsuranceEmployee -
      incomeTax;

    return {
      netSalary: this.roundToTwoDecimalPlaces(netSalary),
      socialSecurityContributions: this.roundToTwoDecimalPlaces(
        socialInsuranceEmployee,
      ),
      healthInsurance: this.roundToTwoDecimalPlaces(healthInsuranceEmployee),
      incomeTax: this.roundToTwoDecimalPlaces(incomeTax),
      socialInsuranceCompany: this.roundToTwoDecimalPlaces(
        socialInsuranceCompany,
      ),
      healthInsuranceCompany: this.roundToTwoDecimalPlaces(
        healthInsuranceCompany,
      ),
      grossSalary: this.roundToTwoDecimalPlaces(newGrossSalary),
    };
  }

  private getHealthInsuranceEmployee(taxableSalary: number): number {
    return taxableSalary * this.HEALTH_INSURANCES_EMPLOYEE_COEFICIENT;
  }

  private getSocialInsuranceEmployee(taxableSalary: number): number {
    return (
      Math.min(this.MAX_SALARY, taxableSalary) *
      this.SOCIAL_INSURANCES_EMPLOYEE_COEFICIENT
    );
  }

  private getIncomeTax(taxableSalary: number): number {
    if (taxableSalary <= this.INCOME_TAX_INTERVAL_2_50000) {
      return 0;
    }
    if (taxableSalary <= this.INCOME_TAX_INTERVAL_2_60000) {
      return (
        (taxableSalary - this.INCOME_TAX_INTERVAL_1_35000) *
        this.INCOME_TAX_COEFICIENT_1_13Percent
      );
    }
    if (taxableSalary <= this.INCOME_TAX_INTERVAL_3_200000) {
      return (
        (taxableSalary - this.INCOME_TAX_INTERVAL_1_30000) *
        this.INCOME_TAX_COEFICIENT_1_13Percent
      );
    }
    const taxForInterval200000 = 22100;
    return (
      (taxableSalary - this.INCOME_TAX_INTERVAL_3_200000) *
        this.INCOME_TAX_COEFICIENT_2_23Percent +
      taxForInterval200000
    );
  }

  private getSocialInsuranceCompany(taxableSalary: number): number {
    return (
      Math.min(this.MAX_SALARY, taxableSalary) *
      this.SOCIAL_INSURANCES_COMPANY_COEFICIENT
    );
  }

  private getHealthInsuranceCompany(taxableSalary: number): number {
    return taxableSalary * this.HEALTH_INSURANCES_COMPANY_COEFICIENT;
  }

  private roundToTwoDecimalPlaces(value: number): number {
    return parseFloat(value.toFixed(2));
  }
}
