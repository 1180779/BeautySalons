import {FormEvent, useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {fetchSalon, updateSalon} from '../api';
import type {PriceLevel} from '@beauty-salons/shared';

const PRICE_LEVELS = [
    {value: '', label: '— not set —'},
    {value: 'PRICE_LEVEL_FREE', label: 'Free'},
    {value: 'PRICE_LEVEL_INEXPENSIVE', label: '$ Inexpensive'},
    {value: 'PRICE_LEVEL_MODERATE', label: '$$ Moderate'},
    {value: 'PRICE_LEVEL_EXPENSIVE', label: '$$$ Expensive'},
    {value: 'PRICE_LEVEL_VERY_EXPENSIVE', label: '$$$$ Very expensive'},
];

const fieldClass = 'flex-1 text-sm text-gray-900 border-0 focus:outline-none focus:ring-2 focus:ring-pink-400 rounded-lg px-2 py-1';

export default function SalonEdit() {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [district, setDistrict] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [website, setWebsite] = useState('');
    const [rating, setRating] = useState('');
    const [reviewCount, setReviewCount] = useState('');
    const [priceLevel, setPriceLevel] = useState('');
    const [servicesRaw, setServicesRaw] = useState('');

    useEffect(() => {
        fetchSalon(Number(id))
            .then(salon => {
                setName(salon.name);
                setAddress(salon.address ?? '');
                setDistrict(salon.district ?? '');
                setPhoneNumber(salon.phoneNumber ?? '');
                setWebsite(salon.website ?? '');
                setRating(salon.rating != null ? String(salon.rating) : '');
                setReviewCount(salon.reviewCount != null ? String(salon.reviewCount) : '');
                setPriceLevel((salon.priceLevel ?? '') as string);
                setServicesRaw(salon.services.join(', '));
            })
            .catch(e => setError(String(e)))
            .finally(() => setLoading(false));
    }, [id]);

    async function save(e: FormEvent) {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            await updateSalon(Number(id), {
                name: name || undefined,
                address: address || null,
                district: district || null,
                phoneNumber: phoneNumber || null,
                website: website || null,
                rating: rating !== '' ? Number(rating) : null,
                reviewCount: reviewCount !== '' ? Number(reviewCount) : null,
                priceLevel: (priceLevel as unknown as PriceLevel) || null,
                services: servicesRaw.split(',').map(s => s.trim()).filter(Boolean),
            });
            navigate(`/salons/${id}`);
        } catch (e) {
            setError(String(e));
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
                    <Link to={`/salons/${id}`} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                        </svg>
                    </Link>
                    <span className="text-sm text-gray-500">Edit salon</span>
                </div>
            </header>

            <div className="max-w-2xl mx-auto px-4 py-6">
                {loading ? (
                    <div className="animate-pulse space-y-4">
                        {Array.from({length: 5}, (_, i) => <div key={i} className="h-12 bg-gray-200 rounded-lg"/>)}
                    </div>
                ) : (
                    <>
                        {error && (
                            <p className="text-red-500 text-sm mb-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</p>
                        )}

                        <form className="space-y-4" onSubmit={save}>
                            <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
                                <div className="flex items-center gap-4 px-4 py-3">
                                    <label className="w-28 text-sm font-medium text-gray-500 shrink-0"
                                           htmlFor="name">Name</label>
                                    <input id="name" value={name} onChange={e => setName(e.target.value)}
                                           className={fieldClass} required type="text"/>
                                </div>
                                <div className="flex items-center gap-4 px-4 py-3">
                                    <label className="w-28 text-sm font-medium text-gray-500 shrink-0"
                                           htmlFor="district">District</label>
                                    <input id="district" value={district} onChange={e => setDistrict(e.target.value)}
                                           className={fieldClass} type="text"/>
                                </div>
                                <div className="flex items-center gap-4 px-4 py-3">
                                    <label className="w-28 text-sm font-medium text-gray-500 shrink-0"
                                           htmlFor="address">Address</label>
                                    <input id="address" value={address} onChange={e => setAddress(e.target.value)}
                                           className={fieldClass} type="text"/>
                                </div>
                                <div className="flex items-center gap-4 px-4 py-3">
                                    <label className="w-28 text-sm font-medium text-gray-500 shrink-0"
                                           htmlFor="phoneNumber">Phone</label>
                                    <input id="phoneNumber" value={phoneNumber}
                                           onChange={e => setPhoneNumber(e.target.value)} className={fieldClass}
                                           type="tel"/>
                                </div>
                                <div className="flex items-center gap-4 px-4 py-3">
                                    <label className="w-28 text-sm font-medium text-gray-500 shrink-0"
                                           htmlFor="website">Website</label>
                                    <input id="website" value={website} onChange={e => setWebsite(e.target.value)}
                                           className={fieldClass} type="url"/>
                                </div>
                                <div className="flex items-center gap-4 px-4 py-3">
                                    <label className="w-28 text-sm font-medium text-gray-500 shrink-0"
                                           htmlFor="rating">Rating</label>
                                    <input id="rating" value={rating} onChange={e => setRating(e.target.value)}
                                           className={fieldClass} max="5" min="0" step="0.1" type="number"/>
                                </div>
                                <div className="flex items-center gap-4 px-4 py-3">
                                    <label className="w-28 text-sm font-medium text-gray-500 shrink-0"
                                           htmlFor="reviewCount">Reviews</label>
                                    <input id="reviewCount" value={reviewCount}
                                           onChange={e => setReviewCount(e.target.value)} className={fieldClass} min="0"
                                           type="number"/>
                                </div>
                                <div className="flex items-center gap-4 px-4 py-3">
                                    <label className="w-28 text-sm font-medium text-gray-500 shrink-0"
                                           htmlFor="priceLevel">Price</label>
                                    <select id="priceLevel" value={priceLevel}
                                            onChange={e => setPriceLevel(e.target.value)}
                                            className={`${fieldClass} bg-white`}>
                                        {PRICE_LEVELS.map(p => <option key={p.value}
                                                                       value={p.value}>{p.label}</option>)}
                                    </select>
                                </div>
                                <div className="flex items-start gap-4 px-4 py-3">
                                    <label className="w-28 text-sm font-medium text-gray-500 shrink-0 mt-1"
                                           htmlFor="services">Services</label>
                                    <textarea
                                        id="services"
                                        value={servicesRaw}
                                        onChange={e => setServicesRaw(e.target.value)}
                                        className="flex-1 text-sm text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 px-3 py-2 resize-none"
                                        placeholder="manicure, pedicure, …"
                                        rows={2}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    disabled={saving}
                                    className="flex-1 bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white font-medium py-2.5 rounded-lg transition-colors text-sm"
                                    type="submit"
                                >
                                    {saving ? 'Saving…' : 'Save changes'}
                                </button>
                                <Link
                                    to={`/salons/${id}`}
                                    className="px-5 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-100 transition-colors"
                                >
                                    Cancel
                                </Link>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
