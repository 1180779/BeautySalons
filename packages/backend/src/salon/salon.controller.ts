import {Body, Controller, Get, Param, ParseIntPipe, Patch, Query} from '@nestjs/common';
import {SalonService} from './salon.service';
import type {UpdateSalonDto} from '@beauty-salons/shared';

@Controller('salons')
export class SalonController {
    constructor(private readonly salonService: SalonService) {
    }

    @Get()
    findAll(
        @Query('district') district?: string,
        @Query('service') service?: string,
        @Query('page') page?: string,
        @Query('pageSize') pageSize?: string,
    ) {
        return this.salonService.findAll(
            district,
            service,
            page ? parseInt(page, 10) : 1,
            pageSize ? parseInt(pageSize, 10) : 12,
        );
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.salonService.findOne(id);
    }

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateSalonDto,
    ) {
        return this.salonService.update(id, dto);
    }
}
