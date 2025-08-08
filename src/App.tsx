import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './admin/layoutAdmin/MainLayout'
import ShowtimeList from './admin/pageAdmin/showtimeAdmin/ShowtimeList'
import SeatList from './admin/pageAdmin/seatAdmin/SeatList'
import DefaultLayout from './layouts/DefaultLayout'
import Index from './pages/LandingPage'
import Contact from './pages/Contact'
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
import UserList from './admin/pageAdmin/userAdmin/AccountList'
import SelectSeat from './pages/SelectSeat'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import CheckPayment from './pages/CheckPayment'
import MovieList from './admin/pageAdmin/movieAdmin/movieList'
import MovieDetailPage from '@/pages/MovieDetail'

import TicketPrice from './pages/TicketPrice'
import RoomList from './admin/pageAdmin/roomAdmin/RoomAdmin'
import RequireRole from './lib/RequireRole'
import StaffMainLayout from './staff/layoutStaff/mainLayout'
import ForbiddenPage from './pages/403'
import CinemaDetailStaff from './staff/pageStaff/cinemaStaff/CinemaDetailStaff'
import CinemaListStaff from './staff/pageStaff/cinemaStaff/cinemaListStaff'
import MovieDetailStaff from './staff/pageStaff/movieStaff/movieDetailStaff'
import MovieListStaff from './staff/pageStaff/movieStaff/movieListStaff'
import EditCinemaStaff from './staff/pageStaff/cinemaStaff/cinemaEditStaff'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import OAuthSuccess from './pages/OAuthSuccess'
import CategoryAdmin from './admin/pageAdmin/categoryAdmin/category.admin'
import DashboardAdmin from './admin/pageAdmin/dashboardAdmin/dashboard.admin'
import PolicyPage from './pages/Policy'
import Checkout from './pages/Checkout'
import NewsPage from './pages/NewsPage'


function App() {
  return (
    <Routes>
      {/* Giao diện landing */}
      <Route element={<DefaultLayout />}>
        <Route index element={<Index />} />
        {/* chi tiết */}
        <Route path="/phim/:id" element={<MovieDetailPage />} />
        {/* <Route path="/ve-chung-toi" element={<AboutUs />} /> */}
        <Route path="/lien-he" element={<Contact />} />
        {/* <Route path="/mo-hinh-van-hanh" element={<OperatingModel />} /> */}
        <Route path="/ticket-price" element={<TicketPrice />} />
        <Route path="/dang-ky" element={<Register />} />
        <Route path="/dang-nhap" element={<Login />} />
        <Route path="/dang-xuat" element={<Logout />} />
        <Route path="/phim/:id/selectSeat" element={<SelectSeat />} />
        <Route path="/gio-hang" element={<CartPage />} />
        <Route path="/phim/:id/thanh-toan" element={<CheckoutPage />} />
        <Route path="/payment-result" element={<CheckPayment />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />
        <Route path="/tin-tuc" element={<NewsPage />} />
        <Route path="/quy-dinh-va-chinh-sach" element={<PolicyPage />} />
        <Route path="/phim/:id/checkout" element={<Checkout />} />
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
        <Route path='users' element={<UserList />} />
        <Route path="movies" element={<MovieList />} />
        <Route path="movies/:id" element={<MovieDetail />} />
        <Route path="categories" element={<CategoryAdmin />} />
        <Route path="cinemas" element={<ListCinema />} />
        <Route path="cinemas/add" element={<AddCinema />} />
        <Route path="cinemas/edit/:id" element={<EditCinema />} />
        <Route path="cinemas/:id" element={<CinemaDetail />} />
        <Route path="dashboard" element={<DashboardAdmin />} />
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
        <Route path="movies" element={<MovieListStaff />} />
        <Route path="movies/:id" element={<MovieDetailStaff />} />
        <Route path="categories" element={<CategoryAdmin />} />
        <Route path="cinemas" element={<CinemaListStaff />} />
        <Route path="cinemas/add" element={<AddCinema />} />
        <Route path="cinemas/edit/:id" element={<EditCinemaStaff />} />
        <Route path="cinemas/:id" element={< CinemaDetailStaff />} />

      </Route>
      {/* 404 */}
      <Route path="*" element={<NotFound />} />
      <Route path="/403" element={<ForbiddenPage />} />
    </Routes>
  )
}

export default App;