/**
 * Componente que muestra las estadisticas de ejecucion del algoritmo
 *
 * Presenta la cantidad de pedidos seleccionados respecto a los procesados
 * la ganancia total, el tiempo de ejecucion y las operaciones registradas
 *
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {number} [props.procesados=0] - Cantidad de pedidos procesados
 * @param {Array<Object>} [props.seleccionados=[]] - Pedidos seleccionados por el algoritmo
 * @param {number} [props.ganancia=0] - Ganancia total obtenida
 * @param {number} [props.tiempoMs=0] - Tiempo de ejecucion en milisegundos
 * @param {number} [props.operaciones=0] - Total de operaciones registradas
 * @returns {JSX.Element} Panel con las estadisticas de ejecucion
 */

function StatsPanel({ procesados = 0, seleccionados = [], ganancia = 0, tiempoMs = 0, operaciones = 0 }){
    return (
        <div className="stats_panel">

            {/* Cantidad de pedidos seleccionados respecto a lo procesado */}
            <div className="stats_fila">
                <span className="stats_etiqueta">Pedidos</span>
                <span className="stats_valor">
                    {seleccionados.length} / {procesados}
                </span>
            </div>

            {/* Ganancia total obtenida con los pedidos seleccionados */}
            <div className="stats_fila">
                <span className="stats_etiqueta">Ganancia total</span>
                <span className="stats_valor">{ganancia}</span>
            </div>

            {/* Tiempo que tardo la ejecucion del algoritmo en ms */}
            <div className="stats_fila">
                <span className="stats_etiqueta">Tiempo de ejecución</span>
                <span className="stats_valor">{Number(tiempoMs).toFixed(2)} ms</span>
            </div>

            {/* Cantidad de operaciones registradas en la ejecucion */}
            <div className="stats_fila">
                <span className="stats_etiqueta">Operaciones</span>
                <span className="stats_valor">{operaciones}</span>
            </div>
        </div>

    )
}

export default StatsPanel