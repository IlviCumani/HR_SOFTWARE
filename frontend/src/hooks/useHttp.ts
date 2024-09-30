import { useState } from "react";
import { sendRequestType } from "../types/UseHttpTypes";
import { getFromLocalStorage } from "../utils/utils";

const API = import.meta.env.REACT_APP_MAIN;
const LOGIN_API = import.meta.env.REACT_APP_LOGIN_API;

function POSTHelper(endpoint: string, body: any, headers?: any) {
	return {
		endpoint,
		headers,
		method: "POST",
		body,
	};
}

function DELETEHelper(endpoint: string, headers?: any) {
	return {
		endpoint,
		headers,
		method: "DELETE",
	};
}

function PATCHHelper(endpoint: string, body?: any, headers?: any) {
	return {
		endpoint,
		headers,
		method: "PATCH",
		body,
	};
}

function PUTHelper(endpoint: string, body?: any, headers?: any) {
	return {
		endpoint,
		headers,
		method: "PUT",
		body,
	};
}

export default function useHttp() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const userData = getFromLocalStorage();

	const sendRequest: sendRequestType = (requestConfig, applyData) => {
		setIsLoading(true);
		setError(null);
		const isLoggedIn = requestConfig.endpoint === LOGIN_API;

		async function fetchData() {
			try {
				const response = await fetch(`${API}/${requestConfig.endpoint}`, {
					method: requestConfig.method || "GET",
					headers: {
						"Content-Type": "application/json",
						...(!isLoggedIn ? { Authorization: `Bearer ${userData.token}` } : {}),
						...requestConfig.headers,
					},
					body: requestConfig.body ? JSON.stringify(requestConfig.body) : null,
				});

				if (!response.ok) {
					throw new Error("Request failed!");
				}

				const responseData = await response.json();
				if (applyData) {
					applyData(responseData);
				}
			} catch (err: any) {
				setError(err.message || "Something went wrong!");
			} finally {
				setIsLoading(false);
			}
		}

		fetchData();
	};

	return [isLoading, error, sendRequest] as const;
}

useHttp.postRequestHelper = POSTHelper;
useHttp.deleteRequestHelper = DELETEHelper;
useHttp.patchRequestHelper = PATCHHelper;
useHttp.putRequestHelper = PUTHelper;
