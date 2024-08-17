import './App.css'
import { Login } from './Pages/Login'
import { HashRouter, Route, Routes } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import { Combat } from './Pages/Combat'
import { Destruct } from './Pages/Destruct'
import { Register } from './Pages/Register'
import { Guides } from './Pages/Guides'
import { Misc } from './Pages/Misc'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/combat" element={<PrivateRoute path="/combat" element={<Combat />} />} />
        <Route path="/destruct" element={<PrivateRoute path="/destruct" element={<Destruct />} />} />
        <Route path="/misc" element={<PrivateRoute path="/misc" element={<Misc />} />} />
        <Route path="/register" element={<Register/>} />
        <Route path="/guides" element={<PrivateRoute path="/guides" element={<Guides/>} />} />
      </Routes>
    </HashRouter>
  )
}

export default App
