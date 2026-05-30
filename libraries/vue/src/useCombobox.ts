import { createUseCombobox } from "@hexagonal-ui/core";

import { ports } from "./adapters";

export const useCombobox = createUseCombobox(ports);
