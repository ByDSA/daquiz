import { Body, Controller, Get, Inject, Post } from "@nestjs/common";
import { CreateOneHistoryEntryDto, ResultManyHistoryEntryDto } from "../domain";
import { HistoryEntryRepo } from "./persistence";
import { CreateOneController, FindAllController } from "#/utils/controllers/crud";

@Controller()
export class HistoryEntriesController implements
  CreateOneController<CreateOneHistoryEntryDto>,
  FindAllController<ResultManyHistoryEntryDto> {
  constructor(
    @Inject(HistoryEntryRepo) private readonly repo: HistoryEntryRepo,
  ) {}

  @Post()
  async createOne(@Body() dto: CreateOneHistoryEntryDto): Promise<void> {
    return await this.repo.createOne( {
      enteredAnswer: dto.enteredAnswer,
      questionAnswerId: dto.questionAnswerId,
      checkResult: dto.checkResult,
    } );
  }

  @Get()
  async findAll(): Promise<ResultManyHistoryEntryDto> {
    const data = await this.repo.findAll();

    return {
      data,
    };
  }
}
