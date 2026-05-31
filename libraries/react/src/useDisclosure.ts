import { createUseDisclosure } from "@hexagonal-ui/core";

import { frameworkAdapter } from "./adapters";

export const useDisclosure = createUseDisclosure(frameworkAdapter);
