import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
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
const fieldClass = 'flex-1 text-sm text-gray-900 border-0 focus:outline-none focus:ring-2 focus:ring-pink-400 rounded-lg px-2 py-1';
export default function SalonEdit() {
    const { id } = useParams();
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
            setPriceLevel((salon.priceLevel ?? ''));
            setServicesRaw(salon.services.join(', '));
        })
            .catch(e => setError(String(e)))
            .finally(() => setLoading(false));
    }, [id]);
    async function save(e) {
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
                priceLevel: priceLevel || null,
                services: servicesRaw.split(',').map(s => s.trim()).filter(Boolean),
            });
            navigate(`/salons/${id}`);
        }
        catch (e) {
            setError(String(e));
        }
        finally {
            setSaving(false);
        }
    }
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx("header", { className: "bg-white border-b border-gray-200 sticky top-0 z-10", children: _jsxs("div", { className: "max-w-2xl mx-auto px-4 py-4 flex items-center gap-3", children: [_jsx(Link, { to: `/salons/${id}`, className: "text-gray-400 hover:text-gray-600 transition-colors", children: _jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { d: "M15 19l-7-7 7-7", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2" }) }) }), _jsx("span", { className: "text-sm text-gray-500", children: "Edit salon" })] }) }), _jsx("div", { className: "max-w-2xl mx-auto px-4 py-6", children: loading ? (_jsx("div", { className: "animate-pulse space-y-4", children: Array.from({ length: 5 }, (_, i) => _jsx("div", { className: "h-12 bg-gray-200 rounded-lg" }, i)) })) : (_jsxs(_Fragment, { children: [error && (_jsx("p", { className: "text-red-500 text-sm mb-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3", children: error })), _jsxs("form", { className: "space-y-4", onSubmit: save, children: [_jsxs("div", { className: "bg-white rounded-xl border border-gray-200 divide-y divide-gray-100", children: [_jsxs("div", { className: "flex items-center gap-4 px-4 py-3", children: [_jsx("label", { className: "w-28 text-sm font-medium text-gray-500 shrink-0", htmlFor: "name", children: "Name" }), _jsx("input", { id: "name", value: name, onChange: e => setName(e.target.value), className: fieldClass, required: true, type: "text" })] }), _jsxs("div", { className: "flex items-center gap-4 px-4 py-3", children: [_jsx("label", { className: "w-28 text-sm font-medium text-gray-500 shrink-0", htmlFor: "district", children: "District" }), _jsx("input", { id: "district", value: district, onChange: e => setDistrict(e.target.value), className: fieldClass, type: "text" })] }), _jsxs("div", { className: "flex items-center gap-4 px-4 py-3", children: [_jsx("label", { className: "w-28 text-sm font-medium text-gray-500 shrink-0", htmlFor: "address", children: "Address" }), _jsx("input", { id: "address", value: address, onChange: e => setAddress(e.target.value), className: fieldClass, type: "text" })] }), _jsxs("div", { className: "flex items-center gap-4 px-4 py-3", children: [_jsx("label", { className: "w-28 text-sm font-medium text-gray-500 shrink-0", htmlFor: "phoneNumber", children: "Phone" }), _jsx("input", { id: "phoneNumber", value: phoneNumber, onChange: e => setPhoneNumber(e.target.value), className: fieldClass, type: "tel" })] }), _jsxs("div", { className: "flex items-center gap-4 px-4 py-3", children: [_jsx("label", { className: "w-28 text-sm font-medium text-gray-500 shrink-0", htmlFor: "website", children: "Website" }), _jsx("input", { id: "website", value: website, onChange: e => setWebsite(e.target.value), className: fieldClass, type: "url" })] }), _jsxs("div", { className: "flex items-center gap-4 px-4 py-3", children: [_jsx("label", { className: "w-28 text-sm font-medium text-gray-500 shrink-0", htmlFor: "rating", children: "Rating" }), _jsx("input", { id: "rating", value: rating, onChange: e => setRating(e.target.value), className: fieldClass, max: "5", min: "0", step: "0.1", type: "number" })] }), _jsxs("div", { className: "flex items-center gap-4 px-4 py-3", children: [_jsx("label", { className: "w-28 text-sm font-medium text-gray-500 shrink-0", htmlFor: "reviewCount", children: "Reviews" }), _jsx("input", { id: "reviewCount", value: reviewCount, onChange: e => setReviewCount(e.target.value), className: fieldClass, min: "0", type: "number" })] }), _jsxs("div", { className: "flex items-center gap-4 px-4 py-3", children: [_jsx("label", { className: "w-28 text-sm font-medium text-gray-500 shrink-0", htmlFor: "priceLevel", children: "Price" }), _jsx("select", { id: "priceLevel", value: priceLevel, onChange: e => setPriceLevel(e.target.value), className: `${fieldClass} bg-white`, children: PRICE_LEVELS.map(p => _jsx("option", { value: p.value, children: p.label }, p.value)) })] }), _jsxs("div", { className: "flex items-start gap-4 px-4 py-3", children: [_jsx("label", { className: "w-28 text-sm font-medium text-gray-500 shrink-0 mt-1", htmlFor: "services", children: "Services" }), _jsx("textarea", { id: "services", value: servicesRaw, onChange: e => setServicesRaw(e.target.value), className: "flex-1 text-sm text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 px-3 py-2 resize-none", placeholder: "manicure, pedicure, \u2026", rows: 2 })] })] }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { disabled: saving, className: "flex-1 bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white font-medium py-2.5 rounded-lg transition-colors text-sm", type: "submit", children: saving ? 'Saving…' : 'Save changes' }), _jsx(Link, { to: `/salons/${id}`, className: "px-5 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-100 transition-colors", children: "Cancel" })] })] })] })) })] }));
}
