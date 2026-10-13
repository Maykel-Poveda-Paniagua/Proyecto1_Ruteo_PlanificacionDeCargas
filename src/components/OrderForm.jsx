// Formulario para ingresar un pedido a mano

import { useState } from 'react'

function OrderForm({ onAgregar }) {
    
    const [id, setId] = useState('')
    const [peso, setPeso] = useState('')
    const [beneficio, setBeneficio] = useState('')
    const [x, setX] = useState('')
    const [y, setY] = useState('')
    const [error, setError] = useState('')
    
    const agregarPedido = () => {
        if (id.trim() === '' || peso === '' || beneficio === '' || x === '' || y === ''){
            setError('Todos los campos son obligatorios')
        
        } else if (Number(peso) <= 0 || Number(beneficio) <= 0 || Number(x) < 0 || Number(x) > 100 || Number(y) < 0 || Number(y) > 100) {
            setError('Los valores de peso, beneficio y coordenadas deben ser válidos')
        } else {
            setError('')
            onAgregar({ id: id, peso: Number(peso), beneficio: Number(beneficio), x: Number(x), y: Number(y) })
            setId('')
            setPeso('')
            setBeneficio('')
            setX('')
            setY('')
        }
    } 
    
    return (
        <div className="order_form">
            
            <div className="order_id">
                {/* input de id */}
                <label htmlFor="id">ID:</label>
                <input
                    type="text"
                    id="id"
                    value={id}
                    onChange={(e) => { setId(e.target.value); setError('')}}
                />
            </div>

            <div className="order_peso">
                {/* input de peso */}
                <label htmlFor="peso">Peso:</label>
                <input
                    type="number"
                    id="peso"
                    value={peso}
                    onChange={(e) => { setPeso(e.target.value); setError('')}}
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
                    onChange={(e) => { setBeneficio(e.target.value); setError('')}}
                    min="1"
                />
            </div>

            <div className="order_x">
                {/* input de coordenada x */}
                <label htmlFor="x">Coordenada X:</label>
                <input
                    type="number"
                    id="x"
                    value={x}
                    onChange={(e) => { setX(e.target.value); setError('')}}
                    min="0"
                    max="100"
                />
            </div>

            <div className="order_y">
                {/* input de coordenada y */}
                <label htmlFor="y">Coordenada Y:</label>
                <input
                    type="number"
                    id="y"
                    value={y}
                    onChange={(e) => { setY(e.target.value); setError('')}}
                    min="0"
                    max="100"
                />
            </div>

            {/* boton de agregar */}
            <button className="order_boton" onClick={agregarPedido}>Agregar pedido</button>

            {/* Muestra el error si hay alguno */}
            {error && <p className="order_error">{error}</p>}

        </div>
    )
} 

export default OrderForm