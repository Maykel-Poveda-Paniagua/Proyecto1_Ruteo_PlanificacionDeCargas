// Mapa donde los pedidos están en las intersecciones y la ruta
// recorre las calles. La central esta en (0,0).

import { useState, useEffect } from 'react'

const FILAS = 9
const COLUMNAS = 12
const CELDA = 50     // separacion entre calles
const MARGEN = 30    // espacio alrededor

// Convierten fila/columna en posicion dentro del SVG
const posX = (columna) => MARGEN + columna * CELDA
const posY = (fila) => MARGEN + fila * CELDA

function ViewMap({ pedidos = [], resultado = null, pedidosNuevos = [] }) {
    const seleccionados = new Set((resultado?.seleccionados ?? []).map((p) => p.id))
    const pasos = resultado?.pasosRuta ?? []

    const [visibles, setVisibles] = useState(0)
    const [reproduciendo, setReproduciendo] = useState(false)

    const mostrados = visibles

    // Mientras reproduce, agrega un tramo cada 600 ms
    useEffect(() => {
        if (!reproduciendo) return

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

    const reproducir = () => {
        setVisibles(0)
        setReproduciendo(true)
    }

    const siguientePaso = () => {
        setReproduciendo(false)
        setVisibles((v) => Math.min((v ?? 0) + 1, pasos.length))
    }

    const ancho = posX(COLUMNAS - 1) + MARGEN
    const alto = posY(FILAS - 1) + MARGEN

    // Antes de ejecutar, o si el pedido es nuevo, el estado es pendiente
    const estadoDe = (pedido) => {
        if (resultado === null || pedidosNuevos.includes(pedido.id)) return 'pendiente'
        return seleccionados.has(pedido.id) ? 'seleccionado' : 'descartado'
    }

    // Agrupa los pedidos que caen en la misma interseccion
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

                {/* Numeros de los ejes */}
                {Array.from({ length: COLUMNAS }, (_, columna) => (
                    <text key={`tc${columna}`} className="mapa_eje"
                        x={posX(columna)} y={14} textAnchor="middle">
                        {columna}
                    </text>
                ))}

                {Array.from({ length: FILAS }, (_, fila) => (
                    <text key={`tf${fila}`} className="mapa_eje"
                        x={10} y={posY(fila) + 4} textAnchor="middle">
                        {fila}
                    </text>
                ))}

                {/* Ruta donde cada tramo va primero en horizontal y luego en vertical */}
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

                {/* Pedidos en las intersecciones */}
                {Object.values(grupos).map((grupo) => {
                    const visible = [...grupo].sort(
                        (a, b) => prioridad.indexOf(estadoDe(a)) - prioridad.indexOf(estadoDe(b))
                    )[0]
                    
                    const cx = posX(visible.columna)
                    const cy = posY(visible.fila)

                    return (
                        <g key={`${visible.fila}-${visible.columna}`}>
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

            <div className="mapa_controles">
                
                <button onClick={reproducir} disabled={pasos.length === 0}>Reproducir ruta</button>
                <button onClick={siguientePaso} disabled={pasos.length === 0 || mostrados >= pasos.length}>
                    Siguiente paso
                </button>

                <button onClick={() => { setReproduciendo(false); setVisibles(pasos.length) }} disabled={pasos.length === 0}>
                    Ver completa
                </button>

                <span className="mapa_progreso">
                    {pasos.length > 0 && `Tramo ${mostrados} de ${pasos.length}`}
                </span>

            </div>

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