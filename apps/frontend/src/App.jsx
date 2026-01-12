import { useState } from 'react'

/**
 * Componente principal de Registro.
 * Maneja el estado local del formulario y la comunicación con el microservicio de usuarios.
 */
function App() {
  // Estado único para agrupar los campos del formulario de registro
  const [usuario, setUsuario] = useState({
    rut: '',
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    telefono: ''
  });

  /**
   * Actualiza el estado de forma dinámica basándose en el atributo 'name' del input.
   */
  const handleChange = (e) => {
    setUsuario({ ...usuario, [e.target.name]: e.target.value });
  };

  /**
   * Envía los datos del formulario al backend vía POST.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuario)
      });
      
      const data = await response.json();
      alert(data.message || "Error en el registro");
    } catch (error) {
      console.error("Error conectando con el servidor:", error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Registro de Usuario</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
        <input name="rut" placeholder="RUT" onChange={handleChange} required />
        <input name="nombre" placeholder="Nombre" onChange={handleChange} required />
        <input name="apellido" placeholder="Apellido" onChange={handleChange} required />
        <input name="email" type="email" placeholder="Correo electrónico" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Contraseña" onChange={handleChange} required />
        <input name="telefono" placeholder="Teléfono (opcional)" onChange={handleChange} />
        <button type="submit">Crear Cuenta</button>
      </form>
    </div>
  );
}

export default App;