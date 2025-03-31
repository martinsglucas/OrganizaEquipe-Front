import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Home from "./pages/Home";
import Escala from "./pages/Escala";
import Equipe from "./pages/Equipe";
import Cadastro from "./pages/Cadastro";
import Login from "./pages/Login";
import Perfil from "./pages/Perfil";
import Header from "./components/layout/Header";
import Indisponibilidade from "./pages/Indisponibilidade";
import Footer from "./components/layout/Footer";
import Container from "./components/layout/Container";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import { EquipeProvider } from "./context/EquipeContext";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [sidebar, setSidebar] = useState(false);

  return (
    <AuthProvider>
      <EquipeProvider>
        <Router>
          <Header sidebar={sidebar} setSitebar={setSidebar} />
          <Container customClass="min_height">
            <Routes>
              <Route path="/cadastro" element={<Cadastro />} />
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
                    <Indisponibilidade />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/escala"
                element={
                  <ProtectedRoute>
                    <Escala />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/equipe"
                element={
                  <ProtectedRoute>
                    <Equipe />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/perfil"
                element={
                  <ProtectedRoute>
                    <Perfil />
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
    </AuthProvider>
  );
}

export default App;
