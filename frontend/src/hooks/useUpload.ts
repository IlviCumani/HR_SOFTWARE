import { useState } from "react";

export type UploadReturnType = {
	fileList: any[];
	addNewFilesHandler: (files: any[]) => void;
	updateFilesUrlHandler: (fileUrls: string[]) => void;
	isUploading: boolean;
};

export default function useUpload(): UploadReturnType {
	const [fileList, setFileList] = useState<any[]>([]);
	const [isUploading, setIsUploading] = useState(false);

	function addNewFilesHandler(files: any[]) {
		setIsUploading(true);
		setFileList((prev) => {
			const newFiles = files
				.filter((file) => !prev.some((prevFile) => prevFile.uid === file.uid))
				.map((file) => ({
					uid: file.uid,
					name: file.name,
					status: "uploading",
				}));

			const newArray = [...prev, ...newFiles];

			return newArray;
		});
	}

	function updateFilesUrlHandler(fileUrls: string[]) {
		setFileList((prev) => {
			return prev.map((file) => {
				const uploadedFileURL = fileUrls.find((url: string) => url.includes(file.name));
				if (file.status === "uploading") {
					return {
						...file,
						status: "done",
						url: uploadedFileURL,
					};
				} else {
					return file;
				}
			});
		});
		setIsUploading(false);
	}

	return { fileList, addNewFilesHandler, updateFilesUrlHandler, isUploading };
}

