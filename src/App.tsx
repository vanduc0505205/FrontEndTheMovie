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
import 'antd/dist/reset.css';
import MovieDetail from './admin/pageAdmin/movieAdmin/movieDetail'
import Register from './pages/Register'
import Login from './pages/Login'
import Logout from './pages/Logout'
import ListCinema from './admin/pageAdmin/cinemaAdmin/CinemaList'
import AddCinema from './admin/pageAdmin/cinemaAdmin/CinemaAdd'
import EditCinema from './admin/pageAdmin/cinemaAdmin/CinemaEdit'
import CinemaDetail from './admin/pageAdmin/cinemaAdmin/CinemaDetail'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import CheckPayment from './pages/CheckPayment'
import MovieList from './admin/pageAdmin/movieAdmin/movieList'

import TicketPrice from './pages/TicketPrice'
import RoomList from './admin/pageAdmin/roomAdmin/RoomAdmin'
import RequireRole from './lib/RequireRole'
import StaffMainLayout from './staff/layoutStaff/mainLayout'
import ForbiddenPage from './pages/403'
import CategoryAdmin from './admin/pageAdmin/category.admin'


function App() {
  return (
    <Routes>
      {/* Giao diện landing */}
      <Route element={<DefaultLayout />}>
        <Route index element={<Index />} />
        {/* <Route path="/ve-chung-toi" element={<AboutUs />} /> */}
        <Route path="/lien-he" element={<Contact />} />
        <Route path="/mo-hinh-van-hanh" element={<OperatingModel />} />
        <Route path="/ticket-price" element={<TicketPrice />} />
        <Route path="/dang-ky" element={<Register />} />
        <Route path="/dang-nhap" element={<Login />} />
        <Route path="/dang-xuat" element={<Logout />} />
        <Route path="/gio-hang" element={<CartPage />} />
        <Route path="/thanh-toan" element={<CheckoutPage />} />
        <Route path="/payment-result" element={<CheckPayment />} />
      </Route>

      {/* Giao diện admin */}
      <Route path='admin' element={
        <RequireRole allowedRoles={['admin']}>
          <MainLayout />
        </RequireRole>
      }>
        <Route path="showtimes" element={<ShowtimeList />} />
        <Route path="seats" element={<SeatList />} />
        <Route path='rooms' element={<RoomList />} />
        <Route path="movies" element={<MovieList />} />
        <Route path="movies/:id" element={<MovieDetail />} />
        <Route path="categories" element={<CategoryAdmin />} />
        <Route path="cinemas" element={<ListCinema />} />
        <Route path="cinemas/add" element={<AddCinema />} />
        <Route path="cinemas/edit/:id" element={<EditCinema />} />
        <Route path="cinemas/:id" element={<CinemaDetail />} />
      </Route>
      {/* Giao diện staff */}
      <Route path='staff' element={
        <RequireRole allowedRoles={['staff', 'admin']}>
          <StaffMainLayout />
        </RequireRole>
      }
      >
        <Route path="showtimes" element={<ShowtimeList />} />
        <Route path="seats" element={<SeatList />} />
        <Route path='rooms' element={<RoomList />} />
        <Route path="movies" element={<MovieList />} />
        <Route path="movies/:id" element={<MovieDetail />} />
        <Route path="categories" element={<CategoryAdmin />} />
        <Route path="cinemas" element={<ListCinema />} />
        <Route path="cinemas/add" element={<AddCinema />} />
        <Route path="cinemas/edit/:id" element={<EditCinema />} />
        <Route path="cinemas/:id" element={<CinemaDetail />} />

      </Route>
      {/* 404 */}
      <Route path="*" element={<NotFound />} />
      <Route path="/403" element={<ForbiddenPage />} />
    </Routes>
  )
}

export default App;