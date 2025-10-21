import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FinanceService } from '@application/services/finance.service';
import { CreateFinanceDto } from '@application/dto/create-finance.dto';
import { UpdateFinanceDto } from '@application/dto/update-finance.dto';

@Controller()
export class FinanceMicroserviceController {
  constructor(private readonly financeService: FinanceService) {}

  @MessagePattern('create_finance')
  async createFinance(@Payload() createFinanceDto: CreateFinanceDto) {
    try {
      const finance = await this.financeService.create(createFinanceDto);
      return { success: true, data: finance };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: errorMessage };
    }
  }

  @MessagePattern('find_finance_by_id')
  async findFinanceById(@Payload() payload: { id: string }) {
    try {
      const finance = await this.financeService.findById(payload.id);
      if (!finance) {
        return { success: false, error: 'Finance not found' };
      }
      return { success: true, data: finance };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: errorMessage };
    }
  }

  @MessagePattern('find_finances_by_user_id')
  async findFinancesByUserId(
    @Payload() payload: { userId: string; skip?: number; take?: number },
  ) {
    try {
      const finances = await this.financeService.findByUserId(
        payload.userId,
        payload.skip,
        payload.take,
      );
      return { success: true, data: finances };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: errorMessage };
    }
  }

  @MessagePattern('find_all_finances')
  async findAllFinances(@Payload() payload: { skip?: number; take?: number }) {
    try {
      const finances = await this.financeService.findAll(payload.skip, payload.take);
      return { success: true, data: finances };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: errorMessage };
    }
  }

  @MessagePattern('update_finance')
  async updateFinance(
    @Payload() payload: { id: string; descricao?: string; valor?: number; categoria?: string },
  ) {
    try {
      const updateFinanceDto: UpdateFinanceDto = {};
      if (payload.descricao) updateFinanceDto.descricao = payload.descricao;
      if (payload.valor) updateFinanceDto.valor = payload.valor;
      if (payload.categoria) updateFinanceDto.categoria = payload.categoria;

      const finance = await this.financeService.update(payload.id, updateFinanceDto);
      return { success: true, data: finance };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: errorMessage };
    }
  }

  @MessagePattern('delete_finance')
  async deleteFinance(@Payload() payload: { id: string }) {
    try {
      await this.financeService.delete(payload.id);
      return { success: true, message: 'Finance deleted successfully' };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: errorMessage };
    }
  }

  @MessagePattern('confirm_finance')
  async confirmFinance(@Payload() payload: { id: string }) {
    try {
      const finance = await this.financeService.confirm(payload.id);
      return { success: true, data: finance };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: errorMessage };
    }
  }

  @MessagePattern('cancel_finance')
  async cancelFinance(@Payload() payload: { id: string }) {
    try {
      const finance = await this.financeService.cancel(payload.id);
      return { success: true, data: finance };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: errorMessage };
    }
  }

  @MessagePattern('restore_finance')
  async restoreFinance(@Payload() payload: { id: string }) {
    try {
      const finance = await this.financeService.restore(payload.id);
      return { success: true, data: finance };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: errorMessage };
    }
  }

  @MessagePattern('get_user_balance')
  async getUserBalance(@Payload() payload: { userId: string }) {
    try {
      const balance = await this.financeService.getUserBalance(payload.userId);
      return { success: true, data: { userId: payload.userId, balance } };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: errorMessage };
    }
  }
}

