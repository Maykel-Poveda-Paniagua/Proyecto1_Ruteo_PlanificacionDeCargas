// Tabla con los pedidos ingresados y su estado

function OrderList({pedidos, seleccionados = [], hayCambios = false, pedidosNuevos = []}) {

    if (pedidos.length === 0) {
        return <p className="orders_vacio">No hay pedidos para mostrar.</p>;
    }

    return (
        <table className="orders_tabla">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Peso</th>
                    <th>Beneficio</th>
                    <th>Rentabilidad</th>
                    <th>Fila</th>
                    <th>Columna</th>
                    <th>Estado</th>
                </tr>
            </thead>
            <tbody> 
                {pedidos.map((pedido) => {

                    // Comprueba si el algoritmo selecciono el pedido
                    const cargado = seleccionados.some((s) => s.id === pedido.id);

                    // Identifica los pedidos nuevos que todavia no se han planificado
                    const sinActualizar = hayCambios && pedidosNuevos.includes(pedido.id);

                    return (
                        <tr key= {pedido.id}> 
                            <td>{pedido.id}</td>
                            <td>{pedido.peso}</td>
                            <td>{pedido.beneficio}</td>

                            {/* Beneficio obtenido por cada unidad de peso */}
                            <td>{(pedido.beneficio / pedido.peso).toFixed(2)}</td>
                            <td>{pedido.fila}</td>
                            <td>{pedido.columna}</td>
                            
                            {/* Asigna un ClassName y un estados segun la situacion que esta el pedido */}
                            <td className={sinActualizar ? 'orders_sin_actualizar' : 
                                            cargado ? 'orders_cargado' :  
                                            'orders_descartado'}>
                                
                                {sinActualizar ? 'Pendiente' : 
                                            cargado ? 'Cargado' : 
                                            'Descartado'}
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}

export default OrderList;