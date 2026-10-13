import { resultadoEjemplo } from '../utils/datosEjemplo'
import { useState } from 'react'
import TruckCapacity from '../components/TruckCapacity'
import ConfigForm from '../components/ConfigForm'
import OrderForm from '../components/OrderForm'
import OrderList from '../components/OrderList'
import StatePanel from '../components/StatsPanel'

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
                        onGenerar={() => console.log('Generando', numPedidos, 'pedidos')}
                    />

                    <OrderForm
                        onAgregar={agregarPedido}
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

                <div className="stats_contenedor">
                    <TruckCapacity
                        pesoActual={resultadoEjemplo.pesoTotal}
                        capacidad={Number(capacidad)}
                    />

                    <StatePanel
                        procesados={resultadoEjemplo.procesados}
                        seleccionados={resultadoEjemplo.seleccionados}
                        ganancia={resultadoEjemplo.gananciaTotal}
                        tiempoMs={resultadoEjemplo.tiempoMs}
                        operaciones={resultadoEjemplo.operaciones}
                    />
                </div>

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
