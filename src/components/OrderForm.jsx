// Formulario para ingresar un pedido a mano

import { useState } from 'react'

function OrderForm({ onAgregar }) {
    
    const [peso, setPeso] = useState('')
    const [beneficio, setBeneficio] = useState('')
    const [fila, setFila] = useState('')
    const [columna, setColumna ] = useState('')
    
    const agregarPedido = () => {
        if (peso === '' || beneficio === '' || fila === '' || columna === '') {
            alert('Todos los campos son obligatorios')
            return
        }

        if (
            !Number.isFinite(Number(peso)) ||
            !Number.isFinite(Number(beneficio)) ||
            !Number.isInteger(Number(fila)) ||
            !Number.isInteger(Number(columna)) ||
            Number(peso) <= 0 ||
            Number(beneficio) <= 0 ||
            Number(fila) < 0 || Number(fila) > 8 ||
            Number(columna) < 0 || Number(columna) > 11
        ) {
            alert('Los valores de peso, beneficio y coordenadas deben ser válidos')
            return
        }

        if (Number(fila) === 0 && Number(columna) === 0) {
            alert('No se puede colocar un pedido en la central (0,0).')
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