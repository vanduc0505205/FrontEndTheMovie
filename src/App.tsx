import { Routes, Route, Navigate } from 'react-router-dom'
import ShowtimeList from './admin/showtimeAdmin/ShowtimeList'
import SeatList from './admin/seatAdmin/SeatList'
import DefaultLayout from './layouts/DefaultLayout'
import Index from './pages/LandingPage'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import 'antd/dist/reset.css';
import MovieDetail from './admin/movieAdmin/movieDetail'
import Register from './pages/Register'
import Login from './pages/Login'
import Logout from './pages/Logout'
import ListCinema from './admin/cinemaAdmin/CinemaList'
import AddCinema from './admin/cinemaAdmin/CinemaAdd'
import EditCinema from './admin/cinemaAdmin/CinemaEdit'
import CinemaDetail from './admin/cinemaAdmin/CinemaDetail'
import UserList from './admin/userAdmin/AccountList'
import SelectSeat from './pages/SelectSeat'
import CartPage from './pages/CartPage'
import CheckPayment from './pages/CheckPayment'
import MovieList from './admin/movieAdmin/movieList'
import MovieDetailPage from '@/pages/MovieDetail'
import Notification from './pages/Notification'

import TicketPrice from './pages/TicketPrice'
import RoomList from './admin/roomAdmin/RoomAdmin'
import RequireRole from '@/components/pageComponets/requiredRole/RequireRole'
import ForbiddenPage from './pages/403'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import OAuthSuccess from './pages/OAuthSuccess'
import CategoryAdmin from './admin/categoryAdmin/category.admin'
import DashboardAdmin from './admin/dashboardAdmin/dashboard.admin'
import PolicyPage from './pages/Policy'
import Checkout from './pages/Checkout'
import NewsPage from './pages/NewsPage'
import DashboardLayout from './layouts/DashboardLayout'
import BookingsPage from './staff/bookingStaff/BookingsPage'
import PaymentsPage from './staff/paymentStaff/PaymentsPage'
import MovieStaff from './staff/movieStaff/movieList'
import ShowtimeStaff from './staff/showtimeStaff/ShowtimeList'
import RoomStaff from './staff/roomStaff/RoomAdmin'
import OrderHistoryPage from './pages/OrderHistoryPage'
import DiscountList from './admin/discountAdmin/discountList'
import BookingAdmin from './admin/bookingAdmin/booking.admin'
import UserProfile from './pages/UserProfile'
import ChangePasswordPage from './pages/ChangePasswordPage'
import ProfilePage from './pages/ProfilePage'
import { useEffect } from 'react';
import ContactAdmin from './admin/contactAdmin/contact.admin'
import CategoryStaff from './staff/categoryStaff/CategoryStaff'
import Showtime from './pages/Showtimes'
import MovieDetailStaff from './staff/movieStaff/movieDetail'
import ComboList from './admin/comboAdmin/comboAdmin'

function App() {

  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route element={<DefaultLayout />}>
        <Route index element={<Index />} />
        <Route path="/phim/:id" element={<MovieDetailPage />} />
        <Route path="/lien-he" element={<Contact />} />
        <Route path="/thongbao" element={<Notification />} />
        <Route path="/ticket-price" element={<TicketPrice />} />
        {/* <Route path="/dang-ky" element={<Register />} /> */}
        <Route path="/dang-nhap" element={<Login />} />
        <Route path="/dang-xuat" element={<Logout />} />
        <Route path="/dang-ky" element={<Register />} />
        <Route path="/gio-hang" element={<CartPage />} />
        {/* <Route path="/phim/:id/thanh-toan" element={<CheckoutPage />} /> */}
        <Route path="/payment-result" element={<CheckPayment />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />
        <Route path="/tin-tuc" element={<NewsPage />} />
        <Route path="/quy-dinh-va-chinh-sach" element={<PolicyPage />} />
        <Route path="/phim/:id/checkout" element={<Checkout />} />
        <Route path="/lichsudatve" element={<OrderHistoryPage />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />
        <Route path="/thong-tin-ca-nhan" element={<ProfilePage />} />
        <Route path="/lich-chieu" element={<Showtime />} />
      </Route>

      {/* CUSTOMER ROUTES */}
      <Route element={<DefaultLayout />}>
        <Route
          path="/phim/:id/selectSeat"
          element={
            <RequireRole allowedRoles={['customer', 'staff', 'admin']}>
              <SelectSeat />
            </RequireRole>
          }
        />
        <Route
          path="/gio-hang"
          element={
            <RequireRole allowedRoles={['customer', 'staff', 'admin']}>
              <CartPage />
            </RequireRole>
          }
        />
        <Route
          path="/phim/:id/checkout"
          element={
            <RequireRole allowedRoles={['customer', 'staff', 'admin']}>
              <Checkout />
            </RequireRole>
          }
        />
      </Route>

      {/* ADMIN ROUTES */}
      <Route
        path="admin"
        element={
          <RequireRole allowedRoles={['admin']}>
            <DashboardLayout role="admin" />
          </RequireRole>
        }
      >
        <Route index element={<DashboardAdmin />} />
        <Route path="dashboard" element={<DashboardAdmin />} />
        <Route path="showtimes" element={<ShowtimeList />} />
        <Route path="seats" element={<SeatList />} />
        <Route path="rooms" element={<RoomList />} />
        <Route path="users" element={<UserList />} />
        <Route path="movies" element={<MovieList />} />
        <Route path="movies/:id" element={<MovieDetail />} />
        <Route path="categories" element={<CategoryAdmin />} />
        <Route path="cinemas" element={<ListCinema />} />
        <Route path="cinemas/add" element={<AddCinema />} />
        <Route path="cinemas/edit/:id" element={<EditCinema />} />
        <Route path="cinemas/:id" element={<CinemaDetail />} />
        <Route path="dashboard" element={<DashboardAdmin />} />
        <Route path="bookings" element={<BookingAdmin />} />
        <Route path="discounts" element={<DiscountList />} />
        <Route path="combos" element={<ComboList />} />
        <Route path="lienhe" element={<ContactAdmin />} />
      </Route>

      {/* STAFF ROUTES */}
      <Route
        path="staff"
        element={
          <RequireRole allowedRoles={['staff']}>
            <DashboardLayout role="staff" />
          </RequireRole>
        }
      >
        <Route index element={<BookingsPage />} />
        <Route path="bookings" element={<BookingsPage />} />
        <Route path="payments" element={<PaymentsPage />} />
        <Route path="showtimes" element={<ShowtimeStaff />} />
        <Route path="movies" element={<MovieStaff />} />
        <Route path="movies/:id" element={<MovieDetailStaff />} />
        <Route path="rooms" element={<RoomStaff />} />
        <Route path="categories" element={<CategoryStaff />} />
      </Route>

      {/* ERROR PAGES */}
      <Route path="*" element={<NotFound />} />
      <Route path="/403" element={<ForbiddenPage />} />
    </Routes>
  )
}

export default App;