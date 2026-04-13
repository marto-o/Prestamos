import { useState, useEffect } from 'react';

const Simulador = () => {
  const [inputs, setInputs] = useState({ monto: '', cuotas: '' });
  const [resultados, setResultados] = useState(null);

  useEffect(() => {
    const realizarSimulacion = async () => {
      if (inputs.monto >= 100000 && inputs.cuotas >= 1) {
        try {
          const response = await fetch('http://localhost:8001/simular', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              monto: parseFloat(inputs.monto),
              cuotas: parseInt(inputs.cuotas)
            })
          });
          const data = await response.json();
          if (response.ok) setResultados(data);
        } catch (error) {
          console.error("Error en loan-service");
        }
      } else {
        setResultados(null);
      }
    };
    realizarSimulacion();
  }, [inputs]);

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ display: 'flex', gap: '20px', border: '1px solid black', padding: '10px' }}>
      {/* LADO IZQUIERDO: FORMULARIO */}
      <div style={{ flex: 1 }}>
        <p><strong>Datos del Préstamo</strong></p>
        <label>Monto: </label>
        <input type="number" name="monto" value={inputs.monto} onChange={handleChange} />
        <br /><br />
        <label>Cuotas: </label>
        <input type="number" name="cuotas" value={inputs.cuotas} onChange={handleChange} />
      </div>

      {/* LADO DERECHO: RESULTADOS */}
      <div style={{ flex: 1, borderLeft: '1px solid black', paddingLeft: '10px' }}>
        <p><strong>Resultados:</strong></p>
        {resultados ? (
          <ul>
            <li>Cuota Mensual: ${resultados.cuota_mensual}</li>
            <li>Tasa: {resultados.tasa_aplicada}%</li>
            <li>Total: ${resultados.total_pagar}</li>
            <li>CAE: {resultados.cae}%</li>
          </ul>
        ) : (
          <p>Esperando datos válidos...</p>
        )}
      </div>
    </div>
  );
};

export default Simulador;