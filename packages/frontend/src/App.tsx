import {BrowserRouter, Route, Routes} from 'react-router-dom';
import SalonList from './views/SalonList';
import SalonDetail from './views/SalonDetail';
import SalonEdit from './views/SalonEdit';

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<SalonList/>}/>
                <Route path="/salons/:id" element={<SalonDetail/>}/>
                <Route path="/salons/:id/edit" element={<SalonEdit/>}/>
            </Routes>
        </BrowserRouter>
    );
}
