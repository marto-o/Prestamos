import { useState, useEffect } from 'react' // Agregamos useEffect
import Simulador from './components/Simulador';

function App() {
  const [esLogin, setEsLogin] = useState(true);
  
  // 1. Declaramos el estado del token (esto soluciona el error ReferenceError)
  const [token, setToken] = useState(localStorage.getItem('token'));
  
  const [formData, setFormData] = useState({
    rut: '',
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    telefono: ''
  });

  // 2. Sincronizamos el estado con el almacenamiento local al cargar la app
  useEffect(() => {
    const tokenGuardado = localStorage.getItem('token');
    if (tokenGuardado) setToken(tokenGuardado);
  }, []);

  /**
   * 3. Definimos handleLogout (necesaria para el botón del Header)
   */
  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    alert("Sesión cerrada correctamente");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = esLogin ? '/login' : '/register';
    const dataToSend = esLogin 
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
        if (esLogin) {
          // 4. Actualizamos el estado aquí también para que la UI reaccione de inmediato
          localStorage.setItem('token', data.access_token);
          setToken(data.access_token); 
          alert(`¡Bienvenido de nuevo, ${data.user.nombre}!`);
        } else {
          alert("Registro exitoso. Ahora puedes iniciar sesión.");
          setEsLogin(true); 
        }
      } else {
        alert(data.detail || "Ocurrió un error en la validación");
      }
    } catch (error) {
      alert("Error crítico: No se pudo establecer conexión con el servidor backend.");
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <header>
        <h1>Sistema de Préstamos</h1>
        {token ? (
          <button onClick={handleLogout}>Cerrar Sesión</button>
        ) : (
          <button onClick={() => setEsLogin(!esLogin)}>
            {esLogin ? 'Ir a Registro' : 'Ir a Login'}
          </button>
        )}
      </header>

      <hr />

      <section>
        <h2>Simulador</h2>
        <Simulador />
      </section>

      <hr />

      <section>
        {token ? (
          <div>
            <h2>Panel de Usuario</h2>
            <p>Estado: Autenticado</p>
            <button>Ver mis solicitudes</button>
          </div>
        ) : (
          <div>
            <h2>{esLogin ? 'Login' : 'Registro'}</h2>
            <form onSubmit={handleSubmit}>
              {!esLogin && (
                <>
                  <input name="rut" placeholder="RUT" onChange={handleChange} /><br />
                  <input name="nombre" placeholder="Nombre" onChange={handleChange} /><br />
                  <input name="apellido" placeholder="Apellido" onChange={handleChange} /><br />
                </>
              )}
              <input name="email" type="email" placeholder="Email" onChange={handleChange} /><br />
              <input name="password" type="password" placeholder="Password" onChange={handleChange} /><br />
              <button type="submit">{esLogin ? 'Entrar' : 'Registrar'}</button>
            </form>
          </div>
        )}
      </section>
    </div>
  );
}

export default App;