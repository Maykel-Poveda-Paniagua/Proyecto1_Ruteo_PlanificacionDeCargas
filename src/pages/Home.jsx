import { useState } from 'react'
import {generarPedidosAleatorios, planificarCargaYRuta} from '../algorithms/logistica'
import TruckCapacity from '../components/TruckCapacity'
import ConfigForm from '../components/ConfigForm'
import OrderForm from '../components/OrderForm'
import OrderList from '../components/OrderList'
import StatsPanel from '../components/StatsPanel'

function Home() {

    const [resultado, setResultado] = useState(null);
    const [capacidad, setCapacidad] = useState('100');
    const [numPedidos, setNumPedidos] = useState('5');
    const [pedidosNuevos, setPedidosNuevos] = useState([]);
    const [pedidos, setPedidos] = useState([]);
    const [capacidadAplicada, setCapacidadAplicada] = useState(100);
    const [hayCambios, setHayCambios] = useState(false);
    
    const agregarPedido = (nuevo) => {
        const idsExistentes = pedidos.map((p) => Number(p.id.slice(1)))
        const siguienteId = Math.max(0, ...idsExistentes) + 1

        const nuevoPedido = {...nuevo, id: `P${siguienteId}`}
        const nuevosPedidos = [...pedidos, nuevoPedido]

        setPedidos(nuevosPedidos)
        setPedidosNuevos([...pedidosNuevos, nuevoPedido.id])
        setHayCambios(true)
        return true
    }

    const planificar = (listaPedidos, capacidadActual) => {
        try {
            const nuevoResultado = planificarCargaYRuta(
                listaPedidos,
                Number(capacidadActual)
            )

            setResultado(nuevoResultado)
            setPedidosNuevos([])
            setCapacidadAplicada(Number(capacidadActual))
            setHayCambios(false)

            return true

        } catch (err) {
            alert(err.message)
            return false
        }
    }

    const generarPedidos = () => {
        const cantidad = Number(numPedidos)
        const capacidadActual = Number(capacidad)

        if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > 50) {
            alert('La cantidad debe ser un entero entre 1 y 50.')
            return
        }

        if (!Number.isFinite(capacidadActual) || capacidadActual <= 0) {
            alert('La capacidad debe ser mayor que cero.')
            return
        }

        try {
            const nuevosPedidos = generarPedidosAleatorios(cantidad)

            if (planificar(nuevosPedidos, capacidadActual)) {
                setPedidos(nuevosPedidos)
                setHayCambios(false)
            }
        } catch (err) {
            alert(err.message)
        }
    }

    const ejecutar = () => {
        if (pedidos.length === 0) {
            alert('Primero debe generar o agregar pedidos.')
            return
        }

        planificar(pedidos, capacidad)
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
                        onGenerar={generarPedidos}
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

            <div className="ejecutar_algoritmo">
                <button className="boton_ejecutar"
                    onClick={ejecutar} 
                >
                    Ejecutar Algoritmo
                </button>

            </div>

            {/* Estadisticas debajo de las dos columnas */}
            <div className="seccion_estadisticas">

                <h2>Estadísticas</h2>

                <div className="stats_contenedor">
                    <TruckCapacity
                        pesoActual={resultado?.pesoTotal ?? 0}
                        capacidad={capacidadAplicada}
                    />

                    <StatsPanel
                        procesados={resultado?.procesados ?? 0}
                        seleccionados={resultado?.seleccionados ?? []}
                        ganancia={resultado?.ganancia ?? 0}
                        tiempoMs={resultado?.tiempoMs ?? 0}
                        operaciones={resultado?.operaciones ?? 0}
                    />
                </div>

            </div>

            {/* Info en tiempo real */}
            <div className="seccion_tiempo_real">

                <h2>Información en tiempo real</h2>

                <OrderList
                    pedidos={pedidos}
                    seleccionados={resultado?.seleccionados ?? []}
                    hayCambios={hayCambios}
                    pedidosNuevos={pedidosNuevos}
                />

            </div>

        </div>
    )
}

export default Home