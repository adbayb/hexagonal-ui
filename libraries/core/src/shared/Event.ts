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

export type KeyboardEvent = Pick<
	globalThis.KeyboardEvent,
	"key" | "preventDefault"
>;
