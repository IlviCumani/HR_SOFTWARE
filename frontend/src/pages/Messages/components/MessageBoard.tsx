import { UserType } from "../types/userType";
import { Input } from "antd";
// import Pusher from "pusher-js";
import "../styles/MessageBoard.css";
import Button from "../../../components/Shared/Button";
import { SendOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { getFromLocalStorage } from "../../../utils/utils";

type MessageBoardProps = {
	selectedUser: UserType | null;
};

type MessageType = {
	message: string;
	senderID: string;
	recieverID: string;
};

export default function MessageBoard({ selectedUser }: MessageBoardProps) {
	const [messages, setMessages] = useState<MessageType[]>([]);
	const [message, setMessage] = useState<string>("");
	const userData = getFromLocalStorage();
	const userID = userData.employID;

	// useEffect(() => {
	// 	// if (selectedUser) {
	// 	// 	setMessages((prev) => prev.filter((message) => message.recieverID === selectedUser._id));
	// 	// }

	// 	const pusher = new Pusher("778e41d67fa4dbcc69e7", {
	// 		cluster: "eu",
	// 	});

	// 	const channel = pusher.subscribe("my-channel");
	// 	channel.bind("my-event", function (data: MessageType) {
	// 		alert(JSON.stringify(data));
	// 		setMessages((prev) => [...prev, data]);
	// 	});
	// }, []);

	function handleSendMessage() {
		if (message) {
			setMessages((prev) => [
				...prev,
				{
					message: message,
					senderID: userID,
					recieverID: selectedUser?._id || "",
				},
			]);
			setMessage("");
		}
	}

	function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
		setMessage(e.target.value);
	}

	return (
		<section className="message-board">
			<ul className="message-board-messages">
				{messages.map((message) => (
					<li
						className={`${"message"} ${
							message.senderID === userID ? "other-message" : "my-message"
						}`}
					>
						{message.message}
					</li>
				))}
			</ul>
			<Input
				value={message}
				onChange={handleInputChange}
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						handleSendMessage();
					}
				}}
				className="message-board-input"
				size="large"
				suffix={
					<Button
						onClick={handleSendMessage}
						disabled={!message}
						type="primary"
						icon={<SendOutlined />}
					></Button>
				}
			></Input>
		</section>
	);
}
