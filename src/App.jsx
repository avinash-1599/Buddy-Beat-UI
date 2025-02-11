import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Body from './components/Body';
import Login from './components/Login';
import Profile from './components/Profile';
import Feed from './components/Feed';
import {Provider} from 'react-redux';
import appStore from './utils/appStore';
import Connections from './components/Connections';
import Premium from './components/Premium';
import Chat from './components/Chat';
import RequestPage from './components/RequestPage';
import AuthCallback from './components/AuthCallback';


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
          <Route path='/profile' element={<Profile></Profile>} />
          <Route path='/connections' element={<Connections></Connections>} />
          <Route path='/requests' element={<RequestPage></RequestPage>} />
          <Route path='/premium' element={<Premium></Premium>} />
          <Route path='/chat/:targetUserId' element={<Chat></Chat>} />
        </Route>
      </Routes>
    </BrowserRouter>
    </Provider>
    </>
  )
}
