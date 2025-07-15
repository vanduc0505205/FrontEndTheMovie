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
import Register from './pages/Register'
import Login from './pages/Login'
import Logout from './pages/Logout'
import ListCinema from './admin/pageAdmin/cinemaAdmin/CinemaList'
import AddCinema from './admin/pageAdmin/cinemaAdmin/CinemaAdd'
import EditCinema from './admin/pageAdmin/cinemaAdmin/CinemaEdit'
import CinemaDetail from './admin/pageAdmin/cinemaAdmin/CinemaDetail'

function App() {
  return (
    <Routes>
      {/* Giao diện landing */}
      <Route element={<DefaultLayout />}>
        <Route index element={<Index />} />
        <Route path="/ve-chung-toi" element={<AboutUs />} />
        <Route path="/lien-he" element={<Contact />} />
        <Route path="/mo-hinh-van-hanh" element={<OperatingModel />} />
        <Route path="/dang-ky" element={<Register />} />
        <Route path="/dang-nhap" element={<Login />} />
        <Route path="/dang-xuat" element={<Logout />} />
      </Route>

      {/* Giao diện admin */}
      <Route path='admin' element={<MainLayout />}>
        <Route path="showtimes" element={<ShowtimeList />} />
        <Route path="seats" element={<SeatList />} />
        <Route path="cinemas" element={<ListCinema />} />
        <Route path="cinemas/add" element={<AddCinema />} />
        <Route path="cinemas/edit/:id" element={<EditCinema />} />
        <Route path="cinemas/:id" element={<CinemaDetail />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App;