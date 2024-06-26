import { CreateOneHistoryEntryDto, HistoryEntryEntity } from "../../../domain";
import { CreateOneService, FindAllService, FindOneService } from "#/utils/services/crud";

export interface Repo extends
CreateOneService<CreateOneHistoryEntryDto>,
FindOneService<HistoryEntryEntity>,
FindAllService<HistoryEntryEntity> {
}

export const Repo = Symbol("HistoryEntryRepo");
