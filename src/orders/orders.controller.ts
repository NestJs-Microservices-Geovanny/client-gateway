import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Inject,
  ParseUUIDPipe,
  Query,
  Patch,
} from '@nestjs/common';

import { NAST_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreateOrderDto, PaginationOrderDto, StatusDto } from './dto';
import { catchError, firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common';

@Controller('orders')
export class OrdersController {
  constructor(@Inject(NAST_SERVICE) private readonly client: ClientProxy) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    try {
      const order = await firstValueFrom(
        this.client.send('createOrder', createOrderDto),
      );
      return order;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationOrderDto) {
    try {
      const orders = await firstValueFrom(
        this.client.send('findAllOrders', paginationDto),
      );
      return orders;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get('id/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.client.send('findOneOrder', { id }).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Get(':status')
  async findAllByStatus(
    @Param() statusDto: StatusDto,
    @Query() paginatioDto: PaginationDto,
  ) {
    try {
      return this.client.send('findAllOrders', {
        ...paginatioDto,
        status: statusDto.status,
      });
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Patch(':id')
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() statusDto: StatusDto,
  ) {
    try {
      return this.client.send('changeOrderStatus', {
        id,
        status: statusDto.status,
      });
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
