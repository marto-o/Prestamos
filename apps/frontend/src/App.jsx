import { useState, useEffect } from 'react'
import Simulador from './components/simulador/Simulador';
import Login from './components/auth/Login';
import Registro from './components/auth/Register';
import Dashboard from './components/user/Dashboard';

function App() {
  const [vista, setVista] = useState('inicio');
  const [token, setToken] = useState(
    localStorage.getItem('token') || sessionStorage.getItem('token')
  );
  const [formData, setFormData] = useState({
    rut: '', nombre: '', apellido: '', email: '', password: '', 
    telefono: '', recordarme: false
  });

  useEffect(() => {
    const t = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (t) setToken(t);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    setToken(null);
    setVista('inicio');
    alert("Sesión cerrada.");
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = vista === 'login' ? '/login' : '/register';
    const dataToSend = vista === 'login' 
      ? { email: formData.email, password: formData.password }
      : formData;

    try {
    const response = await fetch(`http://localhost:8000${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToSend)
    });
    
    const data = await response.json();

    if (response.ok) {
      if (vista === 'login') {
        const storage = formData.recordarme ? localStorage : sessionStorage;
        storage.setItem('token', data.access_token);
        setToken(data.access_token);

        setVista('dashboard'); 
        alert(`¡Bienvenido, ${data.user.nombre}!`);
      } else {
        alert("Registro exitoso. Ahora puedes iniciar sesión.");
        setVista('login'); 
      }
    } else {
      alert(data.detail || "Error en la operación");
    }
    } catch (error) {
      alert("Error de conexión.");
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      
      {/* HEADER DINÁMICO */}
      <header style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid gray', paddingBottom: '10px' }}>
        <button onClick={() => setVista('inicio')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 'bold' }}>
          Sistema de Préstamos
        </button>

      <div>
        {token ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span>Bienvenido</span>
        
            {/* BOTÓN DINÁMICO: Cambia según la vista actual */}
            {vista === 'inicio' && (
              <button onClick={() => setVista('dashboard')} style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>
                Mi Panel / Dashboard
              </button>
            )}

            <button onClick={handleLogout} style={{ padding: '5px 10px', cursor: 'pointer' }}>
              Cerrar Sesión
            </button>
          </div>
        ) : (
          <>
            {vista !== 'login' && <button onClick={() => setVista('login')}>Inicio de Sesión</button>}
            {vista !== 'registro' && <button onClick={() => setVista('registro')} style={{ marginLeft: '10px' }}>Registro</button>}
          </>
        )}
      </div>
    </header>

      {/* RENDERIZADO DE COMPONENTES */}
      <main style={{ marginTop: '30px' }}>
        {vista === 'inicio' && <Simulador />}
  
        {vista === 'login' && (
          <Login handleChange={handleChange} handleSubmit={handleSubmit} setVista={setVista} formData={formData} />
        )}
  
        {vista === 'registro' && (
          <Registro handleChange={handleChange} handleSubmit={handleSubmit} setVista={setVista} />
        )}
        
        {vista === 'dashboard' && token && (
          <Dashboard token={token} setVista={setVista}/>
        )}
      </main>
    </div>
  );
}

export default App;