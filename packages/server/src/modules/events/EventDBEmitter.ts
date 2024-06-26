import { Injectable, Logger } from "@nestjs/common";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { CreateEventDB, DeleteEventDB, EventDB, PatchEventDB } from "./EventDB";
import { EventDBType } from "./EventDBType";

type Listener<T extends {id: unknown}> = (event: EventDB<T>)=> void;
type PatchListener<T extends {id: unknown}, UE> = (event: PatchEventDB<T, UE>)=> void;
type DeleteListener<T extends {id: unknown}> = (event: DeleteEventDB<T>)=> void;
type CreateListener<T extends {id: unknown}> = (event: CreateEventDB<T>)=> void;

type EntityClass<T extends {id: unknown}> = string | (new ()=> T);
function getName<T extends {id: unknown}>(entityClass: EntityClass<T>): string {
  if (typeof entityClass === "string")
    return entityClass;

  return entityClass.name;
}

type OnEventDBType<T extends {id: unknown}> = EntityClass<T>;

function entityAndActionToEventName<T extends {id: unknown}>(
  entity: EntityClass<T>,
  action: EventDBType,
): string {
  return getName(entity) + "." + action;
}

export function OnPatchEvent<T extends {id: unknown}>(entity: OnEventDBType<T>): MethodDecorator {
  const name = entityAndActionToEventName(entity, EventDBType.PATCHED);

  return OnEvent(name);
}

export function OnCreateEvent<T extends {id: unknown}>(entity: OnEventDBType<T>): MethodDecorator {
  const name = entityAndActionToEventName(entity, EventDBType.CREATED);

  return OnEvent(name);
}

export function OnDeleteEvent<T extends {id: unknown}>(entity: OnEventDBType<T>): MethodDecorator {
  const name = entityAndActionToEventName(entity, EventDBType.DELETED);

  return OnEvent(name);
}

@Injectable()
export class EventDBEmitter {
  constructor(private nestEventEmitter: EventEmitter2) {
  }

  #on<T extends {id: unknown}>(
    entityClass: EntityClass<T>,
    eventType: EventDBType,
    listener: Listener<T>,
  ): this {
    const entityName = getName(entityClass);

    this.nestEventEmitter.on(entityName + "." + eventType, listener);

    return this;
  }

  registerEventDBLoggerFor<T extends {id: unknown}>(entityClass: EntityClass<T>) {
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

  #emit<T extends {id: unknown}>(
    entityName: string,
    eventType: EventDBType,
    event: EventDB<T>,
  ): this {
    this.nestEventEmitter.emit(entityName + "." + eventType, event);

    return this;
  }

  onPatch<T extends {id: unknown}, UE = Partial<Omit<T, "id">>>(
    entityClass: EntityClass<T>,
    listener: PatchListener<T, UE>,
  ): this {
    return this.#on(entityClass, EventDBType.PATCHED, listener);
  }

  onDelete<T extends {id: unknown}>(
    entityClass: EntityClass<T>,
    listener: DeleteListener<T>,
  ): this {
    return this.#on(entityClass, EventDBType.DELETED, listener);
  }

  onCreate<T extends {id: unknown}>(
    entityClass: EntityClass<T>,
    listener: CreateListener<T>,
  ): this {
    return this.#on(entityClass, EventDBType.CREATED, listener);
  }

  emitPatch<T extends {id: unknown}, UE = Partial<Omit<T, "id">>>(
    entityClass: EntityClass<T>,
    event: PatchEventDB<T, UE>,
  ): this {
    const entityName = getName(entityClass);

    return this.#emit(entityName, EventDBType.PATCHED, event);
  }

  emitDelete<T extends {id: unknown}>(
    entityClass: EntityClass<T>,
    event: DeleteEventDB<T>,
  ): this {
    const entityName = getName(entityClass);

    return this.#emit(entityName, EventDBType.DELETED, event);
  }

  emitCreate<T extends {id: unknown}>(
    entityClass: EntityClass<T>,
    event: CreateEventDB<T>,
  ): this {
    const entityName = getName(entityClass);

    return this.#emit(entityName, EventDBType.CREATED, event);
  }
}
