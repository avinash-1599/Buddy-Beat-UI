import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Body from './Body';
import Login from './Login';
import Profile from './Profile';


export default function App() {
  return (
    <>
    <BrowserRouter basename="/">
      <Routes>
        <Route path='/' element={<Body></Body>}>
          <Route path='/login' element={<Login></Login>} />
          <Route path='/profile' element={<Profile></Profile>} />
        </Route>
      </Routes>
    </BrowserRouter>
    </>
  )
}
