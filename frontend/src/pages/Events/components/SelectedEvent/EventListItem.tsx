import { Typography } from "antd";
import { EventListItemProps } from "../../types/EventTypes";

export default function EventListItem({ title, children, level = 1 }: EventListItemProps) {
	return (
		<li>
			<Typography.Title
				level={level}
				style={{
					marginBottom: 10,
					marginTop: 0,
				}}
			>
				{title}
			</Typography.Title>
			<Typography.Text >{children}</Typography.Text>
		</li>
	);
}
