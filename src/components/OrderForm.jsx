// Formulario para ingresar un pedido a mano

import { useState } from 'react'

function OrderForm({ onAgregar }) {
    
    const [peso, setPeso] = useState('')
    const [beneficio, setBeneficio] = useState('')
    const [x, setX] = useState('')
    const [y, setY] = useState('')
    
    const agregarPedido = () => {
        if (peso === '' || beneficio === '' || x === '' || y === '') {
            alert('Todos los campos son obligatorios')
            return
        }

        if (
            !Number.isFinite(Number(peso)) ||
            !Number.isFinite(Number(beneficio)) ||
            !Number.isFinite(Number(x)) ||
            !Number.isFinite(Number(y)) ||
            Number(peso) <= 0 ||
            Number(beneficio) <= 0 ||
            Number(x) < 0 || Number(x) > 100 ||
            Number(y) < 0 || Number(y) > 100
        ) {
            alert('Los valores de peso, beneficio y coordenadas deben ser válidos')
            return
        }

        const agregado = onAgregar({
            peso: Number(peso),
            beneficio: Number(beneficio),
            x: Number(x),
            y: Number(y)
        })

        if (agregado) {
            setPeso('')
            setBeneficio('')
            setX('')
            setY('')
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
                {/* input de coordenada x */}
                <label htmlFor="x">Coordenada X:</label>
                <input
                    type="number"
                    id="x"
                    value={x}
                    onChange={(e) => setX(e.target.value)}
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
                    onChange={(e) => setY(e.target.value)}
                    min="0"
                    max="100"
                />
            </div>

            {/* boton de agregar */}
            <button className="order_boton" onClick={agregarPedido}>
                Agregar pedido
            </button>

        </div>
    )
} 

export default OrderForm