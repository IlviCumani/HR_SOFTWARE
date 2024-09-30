import {
  ContractTypes,
  RecruitmentStage,
} from "../pages/Recruitments/columns/constants";
import { Interview } from "./InterviewProps";

export interface ApplicantProps {
  _id: string;
  name: string;
  surname: string;
  email: string;
  position: string;
  firstInterview: Interview;
  secondInterview: Interview;
  offerMade: OfferMade;
  stage: RecruitmentStage;
  dateSubmitted: string;
  reference: string;
  rejectReason?: string;
  phoneNumber: string;
}

export interface OfferMade {
  offeredSalary: number;
  contractType: ContractTypes;
  startDate: Date;
}
