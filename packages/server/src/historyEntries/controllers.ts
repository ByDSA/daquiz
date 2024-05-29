import { CreateOneHistoryEntryDto, ResultManyHistoryEntryDto } from "#shared/models/history-entries/dtos";
import { Body, Controller, Get, Post } from "@nestjs/common";
import { HistoryEntriesService } from "./services";
import { CreateOneController, FindAllController } from "#/utils/controllers/crud";

@Controller()
export class HistoryEntriesController implements
  CreateOneController<CreateOneHistoryEntryDto>,
  FindAllController<ResultManyHistoryEntryDto> {
  constructor(
    private readonly service: HistoryEntriesService,
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
