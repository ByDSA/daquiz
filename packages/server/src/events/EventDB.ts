export abstract class EventDB<T extends {id: unknown}> {
  id: T["id"];
}

export class PatchEventDB<T extends {id: unknown}> extends EventDB<T> {
  partialValueObject?: Partial<Omit<T, "id">>;

  updateResult: {matchedCount: number; modifiedCount: number};
}
