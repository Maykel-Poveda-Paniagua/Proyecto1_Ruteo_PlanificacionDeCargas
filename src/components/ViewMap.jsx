/**
 * Componente que representa el mapa de pedidos y la ruta de distribucion
 *
 * Muestra la central, las intersecciones y los pedidos segun su estado
 * Permite reproducir paso a paso la ruta generada por el algoritmo
 
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {Array<Object>} [props.pedidos=[]] - Pedidos que se muestran en el mapa
 * @param {Object|null} [props.resultado=null] - Resultado de la planificacion
 * @param {Array<number|string>} [props.pedidosNuevos=[]] - Identificadores de pedidos pendientes de planificacion
 * @returns {JSX.Element} Mapa interactivo de pedidos y ruta
 */

import { useState, useEffect } from 'react'

const FILAS = 9
const COLUMNAS = 12
const CELDA = 50     // separacion entre calles
const MARGEN = 30    // espacio alrededor del mapa

/**
 * Convierte una columna en una coordenada horizontal del SVG
 * @param {number} columna - Indice de la columna
 * @returns {number} Posición horizontal en el mapa
 */
const posX = (columna) => MARGEN + columna * CELDA

/**
 * Convierte una fila en una coordenada vertical del SVG
 * @param {number} fila - Indice de la fila
 * @returns {number} Posición vertical en el mapa
 */
const posY = (fila) => MARGEN + fila * CELDA

function ViewMap({ pedidos = [], resultado = null, pedidosNuevos = [] }) {

    // Guarda los identificadores de los pedidos seleccionados por el algoritmo
    const seleccionados = new Set((resultado?.seleccionados ?? []).map((p) => p.id))

    // Obtiene los tramos de la ruta calculada
    const pasos = resultado?.pasosRuta ?? []

    // Controlan cuantos tramos se muestran y si la ruta se esta reproduciendo
    const [visibles, setVisibles] = useState(0)
    const [reproduciendo, setReproduciendo] = useState(false)

    const mostrados = visibles

    // Mientras reproduce, agrega un tramo cada 600 ms
    useEffect(() => {
        if (!reproduciendo) return

        // Detiene la animacion cuando se muestra todos los tramos
        if (visibles >= pasos.length) {
            setReproduciendo(false)
            setVisibles(pasos.length)
            return
        }

        const temporizador = setTimeout(() => setVisibles((v) => v + 1), 600)
        return () => clearTimeout(temporizador)
    }, [reproduciendo, visibles, pasos.length])

    // Si se ejecuta el algoritmo otra vez, la animacion se reinicia
    useEffect(() => {
        setReproduciendo(false)
        setVisibles(0)
    }, [resultado])

    // Inicia la reproduccion desde el primer tramo
    const reproducir = () => {
        setVisibles(0)
        setReproduciendo(true)
    }

    // Detiene la reproduccion y muestra el siguiente tramo
    const siguientePaso = () => {
        setReproduciendo(false)
        setVisibles((v) => Math.min((v ?? 0) + 1, pasos.length))
    }

    // Calcula las dimenciones totales del mapa
    const ancho = posX(COLUMNAS - 1) + MARGEN
    const alto = posY(FILAS - 1) + MARGEN

    // Determina el estado de cada pedido segun el resultado de la planificacion
    const estadoDe = (pedido) => {
        if (resultado === null || pedidosNuevos.includes(pedido.id)) return 'pendiente'
        return seleccionados.has(pedido.id) ? 'seleccionado' : 'descartado'
    }

    // Agrupa los pedidos que comparten la misma interseccion
    const grupos = {}
    pedidos.forEach((p) => {
        const clave = `${p.fila}-${p.columna}`
        if (!grupos[clave]) grupos[clave] = []
        grupos[clave].push(p)
    })

    // Si hay varios en una interseccion, se dibuja el de mayor prioridad
    const prioridad = ['seleccionado', 'pendiente', 'descartado']

    return (
        <div className="view_map">
            <h2>Mapa de pedidos</h2>

            <svg
                className="mapa_svg"
                viewBox={`0 0 ${ancho} ${alto}`}
                role="img"
                aria-label="Cuadrícula con la central, los pedidos y la ruta"
            >
                {/* Calles horizontales */}
                {Array.from({ length: FILAS }, (_, fila) => (
                    <line
                        key={`h${fila}`}
                        className="mapa_calle"
                        x1={posX(0)} y1={posY(fila)}
                        x2={posX(COLUMNAS - 1)} y2={posY(fila)}
                    />
                ))}

                {/* Calles verticales */}
                {Array.from({ length: COLUMNAS }, (_, columna) => (
                    <line
                        key={`v${columna}`}
                        className="mapa_calle"
                        x1={posX(columna)} y1={posY(0)}
                        x2={posX(columna)} y2={posY(FILAS - 1)}
                    />
                ))}

                {/* Numeros de los ejes de las columnas*/}
                {Array.from({ length: COLUMNAS }, (_, columna) => (
                    <text key={`tc${columna}`} className="mapa_eje"
                        x={posX(columna)} y={14} textAnchor="middle">
                        {columna}
                    </text>
                ))}

                {/* Numeros de los ejes de las filas*/}
                {Array.from({ length: FILAS }, (_, fila) => (
                    <text key={`tf${fila}`} className="mapa_eje"
                        x={10} y={posY(fila) + 4} textAnchor="middle">
                        {fila}
                    </text>
                ))}

                {/* Muestra los tramos visibles de la ruta */}
                {pasos.slice(0, mostrados).map((paso, i) => (
                    <polyline
                        key={`ruta${i}`}
                        className={paso.regreso ? 'mapa_ruta mapa_ruta_regreso' : 'mapa_ruta'}
                        points={[
                            `${posX(paso.desde.columna)},${posY(paso.desde.fila)}`,
                            `${posX(paso.hasta.columna)},${posY(paso.desde.fila)}`,
                            `${posX(paso.hasta.columna)},${posY(paso.hasta.fila)}`,
                        ].join(' ')}
                    />
                ))}

                {/* Central en (0,0) */}
                <rect
                    className="mapa_central"
                    x={posX(0) - 11} y={posY(0) - 11}
                    width="22" height="22" rx="4"
                />
                <text className="mapa_texto_central" x={posX(0)} y={posY(0) + 4} textAnchor="middle">
                    C
                </text>

                {/* Pedidos agrupados en las intersecciones */}
                {Object.values(grupos).map((grupo) => {
                    const visible = [...grupo].sort(
                        (a, b) => prioridad.indexOf(estadoDe(a)) - prioridad.indexOf(estadoDe(b))
                    )[0]
                    
                    const cx = posX(visible.columna)
                    const cy = posY(visible.fila)

                    return (
                        <g key={`${visible.fila}-${visible.columna}`}>
                            {/* Muestra la informacion de todos los pedidos del grupo */}
                            <title>
                                {`Fila ${visible.fila}, columna ${visible.columna}\n` +
                                    grupo.map((p) => `${p.id}: ${estadoDe(p)}`).join('\n')}
                            </title>

                            <circle
                                className={`mapa_nodo mapa_nodo_${estadoDe(visible)}`}
                                cx={cx} cy={cy} r="13"
                            />
                            <text className="mapa_texto_nodo" x={cx} y={cy + 4} textAnchor="middle">
                                {visible.id}
                            </text>
                                  
                            {/* Cuantos pedidos adicionales comparten la posicion */}
                            {grupo.length > 1 && (
                                <g>
                                    <circle className="mapa_badge" cx={cx + 12} cy={cy - 12} r="8" />
                                    <text className="mapa_texto_badge" x={cx + 12} y={cy - 9} textAnchor="middle">
                                        +{grupo.length - 1}
                                    </text>
                                </g>
                            )}
                        </g>
                    )
                })}
            </svg>

            {/* Controles para reproducir la velocidad y poder recorrer la ruta */}
            <div className="mapa_controles">
                
                <button onClick={reproducir} disabled={pasos.length === 0}>Reproducir ruta</button>
                <button onClick={siguientePaso} disabled={pasos.length === 0 || mostrados >= pasos.length}>
                    Siguiente paso
                </button>

                <button onClick={() => { setReproduciendo(false); setVisibles(pasos.length) }} disabled={pasos.length === 0}>
                    Ver completa
                </button>

                {/* Progreso de la ruta */}
                <span className="mapa_progreso">
                    {pasos.length > 0 && `Tramo ${mostrados} de ${pasos.length}`}
                </span>

            </div>

            {/* Colores y simbolos utilizados en el mapa */}
            <div className="mapa_leyenda">
                <span>C: central</span>
                <span>Verde: cargado</span>
                <span>Rojo: descartado</span>
                <span>Gris: pendiente</span>
                <span>Línea: ruta</span>
            </div>
        </div>
    )
}

export default ViewMap