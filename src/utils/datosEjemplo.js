// Datos falsos para probar la interfaz sin el algoritmo
export const pedidosEjemplo = [
    { id: 'P1', peso: 12, beneficio: 45, x: 30, y: 80 },
    { id: 'P2', peso: 9, beneficio: 38, x: 55, y: 60 },
    { id: 'P3', peso: 20, beneficio: 15, x: 10, y: 20 },
    { id: 'P4', peso: 7, beneficio: 30, x: 75, y: 40 },
]

// Resultado de ejemplo con el formato que devolvera el algoritmo
export const resultadoEjemplo = {
    seleccionados: [
        { id: 'P1', peso: 12, beneficio: 45, x: 30, y: 80 },
        { id: 'P2', peso: 9, beneficio: 38, x: 55, y: 60 },
        { id: 'P4', peso: 7, beneficio: 30, x: 75, y: 40 },
    ],
    ganancia: 113,
    pesoTotal: 28,
    ruta: ['P4', 'P2', 'P1'],
    procesados: 4,
    tiempoMs: 0.4,
    operaciones: 250,
}