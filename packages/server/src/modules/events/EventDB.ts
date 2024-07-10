import { UpdateQuery } from "mongoose";

export abstract class EventDB<ID> {
  id: ID;
}

export abstract class EventDBWithDoc<ID, DOC> extends EventDB<ID> {
  doc: DOC;
}

export abstract class EventDBWithOptionalDoc<ID, DOC> extends EventDB<ID> {
  doc?: DOC;
}

export class PatchEventDB<ID, DOC, UQ extends UpdateQuery<DOC> = UpdateQuery<DOC>> extends EventDBWithOptionalDoc<ID, DOC> {
  updateQuery: UQ;

  updateResult?: {matchedCount: number; modifiedCount: number};
}

export class CreateEventDB<ID, DOC> extends EventDBWithDoc<ID, DOC> {
}

export class DeleteEventDB<ID, DOC> extends EventDBWithOptionalDoc<ID, DOC> {
}
