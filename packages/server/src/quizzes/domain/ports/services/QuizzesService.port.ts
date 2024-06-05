import { ReadServicePort } from "./ReadService.port";
import { WriteServicePort } from "./WriteService.port";

export interface QuizzesServicePort extends ReadServicePort, WriteServicePort {
}

export const QuizzesServicePort = Symbol("QuizzesServicePort");
