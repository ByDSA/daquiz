import { EventEmitter } from "node:events";
import { Injectable } from "@nestjs/common";
import { CreateEventDB, DeleteEventDB, EventDB, PatchEventDB } from "./EventDB";
import { EventDBType } from "./EventDBType";

type Listener<T extends {id: unknown}> = (event: EventDB<T>)=> void;
type PatchListener<T extends {id: unknown}, UE> = (event: PatchEventDB<T, UE>)=> void;
type DeleteListener<T extends {id: unknown}> = (event: DeleteEventDB<T>)=> void;

@Injectable()
export class EventDBEmitter {
  #nodeEventEmitter: EventEmitter;

  constructor() {
    this.#nodeEventEmitter = new EventEmitter();
  }

  #on<T extends {id: unknown}>(
    entityClass: new ()=> T,
    eventType: EventDBType,
    listener: Listener<T>,
  ): this {
    const nodeEventName = `${entityClass.name}:${eventType}`;

    this.#nodeEventEmitter.on(nodeEventName, listener);

    return this;
  }

  #emit<T extends {id: unknown}>(
    entityClass: new ()=> T,
    eventType: EventDBType,
    event: EventDB<T>,
  ): this {
    const nodeEventName = `${entityClass.name}:${eventType}`;

    this.#nodeEventEmitter.emit(nodeEventName, event);

    return this;
  }

  onPatch<T extends {id: unknown}, UE = Partial<Omit<T, "id">>>(
    entityClass: new ()=> T,
    listener: PatchListener<T, UE>,
  ): this {
    return this.#on(entityClass, EventDBType.PATCH, listener);
  }

  onDelete<T extends {id: unknown}>(
    entityClass: new ()=> T,
    listener: DeleteListener<T>,
  ): this {
    return this.#on(entityClass, EventDBType.DELETE, listener);
  }

  emitPatch<T extends {id: unknown}, UE = Partial<Omit<T, "id">>>(
    entityClass: new ()=> T,
    event: PatchEventDB<T, UE>,
  ): this {
    return this.#emit(entityClass, EventDBType.PATCH, event);
  }

  emitDelete<T extends {id: unknown}>(
    entityClass: new ()=> T,
    event: DeleteEventDB<T>,
  ): this {
    return this.#emit(entityClass, EventDBType.DELETE, event);
  }

  emitCreate<T extends {id: unknown}>(
    entityClass: new ()=> T,
    event: CreateEventDB<T>,
  ): this {
    return this.#emit(entityClass, EventDBType.CREATE, event);
  }
}
