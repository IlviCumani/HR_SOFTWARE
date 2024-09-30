import { DragEventArgs, EventRenderedArgs } from "@syncfusion/ej2-react-schedule";

export const fieldsData = {
	id: "_id",
	subject: {
		name: "EmployeeName",
		title: "Employee Name",
		validation: { required: true },
	},
	startTime: {
		name: "StartTime",
		title: "From",
		validation: { required: true },
	},
	endTime: { name: "EndTime", title: "To", validation: { required: true } },
	description: {
		name: "description",
		title: "Reason",
		validation: { required: true },
	},
};

export const onDragStart = (args: DragEventArgs): void => {
	args.navigation = { enable: true, timeDelay: 2000 };
};

const styleTypes = {
	annual: {
		background: "linear-gradient(135deg, #447fff, #447fff, #2a9be6, #2a9be6, #30d3cb)",
		backgroundColor: "#2a9be6",
	},
	sick: {
		background: "linear-gradient(135deg, #f269c3, #f576d1, #f882de, #fb8ef1, #fc95f4)",
		backgroundColor: "#f576d1",
	},
	other: {
		background: "linear-gradient(135deg, #ff512f, #ff6a3d, #ff834b, #ff9c59, #ffa567)",
		backgroundColor: "#ff6a3d",
	},
};

export const applyCategoryColor = (args: EventRenderedArgs, currentView: string): void => {
	console.log(args, "args");
	console.log(currentView, "currentView");
	let categoryType: "annual" | "sick" | "other" = args.data.leaveType;
	console.log(categoryType, "categoryColor");
	if (!args.element || !categoryType) {
		return;
	}

	args.element.style.background = styleTypes[categoryType].background;
	args.element.style.backgroundColor = styleTypes[categoryType].backgroundColor;
};
