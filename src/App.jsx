import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Body from './components/Body';
import Login from './components/Login';
import Profile from './components/Profile';
import Feed from './components/Feed';
import {Provider} from 'react-redux';
import appStore from './utils/appStore';
import Connections from './components/Connections';
import Requests from './components/Requests';
import Premium from './components/Premium';


export default function App() {
  return (
    <>
    <Provider store={appStore}>
    <BrowserRouter basename="/">
      <Routes>
        <Route path='/' element={<Body></Body>}>
          <Route path='/' element={<Feed></Feed>} />
          <Route path='/login' element={<Login></Login>} />
          <Route path='/profile' element={<Profile></Profile>} />
          <Route path='/connections' element={<Connections></Connections>} />
          <Route path='/requests' element={<Requests></Requests>} />
          <Route path='/premium' element={<Premium></Premium>} />
        </Route>
      </Routes>
    </BrowserRouter>
    </Provider>
    </>
  )
}
