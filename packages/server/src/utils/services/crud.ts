export interface CreateOneService<REQ_DTO> {
  createOne: (dto: REQ_DTO)=> Promise<void>;
}

export interface CreateOneAndGetService<REQ_DTO, ENTITY> {
  createOneAndGet: (dto: REQ_DTO)=> Promise<ENTITY>;
}

export interface FindOneService<ENTITY extends {id: unknown}> {
  findOne: (id: ENTITY["id"])=> Promise<ENTITY | null>;
}

export interface FindAllService<ENTITY> {
  findAll: ()=> Promise<ENTITY[]>;
}
