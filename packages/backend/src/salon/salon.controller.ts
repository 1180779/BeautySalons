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
    ) {
        return this.salonService.findAll(district, service);
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
