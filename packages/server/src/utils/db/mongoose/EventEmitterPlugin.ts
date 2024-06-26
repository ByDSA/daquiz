/* eslint-disable func-names */
/* eslint-disable no-invalid-this */
import { assertDefined } from "#shared/utils/validation/asserts";
import { FilterQuery, UpdateQuery } from "mongoose";
import { CreateEventDB, DeleteEventDB, PatchEventDB } from "#modules/events/EventDB";
import { EventDBEmitter } from "#modules/events/EventDBEmitter";

type CreateEventAdapterFn<DOC, ENTITY extends {id: unknown}>
= (args: {
  newDoc: DOC;
  documentToEntity?: (doc: DOC)=> ENTITY;
} )=> CreateEventDB<ENTITY>;
type PatchEventAdapterFn<DOC, ENTITY extends {id: unknown}, UE = Partial<Omit<ENTITY, "id">>>
= (args: {
  doc?: DOC;
  updateQueryToUpdateEntity?: (updateQuery: UpdateQuery<DOC>)=> UE;
  filters?: FilterQuery<DOC>;
  updateQuery: UpdateQuery<DOC>;
  updateResult?: PatchEventDB<ENTITY, UE>["updateResult"];
} )=> PatchEventDB<ENTITY, UE>;

type DeleteEventAdapterFn<_DOC, ENTITY extends {id: unknown}>
= (args: { filters: FilterQuery<ENTITY> } )=> DeleteEventDB<ENTITY>;

export type EventEmitterPluginOptions<DOC, ENTITY extends {id: unknown}, UE = Partial<Omit<ENTITY, "id">>> = {
  dbEventEmitter: EventDBEmitter;
  typeEventName: string;
  documentToEntity?: (doc: DOC)=> ENTITY;
  createEmission?: {
    use: boolean;
    customAdapter?: CreateEventAdapterFn<DOC, ENTITY>;
  };
  patchEmission?: {
    use: boolean;
    updateQueryToUpdateEntity?: (updateQuery: UpdateQuery<DOC>)=> UE;
    customAdapter?: PatchEventAdapterFn<DOC, ENTITY, UE>;
  };
  deleteEmission?: {
    use: boolean;
    customAdapter?: DeleteEventAdapterFn<DOC, ENTITY>;
  };
};

export function registerEventEmitterPlugin<DOC, ENTITY extends {id: unknown}, UE = Partial<Omit<ENTITY, "id">>>(
  schema,
  options: EventEmitterPluginOptions<DOC, ENTITY, UE>,
) {
  eventEmitterPlugin<DOC, ENTITY, UE>(schema, options);
}

export function eventEmitterPlugin<DOC, ENTITY extends {id: unknown}, UE = Partial<Omit<ENTITY, "id">>>(
  schema,
  options: EventEmitterPluginOptions<DOC, ENTITY, UE>,
) {
  const { dbEventEmitter, createEmission, patchEmission, deleteEmission, typeEventName } = options;

  if (patchEmission?.use) {
    let patchEventAdapter: PatchEventAdapterFn<DOC, ENTITY, UE> = patchEmission.customAdapter
    ?? defaultPatchEventAdapter<DOC, ENTITY, UE>;

    schema.post("findOneAndUpdate", function (doc, next) {
      const filters = this.getFilter() as FilterQuery<DOC>;
      const updateQuery = this.getUpdate() as UpdateQuery<DOC>;

      assertDefined(updateQuery);

      const event = patchEventAdapter( {
        doc: doc,
        filters,
        updateQueryToUpdateEntity: patchEmission.updateQueryToUpdateEntity,
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
          updateQueryToUpdateEntity: patchEmission.updateQueryToUpdateEntity,
          updateResult,
        } );

        dbEventEmitter.emitPatch(typeEventName, event);
      }

      next();
    } );
  }

  if (deleteEmission?.use) {
    schema.post("deleteOne", function (_obj, next) {
      const deleteEventAdapter: DeleteEventAdapterFn<DOC, ENTITY> = deleteEmission.customAdapter
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
    const createEventAdapter: CreateEventAdapterFn<DOC, ENTITY> = createEmission.customAdapter
    ?? defaultCreateEventAdapter;

    schema.post("save", function (newDoc, next) {
      const event = createEventAdapter( {
        newDoc,
        documentToEntity: options.documentToEntity,
      } );

      dbEventEmitter.emitCreate(typeEventName, event);

      next();
    } );
  }
}

const defaultCreateEventAdapter: CreateEventAdapterFn<any, any> = <
  _DOC,
  ENTITY extends {id: unknown}
>(
    { newDoc, documentToEntity }: Parameters<CreateEventAdapterFn<_DOC, ENTITY>>[0],
  ): CreateEventDB<ENTITY> => {
  if (!documentToEntity)
    throw new Error("documentToEntity is required");

  const { id, ...valueObject } = documentToEntity(newDoc);
  const event: CreateEventDB<ENTITY> = {
    id,
    valueObject,
  };

  return event;
};
const defaultDeleteEventAdapter = <_DOC, ENTITY extends {id: unknown}>(
  { filters }: Parameters<DeleteEventAdapterFn<_DOC, ENTITY>>[0],
): DeleteEventDB<ENTITY> => {
  const id = filters?._id?.toString();

  assertDefined(id);
  const event: DeleteEventDB<ENTITY> = {
    id,
  };

  return event;
};
const defaultPatchEventAdapter = <DOC, ENTITY extends {id: unknown}, UE = Partial<Omit<ENTITY, "id">>>(
  { updateQuery,
    filters,
    updateResult,
    updateQueryToUpdateEntity }: Parameters<PatchEventAdapterFn<DOC, ENTITY, UE>>[0],
): PatchEventDB<ENTITY, UE> => {
  if (!updateQueryToUpdateEntity)
    throw new Error("updateQueryToUpdateEntity is required");

  const id: string = filters?._id?.toString();

  assertDefined(id);
  const event: PatchEventDB<ENTITY, UE> = {
    id,
    updateResult,
    updateEntity: updateQueryToUpdateEntity(updateQuery),
  };

  return event;
};
