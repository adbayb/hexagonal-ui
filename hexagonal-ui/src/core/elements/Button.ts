/* eslint-disable @typescript-eslint/naming-convention */
import { View } from "./View";

export class Button extends View<ButtonAttributes> {
	public constructor(attributes: ButtonAttributes) {
		super("button", attributes);
	}
}

const button = new Button({
	children: "Hello world",
});

const children = button.getChildren();

console.log(children);

type ButtonAttributes = {
	children: boolean | number | string;
	"aria-describedby"?: string;
	"aria-labelledby"?: string;
	"aria-disabled"?: boolean;
	"aria-pressed"?: boolean;
};
