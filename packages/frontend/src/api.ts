import type {Salon, SalonListItem, UpdateSalonDto} from '@beauty-salons/shared';

const BASE = '/api';

export async function fetchSalons(params?: { district?: string; service?: string }): Promise<SalonListItem[]> {
    const qs = new URLSearchParams();
    if (params?.district) qs.set('district', params.district);
    if (params?.service) qs.set('service', params.service);
    const url = `${BASE}/salons${qs.size ? '?' + qs : ''}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${res.status}`);
    return res.json();
}

export async function fetchSalon(id: number): Promise<Salon> {
    const res = await fetch(`${BASE}/salons/${id}`);
    if (!res.ok) throw new Error(`${res.status}`);
    return res.json();
}

export async function updateSalon(id: number, dto: UpdateSalonDto): Promise<Salon> {
    const res = await fetch(`${BASE}/salons/${id}`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(dto),
    });
    if (!res.ok) throw new Error(`${res.status}`);
    return res.json();
}
