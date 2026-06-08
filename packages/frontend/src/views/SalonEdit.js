import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { fetchSalon, updateSalon } from '../api';
const PRICE_LEVELS = [
    { value: '', label: '— not set —' },
    { value: 'PRICE_LEVEL_FREE', label: 'Free' },
    { value: 'PRICE_LEVEL_INEXPENSIVE', label: '$ Inexpensive' },
    { value: 'PRICE_LEVEL_MODERATE', label: '$$ Moderate' },
    { value: 'PRICE_LEVEL_EXPENSIVE', label: '$$$ Expensive' },
    { value: 'PRICE_LEVEL_VERY_EXPENSIVE', label: '$$$$ Very expensive' },
];
const cx = {
    label: 'w-28 text-sm font-medium text-gray-500 shrink-0',
    field: 'flex-1 text-sm text-gray-900 border-0 focus:outline-none focus:ring-2 focus:ring-pink-400 rounded-lg px-2 py-1',
    error: 'text-xs text-red-500 mt-0.5 px-2',
    row: 'flex items-center gap-4 px-4 py-3',
};
export default function SalonEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { register, handleSubmit, reset, formState: { errors, isSubmitting, isLoading } } = useForm({
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
                priceLevel: (salon.priceLevel ?? ''),
                servicesRaw: salon.services.join(', '),
            };
        },
    });
    useEffect(() => { return () => reset(); }, [reset]);
    async function onSubmit(data) {
        await updateSalon(Number(id), {
            name: data.name || undefined,
            address: data.address || null,
            district: data.district || null,
            phoneNumber: data.phoneNumber || null,
            website: data.website || null,
            rating: data.rating !== '' ? Number(data.rating) : null,
            reviewCount: data.reviewCount !== '' ? Number(data.reviewCount) : null,
            priceLevel: data.priceLevel || null,
            services: data.servicesRaw.split(',').map(s => s.trim()).filter(Boolean),
        });
        navigate(`/salons/${id}`);
    }
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx("header", { className: "bg-white border-b border-gray-200 sticky top-0 z-10", children: _jsxs("div", { className: "max-w-2xl mx-auto px-4 py-4 flex items-center gap-3", children: [_jsx(Link, { to: `/salons/${id}`, className: "text-gray-400 hover:text-gray-600 transition-colors", children: _jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { d: "M15 19l-7-7 7-7", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2" }) }) }), _jsx("span", { className: "text-sm text-gray-500", children: "Edit salon" })] }) }), _jsx("div", { className: "max-w-2xl mx-auto px-4 py-6", children: isLoading ? (_jsx("div", { className: "animate-pulse space-y-4", children: Array.from({ length: 5 }, (_, i) => _jsx("div", { className: "h-12 bg-gray-200 rounded-lg" }, i)) })) : (_jsxs("form", { className: "space-y-4", onSubmit: handleSubmit(onSubmit), children: [_jsxs("div", { className: "bg-white rounded-xl border border-gray-200 divide-y divide-gray-100", children: [_jsxs("div", { className: "flex flex-col px-4 py-3", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("label", { className: cx.label, htmlFor: "name", children: "Name" }), _jsx("input", { id: "name", className: cx.field, type: "text", ...register('name', { required: 'Name is required' }) })] }), errors.name && _jsx("p", { className: cx.error, children: errors.name.message })] }), _jsxs("div", { className: cx.row, children: [_jsx("label", { className: cx.label, htmlFor: "district", children: "District" }), _jsx("input", { id: "district", className: cx.field, type: "text", ...register('district') })] }), _jsxs("div", { className: cx.row, children: [_jsx("label", { className: cx.label, htmlFor: "address", children: "Address" }), _jsx("input", { id: "address", className: cx.field, type: "text", ...register('address') })] }), _jsxs("div", { className: cx.row, children: [_jsx("label", { className: cx.label, htmlFor: "phoneNumber", children: "Phone" }), _jsx("input", { id: "phoneNumber", className: cx.field, type: "tel", ...register('phoneNumber') })] }), _jsxs("div", { className: "flex flex-col px-4 py-3", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("label", { className: cx.label, htmlFor: "website", children: "Website" }), _jsx("input", { id: "website", className: cx.field, type: "url", ...register('website', {
                                                        validate: v => !v || v.startsWith('http') || 'Must start with http:// or https://',
                                                    }) })] }), errors.website && _jsx("p", { className: cx.error, children: errors.website.message })] }), _jsxs("div", { className: "flex flex-col px-4 py-3", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("label", { className: cx.label, htmlFor: "rating", children: "Rating" }), _jsx("input", { id: "rating", className: cx.field, type: "number", step: "0.1", ...register('rating', {
                                                        min: { value: 0, message: 'Min 0' },
                                                        max: { value: 5, message: 'Max 5' },
                                                    }) })] }), errors.rating && _jsx("p", { className: cx.error, children: errors.rating.message })] }), _jsxs("div", { className: "flex flex-col px-4 py-3", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("label", { className: cx.label, htmlFor: "reviewCount", children: "Reviews" }), _jsx("input", { id: "reviewCount", className: cx.field, type: "number", ...register('reviewCount', {
                                                        min: { value: 0, message: 'Min 0' },
                                                    }) })] }), errors.reviewCount && _jsx("p", { className: cx.error, children: errors.reviewCount.message })] }), _jsxs("div", { className: cx.row, children: [_jsx("label", { className: cx.label, htmlFor: "priceLevel", children: "Price" }), _jsx("select", { id: "priceLevel", className: `${cx.field} bg-white`, ...register('priceLevel'), children: PRICE_LEVELS.map(p => _jsx("option", { value: p.value, children: p.label }, p.value)) })] }), _jsxs("div", { className: "flex items-start gap-4 px-4 py-3", children: [_jsx("label", { className: `${cx.label} mt-1`, htmlFor: "services", children: "Services" }), _jsx("textarea", { id: "services", className: "flex-1 text-sm text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 px-3 py-2 resize-none", placeholder: "manicure, pedicure, \u2026", rows: 2, ...register('servicesRaw') })] })] }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { disabled: isSubmitting, className: "flex-1 bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white font-medium py-2.5 rounded-lg transition-colors text-sm", type: "submit", children: isSubmitting ? 'Saving…' : 'Save changes' }), _jsx(Link, { to: `/salons/${id}`, className: "px-5 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-100 transition-colors", children: "Cancel" })] })] })) })] }));
}
