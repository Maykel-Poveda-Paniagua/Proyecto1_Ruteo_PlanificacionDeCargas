import { useState } from 'react'
import { generarPedidosAleatorios, planificarCargaYRuta } from '../algorithms/logistica'

// hook que conecta el algoritmo con la interfaz

function useLogistica() {
    const [resultado, setResultado] = useState(null)
    const [capacidad, setCapacidad] = useState('100')
    const [numPedidos, setNumPedidos] = useState('5')
    const [pedidosNuevos, setPedidosNuevos] = useState([])
    const [pedidos, setPedidos] = useState([])
    const [capacidadAplicada, setCapacidadAplicada] = useState(100)
    const [hayCambios, setHayCambios] = useState(false)
    const [mensaje, setMensaje] = useState('')

    // agrega un pedido manual con ID automatico
    const agregarPedido = (nuevo) => {
        const idsExistentes = pedidos.map((p) => Number(p.id.slice(1)))
        const siguienteId = Math.max(0, ...idsExistentes) + 1
        const nuevoPedido = { ...nuevo, id: `P${siguienteId}` }
        const nuevosPedidos = [...pedidos, nuevoPedido]
        setPedidos(nuevosPedidos)
        setPedidosNuevos([...pedidosNuevos, nuevoPedido.id])
        setHayCambios(true)
        return true
    }

    // ejecuta el algoritmo de planificacion
    const planificar = (listaPedidos, capacidadActual) => {
        if (listaPedidos.length === 0) {
            setMensaje('No hay pedidos para planificar.')
            return false
        }
        const nuevoResultado = planificarCargaYRuta(
            listaPedidos,
            Number(capacidadActual)
        )
        setResultado(nuevoResultado)
        setPedidosNuevos([])
        setCapacidadAplicada(Number(capacidadActual))
        setHayCambios(false)
        return true
    }



    // genera pedidos aleatorios y los planifica
    const generarPedidos = () => {
        const cantidad = Number(numPedidos)
        const capacidadActual = Number(capacidad)
        if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > 50) {
            setMensaje('La cantidad debe ser un entero entre 1 y 50.')
            return
        }
        if (!Number.isFinite(capacidadActual) || capacidadActual <= 0) {
            setMensaje('La capacidad debe ser mayor que cero.')
            return
        }

        const nuevosPedidos = generarPedidosAleatorios(cantidad)
        planificar(nuevosPedidos, capacidadActual)
        setPedidos(nuevosPedidos)
        setHayCambios(false)
    }

    // ejecuta la planificacion con los pedidos actuales
    const ejecutar = () => {
        if (pedidos.length === 0) {
            setMensaje('Primero debe generar o agregar pedidos.')
            return
        }
        planificar(pedidos, capacidad)
    }

    return {
        resultado,
        capacidad,
        setCapacidad,
        numPedidos,
        setNumPedidos,
        pedidosNuevos,
        pedidos,
        capacidadAplicada,
        hayCambios,
        mensaje,
        setMensaje,
        agregarPedido,
        generarPedidos,
        ejecutar,
    }
}

export default useLogistica