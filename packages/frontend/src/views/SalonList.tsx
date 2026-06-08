import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import clsx from 'clsx';
import {fetchSalons, resolvePhotoUrl} from '../api';
import type {SalonListItem} from '@beauty-salons/shared';

const PAGE_SIZE = 12;

function priceLabel(p: number | null | undefined) {
    const labels = ['', 'Free', '$', '$$', '$$$', '$$$$'];
    return p != null && p > 0 ? (labels[p] ?? null) : null;
}

export default function SalonList() {
    const [items, setItems] = useState<SalonListItem[]>([]);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [districtInput, setDistrictInput] = useState('');
    const [serviceInput, setServiceInput] = useState('');
    const [appliedDistrict, setAppliedDistrict] = useState('');
    const [appliedService, setAppliedService] = useState('');

    async function load(p: number, district: string, service: string) {
        setLoading(true);
        setError('');
        try {
            const result = await fetchSalons({
                district: district || undefined,
                service: service || undefined,
                page: p,
                pageSize: PAGE_SIZE,
            });
            setItems(result.items);
            setTotal(result.total);
            setTotalPages(result.totalPages);
            setPage(result.page);
        } catch (e) {
            setError(String(e));
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load(1, '', '');
    }, []);

    function applyFilters(e: { preventDefault(): void }) {
        e.preventDefault();
        setAppliedDistrict(districtInput);
        setAppliedService(serviceInput);
        load(1, districtInput, serviceInput);
    }

    function clearFilters() {
        setDistrictInput('');
        setServiceInput('');
        setAppliedDistrict('');
        setAppliedService('');
        load(1, '', '');
    }

    function goToPage(p: number) {
        load(p, appliedDistrict, appliedService);
        window.scrollTo({top: 0, behavior: 'smooth'});
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold text-gray-900 tracking-tight">Warsaw Beauty Salons</h1>
                    <span className="text-sm text-gray-500">{total} salons</span>
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-4 py-6">
                <form className="flex flex-wrap gap-3 mb-6" onSubmit={applyFilters}>
                    <input
                        value={districtInput}
                        onChange={e => setDistrictInput(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm flex-1 min-w-40 focus:outline-none focus:ring-2 focus:ring-pink-400"
                        placeholder="District (e.g. Mokotów)"
                    />
                    <input
                        value={serviceInput}
                        onChange={e => setServiceInput(e.target.value)}
                        placeholder="Service (e.g. manicure)"
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm flex-1 min-w-40 focus:outline-none focus:ring-2 focus:ring-pink-400"
                    />
                    <button
                        type="submit"
                        className="bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
                    >
                        Filter
                    </button>
                    {(appliedDistrict || appliedService) && (
                        <button
                            type="button"
                            className="text-sm text-gray-500 hover:text-gray-700 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                            onClick={clearFilters}
                        >
                            Clear
                        </button>
                    )}
                </form>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Array.from({length: PAGE_SIZE}, (_, i) => (
                            <div key={i}
                                 className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
                                <div className="h-44 bg-gray-200"/>
                                <div className="p-4 space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-3/4"/>
                                    <div className="h-3 bg-gray-100 rounded w-1/2"/>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <p className="text-red-500 text-sm">{error}</p>
                ) : !items.length ? (
                    <p className="text-gray-500 text-sm">No salons found.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {items.map(s => (
                            <Link
                                key={s.id}
                                to={`/salons/${s.id}`}
                                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all group"
                            >
                                <div className="h-44 bg-linear-to-br from-pink-100 to-purple-100 overflow-hidden">
                                    {s.photos?.[0] ? (
                                        <img
                                            alt={s.name}
                                            src={resolvePhotoUrl(s.photos[0].url)}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <svg className="w-12 h-12 text-pink-300" fill="none" stroke="currentColor"
                                                 viewBox="0 0 24 24">
                                                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                                                      strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/>
                                                <polyline points="9 22 9 12 15 12 15 22" strokeLinecap="round"
                                                          strokeLinejoin="round" strokeWidth="1.5"/>
                                            </svg>
                                        </div>
                                    )}
                                </div>

                                <div className="p-4">
                                    <h2 className="font-semibold text-gray-900 text-sm group-hover:text-pink-600 transition-colors line-clamp-1">
                                        {s.name}
                                    </h2>
                                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{s.address ?? s.district ?? '—'}</p>

                                    <div className="flex items-center gap-2 mt-3">
                                        {s.rating != null && (
                                            <span
                                                className="flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                                                <svg className="w-3 h-3 fill-amber-400" viewBox="0 0 20 20">
                                                    <path
                                                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                                </svg>
                                                {s.rating.toFixed(1)}
                                            </span>
                                        )}
                                        {s.reviewCount != null &&
                                            <span className="text-xs text-gray-400">({s.reviewCount})</span>}
                                        {priceLabel(s.priceLevel) && (
                                            <span
                                                className="ml-auto text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                                {priceLabel(s.priceLevel)}
                                            </span>
                                        )}
                                    </div>

                                    {s.district && (
                                        <p className="mt-2 text-xs text-gray-400 flex items-center gap-1">
                                            <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor"
                                                 viewBox="0 0 24 24">
                                                <path
                                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                                    strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                                                <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round"
                                                      strokeLinejoin="round" strokeWidth="2"/>
                                            </svg>
                                            {s.district}
                                        </p>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {!loading && totalPages > 1 && (
                    <div className="flex items-center justify-center gap-1 mt-8">
                        <button
                            disabled={page === 1}
                            className="px-3 py-1.5 rounded-lg text-sm border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            onClick={() => goToPage(page - 1)}
                        >←
                        </button>

                        {Array.from({length: totalPages}, (_, i) => i + 1).map(p => {
                            if (Math.abs(p - page) <= 2 || p === 1 || p === totalPages) {
                                return (
                                    <button
                                        key={p}
                                        className={clsx('min-w-9 px-3 py-1.5 rounded-lg text-sm border transition-colors', p === page ? 'bg-pink-500 border-pink-500 text-white font-medium' : 'border-gray-200 text-gray-600 hover:bg-gray-100')}
                                        onClick={() => goToPage(p)}
                                    >{p}</button>
                                );
                            }
                            if (Math.abs(p - page) === 3) {
                                return <span key={p} className="px-1 text-gray-400 text-sm">...</span>;
                            }
                            return null;
                        })}

                        <button
                            disabled={page === totalPages}
                            className="px-3 py-1.5 rounded-lg text-sm border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            onClick={() => goToPage(page + 1)}
                        >→
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
