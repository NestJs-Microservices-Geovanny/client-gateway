import { IsEnum, IsOptional } from 'class-validator';
import { OrderStatus, OrderStatusList } from '../enum/orders.enum';
import { PaginationDto } from 'src/common';

export class PaginationOrderDto extends PaginationDto {
  @IsOptional()
  @IsEnum(OrderStatusList, {
    message: `Valid status values are: ${OrderStatusList}`,
  })
  status: OrderStatus;
}
