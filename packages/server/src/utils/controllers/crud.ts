export interface CreateOneController<REQ_DTO, RES_DTO = void> {
  createOne: (dto: REQ_DTO)=> Promise<RES_DTO>;
}

export interface CreateOneAndGetController<REQ_DTO, RES_DTO> {
  createOneAndGet: (...params: Parameters<CreateOneController<REQ_DTO, RES_DTO>["createOne"]>)=> Promise<RES_DTO>;
}

export interface FindOneController<ID_DTO, RES_DTO> {
  findOne: (id: ID_DTO)=> Promise<RES_DTO>;
}

export interface FindAllController<RES_DTO> {
  findAll: ()=> Promise<RES_DTO>;
}

export interface PatchOneController<ID_DTO, DTO, RES_DTO = void> {
  patchOne: (id: ID_DTO, dto: DTO, ...otherParams: any[])=> Promise<RES_DTO>;
}

export interface PatchOneAndGetController<ID_DTO, DTO, RES_DTO> {
  patchOneAndGet: (...params: Parameters<PatchOneController<ID_DTO, DTO>["patchOne"]>)=> Promise<RES_DTO | void>;
}
