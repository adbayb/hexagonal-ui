import { createUseSelect } from "@hexagonal-ui/core";

import { frameworkAdapter } from "./adapters";

export const useSelect = createUseSelect(frameworkAdapter);
