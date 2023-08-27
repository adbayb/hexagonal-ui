import { Button } from "../elements/Button";

// @todo: eslint formatting rules linebreaks between class members
// @todo: protocolize presenters patterns-side and call presenter.setState by passing it to a onClick attribute for example
/**
 * Implementation of https://www.w3.org/WAI/ARIA/apg/patterns/button/
 */
export class UseButton {
	private readonly element: Button;

	// @todo
	public constructor() {
		console.log("hello world");
		this.element = new Button({
			children: "",
		});
	}

	/**
	 * DTO
	 * @returns JSX-compatible output
	 */
	// @todo: standardize dto shape with a common interface for all pattern
	public toObject() {
		return {
			tag: this.element.getTag(),
			attributes: this.element.getAttributes(),
			// States are flatten
			isPressed: "todo",
			isHovered: "todo",
			isFocused: "todo",
		};
	}
}

const dto = new UseButton().toObject();

console.log(dto);
