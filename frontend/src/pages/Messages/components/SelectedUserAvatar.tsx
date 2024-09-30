import { Flex, Typography } from "antd";
import { RenderAvatar } from "../MessagePage";
import { UserType } from "../types/userType";

type SelectedUserAvatarProps = {
	user: UserType | null;
};

const SelectedUserAvatar = ({ user }: SelectedUserAvatarProps) => {
	return (
		<Flex
			align="center"
			gap={5}
			style={{
				margin: "10px 30px",
			}}
		>
			{user && RenderAvatar(user.profilePhoto, user.name)}
			<Typography.Text
				style={{
					color: "white",
					fontSize: "1.3rem",
				}}
			>
				{user ? `${user.name} ${user.surname}` : "Message Someone"}
			</Typography.Text>
		</Flex>
	);
};
export default SelectedUserAvatar;
