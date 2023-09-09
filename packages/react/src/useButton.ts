import { createUseButton } from "@hexagonal-ui/core";
import { useEffect, useRef, useState } from "react";

const useMount = (callback: () => void) => {
	const callbackRef = useRef(callback);

	useEffect(() => {
		callbackRef.current();
	}, []);
};

const useDestroy = (callback: () => void) => {
	const callbackRef = useRef(callback);

	useEffect(() => {
		return callbackRef.current;
	}, []);
};

export const useButton = createUseButton({
	lifecycle: {
		onMount: useMount,
		onDestroy: useDestroy,
	},
	state: useState,
});
