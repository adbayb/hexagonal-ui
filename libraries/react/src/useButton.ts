import { createUseButton } from "@hexagonal-ui/core";

import { ports } from "./adapters";

export const useButton = createUseButton(ports);
