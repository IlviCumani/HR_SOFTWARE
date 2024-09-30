export type RequestedDataType = {
	_id: string;
	employeeId: string;
	leaveType: string;
	StartTime: Date;
	EndTime: Date;
	description: string;
	totalDays: number;
	EmployeeName: string;
	isApproved: boolean;
};

export type valueSubmit = {
	employeeId: string;
	StartTime: Date;
	EndTime: Date;
	leaveType: string;
	description: string;
};
