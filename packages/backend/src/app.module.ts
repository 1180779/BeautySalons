import {Module} from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {TypeOrmModule} from '@nestjs/typeorm';
import {SalonModule} from './salon/salon.module';
import {SalonEntity} from './salon/salon.entity';

@Module({
    imports: [
        ConfigModule.forRoot({isGlobal: true}),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (cfg: ConfigService) => ({
                type: 'postgres',
                host: cfg.get('POSTGRES_HOST', 'localhost'),
                port: cfg.get<number>('POSTGRES_PORT', 5432),
                username: cfg.get('POSTGRES_USER', 'beauty'),
                password: cfg.get('POSTGRES_PASSWORD', 'beauty'),
                database: cfg.get('POSTGRES_DB', 'beauty_salons'),
                entities: [SalonEntity],
                synchronize: false,
            }),
        }),
        SalonModule,
    ],
})
export class AppModule {
}
