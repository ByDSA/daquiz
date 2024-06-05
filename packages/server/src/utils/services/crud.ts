export interface CreateOneService<REQ_DTO> {
  createOne: (dto: REQ_DTO)=> Promise<void>;
}

export interface CreateManyService<REQ_DTO> {
  createMany: (dto: REQ_DTO)=> Promise<void>;
}

export interface CreateOneAndGetService<REQ_DTO, ENTITY> {
  createOneAndGet: (...params: Parameters<CreateOneService<REQ_DTO>["createOne"]>)=> Promise<ENTITY>;
}

export interface FindOneService<ENTITY extends {id: unknown}, OPTS = void> {
  findOne: (id: ENTITY["id"], options?: OPTS)=> Promise<ENTITY | null>;
}

export interface FindAllService<ENTITY, OPTS = void> {
  findAll: (options?: OPTS)=> Promise<ENTITY[]>;
}

export interface PatchOneService<DTO, ENTITY extends {id: unknown}> {
  patchOne: (id: ENTITY["id"], dto: DTO)=> Promise<void>;
}

export interface PatchOneAndGetService<DTO, ENTITY extends {id: unknown}> {
  patchOneAndGet: (...params: Parameters<PatchOneService<DTO, ENTITY>["patchOne"]>)=> Promise<ENTITY | null>;
}

export interface DeleteOneService<REQ_DTO> {
  deleteOne: (dto: REQ_DTO)=> Promise<void>;
}

export interface DeleteAllService {
  deleteAll: ()=> Promise<void>;
}
