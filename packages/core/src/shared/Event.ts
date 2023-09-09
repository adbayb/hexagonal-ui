/**
 * Event (Value Object)
 */
export type Event<E = Element> = {
	bubbles: boolean;
	cancelable: boolean;
	currentTarget: E & EventTarget;
	defaultPrevented: boolean;
	eventPhase: number;
	isTrusted: boolean;
	preventDefault: () => void;
	// stopImmediatePropagation: () => void;
	stopPropagation: () => void;
	target: EventTarget;
	timeStamp: number;
	type: string;
};
