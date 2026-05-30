import { createUseMenu } from "@hexagonal-ui/core";

import { ports } from "./adapters";

export const useMenu = createUseMenu(ports);
