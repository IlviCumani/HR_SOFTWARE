import { SmileOutlined, FrownOutlined, MehOutlined } from "@ant-design/icons";
import { getDevRoles } from "../../Employment/utils/helperFunctions";

const selectOption = [
	{ label: "Applied", color: "cyan" },
	{ label: "Rejected", color: "red" },
	{ label: "1st Interview", color: "gold" },
	{ label: "2nd Interview", color: "lime" },
	{ label: "Offer Made", color: "blue" },
	{ label: "Hired", color: "purple" },
];

const references = [
	{ value: "Linkedin", label: "LinkedIn" },
	{ value: "Instagram", label: "Instagram" },
	{ value: "Facebook", label: "Facebook" },
	{ value: "Dua Pune", label: "Dua Pune" },
	{ value: "Others", label: "Other" },
];

const interviewTypes = [
	{ value: "Phone Interview", label: "Phone Interview" },
	{ value: "Video Interview", label: "Video Interview" },
	{ value: "In-Person Interview", label: "In-Person Interview" },
	{ value: "Panel Interview", label: "Panel Interview" },
	{ value: "Technical Interview", label: "Technical Interview" },
	{ value: "Informational Interview", label: "Informational Interview" },
];

enum ContractTypes {
	FullTime = "Full Time",
	PartTime = "Part Time",
	Temporary = "Temporary",
	Internship = "Internship",
	Seasonal = "Seasonal",
	FixedTerm = "Fixed Term",
	Indefinite = "Indefinite",
	Freelance = "Freelance",
	Remote = "Remote",
	Apprenticeship = "Apprenticeship",
}
enum RecruitmentStage {
	Applied = "Applied",
	FirstInterview = "1st Interview",
	SecondInterview = "2nd Interview",
	OfferMade = "Offer Made",
	Hired = "Hired",
	Rejected = "Rejected",
}
export const customIcons: Record<number, React.ReactNode> = {
	1: <FrownOutlined />,
	2: <FrownOutlined />,
	3: <MehOutlined />,
	4: <SmileOutlined />,
	5: <SmileOutlined />,
};

const evaluationSteps = [
	{
		title: "Negative",
		content: "😞",
		value: "Negative",
	},
	{
		title: "Not Sure",
		content: "😐",
		value: "Not sure",
	},
	{
		title: "OK",
		content: "👍",
		value: "OK",
	},
	{
		title: "Positive",
		content: "😊",
		value: "Positive",
	},
];

const menuItems = [
	{
		key: RecruitmentStage.Applied,
		label: RecruitmentStage.Applied,
		index: 0,
	},
	{
		key: RecruitmentStage.FirstInterview,
		label: RecruitmentStage.FirstInterview,
		index: 1,
	},
	{
		key: RecruitmentStage.SecondInterview,
		label: RecruitmentStage.SecondInterview,
		index: 2,
	},
	{
		key: RecruitmentStage.OfferMade,
		label: RecruitmentStage.OfferMade,
		index: 3,
	},
	{
		key: RecruitmentStage.Hired,
		label: RecruitmentStage.Hired,
		index: 4,
	},
	{
		key: RecruitmentStage.Rejected,
		label: RecruitmentStage.Rejected,
		index: 5,
	},
];
const referenceItems = [
	{
		key: "LinkedIn",
		label: "LinkedIn",
	},
	{
		key: "Instagram",
		label: "Instagram",
	},
	{
		key: "Facebook",
		label: "Facebook",
	},
	{
		key: "DuaPune",
		label: "Dua Pune",
	},
	{
		key: "Others",
		label: "Others",
	},
];

const positions = getDevRoles().map((role) => ({
	label: role,
	value: role,
}));
const findStepIndex = (stage: RecruitmentStage): number => {
	const item = menuItems.find((item) => item.label === stage);
	const index = item ? item.index : 0;
	return index < 4 ? index : 0;
};

export {
	ContractTypes,
	selectOption,
	references,
	RecruitmentStage,
	evaluationSteps,
	menuItems,
	referenceItems,
	interviewTypes,
	positions,
	findStepIndex,
};
