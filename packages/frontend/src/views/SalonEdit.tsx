import {useEffect} from 'react';
import {useForm} from 'react-hook-form';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {fetchSalon, updateSalon} from '../api';
import {PriceLevel} from '@beauty-salons/shared';

const PRICE_LEVELS = [
    {value: '', label: '— not set —'},
    {value: 'PRICE_LEVEL_FREE', label: 'Free'},
    {value: 'PRICE_LEVEL_INEXPENSIVE', label: '$ Inexpensive'},
    {value: 'PRICE_LEVEL_MODERATE', label: '$$ Moderate'},
    {value: 'PRICE_LEVEL_EXPENSIVE', label: '$$$ Expensive'},
    {value: 'PRICE_LEVEL_VERY_EXPENSIVE', label: '$$$$ Very expensive'},
];

const cx = {
    label: 'w-28 text-sm font-medium text-gray-500 shrink-0',
    field: 'flex-1 text-sm text-gray-900 border-0 focus:outline-none focus:ring-2 focus:ring-pink-400 rounded-lg px-2 py-1',
    error: 'text-xs text-red-500 mt-0.5 px-2',
    row: 'flex items-center gap-4 px-4 py-3',
};

interface FormValues {
    name: string;
    address: string;
    district: string;
    phoneNumber: string;
    website: string;
    rating: string;
    reviewCount: string;
    priceLevel: string;
    servicesRaw: string;
}

export default function SalonEdit() {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();

    const {register, handleSubmit, reset, formState: {errors, isSubmitting, isLoading}} = useForm<FormValues>({
        defaultValues: async () => {
            const salon = await fetchSalon(Number(id));
            return {
                name: salon.name,
                address: salon.address ?? '',
                district: salon.district ?? '',
                phoneNumber: salon.phoneNumber ?? '',
                website: salon.website ?? '',
                rating: salon.rating != null ? String(salon.rating) : '',
                reviewCount: salon.reviewCount != null ? String(salon.reviewCount) : '',
                priceLevel: salon.priceLevel != null ? PriceLevel[salon.priceLevel] : '',
                servicesRaw: salon.services.join(', '),
            };
        },
    });

    useEffect(() => {
        return () => reset();
    }, [reset]);

    async function onSubmit(data: FormValues) {
        await updateSalon(Number(id), {
            name: data.name || undefined,
            address: data.address || null,
            district: data.district || null,
            phoneNumber: data.phoneNumber || null,
            website: data.website || null,
            rating: data.rating !== '' ? Number(data.rating) : null,
            reviewCount: data.reviewCount !== '' ? Number(data.reviewCount) : null,
            priceLevel: data.priceLevel ? PriceLevel[data.priceLevel as keyof typeof PriceLevel] : null,
            services: data.servicesRaw.split(',').map(s => s.trim()).filter(Boolean),
        });
        navigate(`/salons/${id}`);
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
                {isLoading ? (
                    <div className="animate-pulse space-y-4">
                        {Array.from({length: 5}, (_, i) => <div key={i} className="h-12 bg-gray-200 rounded-lg"/>)}
                    </div>
                ) : (
                    <form className="space-y-4"
                          onSubmit={handleSubmit(onSubmit, errors => console.log('validation errors:', errors))}>
                        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
                            <div className="flex flex-col px-4 py-3">
                                <div className="flex items-center gap-4">
                                    <label className={cx.label} htmlFor="name">Name</label>
                                    <input id="name" className={cx.field} type="text"
                                           {...register('name', {required: 'Name is required'})}/>
                                </div>
                                {errors.name && <p className={cx.error}>{errors.name.message}</p>}
                            </div>
                            <div className={cx.row}>
                                <label className={cx.label} htmlFor="district">District</label>
                                <input id="district" className={cx.field} type="text" {...register('district')}/>
                            </div>
                            <div className={cx.row}>
                                <label className={cx.label} htmlFor="address">Address</label>
                                <input id="address" className={cx.field} type="text" {...register('address')}/>
                            </div>
                            <div className={cx.row}>
                                <label className={cx.label} htmlFor="phoneNumber">Phone</label>
                                <input id="phoneNumber" className={cx.field} type="tel" {...register('phoneNumber')}/>
                            </div>
                            <div className="flex flex-col px-4 py-3">
                                <div className="flex items-center gap-4">
                                    <label className={cx.label} htmlFor="website">Website</label>
                                    <input id="website" className={cx.field} type="url"
                                           {...register('website', {
                                               validate: v => !v || v.startsWith('http') || 'Must start with http:// or https://',
                                           })}/>
                                </div>
                                {errors.website && <p className={cx.error}>{errors.website.message}</p>}
                            </div>
                            <div className="flex flex-col px-4 py-3">
                                <div className="flex items-center gap-4">
                                    <label className={cx.label} htmlFor="rating">Rating</label>
                                    <input id="rating" className={cx.field} type="number" step="0.1"
                                           {...register('rating', {
                                               min: {value: 1, message: 'Min 1'},
                                               max: {value: 5, message: 'Max 5'},
                                           })}/>
                                </div>
                                {errors.rating && <p className={cx.error}>{errors.rating.message}</p>}
                            </div>
                            <div className="flex flex-col px-4 py-3">
                                <div className="flex items-center gap-4">
                                    <label className={cx.label} htmlFor="reviewCount">Reviews</label>
                                    <input id="reviewCount" className={cx.field} type="number"
                                           {...register('reviewCount', {
                                               min: {value: 0, message: 'Min 0'},
                                           })}/>
                                </div>
                                {errors.reviewCount && <p className={cx.error}>{errors.reviewCount.message}</p>}
                            </div>
                            <div className={cx.row}>
                                <label className={cx.label} htmlFor="priceLevel">Price</label>
                                <select id="priceLevel" className={`${cx.field} bg-white`} {...register('priceLevel')}>
                                    {PRICE_LEVELS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                                </select>
                            </div>
                            <div className="flex items-start gap-4 px-4 py-3">
                                <label className={`${cx.label} mt-1`} htmlFor="services">Services</label>
                                <textarea
                                    id="services"
                                    className="flex-1 text-sm text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 px-3 py-2 resize-none"
                                    placeholder="manicure, pedicure, …"
                                    rows={2}
                                    {...register('servicesRaw')}
                                />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                disabled={isSubmitting}
                                className="flex-1 bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white font-medium py-2.5 rounded-lg transition-colors text-sm"
                                type="submit"
                            >
                                {isSubmitting ? 'Saving…' : 'Save changes'}
                            </button>
                            <Link
                                to={`/salons/${id}`}
                                className="px-5 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-100 transition-colors"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}