/* eslint-disable func-names */
/* eslint-disable no-invalid-this */
import { CreateEventDB, DeleteEventDB, PatchEventDB } from "#modules/events/EventDB";
import { EventDBEmitter } from "#modules/events/EventDBEmitter";
import { assertDefined } from "#shared/utils/validation/asserts";
import { FilterQuery, UpdateQuery } from "mongoose";

type CreateEventAdapterFn<ID, DOC>
= (args: {
  newDoc: DOC;
} )=> CreateEventDB<ID, DOC>;
type PatchEventAdapterFn<ID, DOC>
= (args: {
  doc?: DOC;
  filters?: FilterQuery<DOC>;
  updateQuery: UpdateQuery<DOC>;
  updateResult?: PatchEventDB<ID, DOC>["updateResult"];
} )=> PatchEventDB<ID, DOC>;

type DeleteEventAdapterFn<ID, DOC>
= (args: { filters: FilterQuery<DOC> } )=> DeleteEventDB<ID, DOC>;

export type EventEmitterPluginOptions<ID, DOC> = {
  dbEventEmitter: EventDBEmitter;
  typeEventName: string;
  createEmission?: {
    use: boolean;
    customAdapter?: CreateEventAdapterFn<ID, DOC>;
  };
  patchEmission?: {
    use: boolean;
    customAdapter?: PatchEventAdapterFn<ID, DOC>;
  };
  deleteEmission?: {
    use: boolean;
    customAdapter?: DeleteEventAdapterFn<ID, DOC>;
  };
};

export function registerEventEmitterPlugin<ID, DOC>(
  schema,
  options: EventEmitterPluginOptions<ID, DOC>,
) {
  eventEmitterPlugin<ID, DOC>(schema, options);
}

export function eventEmitterPlugin<ID, DOC>(
  schema,
  options: EventEmitterPluginOptions<ID, DOC>,
) {
  const { dbEventEmitter, createEmission, patchEmission, deleteEmission, typeEventName } = options;

  if (patchEmission?.use) {
    let patchEventAdapter: PatchEventAdapterFn<ID, DOC> = patchEmission.customAdapter
    ?? defaultPatchEventAdapter<ID, DOC>;

    schema.post("findOneAndUpdate", function (doc, next) {
      const filters = this.getFilter() as FilterQuery<DOC>;
      const updateQuery = this.getUpdate() as UpdateQuery<DOC>;

      assertDefined(updateQuery);

      const event = patchEventAdapter( {
        doc: doc,
        filters,
        updateQuery,
      } );

      dbEventEmitter.emitPatch(typeEventName, event);

      next();
    } );

    schema.post("updateOne", function (updateResult, next) {
      if (updateResult.modifiedCount > 0) {
        const filters = this.getFilter() as FilterQuery<DOC>;
        const updateQuery = this.getUpdate() as UpdateQuery<DOC>;

        assertDefined(updateQuery);

        const event = patchEventAdapter( {
          filters,
          updateQuery,
          updateResult,
        } );

        dbEventEmitter.emitPatch(typeEventName, event);
      }

      next();
    } );
  }

  if (deleteEmission?.use) {
    schema.post("deleteOne", function (_obj, next) {
      const deleteEventAdapter: DeleteEventAdapterFn<ID, DOC> = deleteEmission.customAdapter
      ?? defaultDeleteEventAdapter;
      const filters = this.getFilter();
      const event = deleteEventAdapter( {
        filters,
      } );

      dbEventEmitter.emitDelete(typeEventName, event);

      next();
    } );
  }

  if (createEmission?.use) {
    const createEventAdapter: CreateEventAdapterFn<ID, DOC> = createEmission.customAdapter
    ?? defaultCreateEventAdapter;

    schema.post("save", function (newDoc, next) {
      const event = createEventAdapter( {
        newDoc,
      } );

      dbEventEmitter.emitCreate(typeEventName, event);

      next();
    } );
  }
}

const defaultCreateEventAdapter: CreateEventAdapterFn<any, any> = <
  ID,
  DOC,
>(
    { newDoc }: Parameters<CreateEventAdapterFn<ID, DOC>>[0],
  ): CreateEventDB<ID, DOC> => {
  const id = (newDoc as any)._id;
  const event: CreateEventDB<ID, DOC> = {
    id,
    doc: newDoc,
  };

  return event;
};
const defaultDeleteEventAdapter = <ID, DOC>(
  { filters }: Parameters<DeleteEventAdapterFn<ID, DOC>>[0],
): DeleteEventDB<ID, DOC> => {
  const id = filters?._id?.toString();

  assertDefined(id);
  const event: DeleteEventDB<ID, DOC> = {
    id,
  };

  return event;
};
const defaultPatchEventAdapter = <ID, DOC>(
  { updateQuery,
    filters,
    updateResult}: Parameters<PatchEventAdapterFn<ID, DOC>>[0],
): PatchEventDB<ID, DOC> => {

  const id: ID = filters?._id?.toString();

  assertDefined(id);
  const event: PatchEventDB<ID, DOC> = {
    id,
    updateResult,
    updateQuery,
  };

  return event;
};
