import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FinanceService } from '@application/services/finance.service';
import { CreateFinanceDto } from '@application/dto/create-finance.dto';
import { UpdateFinanceDto } from '@application/dto/update-finance.dto';

@Controller('finances')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createFinanceDto: CreateFinanceDto) {
    return this.financeService.create(createFinanceDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query('skip') skip: string = '0',
    @Query('take') take: string = '10',
  ) {
    return this.financeService.findAll(parseInt(skip), parseInt(take));
  }

  @Get('user/:userId')
  @HttpCode(HttpStatus.OK)
  async findByUserId(
    @Param('userId') userId: string,
    @Query('skip') skip: string = '0',
    @Query('take') take: string = '10',
  ) {
    return this.financeService.findByUserId(userId, parseInt(skip), parseInt(take));
  }

  @Get('user/:userId/balance')
  @HttpCode(HttpStatus.OK)
  async getUserBalance(@Param('userId') userId: string) {
    return this.financeService.getUserBalance(userId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: string) {
    return this.financeService.findById(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateFinanceDto: UpdateFinanceDto,
  ) {
    return this.financeService.update(id, updateFinanceDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.financeService.delete(id);
  }

  @Post(':id/confirm')
  @HttpCode(HttpStatus.OK)
  async confirm(@Param('id') id: string) {
    return this.financeService.confirm(id);
  }

  @Post(':id/cancel')
  @HttpCode(HttpStatus.OK)
  async cancel(@Param('id') id: string) {
    return this.financeService.cancel(id);
  }

  @Post(':id/restore')
  @HttpCode(HttpStatus.OK)
  async restore(@Param('id') id: string) {
    return this.financeService.restore(id);
  }
}

