import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SalonList from './views/SalonList';
import SalonDetail from './views/SalonDetail';
import SalonEdit from './views/SalonEdit';
export default function App() {
    return (_jsx(BrowserRouter, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(SalonList, {}) }), _jsx(Route, { path: "/salons/:id", element: _jsx(SalonDetail, {}) }), _jsx(Route, { path: "/salons/:id/edit", element: _jsx(SalonEdit, {}) })] }) }));
}
