import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Login from './Login';  
/**
 * LoginPage actúa como puente entre el AuthContext y el componente visual Login.
 * Mismo patrón de la red social: la página maneja la lógica, el componente maneja la UI.
 */
export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (formData) => {
    const resultado = await login(formData.correo, formData.contrasena);
    if (resultado.success) {
      navigate('/', { replace: true });
    }
    return resultado; // Login.jsx muestra el error si success === false
  };

  return <Login onLogin={handleLogin} />;
}