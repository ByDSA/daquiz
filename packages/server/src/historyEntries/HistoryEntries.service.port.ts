import { CreateOneHistoryEntryDto, HistoryEntryEntity } from "./domain";
import { CreateOneService, FindAllService, FindOneService } from "#/utils/services/crud";

export interface HistoryEntriesServicePort extends
CreateOneService<CreateOneHistoryEntryDto>,
FindOneService<HistoryEntryEntity>,
FindAllService<HistoryEntryEntity> {
}

export const HistoryEntriesServicePort = Symbol("HistoryEntriesServicePort");
