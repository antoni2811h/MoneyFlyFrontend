import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/Protectedroute";

import LoginPage from "./pages/LoginPages";
import RegisterPage from "./pages/Registro";

import Dashboard from "./pages/Dashboard";
import Gastos from "./pages/Gastos";
import Categorias from "./pages/Categorias";
import Medios from "./pages/Medios";
import Reportes from "./pages/Reportes";
import Alertas from "./pages/Alertas";
import Perfil from "./pages/Perfil";
import Ajustes from "./pages/Ajustes";
import NotFoundPage from "./pages/Notfoundpage";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
      />

      <Route
        path="/registro"
        element={isAuthenticated ? <Navigate to="/" replace /> : <RegisterPage />}
      />

      <Route path="/" element={<ProtectedRoute element={<Dashboard />} />} />
      <Route path="/gastos" element={<ProtectedRoute element={<Gastos />} />} />
      <Route path="/categorias" element={<ProtectedRoute element={<Categorias />} />} />
      <Route path="/medios" element={<ProtectedRoute element={<Medios />} />} />
      <Route path="/reportes" element={<ProtectedRoute element={<Reportes />} />} />
      <Route path="/alertas" element={<ProtectedRoute element={<Alertas />} />} />
      <Route path="/perfil" element={<ProtectedRoute element={<Perfil />} />} />
      <Route path="/ajustes" element={<ProtectedRoute element={<Ajustes />} />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;