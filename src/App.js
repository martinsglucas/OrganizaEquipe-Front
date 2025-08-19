import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Home from "./pages/Home";
import Schedule from "./pages/Schedule";
import Team from "./pages/Team";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Header from "./components/layout/Header";
import Unavailability from "./pages/Unavailability";
import Organization from "./pages/Organization";
import Footer from "./components/layout/Footer";
import Container from "./components/layout/Container";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import { EquipeProvider } from "./context/TeamContext";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Notifications from "./pages/Notifications";
import { OrganizationProvider} from "./context/OrganizationContext";

function App() {
  const [sidebar, setSidebar] = useState(false);

  return (
    <AuthProvider>
      <OrganizationProvider>
        <EquipeProvider>
          <Router>
            <Header sidebar={sidebar} setSitebar={setSidebar} />
            <Container customClass="min_height">
              <Routes>
                <Route path="/cadastro" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Home />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/indisponibilidade"
                  element={
                    <ProtectedRoute>
                      <Unavailability />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/escala"
                  element={
                    <ProtectedRoute>
                      <Schedule />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/equipe"
                  element={
                    <ProtectedRoute>
                      <Team />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/organizacao"
                  element={
                    <ProtectedRoute>
                      <Organization />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/perfil"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/notificacoes"
                  element={
                    <ProtectedRoute>
                      <Notifications />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Container>
            <Footer setSidebar={setSidebar} />
            <ToastContainer
              position="top-center"
              autoClose={2000}
              hideProgressBar
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
              // theme="dark"
            />
          </Router>
        </EquipeProvider>
      </OrganizationProvider>
    </AuthProvider>
  );
}

export default App;
