/**
 * Event (Value Object)
 */
export type Event = Pick<
	globalThis.Event,
	| "bubbles"
	| "cancelable"
	| "currentTarget"
	| "defaultPrevented"
	| "eventPhase"
	| "isTrusted"
	| "preventDefault"
	| "stopPropagation"
	| "target"
	| "timeStamp"
	| "type"
>;
