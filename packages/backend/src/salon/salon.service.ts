import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import type {SalonPage, UpdateSalonDto} from '@beauty-salons/shared';
import {SalonEntity} from './salon.entity';

@Injectable()
export class SalonService {
    constructor(
        @InjectRepository(SalonEntity)
        private readonly repo: Repository<SalonEntity>,
    ) {
    }

    async findAll(district?: string, service?: string, page = 1, pageSize = 12): Promise<SalonPage> {
        const qb = this.repo
            .createQueryBuilder('s')
            .select(['s.id', 's.name', 's.district', 's.rating', 's.reviewCount', 's.priceLevel', 's.address']);

        if (district) qb.andWhere('s.district = :district', {district});
        if (service) qb.andWhere(':service = ANY(s.services)', {service});

        qb.orderBy('s.rating', 'DESC', 'NULLS LAST');
        qb.skip((page - 1) * pageSize).take(pageSize);

        const [rows, total] = await qb.getManyAndCount();
        const items = rows.map(r => ({
            id: r.id, name: r.name, district: r.district,
            rating: r.rating, reviewCount: r.reviewCount,
            priceLevel: r.priceLevel, address: r.address,
        }));

        return {items, total, page, pageSize, totalPages: Math.ceil(total / pageSize)};
    }

    async findOne(id: number): Promise<SalonEntity> {
        const salon = await this.repo.findOneBy({id});
        if (!salon) throw new NotFoundException(`Salon #${id} not found`);
        return salon;
    }

    async update(id: number, dto: UpdateSalonDto): Promise<SalonEntity> {
        const salon = await this.findOne(id);
        Object.assign(salon, dto);
        return this.repo.save(salon);
    }
}
