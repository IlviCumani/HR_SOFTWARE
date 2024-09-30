import { Result } from "antd";
import Loader from "../../../components/Shared/Loader";
import Button from "../../../components/Shared/Button";
import { t } from "i18next";

type FinalStepProps = {
  isSubmitting: boolean;
  errorMsg: string | null;
  onGoBackBtn: () => void;
};

const FinalStep = ({ isSubmitting, errorMsg, onGoBackBtn }: FinalStepProps) => {
	return !isSubmitting ? (
		<>
			<Result
				status={errorMsg ? "error" : "success"}
				title={errorMsg ? errorMsg : t("sucessSubmit")}
				extra={[
					errorMsg && (
						<Button danger onClick={onGoBackBtn}>
							{t("back")}
						</Button>
					),
				]}
			/>
		</>
	) : (
		<Loader />
	);
};

export default FinalStep;
