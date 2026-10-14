import { useState } from 'react'
import './App.css'

function App() {
  const [capacidad, setCapacidad] = useState(100)
  const [numPedidos, setNumPedidos] = useState(5)
  const [pedidos, setPedidos] = useState([])

  
  
  // función para generar pedidos aleatorios
  const generarPedidosAleatorios = () => {
    const nuevosPedidos = []
    for (let i = 1; i <= numPedidos; i++) {
      nuevosPedidos.push({
        id: `P${i}`,
        peso: Math.floor(Math.random() * 20) + 5,
        beneficio: Math.floor(Math.random() * 50) + 10,
        x: Math.floor(Math.random() * 100),
        y: Math.floor(Math.random() * 100)
      })
    }
    setPedidos(nuevosPedidos)
  }

  
  
  
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Proyecto 1: Ruteo y Planificación de Cargas</h1>
      <p>Curso: Análisis de Algoritmos</p>
      <p>Algoritmo: Voraz (Greedy)</p>

      <hr />

      <h2>Requisito 1: Entrada de Datos y Configuración</h2>

      <div style={{ marginBottom: '20px' }}>
        <label>
          <strong>Capacidad Máxima del Vehículo (W):</strong>
        </label>
        <br />


        <input
          type="number"
          value={capacidad}
          onChange={(e) => setCapacidad(Number(e.target.value))}
          min="1"
          style={{ padding: '8px', marginTop: '5px', width: '200px' }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>
          <strong>Cantidad de pedidos a generar (N):</strong>
        </label>
        <br />


        <input
          type="number"
          value={numPedidos}
          onChange={(e) => setNumPedidos(Number(e.target.value))}
          min="1"
          max="50"
          style={{ padding: '8px', marginTop: '5px', width: '200px', marginRight: '10px' }}
        />
        
        
        
        <button
          onClick={generarPedidosAleatorios}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >

          Generar Pedidos Aleatorios
        </button>
      </div>

      {pedidos.length > 0 && (
        <div>
          <h3>Pedidos Generados ({pedidos.length})</h3>
          <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f0f0' }}>
                <th>ID</th>
                <th>Peso</th>
                <th>Beneficio</th>
                <th>Coordenada X</th>
                <th>Coordenada Y</th>
              </tr>


            </thead>
            <tbody>
              {pedidos.map((pedido) => (
                <tr key={pedido.id}>
                  <td>{pedido.id}</td>
                  <td>{pedido.peso}</td>
                  <td>{pedido.beneficio}</td>
                  <td>{pedido.x}</td>
                  <td>{pedido.y}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )

}



export default App