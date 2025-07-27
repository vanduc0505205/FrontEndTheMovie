import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './admin/layoutAdmin/MainLayout'
import ShowtimeList from './admin/pageAdmin/showtimeAdmin/ShowtimeList'
import SeatList from './admin/pageAdmin/seatAdmin/SeatList'
import DefaultLayout from './layouts/DefaultLayout'
import Index from './pages/Index'
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
import UserList from './admin/pageAdmin/userAdmin/AccountList'
import SelectSeat from './pages/SelectSeat'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import CheckPayment from './pages/CheckPayment'
import MovieList from './admin/pageAdmin/movieAdmin/movieList'
import CategoryAdmin from './admin/pageAdmin/category.admin'
import TicketPrice from './pages/TicketPrice'
import RoomList from './admin/pageAdmin/roomAdmin/RoomAdmin'

function App() {
  return (
    <Routes>
      {/* Giao diện landing */}
      <Route element={<DefaultLayout />}>
        <Route index element={<Index />} />
        {/* <Route path="/ve-chung-toi" element={<AboutUs />} /> */}
        <Route path="/lien-he" element={<Contact />} />
        {/* <Route path="/mo-hinh-van-hanh" element={<OperatingModel />} /> */}
        <Route path="/ticket-price" element={<TicketPrice/>}/>
        <Route path="/dang-ky" element={<Register />} />
        <Route path="/dang-nhap" element={<Login />} />
        <Route path="/dang-xuat" element={<Logout />} />
        <Route path="/selectSeat" element={<SelectSeat/>} />
        <Route path="/gio-hang" element={<CartPage />} />
        <Route path="/thanh-toan" element={<CheckoutPage />} />
        <Route path="/payment-result" element={<CheckPayment />} />
      </Route>

      {/* Giao diện admin */}
      <Route path='admin' element={<MainLayout />}>
        <Route path="showtimes" element={<ShowtimeList />} />
        <Route path="seats" element={<SeatList />} />
        <Route path='rooms' element={<RoomList/>}/>
        <Route path='users' element={<UserList/>}/>
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
    </Routes>
  )
}

export default App;