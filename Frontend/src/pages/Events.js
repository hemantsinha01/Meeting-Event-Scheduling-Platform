import Layout from "../components/Layout"
import EventTypes from "../components/EventTypes"
import "../styles/Events.css"

const Events = () => {
  return (
    <Layout>
      <div className="events-page">
        <EventTypes />
      </div>
    </Layout>
  )
}

export default Events

