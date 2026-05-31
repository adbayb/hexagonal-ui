import { createUseCombobox } from "@hexagonal-ui/core";

import { frameworkAdapter } from "./adapters";

export const useCombobox = createUseCombobox(frameworkAdapter);
