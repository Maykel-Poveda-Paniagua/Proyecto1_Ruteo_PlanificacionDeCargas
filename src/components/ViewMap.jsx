
function ViewMap({ pedidos = [], resultado = null }) {
    const seleccionados = new Set(
        (resultado?.seleccionados ?? []).map((pedido) => pedido.id)
    )

    return (
        <div className="view_map">
            <h2>Mapa de pedidos</h2>

            <div className="mapa_contenedor">
                <div className="mapa_matriz">
                    {Array.from({ length: 9 }, (_, fila) =>
                        Array.from({ length: 12 }, (_, columna) => {
                            const pedido = pedidos.find(
                                (p) => p.fila === fila && p.columna === columna
                            )

                            const esSeleccionado = pedido && seleccionados.has(pedido.id)

                            return (
                                <div
                                    key={`${fila}-${columna}`} className={`mapa_celda ${
                                        pedido ? esSeleccionado
                                        ? 'seleccionado' : 'descartado' : ''
                                    }`}
                                    title={
                                        pedido ? `${pedido.id}: fila ${fila}, columna ${columna}`
                                        : `Fila ${fila}, columna ${columna}`
                                    }
                                >
                                    {fila === 0 && columna === 0 ? 'C' : pedido ? pedido.id: ''}
                                </div>
                            )
                        })
                    )}
                </div>
            </div>

            <div className="mapa_leyenda">
                <span>C: Central</span>
                <span>Verde: seleccionado</span>
                <span>Rojo: descartado</span>
            </div>
        </div>
    )
}

export default ViewMap
