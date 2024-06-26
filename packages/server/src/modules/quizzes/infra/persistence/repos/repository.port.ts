import { ReadService } from "./Read.service.port";
import { WriteService } from "./Write.service.port";

export interface Repo extends ReadService, WriteService {
}

export const Repo = Symbol("QuizRepo");
