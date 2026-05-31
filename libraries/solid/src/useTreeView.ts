import { createUseTreeView } from "@hexagonal-ui/core";

import { ports } from "./adapters";

export const useTreeView = createUseTreeView(ports);
