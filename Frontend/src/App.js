import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import "./styles/App.css"

// Pages
import LandingPage from "./pages/LandingPage"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import AddAvailability from "./pages/AddAvailability"
import CalendarView from "./pages/CalendarView"
import Settings from "./pages/Settings"
import EventPublicPage from "./pages/EventPublicPage"
import Events from "./pages/Events"
import Booking from "./pages/Booking"
import CreateEvent from "./pages/CreateEvent"
import Preferences from "./pages/Preferences"
import AddEvent from "./pages/AddEvent"
import EditEvent from "./pages/EditEvent"

const App = () => {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/preferences" element={<Preferences />} />
          <Route path="/events" element={<Events />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/availability" element={<AddAvailability />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/calendar" element={<CalendarView />} />
          <Route path="/event/:eventId" element={<EventPublicPage />} />
          <Route path="/add-event" element={<AddEvent />} />
          <Route path="/edit-event/:eventId" element={<EditEvent />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

