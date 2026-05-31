import { createUseTreeView } from "@hexagonal-ui/core";

import { frameworkAdapter } from "./adapters";

export const useTreeView = createUseTreeView(frameworkAdapter);
