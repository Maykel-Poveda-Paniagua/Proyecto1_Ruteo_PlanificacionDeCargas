/**
 * Componente que permite configurar la capacidad del camión
 * y la cantidad de pedidos que se desean generar.
 *
 * Permite modificar ambos valores y ejecutar la función encargada
 * de generar los pedidos.
 *
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {number|string} props.capacidad - Capacidad máxima del camión.
 * @param {Function} props.setCapacidad - Función para actualizar la capacidad.
 * @param {number|string} props.numPedidos - Cantidad de pedidos que se generarán.
 * @param {Function} props.setNumPedidos - Función para actualizar la cantidad de pedidos.
 * @param {Function} props.onGenerar - Función que inicia la generación de pedidos.
 * @returns {JSX.Element} Formulario de configuración.
 */

function ConfigForm({ capacidad, setCapacidad, numPedidos, setNumPedidos, onGenerar }) {
    return (
        <div className="config_form">
            
            <div className="config_campo">
                {/* input de capacidad */}
                <label htmlFor="capacidad">Capacidad máxima:</label>
                <input
                    type="number"
                    id="capacidad"
                    value={capacidad}
                    onChange={(e) => setCapacidad(e.target.value)}
                    min="1"
                />
            </div>

            <div className="config_campo">
                {/* input de cantidad */}
                <label htmlFor="numPedidos">Cantidad de pedidos:</label>
                <input
                    type="number"
                    id="numPedidos"
                    value={numPedidos}
                    onChange={(e) => setNumPedidos(e.target.value)}
                    min="1"
                    max="50"
                />
            </div>

                {/* boton de generar */}
                <button className="config_boton" onClick={onGenerar}>Generar pedidos</button>

        </div>
    )
} 

export default ConfigForm