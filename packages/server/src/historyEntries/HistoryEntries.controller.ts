import { Body, Controller, Get, Inject, Post } from "@nestjs/common";
import { HistoryEntriesServicePort } from "./HistoryEntries.service.port";
import { CreateOneHistoryEntryDto, ResultManyHistoryEntryDto } from "./domain";
import { CreateOneController, FindAllController } from "#/utils/controllers/crud";

@Controller()
export class HistoryEntriesController implements
  CreateOneController<CreateOneHistoryEntryDto>,
  FindAllController<ResultManyHistoryEntryDto> {
  constructor(
    @Inject(HistoryEntriesServicePort) private readonly service: HistoryEntriesServicePort,
  ) {}

  @Post()
  async createOne(@Body() dto: CreateOneHistoryEntryDto): Promise<void> {
    return await this.service.createOne( {
      enteredAnswer: dto.enteredAnswer,
      questionAnswerId: dto.questionAnswerId,
      checkResult: dto.checkResult,
    } );
  }

  @Get()
  async findAll(): Promise<ResultManyHistoryEntryDto> {
    const data = await this.service.findAll();

    return {
      data,
    };
  }
}
