import { Button } from "../elements/Button";

// @todo: eslint formatting rules linebreaks between class members
// @todo: protocolize presenters patterns-side and call presenter.setState by passing it to a onClick attribute for example
/**
 * Implementation of https://www.w3.org/WAI/ARIA/apg/patterns/button/
 */
export class UseButton {
	private readonly element: Button;

	// @todo IdGenerator driven adapters
	// @see https://medium.com/ssense-tech/hexagonal-architecture-there-are-always-two-sides-to-every-story-bc0780ed7d9c
	// https://github.com/carlphilipp/clean-architecture-example/blob/master/usecase/src/main/java/com/slalom/example/usecase/CreateUser.java
	public constructor() {
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
