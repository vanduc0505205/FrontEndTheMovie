import { Routes, Route, Navigate } from 'react-router-dom'
import ShowtimeList from './management/admin/showtimeAdmin/ShowtimeList'
import SeatList from './management/admin/seatAdmin/SeatList'
import DefaultLayout from './layouts/DefaultLayout'
import Index from './pages/LandingPage'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import 'antd/dist/reset.css';
import MovieDetail from './management/admin/movieAdmin/movieDetail'
import Register from './pages/Register'
import Login from './pages/Login'
import Logout from './pages/Logout'
import ListCinema from './management/admin/cinemaAdmin/CinemaList'
import AddCinema from './management/admin/cinemaAdmin/CinemaAdd'
import EditCinema from './management/admin/cinemaAdmin/CinemaEdit'
import CinemaDetail from './management/admin/cinemaAdmin/CinemaDetail'
import UserList from './management/admin/userAdmin/AccountList'
import SelectSeat from './pages/SelectSeat'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import CheckPayment from './pages/CheckPayment'
import MovieList from './management/admin/movieAdmin/movieList'
import MovieDetailPage from '@/pages/MovieDetail'

import TicketPrice from './pages/TicketPrice'
import RoomList from './management/admin/roomAdmin/RoomAdmin'
import RequireRole from './lib/RequireRole'
import ForbiddenPage from './pages/403'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import OAuthSuccess from './pages/OAuthSuccess'
import CategoryAdmin from './management/admin/categoryAdmin/category.admin'
import DashboardAdmin from './management/admin/dashboardAdmin/dashboard.admin'
import PolicyPage from './pages/Policy'
import Checkout from './pages/Checkout'
import NewsPage from './pages/NewsPage'
import DashboardLayout from './management/layouts/DashboardLayout'
import BookingsPage from './management/staff/bookingStaff/BookingsPage'
import PaymentsPage from './management/staff/paymentStaff/PaymentsPage'
import MoviesPage from './management/staff/movieStaff/MoviesPage'
import ShowtimesPage from './management/staff/showtimeStaff/ShowtimesPage'


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
        {/* <Route path="/phim/:id/thanh-toan" element={<CheckoutPage />} />
        <Route path="/payment-result" element={<CheckPayment />} /> */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />
        <Route path="/tin-tuc" element={<NewsPage />} />
        <Route path="/quy-dinh-va-chinh-sach" element={<PolicyPage />} />
        <Route path="/phim/:id/checkout" element={<Checkout />} />
      </Route>

      {/* Admin layout */}
      <Route path='admin' element={
        <RequireRole allowedRoles={['admin']}>
          <DashboardLayout role={'admin'} />
        </RequireRole>
      }>
        {/* router mặc định */}
        <Route index element={<DashboardAdmin />} />
        {/* router chính */}
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
        <RequireRole allowedRoles={['staff']}>
          <DashboardLayout role={'staff'} />
        </RequireRole>
      }>
        {/* router mặc định */}
        <Route index element={<BookingsPage />} />
        {/* router chính */}
        <Route path="bookings" element={<BookingsPage />} />
        <Route path="payments" element={<PaymentsPage />} />
        <Route path="showtimes" element={<ShowtimesPage />} />
        <Route path="movies" element={<MoviesPage />} />
      </Route>
      {/* 404 */}
      <Route path="*" element={<NotFound />} />
      <Route path="/403" element={<ForbiddenPage />} />
    </Routes>
  )
}

export default App;