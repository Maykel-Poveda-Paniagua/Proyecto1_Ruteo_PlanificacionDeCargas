// Formulario para configurar la capacidad del camion y la
//  cantidad de pedidos

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