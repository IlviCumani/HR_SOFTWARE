import { UserOutlined } from "@ant-design/icons";
import { FaUserCheck } from "react-icons/fa";
import { IoDocumentOutline } from "react-icons/io5";
import { CiCircleCheck } from "react-icons/ci";
import { FaCircleCheck } from "react-icons/fa6";
import { BsPencilSquare } from "react-icons/bs";
import { BiSolidError } from "react-icons/bi";
import FirstPanel from "./FirstPanel";
import SecondStep from "./SecondStep";
import FinalStep from "./FinalStep";
import { t } from "i18next";

type StepItem = {
  subTitle: string;
  content: JSX.Element;
  icon: JSX.Element;
};

type StepItemProps = (
  current: number,
  setCurrent: (value: number) => void,
  form: any,
  isLoading: boolean,
  error: string | null,
) => StepItem[];

const getStepItems: StepItemProps = (
  current,
  setCurrent,
  form,
  isLoading,
  error,
) => {
  function resetOnError() {
    setCurrent(0);
  }

	return [
		{
			subTitle: t("createAccount"),
			content: <FirstPanel />,
			icon: current === 0 ? <UserOutlined /> : <FaUserCheck />,
		},
		{
			subTitle: t("addEmployeeInfo"),
			content: <SecondStep form={form} />,
			icon: current === 1 ? <BsPencilSquare /> : <IoDocumentOutline />,
		},
		{
			subTitle: t("finalizeAccount"),
			content: <FinalStep isSubmitting={isLoading} errorMsg={error} onGoBackBtn={resetOnError} />,
			icon: current === 2 ? error ? <BiSolidError /> : <FaCircleCheck /> : <CiCircleCheck />,
		},
	];
};

export default getStepItems;
