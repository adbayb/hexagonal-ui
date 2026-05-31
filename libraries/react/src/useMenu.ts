import { createUseMenu } from "@hexagonal-ui/core";

import { frameworkAdapter } from "./adapters";

export const useMenu = createUseMenu(frameworkAdapter);
