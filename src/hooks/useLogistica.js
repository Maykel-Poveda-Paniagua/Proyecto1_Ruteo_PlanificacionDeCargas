import { useState } from 'react'
import { generarPedidosAleatorios, planificarCargaYRuta } from '../algorithms/logistica'


/**
 * Hook que conecta el algoritmo de logística con la interfaz.
 * Encapsula los estados y funciones necesarios para gestionar pedidos,
 * capacidad del vehículo y resultados de la planificación.
 *
 * @hook
 * @returns {Object} Objeto con estados y funciones del hook
 * @returns {Object|null} returns.resultado - Resultado de la última planificación
 * @returns {string} returns.capacidad - Capacidad máxima del vehículo
 * @returns {Function} returns.setCapacidad - Función para actualizar la capacidad
 * @returns {string} returns.numPedidos - Cantidad de pedidos a generar
 * @returns {Function} returns.setNumPedidos - función para actualizar la cantidad
 * @returns {Array} returns.pedidosNuevos - Lista de ID de pedidos recién agregados
 * @returns {Array} returns.pedidos - lista completa de pedidos
 * @returns {number} returns.capacidadAplicada - Capacidad usada en la última planificación
 * @returns {boolean} returns.hayCambios - Dice si hay pedidos sin actualizar
 * @returns {string} returns.mensaje - Mensaje de aviso para mostrar
 * @returns {Function} returns.setMensaje - Función para actualizar el mensaje
 * @returns {Function} returns.agregarPedido - Función para agregar un pedido manual.
 * @returns {Function} returns.generarPedidos - Función para generar pedidos aleatorios
 * @returns {Function} returns.ejecutar - Función para ejecutar la planificación
 */
function useLogistica() {
    const [resultado, setResultado] = useState(null)
    const [capacidad, setCapacidad] = useState('100')
    const [numPedidos, setNumPedidos] = useState('5')
    const [pedidosNuevos, setPedidosNuevos] = useState([])
    const [pedidos, setPedidos] = useState([])
    const [capacidadAplicada, setCapacidadAplicada] = useState(100)
    const [hayCambios, setHayCambios] = useState(false)
    const [mensaje, setMensaje] = useState('')

    /**
     * Agrega un pedido manual a la lista, asignándole un ID automático
     *
     * @param {Object} nuevo - Pedido a agregar
     * @param {number} nuevo.peso - Peso del pedido
     * @param {number} nuevo.beneficio - Beneficio del pedido
     * @param {number} nuevo.fila - Fila de la coordenada
     * @param {number} nuevo.columna - Columna de la coordenada
     * @returns {boolean} true si el pedido fue agregado exitosamente
     */
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

    /**
     * Ejecuta el algoritmo de planificación sobre una lista de pedidos
     *
     * @param {Array} listaPedidos - Lista de pedidos a planificar
     * @param {string|number} capacidadActual - Capacidad máxima del vehículo
     * @returns {boolean} true si la planificación fue exitosa y false si hubo error
     */
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

    /**
     * Genera pedidos aleatorios y los planifica automáticamente.
     * Valida que la cantidad y capacidad sean valores correctos antes de ejecutar
     */
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

    /**
     * Ejecuta la planificación con los pedidos actuales en la lista
     * Muestra un mensaje de error si no hay pedidos disponibles.
     */
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