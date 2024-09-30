export type LeftDataType = {
  _id: string;
  name: string;
  surname: string;
  username: string;
  email: string;
  phoneNumber: number;
  salary: number;
  teamLeader: string;
  startingDate: string;
  position: string;
  nID: string;
  // status: "Working" | "Remote" | "On Leave";
  contract: string;
  deletedAt: string;
};

export type RemainingDays = {
  employeeId: string,
  remainingDays: number
}
