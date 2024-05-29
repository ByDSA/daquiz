export {
  DBModule as HistoryEntriesDBModule,
} from "./module";

export {
  SchemaClass as HistoryEntry,
  Doc as HistoryEntryDocument,
  SchemaDoc as HistoryEntrySchema,
} from "./schema";

export {
  docToEntity as historyEntryDocToEntity,
  entityToDoc as historyEntryEntityToDoc,
  modelName as historyEntryModelName,
} from "./adapters";
