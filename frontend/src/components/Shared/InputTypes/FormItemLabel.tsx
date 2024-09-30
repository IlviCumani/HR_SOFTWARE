const FormItemLabel = ({ children }: { children: React.ReactNode }) => {
	// component logic
	return (
		<span
			style={{
				textOverflow: "ellipsis",
				overflow: "hidden",
				whiteSpace: "nowrap",
			}}
		>
			{children}
		</span>
	);
};
export default FormItemLabel;
