// Formulario para ingresar un pedido a mano
import Aviso from './Aviso'
import { useState } from 'react'

function OrderForm({ onAgregar }) {
    
    const [peso, setPeso] = useState('')
    const [beneficio, setBeneficio] = useState('')
    const [fila, setFila] = useState('')
    const [columna, setColumna ] = useState('')
    const [mensaje, setMensaje] = useState('')

    const agregarPedido = () => {
        if (peso === '') {
            setMensaje('Falta ingresar el peso')
            return
        }

        if (beneficio === '') {
            setMensaje('Falta ingresar el beneficio')
            return
        }

        if (fila === '') {
            setMensaje('Falta seleccionar la fila')
            return
        }

        if (columna === '') {
            setMensaje('Falta seleccionar la columna')
            return
        }

        if (Number(peso) <= 0) {
            setMensaje('El peso debe ser mayor que 0')
            return
        }

        if (Number(beneficio) <= 0) {
            setMensaje('El beneficio debe ser mayor que 0')
            return
        }

        if (Number(fila) === 0 && Number(columna) === 0) {
            setMensaje('No se puede colocar un pedido en la central (0,0).')
            return
        }

        const agregado = onAgregar({
            peso: Number(peso),
            beneficio: Number(beneficio),
            fila: Number(fila),
            columna: Number(columna)
        })

        if (agregado) {
            setPeso('')
            setBeneficio('')
            setFila('')
            setColumna('')
        }
    }
    
    return (
        <div className="order_form">
            <Aviso mensaje={mensaje} onCerrar={() => setMensaje('')} />

            <div className="order_peso">
                {/* input de peso */}
                <label htmlFor="peso">Peso:</label>
                <input
                    type="number"
                    id="peso"
                    value={peso}
                    onChange={(e) => setPeso(e.target.value)}
                    min="1"
                />
            </div>

            <div className="order_beneficio">
                {/* input de beneficio */}
                <label htmlFor="beneficio">Beneficio:</label>
                <input
                    type="number"
                    id="beneficio"
                    value={beneficio}
                    onChange={(e) => setBeneficio(e.target.value)}
                    min="1"
                />
            </div>

            <div className="order_x">
                <label htmlFor="fila">Coordenada Fila:</label>
                <select
                    id="fila"
                    value={fila}
                    onChange={(e) => setFila(e.target.value)}
                >
                    <option value="">Seleccionar fila</option>
                    {Array.from({ length: 9 }, (_, i) => (
                        <option key={i} value={i}>{i}</option>
                    ))}
                </select>
            </div>

            <div className="order_y">
                <label htmlFor="columna">Coordenada Columna:</label>
                <select
                    id="columna"
                    value={columna}
                    onChange={(e) => setColumna(e.target.value)}
                >
                    <option value="">Seleccionar columna</option>
                    {Array.from({ length: 12 }, (_, i) => (
                        <option key={i} value={i}>{i}</option>
                    ))}
                </select>
            </div>

            {/* boton de agregar */}
            <button className="order_boton" onClick={agregarPedido}>
                Agregar pedido
            </button>

        </div>
    )
} 

export default OrderForm