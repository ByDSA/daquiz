export interface CreateOneService<REQ_DTO> {
  createOne: (dto: REQ_DTO)=> Promise<void>;
}

export interface CreateOneAndGetService<REQ_DTO, ENTITY> {
  createOneAndGet: (dto: REQ_DTO)=> Promise<ENTITY>;
}

export interface FindOneService<ID_DTO, ENTITY> {
  findOne: (id: ID_DTO)=> Promise<ENTITY | null>;
}

export interface FindAllService<ENTITY> {
  findAll: ()=> Promise<ENTITY[]>;
}
