import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {SalonEntity} from './salon.entity';
import {SalonService} from './salon.service';
import {SalonController} from './salon.controller';

@Module({
    imports: [TypeOrmModule.forFeature([SalonEntity])],
    providers: [SalonService],
    controllers: [SalonController],
    exports: [SalonService],
})
export class SalonModule {
}
