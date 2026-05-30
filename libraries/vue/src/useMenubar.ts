import { createUseMenubar } from "@hexagonal-ui/core";

import { ports } from "./adapters";

export const useMenubar = createUseMenubar(ports);
