import {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import clsx from 'clsx';
import {fetchSalon, resolvePhotoUrl} from '../api';
import type {Salon} from '@beauty-salons/shared';

const cx = {
    badge: 'text-sm bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-full',
    infoRow: 'flex gap-3 px-4 py-3',
    infoIcon: 'w-4 h-4 text-gray-400 mt-0.5 shrink-0',
};

function priceLabel(p: number | null | undefined) {
    const labels = ['', 'Free', '$', '$$', '$$$', '$$$$'];
    return p != null && p > 0 ? (labels[p] ?? null) : null;
}

export default function SalonDetail() {
    const {id} = useParams<{ id: string }>();
    const [salon, setSalon] = useState<Salon | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchSalon(Number(id))
            .then(setSalon)
            .catch(e => setError(String(e)))
            .finally(() => setLoading(false));
    }, [id]);

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
                    <Link to="/" className="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                        </svg>
                    </Link>
                    <span className="text-sm text-gray-500">Back to list</span>
                </div>
            </header>

            <div className="max-w-3xl mx-auto px-4 py-6">
                {loading ? (
                    <div className="animate-pulse space-y-4">
                        <div className="h-56 bg-gray-200 rounded-xl"/>
                        <div className="h-6 bg-gray-200 rounded w-1/2"/>
                        <div className="h-4 bg-gray-100 rounded w-1/3"/>
                    </div>
                ) : error ? (
                    <p className="text-red-500 text-sm">{error}</p>
                ) : salon && (
                    <>
                        <div className="mb-6">
                            {salon.photos?.length ? (
                                <div
                                    className={clsx('grid gap-2', salon.photos.length === 1 ? 'grid-cols-1' : 'grid-cols-2')}>
                                    {salon.photos.slice(0, 4).map((photo, i) => {
                                        const isHero = i === 0 && salon.photos.length > 1;
                                        return (
                                            <div key={i}
                                                 className={clsx('relative overflow-hidden rounded-xl', isHero && 'col-span-2')}>
                                                <img
                                                    alt={`${salon.name} photo ${i + 1}`}
                                                    src={resolvePhotoUrl(photo.url)}
                                                    className={clsx('w-full object-cover', isHero ? 'h-56' : 'h-36')}
                                                    onError={e => (e.currentTarget.parentElement!.style.display = 'none')}
                                                />
                                                {photo.attributions?.length > 0 && (
                                                    <div
                                                        className="absolute bottom-0 left-0 right-0 bg-black/40 px-2 py-1 flex items-center gap-1.5">
                                                        {photo.attributions[0].photoUri && (
                                                            <img
                                                                alt={photo.attributions[0].displayName}
                                                                src={photo.attributions[0].photoUri}
                                                                className="w-4 h-4 rounded-full object-cover"
                                                            />
                                                        )}
                                                        <a
                                                            href={photo.attributions[0].uri}
                                                            className="text-white/80 text-xs truncate hover:text-white"
                                                            rel="noopener"
                                                            target="_blank"
                                                        >
                                                            {photo.attributions[0].displayName}
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div
                                    className="h-56 bg-linear-to-br from-pink-100 to-purple-100 rounded-xl flex items-center justify-center">
                                    <svg className="w-16 h-16 text-pink-300" fill="none" stroke="currentColor"
                                         viewBox="0 0 24 24">
                                        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" strokeLinecap="round"
                                              strokeLinejoin="round" strokeWidth="1.5"/>
                                        <polyline points="9 22 9 12 15 12 15 22" strokeLinecap="round"
                                                  strokeLinejoin="round" strokeWidth="1.5"/>
                                    </svg>
                                </div>
                            )}
                        </div>

                        <div className="flex items-start justify-between gap-4 mb-6">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 leading-tight">{salon.name}</h1>
                                {salon.district && (
                                    <p className="text-sm text-gray-400 mt-1 flex items-center gap-1">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor"
                                             viewBox="0 0 24 24">
                                            <path
                                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                                strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                                            <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round"
                                                  strokeLinejoin="round" strokeWidth="2"/>
                                        </svg>
                                        {salon.district}
                                    </p>
                                )}
                            </div>
                            <Link
                                to={`/salons/${salon.id}/edit`}
                                className="shrink-0 text-sm font-medium bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg transition-colors"
                            >
                                Edit
                            </Link>
                        </div>

                        <div className="flex flex-wrap gap-3 mb-6">
                            {salon.rating != null && (
                                <span
                                    className="flex items-center gap-1.5 text-sm font-medium text-amber-700 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-full">
                                    <svg className="w-4 h-4 fill-amber-400" viewBox="0 0 20 20">
                                        <path
                                            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                    </svg>
                                    {salon.rating.toFixed(1)}
                                    <span className="font-normal text-amber-500">({salon.reviewCount ?? 0})</span>
                                </span>
                            )}
                            {priceLabel(salon.priceLevel) && (
                                <span className={cx.badge}>{priceLabel(salon.priceLevel)}</span>
                            )}
                            {(salon.priceRange?.startPrice != null || salon.priceRange?.endPrice != null) && (
                                <span className={cx.badge}>
                                    {salon.priceRange.currency ?? ''}{' '}
                                    {salon.priceRange.startPrice ?? ''}
                                    {salon.priceRange.startPrice != null && salon.priceRange.endPrice != null ? '–' : ''}
                                    {salon.priceRange.endPrice ?? ''}
                                </span>
                            )}
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 mb-6">
                            {salon.address && (
                                <div className={cx.infoRow}>
                                    <svg className={cx.infoIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                            strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                                        <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round"
                                              strokeLinejoin="round" strokeWidth="2"/>
                                    </svg>
                                    <span className="text-sm text-gray-700">{salon.address}</span>
                                </div>
                            )}
                            {salon.phoneNumber && (
                                <div className={cx.infoRow}>
                                    <svg className={cx.infoIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                            strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                                    </svg>
                                    <a href={`tel:${salon.phoneNumber}`}
                                       className="text-sm text-pink-600 hover:underline">{salon.phoneNumber}</a>
                                </div>
                            )}
                            {salon.website && (
                                <div className={cx.infoRow}>
                                    <svg className={cx.infoIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                                            strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                                    </svg>
                                    <a href={salon.website} className="text-sm text-pink-600 hover:underline truncate"
                                       rel="noopener" target="_blank">{salon.website}</a>
                                </div>
                            )}
                        </div>

                        {salon.services.length > 0 && (
                            <div className="mb-6">
                                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Services</h2>
                                <div className="flex flex-wrap gap-2">
                                    {salon.services.map(svc => (
                                        <span key={svc}
                                              className="text-sm bg-pink-50 text-pink-700 border border-pink-100 px-3 py-1 rounded-full">
                                            {svc}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}