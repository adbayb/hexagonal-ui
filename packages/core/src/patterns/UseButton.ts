import type { Button } from "../elements/Button";

type RequestModel = Record<string, never>;

/**
 * The response model always look like to the underlying domain entity (which corresponds here to an element)
 * No need to have a concrete DTO which will introduce uneeded layer of indirection (a pattern is anyway strongly tied to elements)
 */
type ResponseModel = Button;

type Presenter = {
	update: () => void;
};

// @todo: eslint formatting rules linebreaks between class members
// @todo: protocolize presenters patterns-side and call presenter.setState by passing it to a onClick attribute for example
/**
 * Implementation of https://www.w3.org/WAI/ARIA/apg/patterns/button/
 */
// @todo IdGenerator driven adapters (createUseButton(gateways, repositories, ...)?)
// @see https://medium.com/ssense-tech/hexagonal-architecture-there-are-always-two-sides-to-every-story-bc0780ed7d9c
// https://github.com/carlphilipp/clean-architecture-example/blob/master/usecase/src/main/java/com/slalom/example/usecase/CreateUser.java
export const useButton = (
	requestModel: RequestModel,
	presenter: Presenter,
): ResponseModel => {
	console.log(requestModel);
	presenter.update();

	return {
		tag: "button",
		attributes: {
			children: "Hello world",
		},
	};
};
