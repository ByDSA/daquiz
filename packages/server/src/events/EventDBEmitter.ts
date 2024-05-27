import { EventEmitter } from "node:events";
import { Injectable } from "@nestjs/common";
import { EventDB, PatchEventDB } from "./EventDB";
import { EventDBType } from "./EventDBType";

type Listener<T extends {id: unknown}> = (event: EventDB<T>)=> void;
type PatchListener<T extends {id: unknown}> = (event: PatchEventDB<T>)=> void;

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

  onPatch<T extends {id: unknown}>(
    entityClass: new ()=> T,
    listener: PatchListener<T>,
  ): this {
    return this.#on(entityClass, EventDBType.PATCH, listener);
  }

  emitPatch<T extends {id: unknown}>(
    entityClass: new ()=> T,
    event: PatchEventDB<T>,
  ): this {
    return this.#emit(entityClass, EventDBType.PATCH, event);
  }
}
