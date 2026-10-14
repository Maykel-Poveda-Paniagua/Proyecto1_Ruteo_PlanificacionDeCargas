import TruckCapacity from '../components/TruckCapacity'
import ConfigForm from '../components/ConfigForm'
import OrderForm from '../components/OrderForm'
import OrderList from '../components/OrderList'
import StatsPanel from '../components/StatsPanel'
import useLogistica from '../hooks/useLogistica'
import Aviso from '../components/Aviso'
import ViewMap from '../components/ViewMap'


function Home() {

    // Obtiene los estados y las funciones
    const {
        resultado,
        capacidad,
        setCapacidad,
        numPedidos,
        setNumPedidos,
        pedidosNuevos,
        pedidos,
        capacidadAplicada,
        hayCambios,
        mensaje,
        setMensaje,
        agregarPedido,
        generarPedidos,
        ejecutar,
    } = useLogistica()

    return (
        <div className="panel_principal">

            {/* Muestra los mensajes de las validaciones */}
            <Aviso mensaje={mensaje} onCerrar={() => setMensaje('')} />

            <h1>Ruteo y Planificación de Cargas</h1>

            {/* Formulario y el mapa en dos columnas */}
            <div className="panel_superior">

                {/* Columna izquierda: registro de los pedidos */}
                <div className="panel_izquierdo">

                    {/* Configurar el camion y generar pedidos */}
                    <ConfigForm
                        capacidad={capacidad}
                        setCapacidad={setCapacidad}
                        numPedidos={numPedidos}
                        setNumPedidos={setNumPedidos}
                        onGenerar={generarPedidos}
                    />

                    {/* Permite ingresar pedidos manualmente */}
                    <OrderForm
                        onAgregar={agregarPedido}
                    />

                </div>

                {/* Columna derecha: mapa con los pedidos */}
                <div className="panel_derecho">
                    <ViewMap pedidos={pedidos} resultado={resultado} pedidosNuevos={pedidosNuevos}/>
                </div>

            </div>

            {/* Ejecuta el algoritmo con los pedidos registrados */}
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

            {/* Muestra los pedidos y sus estados en tiempo real */}
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