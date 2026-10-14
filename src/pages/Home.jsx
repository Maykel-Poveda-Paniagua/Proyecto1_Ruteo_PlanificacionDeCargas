import { generarPedidosAleatorios, seleccionarPedidosVoraz } from '../utils/logistica'
import { useState } from 'react'
import TruckCapacity from '../components/TruckCapacity'
import ConfigForm from '../components/ConfigForm'
import OrderForm from '../components/OrderForm'
import OrderList from '../components/OrderList'

function Home() {

    const [capacidad, setCapacidad] = useState('100');
    const [numPedidos, setNumPedidos] = useState('5');
    const [pedidos, setPedidos] = useState([]);
    
    const agregarPedido = (nuevo) => {
        if (pedidos.some((p) => p.id === nuevo.id)) {
            alert('Ya existe un pedido con ese ID')
            return
        }
        setPedidos([...pedidos, nuevo])
    }

    return (
        <div className="panel_principal">

            <h1>Ruteo y Planificación de Cargas</h1>

            {/* Dos columnas superiores */}
            <div className="panel_superior">

                {/* Columna izquierda: formularios */}
                <div className="panel_izquierdo">

                    <ConfigForm
                        capacidad={capacidad}
                        setCapacidad={setCapacidad}
                        numPedidos={numPedidos}
                        setNumPedidos={setNumPedidos}
                        onGenerar={() => {
                            const nuevos = generarPedidosAleatorios(Number(numPedidos))
                            setPedidos(nuevos)
                            ejecutarAlgoritmo(nuevos, capacidad)
                        }}
                    />

                    <OrderForm
                    onAgregar={(pedido) => {
                        if (pedidos.some((p) => p.id === pedido.id)) {
                            alert('Ya existe un pedido con ese ID')
                            return
                        }
                        const nuevosPedidos = [...pedidos, pedido]
                        setPedidos(nuevosPedidos)
                        ejecutarAlgoritmo(nuevosPedidos, capacidad)
                    }}
                    />

                </div>

                {/* Columna derecha: mapa */}
                <div className="panel_derecho">
                    {/* componente del mapa */}
                </div>

            </div>

            {/* Estadisticas debajo de las dos columnas */}
            <div className="seccion_estadisticas">

                <h2>Estadísticas</h2>

                <TruckCapacity
                    
                    pesoActual={resultado?.pesoTotal || 0}
                    capacidad={Number(capacidad)}
                />

            </div>

            {/* Info en tiempo real */}
            <div className="seccion_tiempo_real">

                <h2>Información en tiempo real</h2>

                <OrderList
                    pedidos={pedidos}
                    seleccionados={resultadoEjemplo.seleccionados}
                />

            </div>

        </div>
    )
}

export default Home
