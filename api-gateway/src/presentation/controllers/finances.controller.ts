import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Inject,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

export interface CreateFinanceDto {
  userId: string;
  tipo: 'receita' | 'despesa';
  descricao: string;
  valor: number;
  categoria: string;
  dataTransacao?: Date;
}

export interface UpdateFinanceDto {
  descricao?: string;
  valor?: number;
  categoria?: string;
}

export interface FinanceResponse {
  id: string;
  userId: string;
  tipo: 'receita' | 'despesa';
  descricao: string;
  valor: number;
  categoria: string;
  dataTransacao: Date;
  status: 'pendente' | 'confirmada' | 'cancelada';
  created: Date;
  updated: Date;
}

@Controller('api/finances')
export class FinancesController {
  constructor(@Inject('TOP_FINANCE') private topFinanceClient: ClientProxy) { }

  @Post()
  async createFinance(@Body() createFinanceDto: CreateFinanceDto) {
    try {
      const result = await firstValueFrom(
        this.topFinanceClient.send('create_finance', createFinanceDto),
      );
      return result;
    } catch (error) {
      throw new HttpException(
        'Failed to create finance',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async findAllFinances(
    @Query('skip') skip: number = 0,
    @Query('take') take: number = 10,
  ) {
    try {
      const result = await firstValueFrom(
        this.topFinanceClient.send('find_all_finances', { skip, take }),
      );
      return result;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch finances',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findFinanceById(@Param('id') id: string) {
    try {
      const result = await firstValueFrom(
        this.topFinanceClient.send('find_finance_by_id', { id }),
      );
      if (!result) {
        throw new HttpException('Finance not found', HttpStatus.NOT_FOUND);
      }
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to fetch finance',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('user/:userId')
  async findFinancesByUserId(
    @Param('userId') userId: string,
    @Query('skip') skip: number = 0,
    @Query('take') take: number = 10,
  ) {
    try {
      const result = await firstValueFrom(
        this.topFinanceClient.send('find_finances_by_user_id', {
          userId,
          skip,
          take,
        }),
      );
      return result;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch user finances',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('user/:userId/balance')
  async getUserBalance(@Param('userId') userId: string) {
    try {
      const result = await firstValueFrom(
        this.topFinanceClient.send('get_user_balance', { userId }),
      );
      return result;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch user balance',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  async updateFinance(@Param('id') id: string, @Body() updateFinanceDto: UpdateFinanceDto) {
    try {
      const result = await firstValueFrom(
        this.topFinanceClient.send('update_finance', { id, ...updateFinanceDto }),
      );
      return result;
    } catch (error) {
      throw new HttpException(
        'Failed to update finance',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async deleteFinance(@Param('id') id: string) {
    try {
      const result = await firstValueFrom(
        this.topFinanceClient.send('delete_finance', { id }),
      );
      return result;
    } catch (error) {
      throw new HttpException(
        'Failed to delete finance',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post(':id/confirm')
  async confirmFinance(@Param('id') id: string) {
    try {
      const result = await firstValueFrom(
        this.topFinanceClient.send('confirm_finance', { id }),
      );
      return result;
    } catch (error) {
      throw new HttpException(
        'Failed to confirm finance',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post(':id/cancel')
  async cancelFinance(@Param('id') id: string) {
    try {
      const result = await firstValueFrom(
        this.topFinanceClient.send('cancel_finance', { id }),
      );
      return result;
    } catch (error) {
      throw new HttpException(
        'Failed to cancel finance',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post(':id/restore')
  async restoreFinance(@Param('id') id: string) {
    try {
      const result = await firstValueFrom(
        this.topFinanceClient.send('restore_finance', { id }),
      );
      return result;
    } catch (error) {
      throw new HttpException(
        'Failed to restore finance',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

