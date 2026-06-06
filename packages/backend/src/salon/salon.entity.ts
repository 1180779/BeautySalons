import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import type {PriceRange} from '@beauty-salons/shared';
import {PriceLevel} from '@beauty-salons/shared';

@Entity('salons')
export class SalonEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', unique: true})
    placeId: string;

    @Column({type: 'varchar'})
    name: string;

    @Column({type: 'varchar', nullable: true})
    address: string | null;

    @Column({type: 'varchar', nullable: true})
    district: string | null;

    @Column({type: 'varchar', nullable: true})
    phoneNumber: string | null;

    @Column({type: 'varchar', nullable: true})
    website: string | null;

    @Column({type: 'text', array: true, default: '{}'})
    services: string[];

    @Column({type: 'varchar', nullable: true})
    primaryType: string | null;

    @Column({type: 'smallint', nullable: true})
    priceLevel: PriceLevel | null;

    @Column({type: 'jsonb', nullable: true})
    priceRange: PriceRange | null;

    @Column({type: 'float', nullable: true})
    rating: number | null;

    @Column({type: 'int', nullable: true})
    reviewCount: number | null;

    @Column({type: 'float', nullable: true})
    latitude: number | null;

    @Column({type: 'float', nullable: true})
    longitude: number | null;

    @Column({type: 'text', array: true, nullable: true})
    openingHours: string[] | null;

    @Column({type: 'text', array: true, default: '{}'})
    photos: string[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
