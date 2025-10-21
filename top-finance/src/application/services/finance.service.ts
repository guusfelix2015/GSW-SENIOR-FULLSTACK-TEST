import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import { Finance } from '@domain/entities/finance.entity';
import { IFinanceRepository } from '@domain/repositories/finance.repository.interface';
import { CreateFinanceDto } from '../dto/create-finance.dto';
import { UpdateFinanceDto } from '../dto/update-finance.dto';
import { FinanceMapper } from '../mappers/finance.mapper';

@Injectable()
export class FinanceService {
  constructor(
    @Inject('IFinanceRepository')
    private readonly financeRepository: IFinanceRepository,
  ) { }

  async create(createFinanceDto: CreateFinanceDto) {
    const finance = FinanceMapper.toDomain(createFinanceDto);
    const createdFinance = await this.financeRepository.create(finance);
    return FinanceMapper.toResponse(createdFinance);
  }

  async findById(id: string) {
    const finance = await this.financeRepository.findById(id);
    if (!finance) {
      throw new NotFoundException(`Finance with ID ${id} not found`);
    }
    return FinanceMapper.toResponse(finance);
  }

  async findByUserId(userId: string, skip: number = 0, take: number = 10) {
    const finances = await this.financeRepository.findByUserId(userId, skip, take);
    return FinanceMapper.toResponseArray(finances);
  }

  async findAll(skip: number = 0, take: number = 10) {
    const finances = await this.financeRepository.findAll(skip, take);
    return FinanceMapper.toResponseArray(finances);
  }

  async update(id: string, updateFinanceDto: UpdateFinanceDto) {
    const finance = await this.financeRepository.findById(id);
    if (!finance) {
      throw new NotFoundException(`Finance with ID ${id} not found`);
    }

    if (finance.isDeleted_()) {
      throw new BadRequestException('Cannot update a deleted transaction');
    }

    if (updateFinanceDto.descricao) {
      finance.updateDescription(updateFinanceDto.descricao);
    }

    if (updateFinanceDto.valor) {
      finance.updateValue(updateFinanceDto.valor);
    }

    if (updateFinanceDto.categoria) {
      finance.updateCategory(updateFinanceDto.categoria);
    }

    const updatedFinance = await this.financeRepository.update(id, finance);
    return FinanceMapper.toResponse(updatedFinance);
  }

  async delete(id: string) {
    const finance = await this.financeRepository.findById(id);
    if (!finance) {
      throw new NotFoundException(`Finance with ID ${id} not found`);
    }

    await this.financeRepository.delete(id);
  }

  async restore(id: string) {
    const finance = await this.financeRepository.findById(id);
    if (!finance) {
      throw new NotFoundException(`Finance with ID ${id} not found`);
    }

    if (!finance.isDeleted_()) {
      throw new BadRequestException('Transaction is not deleted');
    }

    await this.financeRepository.restore(id);
  }

  async confirm(id: string) {
    const finance = await this.financeRepository.findById(id);
    if (!finance) {
      throw new NotFoundException(`Finance with ID ${id} not found`);
    }

    finance.confirm();
    const updatedFinance = await this.financeRepository.update(id, finance);
    return FinanceMapper.toResponse(updatedFinance);
  }

  async cancel(id: string) {
    const finance = await this.financeRepository.findById(id);
    if (!finance) {
      throw new NotFoundException(`Finance with ID ${id} not found`);
    }

    finance.cancel();
    const updatedFinance = await this.financeRepository.update(id, finance);
    return FinanceMapper.toResponse(updatedFinance);
  }

  async getUserBalance(userId: string) {
    const receitas = await this.financeRepository.sumByUserId(userId, 'receita');
    const despesas = await this.financeRepository.sumByUserId(userId, 'despesa');
    const saldo = receitas - despesas;

    return {
      userId,
      receitas,
      despesas,
      saldo,
    };
  }
}

