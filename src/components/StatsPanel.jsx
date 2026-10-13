// Muestra estadisticas de la ejecucion del algoritmo

function StatePanel({ procesados = 0, seleccionados = [], ganancia = 0, tiempoMs = 0, operaciones = 0 }){
    return (
        <div className="stats_panel">
            <div className="stats_fila">
                <span className="stats_etiqueta">Pedidos</span>
                <span className="stats_valor">
                    {seleccionados.length} / {procesados}
                </span>
            </div>
            <div className="stats_fila">
                <span className="stats_etiqueta">Ganancia total</span>
                <span className="stats_valor">{ganancia}</span>
            </div>

            <div className="stats_fila">
                <span className="stats_etiqueta">Tiempo de ejecución</span>
                <span className="stats_valor">{Number(tiempoMs).toFixed(2)} ms</span>
            </div>

            <div className="stats_fila">
                <span className="stats_etiqueta">Operaciones</span>
                <span className="stats_valor">{operaciones}</span>
            </div>
        </div>

    )
}

export default StatePanel