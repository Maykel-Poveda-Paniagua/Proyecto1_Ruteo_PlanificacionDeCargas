// Tabla con los pedidos ingresados y su estado

function OrderList({pedidos, seleccionados = []}) {

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
                    <th>X</th>
                    <th>Y</th>
                    <th>Estado</th>
                </tr>
            </thead>
            <tbody>
                {pedidos.map((pedido) => {

                    const cargado = seleccionados.some((s) => s.id === pedido.id);

                    return (
                        <tr key= {pedido.id}> 
                            <td>{pedido.id}</td>
                            <td>{pedido.peso}</td>
                            <td>{pedido.beneficio}</td>
                            <td>{(pedido.beneficio / pedido.peso).toFixed(2)}</td>
                            <td>{pedido.x}</td>
                            <td>{pedido.y}</td>
                            <td className={cargado ? 'orders_cargado' : 'orders_descartado'}>
                                {cargado ? 'Cargado' : 'Pendiente'}
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}

export default OrderList;