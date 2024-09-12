import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Escala from "./pages/Escala";
import Ministerio from "./pages/Ministerio";
import Cadastro from "./pages/Cadastro";
import Login from "./pages/Login";
import Perfil from "./pages/Perfil";
import Header from "./components/layout/Header";
import Indisponibilidade from "./pages/Indisponibilidade";
import Footer from "./components/layout/Footer";
import Container from "./components/layout/Container";
import ProtectedRoute from "./components/layout/ProtectedRoute";

function App() {
  return (
    <Router>
      <Header />
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
            path="/ministerio"
            element={
              <ProtectedRoute>
                <Ministerio />
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
      <Footer />
    </Router>
  );
}

export default App;
