import { createUseListbox } from "@hexagonal-ui/core";

import { frameworkAdapter } from "./adapters";

export const useListbox = createUseListbox(frameworkAdapter);
