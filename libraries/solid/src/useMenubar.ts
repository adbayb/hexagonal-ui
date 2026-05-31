import { createUseMenubar } from "@hexagonal-ui/core";

import { frameworkAdapter } from "./adapters";

export const useMenubar = createUseMenubar(frameworkAdapter);
