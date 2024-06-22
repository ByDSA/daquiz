import { QuizEntity } from "../../models";
import { FindAllService, FindOneService } from "#/utils/services/crud";

export interface ReadServicePort extends
FindOneService<QuizEntity>,
FindAllService<QuizEntity> {
}
