import { QuizEntity } from "../../../domain/models";
import { FindAllService, FindOneService } from "#utils/services/crud";

export interface ReadService extends
FindOneService<QuizEntity>,
FindAllService<QuizEntity> {
}
