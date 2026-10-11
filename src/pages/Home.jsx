import { resultadoEjemplo } from '../utils/datosEjemplo'
import { useState } from 'react'
import TruckCapacity from '../components/TruckCapacity'
import ConfigForm from '../components/ConfigForm'
import OrderForm from '../components/OrderForm'

function Home() {

    const [capacidad, setCapacidad] = useState('100');
    const [numPedidos, setNumPedidos] = useState('5');

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
                        onAgregar={(pedido) => console.log('Agregando pedido', pedido)}
                    />

                </div>

                {/* Columna derecha: mapa */}
                <div className="panel_derecho">
                    {/* componente del mapa */}
                </div>

            </div>

            {/* Estadísticas debajo de las dos columnas */}
            <div className="seccion_estadisticas">

                <h2>Estadísticas</h2>

                <TruckCapacity
                    pesoActual={resultadoEjemplo.pesoTotal}
                    capacidad={Number(capacidad)}
                />

            </div>

            {/* Info en tiempo real */}
            <div className="seccion_tiempo_real">

                <h2>Información en tiempo real</h2>

                {/* Info del sistema */}

            </div>

        </div>
    )
}

export default Home
