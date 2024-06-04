import { EventEmitter } from "node:events";
import { Injectable } from "@nestjs/common";
import { CreateEventDB, DeleteEventDB, EventDB, PatchEventDB } from "./EventDB";
import { EventDBType } from "./EventDBType";

type Listener<T extends {id: unknown}> = (event: EventDB<T>)=> void;
type PatchListener<T extends {id: unknown}, UE> = (event: PatchEventDB<T, UE>)=> void;
type DeleteListener<T extends {id: unknown}> = (event: DeleteEventDB<T>)=> void;
type CreateListener<T extends {id: unknown}> = (event: CreateEventDB<T>)=> void;

type EntityClass<T> = string | (new ()=> T);
function getName<T>(entityClass: EntityClass<T>): string {
  return typeof entityClass === "string" ? entityClass : entityClass.name;
}

@Injectable()
export class EventDBEmitter {
  #nodeEventEmitter: EventEmitter;

  constructor() {
    this.#nodeEventEmitter = new EventEmitter();
  }

  #on<T extends {id: unknown}>(
    entityClass: EntityClass<T>,
    eventType: EventDBType,
    listener: Listener<T>,
  ): this {
    const entityName = getName(entityClass);
    const nodeEventName = `${entityName}:${eventType}`;

    this.#nodeEventEmitter.on(nodeEventName, listener);

    return this;
  }

  #emit<T extends {id: unknown}>(
    entityName: string,
    eventType: EventDBType,
    event: EventDB<T>,
  ): this {
    const nodeEventName = `${entityName}:${eventType}`;

    this.#nodeEventEmitter.emit(nodeEventName, event);

    return this;
  }

  onPatch<T extends {id: unknown}, UE = Partial<Omit<T, "id">>>(
    entityClass: EntityClass<T>,
    listener: PatchListener<T, UE>,
  ): this {
    return this.#on(entityClass, EventDBType.PATCH, listener);
  }

  onDelete<T extends {id: unknown}>(
    entityClass: EntityClass<T>,
    listener: DeleteListener<T>,
  ): this {
    return this.#on(entityClass, EventDBType.DELETE, listener);
  }

  onCreate<T extends {id: unknown}>(
    entityClass: EntityClass<T>,
    listener: CreateListener<T>,
  ): this {
    return this.#on(entityClass, EventDBType.CREATE, listener);
  }

  emitPatch<T extends {id: unknown}, UE = Partial<Omit<T, "id">>>(
    entityClass: EntityClass<T>,
    event: PatchEventDB<T, UE>,
  ): this {
    const entityName = getName(entityClass);

    return this.#emit(entityName, EventDBType.PATCH, event);
  }

  emitDelete<T extends {id: unknown}>(
    entityClass: EntityClass<T>,
    event: DeleteEventDB<T>,
  ): this {
    const entityName = getName(entityClass);

    return this.#emit(entityName, EventDBType.DELETE, event);
  }

  emitCreate<T extends {id: unknown}>(
    entityClass: EntityClass<T>,
    event: CreateEventDB<T>,
  ): this {
    const entityName = getName(entityClass);

    return this.#emit(entityName, EventDBType.CREATE, event);
  }
}
