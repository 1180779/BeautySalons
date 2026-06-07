const BASE = '/api';
export function resolvePhotoUrl(url) {
    if (url.startsWith('places/'))
        return `${BASE}/photos/${url.slice('places/'.length)}`;
    return url;
}
export async function fetchSalons(params) {
    const qs = new URLSearchParams();
    if (params?.district)
        qs.set('district', params.district);
    if (params?.service)
        qs.set('service', params.service);
    if (params?.page)
        qs.set('page', String(params.page));
    if (params?.pageSize)
        qs.set('pageSize', String(params.pageSize));
    const url = `${BASE}/salons${qs.size ? '?' + qs : ''}`;
    const res = await fetch(url);
    if (!res.ok)
        throw new Error(`${res.status}`);
    return res.json();
}
export async function fetchSalon(id) {
    const res = await fetch(`${BASE}/salons/${id}`);
    if (!res.ok)
        throw new Error(`${res.status}`);
    return res.json();
}
export async function updateSalon(id, dto) {
    const res = await fetch(`${BASE}/salons/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto),
    });
    if (!res.ok)
        throw new Error(`${res.status}`);
    return res.json();
}
