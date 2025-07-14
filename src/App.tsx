import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './admin/layoutAdmin/MainLayout'
import ShowtimeList from './admin/pageAdmin/showtimeAdmin/ShowtimeList'
import SeatList from './admin/pageAdmin/seatAdmin/SeatList'
import DefaultLayout from './layouts/DefaultLayout'
import Index from './pages/Index'
import AboutUs from './pages/AboutUs'
import Contact from './pages/Contact'
import OperatingModel from './pages/OperatingModel'
import NotFound from './pages/NotFound'
import RoomList from './admin/pageAdmin/roomAdmin/RoomAdmin'

function App() {
  return (
    <Routes>
      {/* Giao diện landing */}
      <Route element={<DefaultLayout />}>
        <Route index element={<Index />} />
        <Route path="/ve-chung-toi" element={<AboutUs />} />
        <Route path="/lien-he" element={<Contact />} />
        <Route path="/mo-hinh-van-hanh" element={<OperatingModel />} />
      </Route>

      {/* Giao diện admin */}
      <Route path='admin' element={<MainLayout/>}>
        <Route path="showtimes" element={<ShowtimeList />} />
        <Route path="seats" element={<SeatList />} />
        <Route path='rooms' element={<RoomList/>}/>
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App;