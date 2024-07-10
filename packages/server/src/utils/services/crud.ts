import { DtoBase } from "#shared/utils/dtos";
import { BaseEntity } from "#shared/utils/entity";

export interface CreateOneService<REQ_DTO extends DtoBase> {
  createOne: (dto: REQ_DTO)=> Promise<void>;
}

export interface CreateManyService<REQ_DTO extends DtoBase> {
  createMany: (dto: REQ_DTO)=> Promise<void>;
}

export interface CreateOneAndGetService<REQ_DTO extends DtoBase, ENTITY extends BaseEntity> {
  createOneAndGet: (...params: Parameters<CreateOneService<REQ_DTO>["createOne"]>)=> Promise<ENTITY>;
}

export interface FindOneService<ENTITY extends BaseEntity, OPTS = void> {
  findOne: (id: ENTITY["id"], options?: OPTS)=> Promise<ENTITY | null>;
}

export interface FindAllService<ENTITY extends BaseEntity, OPTS = void> {
  findAll: (options?: OPTS)=> Promise<ENTITY[]>;
}

export interface PatchOneService<DTO extends DtoBase, ENTITY extends BaseEntity> {
  patchOne: (id: ENTITY["id"], dto: DTO)=> Promise<void>;
}

export interface PatchOneAndGetService<DTO extends DtoBase, ENTITY extends BaseEntity> {
  patchOneAndGet: (...params: Parameters<PatchOneService<DTO, ENTITY>["patchOne"]>)=> Promise<ENTITY | null>;
}

export interface DeleteOneByIdService<ID> {
  deleteOneById: (id: ID)=> Promise<void>;
}

export interface DeleteOneService<REQ_DTO extends DtoBase> {
  deleteOne: (dto: REQ_DTO)=> Promise<void>;
}

export interface DeleteAllService {
  deleteAll: ()=> Promise<void>;
}
