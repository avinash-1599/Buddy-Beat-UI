import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Body from './components/Body';
import Login from './components/Login';
import Profile from './components/Profile';
import Feed from './components/Feed';
import {Provider} from 'react-redux';
import appStore from './utils/appStore';
import Connections from './components/Connections';
import Premium from './components/Premium';
import RequestPage from './components/RequestPage';
import AuthCallback from './components/AuthCallback';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
//import PostForm from './components/PostForm';
import PostFeed from './components/PostFeed';
import PostLayout from './components/PostLayout';
import UserProfile from './components/UserProfile';
import LoginUsingOTP from './components/LoginUsingOTP';


export default function App() {
  return (
    <>
    <Provider store={appStore}>
    <BrowserRouter basename="/">
      <Routes>
        <Route path='/' element={<Body></Body>}>
          <Route path="/auth-callback" element={<AuthCallback />} />
          <Route path='/' element={<Feed></Feed>} />
          <Route path='/login' element={<Login></Login>} />
          <Route path='/login/otp' element={<LoginUsingOTP></LoginUsingOTP>} />
          <Route path='/profile' element={<Profile></Profile>} />
          <Route path='/connections' element={<Connections></Connections>} />
          <Route path='/requests' element={<RequestPage></RequestPage>} />
          <Route path='/premium' element={<Premium></Premium>} />
          <Route path="/forgot-password" element={<ForgotPassword></ForgotPassword>} />
          <Route path="/create-post" element={<PostLayout></PostLayout>} />
          <Route path="/post/feed" element={<PostFeed></PostFeed>} />
          <Route path="/user/profile/:userId" element={<UserProfile></UserProfile>} />
        </Route>
        <Route path="/reset-password/:resetToken" element={<ResetPassword></ResetPassword>} />
      </Routes>
    </BrowserRouter>
    </Provider>
    </>
  )
}
