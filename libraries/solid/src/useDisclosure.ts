import { createUseDisclosure } from "@hexagonal-ui/core";

import { ports } from "./adapters";

export const useDisclosure = createUseDisclosure(ports);
