import { useState } from 'react'

/**
 * Componente principal de la aplicación.
 * Gestiona los procesos de autenticación (Login) y creación de cuentas (Registro).
 */
function App() {
  // Estado booleano para alternar entre la vista de Login (true) y Registro (false)
  const [esLogin, setEsLogin] = useState(true);
  
  // Objeto de estado único para capturar los datos del formulario de manera centralizada
  const [formData, setFormData] = useState({
    rut: '',
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    telefono: ''
  });

  /**
   * Manejador genérico para actualizar el estado del formulario.
   * Utiliza la propiedad 'name' de los inputs para mapear dinámicamente los valores.
   * @param {Event} e - Evento de cambio del input.
   */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /**
   * Procesa el envío del formulario al Backend.
   * Realiza la petición asíncrona al servicio de usuarios y gestiona la persistencia del token.
   * @param {Event} e - Evento de envío del formulario.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Determinar el endpoint basado en el modo actual del componente
    const endpoint = esLogin ? '/login' : '/register';

    /**
     * Optimización de carga útil (Payload):
     * Para el login solo enviamos credenciales básicas.
     * Para el registro enviamos el objeto formData completo.
     */
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
          /**
           * Flujo de Éxito - Login:
           * Almacenamos el JWT (JSON Web Token) en localStorage para mantener la sesión activa.
           */
          localStorage.setItem('token', data.access_token);
          alert(`¡Bienvenido de nuevo, ${data.user.nombre}!`);
          console.log("Sesión iniciada. JWT almacenado.");
        } else {
          /**
           * Flujo de Éxito - Registro:
           * Notificamos al usuario y lo redirigimos automáticamente a la vista de login.
           */
          alert("Registro exitoso. Ahora puedes iniciar sesión.");
          setEsLogin(true); 
        }
      } else {
        // Manejo de errores controlados desde el Backend (Ej: RUT duplicado o credenciales inválidas)
        alert(data.detail || "Ocurrió un error en la validación");
      }
    } catch (error) {
      // Manejo de errores de red o servidor caído
      alert("Error crítico: No se pudo establecer conexión con el servidor backend.");
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial' }}>
      <h1>{esLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</h1>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '350px' }}>
        
        {/* Renderizado condicional: Estos campos solo existen en el DOM durante el registro */}
        {!esLogin && (
          <>
            <input name="rut" placeholder="RUT (ej: 12345678-9)" onChange={handleChange} required />
            <input name="nombre" placeholder="Nombre" onChange={handleChange} required />
            <input name="apellido" placeholder="Apellido" onChange={handleChange} required />
          </>
        )}

        {/* Campos de identidad básicos presentes en ambos flujos */}
        <input name="email" type="email" placeholder="Correo electrónico" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Contraseña" onChange={handleChange} required />

        {!esLogin && (
          <input name="telefono" placeholder="Teléfono" onChange={handleChange} />
        )}

        <button type="submit" style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          {esLogin ? 'Entrar' : 'Registrarme'}
        </button>
      </form>

      {/* Control de navegación entre estados de autenticación */}
      <p style={{ marginTop: '20px' }}>
        {esLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'} 
        <button 
          onClick={() => setEsLogin(!esLogin)} 
          style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}
        >
          {esLogin ? 'Regístrate aquí' : 'Inicia sesión aquí'}
        </button>
      </p>
    </div>
  );
}

export default App;