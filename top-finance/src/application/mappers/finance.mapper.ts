import { Finance } from '@domain/entities/finance.entity';
import { CreateFinanceDto } from '../dto/create-finance.dto';
import { FinanceResponseDto } from '../dto/finance-response.dto';

export class FinanceMapper {
  static toDomain(dto: CreateFinanceDto): Finance {
    return new Finance(
      dto.userId,
      dto.tipo,
      dto.descricao,
      dto.valor,
      dto.categoria,
      dto.dataTransacao,
    );
  }

  static toResponse(finance: Finance): FinanceResponseDto {
    return {
      id: finance.id,
      userId: finance.userId,
      tipo: finance.tipo,
      descricao: finance.descricao,
      valor: finance.valor,
      status: finance.status,
      dataTransacao: finance.dataTransacao,
      dataPagamento: finance.dataPagamento,
      categoria: finance.categoria,
      created: finance.created,
      updated: finance.updated,
    };
  }

  static toResponseArray(finances: Finance[]): FinanceResponseDto[] {
    return finances.map((finance) => this.toResponse(finance));
  }
}

