import PropTypes from "prop-types";
import React, { createContext, useEffect, useState } from "react";

import { LoaderFullScreen } from "../components/loaders/LoaderFullScreen";
import { useSigningCosmWasmClient } from "../hooks/cosmwasm";
import {ToastError} from "../components/toasts/ToastError"
import {ToastSuccess} from "../components/toasts/ToastSuccess"

interface ToastMessage {
		title: string;
		message: string;
}
export const initialToastError: ToastMessage = { title: "", message: "" };
export const initialToastSuccess: ToastMessage = { title: "", message: "" };

interface DefaultValue {
		toastError: ToastMessage;
		setToastError: (error: ToastMessage) => void;
		toastSuccess: ToastMessage;
		setToastSuccess: (info: ToastMessage) => void;
		loadingFullScreen: boolean;
		setLoadingFullScreen: (loading: boolean) => void;
}
const defaultValue: DefaultValue = {
		toastError: initialToastError,
		setToastError: undefined,
		toastSuccess: initialToastSuccess,
		setToastSuccess: undefined,
		loadingFullScreen: false,
		setLoadingFullScreen: undefined,
};

export const FeedbacksContext = createContext(defaultValue);

const FeedbacksContextProvider = ({ children }) => {
		const [loadingFullScreen, setLoadingFullScreen] = useState(false);
		const [toastError, setToastError] = useState(initialToastError);
		const [toastSuccess, setToastSuccess] = useState(initialToastSuccess);

		return (
				<FeedbacksContext.Provider
						value={{
								loadingFullScreen,
								setLoadingFullScreen,
								toastError,
								setToastError,
								toastSuccess,
								setToastSuccess,
						}}
				>
						{/*==== Loader full screen*/}
						{loadingFullScreen ? <LoaderFullScreen /> : null}
						{/*==== Toasts*/}
						{toastError && toastError.title ? (
								<ToastError
										onPress={() => setToastError(initialToastError)}
										title={toastError.title}
										message={toastError.message}
								/>
						) : null}
						{toastSuccess && toastSuccess.title ? (
								<ToastSuccess
										onPress={() => setToastSuccess(initialToastSuccess)}
										title={toastSuccess.title}
										message={toastSuccess.message}
								/>
						) : null}
						{/*==== Page content*/}
						{children}
				</FeedbacksContext.Provider>
		);
};

FeedbacksContextProvider.propTypes = {
		children: PropTypes.oneOfType([
				PropTypes.arrayOf(PropTypes.node),
				PropTypes.node,
		]),
};

export default FeedbacksContextProvider;
