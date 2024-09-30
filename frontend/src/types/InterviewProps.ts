import { EmployeeDetails } from "./EmployeeDetailsProps";

enum InterviewType {
  PhoneInterview = "Phone Interview",
  VideoInterview = "Video Interview",
  InPersonInterview = "In-Person Interview",
  TechnicalInterview = "Technical Interview",
  PanelInterview = "Panel Interview",
  InformationalInterview = "Informational Interview",
}

export interface Interview {
  date: Date;
  type: InterviewType;
  notes: string;
  evaluation: string;
  interviewers: EmployeeDetails[];
}
