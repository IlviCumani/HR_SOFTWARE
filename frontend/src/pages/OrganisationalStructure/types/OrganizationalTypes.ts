export interface EmployData {
  id: string;
  name: string;
  profilePhoto: string;
  position: string;
}

export interface OrganizationData {
  hrAndCeo: HrAndCeo[];
  teamLeaders: TeamLeader[];
}

export interface HrAndCeo {
  _id: string;
  name: string;
  position: string;
  role: "hr" | "ceo"; 
  profilePhoto: string;
}

export interface TeamLeader {
  _id: string;
  teamLeaderName: string;
  teamLeaderProfilePhoto: string;
  teamLeaderPosition: string;
  employees: EmployData[];
}
