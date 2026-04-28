import { Route, Routes } from "react-router";
import MainLayout from "./layouts/MainLayout.jsx";
import DashBoard from "./layouts/Dashboard.jsx";
import Clients from "./layouts/Clients.jsx";
import Projects from "./layouts/Projects.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<DashBoard />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/projects" element={<Projects />} />
      </Route>
    </Routes>
  );
}

export default App;
