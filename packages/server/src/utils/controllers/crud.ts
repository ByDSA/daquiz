export interface CreateOneController<REQ_DTO, RES_DTO = void> {
  createOne: (dto: REQ_DTO)=> Promise<RES_DTO>;
}

export interface CreateOneAndGetController<REQ_DTO, RES_DTO> {
  createOneAndGet: (dto: REQ_DTO)=> Promise<RES_DTO>;
}

export interface FindOneController<ID_DTO, RES_DTO> {
  findOne: (id: ID_DTO)=> Promise<RES_DTO>;
}

export interface FindAllController<RES_DTO> {
  findAll: ()=> Promise<RES_DTO>;
}
