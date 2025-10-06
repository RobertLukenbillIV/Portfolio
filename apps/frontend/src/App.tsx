import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './routes/Home'
import Projects from './routes/Projects'
import About from './routes/About'
import Login from './routes/Login'
import AdminDashboard from './routes/AdminDashboard'
import Protected from './components/Protected'


export default function App(){
return (
<div className="min-h-screen">
<Navbar/>
<main className="max-w-5xl mx-auto p-4">
<Routes>
<Route path="/" element={<Home/>} />
<Route path="/projects" element={<Projects/>} />
<Route path="/about" element={<About/>} />
<Route path="/login" element={<Login/>} />
<Route path="/admin" element={<Protected><AdminDashboard/></Protected>} />
</Routes>
</main>
</div>
)
}