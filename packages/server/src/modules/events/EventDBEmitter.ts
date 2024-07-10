import { Injectable, Logger } from "@nestjs/common";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { CreateEventDB, DeleteEventDB, EventDB, PatchEventDB } from "./EventDB";
import { EventDBType } from "./EventDBType";

type Listener<ID> = (event: EventDB<ID>)=> void;
type PatchListener<ID, DOC> = (event: PatchEventDB<ID, DOC>)=> void;
type DeleteListener<ID, DOC> = (event: DeleteEventDB<ID, DOC>)=> void;
type CreateListener<ID, DOC> = (event: CreateEventDB<ID, DOC>)=> void;

type EntityClass = string | (new ()=> unknown);
function getName(entityClass: EntityClass): string {
  if (typeof entityClass === "string")
    return entityClass;

  return entityClass.name;
}

type OnEventDBType = EntityClass;

function entityAndActionToEventName(
  entity: EntityClass,
  action: EventDBType,
): string {
  return getName(entity) + "." + action;
}

export function OnPatchEvent(entity: OnEventDBType): MethodDecorator {
  const name = entityAndActionToEventName(entity, EventDBType.PATCHED);

  return OnEvent(name);
}

export function OnCreateEvent(entity: OnEventDBType): MethodDecorator {
  const name = entityAndActionToEventName(entity, EventDBType.CREATED);

  return OnEvent(name);
}

export function OnDeleteEvent(entity: OnEventDBType): MethodDecorator {
  const name = entityAndActionToEventName(entity, EventDBType.DELETED);

  return OnEvent(name);
}

@Injectable()
export class EventDBEmitter {
  constructor(private nestEventEmitter: EventEmitter2) {
  }

  #on<ID>(
    entityClass: EntityClass,
    eventType: EventDBType,
    listener: Listener<ID>,
  ): this {
    const entityName = getName(entityClass);

    this.nestEventEmitter.on(entityName + "." + eventType, listener);

    return this;
  }

  registerEventDBLoggerFor(entityClass: EntityClass) {
    const entityName = getName(entityClass);
    const logger = new Logger(entityName.toString());

    this.onPatch(entityName, (event) => {
      logger.log("Patch Event\n" + JSON.stringify(event, null, 2));
    } );

    this.onDelete(entityName, (event) => {
      logger.log("Delete Event\n" + JSON.stringify(event, null, 2));
    } );

    this.onCreate(entityName, (event) => {
      logger.log("Create Event\n" + JSON.stringify(event, null, 2));
    } );
  }

  #emit<ID>(
    entityName: string,
    eventType: EventDBType,
    event: EventDB<ID>,
  ): this {
    this.nestEventEmitter.emit(entityName + "." + eventType, event);

    return this;
  }

  onPatch<ID, DOC>(
    entityClass: EntityClass,
    listener: PatchListener<ID, DOC>,
  ): this {
    return this.#on(entityClass, EventDBType.PATCHED, listener);
  }

  onDelete<ID, DOC>(
    entityClass: EntityClass,
    listener: DeleteListener<ID, DOC>,
  ): this {
    return this.#on(entityClass, EventDBType.DELETED, listener);
  }

  onCreate<ID, DOC>(
    entityClass: EntityClass,
    listener: CreateListener<ID, DOC>,
  ): this {
    return this.#on(entityClass, EventDBType.CREATED, listener);
  }

  emitPatch<ID, DOC>(
    entityClass: EntityClass,
    event: PatchEventDB<ID, DOC>,
  ): this {
    const entityName = getName(entityClass);

    return this.#emit(entityName, EventDBType.PATCHED, event);
  }

  emitDelete<ID, DOC>(
    entityClass: EntityClass,
    event: DeleteEventDB<ID, DOC>,
  ): this {
    const entityName = getName(entityClass);

    return this.#emit(entityName, EventDBType.DELETED, event);
  }

  emitCreate<ID, DOC>(
    entityClass: EntityClass,
    event: CreateEventDB<ID, DOC>,
  ): this {
    const entityName = getName(entityClass);

    return this.#emit(entityName, EventDBType.CREATED, event);
  }
}
