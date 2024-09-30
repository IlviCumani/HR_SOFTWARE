export type OnLeaveData = {
	_id: string;
	EmployeeName: string;
	StartTime: Date;
	EndTime: Date;
	type: "annual" | "sick" | "other";
};
