export abstract class EventDB<T extends {id: unknown}> {
  id: T["id"];
}

export class PatchEventDB<T extends {id: unknown}, UE = Partial<Omit<T, "id">>> extends EventDB<T> {
  updateEntity: UE;

  updateResult?: {matchedCount: number; modifiedCount: number};
}

export class CreateEventDB<T extends {id: unknown}> extends EventDB<T> {
  valueObject: Omit<T, "id">;
}

export class DeleteEventDB<T extends {id: unknown}> extends EventDB<T> {
}
