import { useState } from 'react';

const Perfil = ({ usuarioActual, token, setVista }) => {
  const [formData, setFormData] = useState({
    email: usuarioActual.email,
    telefono: usuarioActual.telefono || '',
    password: ''
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:8000/perfil', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      alert("Datos actualizados con éxito");
    } else {
      alert("Error al actualizar");
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px' }}>
      <button onClick={() => setVista('dashboard')}>Volver al Panel</button>
      <h2>Mi Cuenta</h2>
      <form onSubmit={handleUpdate}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <label>Email:
            <input type="email" value={formData.email} 
                   onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </label>
          <label>Teléfono:
            <input type="text" value={formData.telefono} 
                   onChange={(e) => setFormData({...formData, telefono: e.target.value})} />
          </label>
          <label>Nueva Contraseña (opcional):
            <input type="password" value={formData.password} 
                   onChange={(e) => setFormData({...formData, password: e.target.value})} />
          </label>
          <button type="submit">Guardar Cambios</button>
        </div>
      </form>
    </div>
  );
};

export default Perfil;