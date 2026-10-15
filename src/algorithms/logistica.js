/**
 * Valida IDs únicos, peso y beneficio positivos, y ubicaciones dentro de la matriz de 9 × 12, no permite pedidos en (0,0)
 *
 * @param {Object[]} pedidos - Pedidos con id, peso, beneficio, fila y columna
 * @returns {void}
 * @throws {Error} si algun dato es invalido
 */

function validarPedidos(pedidos) {
  if (!Array.isArray(pedidos)) throw new Error('Los pedidos deben ser una lista.')
  const ids = new Set()
  for (const p of pedidos) {
    if (!p || typeof p.id !== 'string' || !p.id.trim() || ids.has(p.id)) {
      throw new Error('Cada pedido necesita un ID de texto único.')
    }
    ids.add(p.id)
    if ( ![p.peso, p.beneficio, p.fila, p.columna].every(Number.isFinite) || p.peso <= 0 || p.beneficio <= 0) {
      throw new Error('Peso y beneficio deben ser positivos; fila y columna deben ser números finitos.')
    }

    if ( !Number.isInteger(p.fila) || p.fila < 0 || p.fila > 8 || !Number.isInteger(p.columna) ||
      p.columna < 0 || p.columna > 11) {
      throw new Error('La fila debe estar entre 0 y 8 y la columna entre 0 y 11.')
    }

    if (p.fila === 0 && p.columna === 0){
      throw new Error('No se puede colocar un pedido en la central (0,0).')
    }
  }
}

/**
 * Genera pedidos aleatorios con peso de 5 a 24, beneficio de 10 a 59 y ubicación válida, excluyendo (0,0), puede repetir ubicaciones.
 *
 * @param {number} cantidad - Número entero positivo de pedidos
 * @returns {Object[]} Pedidos con id, peso, beneficio, fila y columna
 * @throws {Error} Si cantidad no es un entero seguro positivo
 */

export function generarPedidosAleatorios(cantidad) {
  if (!Number.isSafeInteger(cantidad) || cantidad < 1) {
    throw new Error('La cantidad debe ser un entero positivo.')
  }
  return Array.from({ length: cantidad }, (_, i) => {
    let fila, columna

    do {
      fila = Math.floor(Math.random() * 9)
      columna = Math.floor(Math.random() * 12)
    } while (fila === 0 && columna === 0)

    return {
      id: `P${i + 1}`, peso: Math.floor(Math.random() * 20) + 5,
      beneficio: Math.floor(Math.random() * 50) + 10, fila,columna,
    }
  })
}


/**
 * Ordena por ratio descendente usando merge sort y cuenta comparaciones
 * Conserva el orden original en empates
 *
 * @param {Object[]} lista - Candidatos con pedido y ratio
 * @param {Object} metricas - Contadores que se actualizan durante el ordenamiento
 * @returns {Object[]} Nueva lista ordenada
 */

function ordenarPorRatio(lista, metricas) {
  if (lista.length <= 1) return lista.slice()
  const mitad = Math.floor(lista.length / 2)
  const a = ordenarPorRatio(lista.slice(0, mitad), metricas)
  const b = ordenarPorRatio(lista.slice(mitad), metricas)
  const salida = []
  let i = 0
  let j = 0
  while (i < a.length && j < b.length) {
    metricas.comparacionesOrdenamiento++
    if (a[i].ratio >= b[j].ratio) salida.push(a[i++])
    else salida.push(b[j++])
  }
  while (i < a.length) salida.push(a[i++])
  while (j < b.length) salida.push(b[j++])
  return salida
}

/**
 * Selecciona pedidos completos por beneficio/peso sin exceder la capacidad
 * No garantiza la máxima ganancia
 *
 * @param {Object[]} pedidos - Pedidos disponibles
 * @param {number} capacidad - Capacidad máxima positiva y finita
 * @returns {Object} Seleccionados, descartados, peso, ganancia, ocupación, pasos, cantidades, tiempo en ms y contadores de operaciones instrumentadas.
 * @throws {Error} Si las entradas o los cálculos son invalidos.
 */

export function seleccionarPedidosVoraz(pedidos, capacidad) {
  validarPedidos(pedidos)
  if (!Number.isFinite(capacidad) || capacidad <= 0) {
    throw new Error('La capacidad debe ser positiva y finita.')
  }
  const inicio = performance.now()
  const metricas = { calculosRatio: 0, comparacionesOrdenamiento: 0, verificacionesCapacidad: 0 }
  const candidatos = pedidos.map(pedido => {
    metricas.calculosRatio++
    const ratio = pedido.beneficio / pedido.peso
    if (!Number.isFinite(ratio)) throw new Error('Ratio fuera del rango numérico.')
    return { pedido, ratio }
  })
  const ordenados = ordenarPorRatio(candidatos, metricas)
  const seleccionados = []
  const descartados = []
  const pasos = []
  let pesoTotal = 0
  let ganancia = 0
  for (const { pedido, ratio } of ordenados) {
    metricas.verificacionesCapacidad++
    const aceptado = pedido.peso <= capacidad - pesoTotal
    if (aceptado) {
      seleccionados.push({ ...pedido })
      pesoTotal += pedido.peso
      ganancia += pedido.beneficio
      if (!Number.isFinite(ganancia)) throw new Error('Ganancia fuera del rango numérico.')
    } else descartados.push({ ...pedido })
    // Un registro pequeño por decisión; evita copiar listas completas en cada paso.
    pasos.push({ id: pedido.id, ratio, aceptado, pesoTotal, ganancia,
      motivo: aceptado ? 'El pedido cabe en la capacidad restante.' : 'Supera la capacidad restante.' })
  }
  return {
    seleccionados, descartados, pesoTotal, ganancia, pasos,
    procesados: pedidos.length, cantidadSeleccionados: seleccionados.length,
    ocupacion: pesoTotal / capacidad * 100,
    capacidadAlcanzada: pesoTotal === capacidad,
    tiempoMs: performance.now() - inicio,
    operaciones: Object.values(metricas).reduce((a, b) => a + b, 0), metricas,
  }
}

/**
 * Construye una ruta por vecino más cercano usando distancia Manhattan
 * No garantiza la ruta mínima global
 *
 * @param {Object[]} pedidos - Pedidos que se deben visitar.
 * @param {Object} [central={fila: 0, columna: 0}] - Ubicación inicial en la matriz
 * @param {boolean} [regresar=true] - Indica si se vuelve a la central
 * @returns {Object} IDs en orden de visita, tramos, distancia total, central, configuración de regreso, tiempo en ms y metricas
 * @throws {Error} Si las entradas o distancias son invalidas
 */

export function rutaVecinoMasCercano(pedidos, central = { fila: 0, columna: 0 }, regresar = true) {
  validarPedidos(pedidos)
  
  if ( !central || ![central.fila, central.columna].every(Number.isFinite) || !Number.isInteger(central.fila) ||
    !Number.isInteger(central.columna) ||
    central.fila < 0 || central.fila > 8 || central.columna < 0 || central.columna > 11
  ) {
    throw new Error('La central debe estar dentro de la matriz.')
  }

  const inicio = performance.now()
  const visitados = new Set()
  const ruta = []
  const pasosRuta = []
  let actual = { ...central }
  let distanciaTotal = 0
  const metricas = { calculosDistancia: 0, comparacionesDistancia: 0, revisionesVisitados: 0 }
  
    /**
   * Calcula la distancia Manhattan e incrementa su contador
   *
   * @param {Object} a - Origen con fila y columna
   * @param {Object} b - Destino con fila y columna
   * @returns {number} Distancia entre ambas ubicaciones
   * @throws {Error} Si la distancia no es finita
   */

  const distancia = (a, b) => { metricas.calculosDistancia++
    const d =Math.abs(a.fila - b.fila) + Math.abs(a.columna - b.columna)
    
    if (!Number.isFinite(d)) {
      throw new Error('Distancia fuera del rango numérico.')
    }
    return d
  }

  while (ruta.length < pedidos.length) {
    let cercano = null
    let menor = Infinity
    
    for (const pedido of pedidos) {
      metricas.revisionesVisitados++
      
      if (visitados.has(pedido.id)) continue
      const d = distancia(actual, pedido)
      metricas.comparacionesDistancia++
      
      // En empate se elige el primero en la lista recibida.
      if (d < menor) { menor = d; cercano = pedido }
    }

    visitados.add(cercano.id)
    ruta.push(cercano.id)
    distanciaTotal += menor
    pasosRuta.push({ desde: { ...actual }, hasta: { ...cercano }, distancia: menor, distanciaAcumulada: distanciaTotal })
    actual = { ...cercano }
  }

  if (regresar && pedidos.length) {
    const d = distancia(actual, central)
    distanciaTotal += d
    pasosRuta.push({ desde: { ...actual }, hasta: { ...central }, distancia: d, distanciaAcumulada: distanciaTotal, regreso: true })
  }

  if (!Number.isFinite(distanciaTotal)) throw new Error('Distancia total fuera del rango numérico.')
  
    return { ruta, pasosRuta, distanciaTotal, central: { ...central }, regresar,
    tiempoMs: performance.now() - inicio,
    operaciones: Object.values(metricas).reduce((a, b) => a + b, 0), metricas }
}

/**
 * Ejecuta la selección de carga y calcula la ruta de los seleccionados. Combina sus resultados para la interfaz
 *
 * @param {Object[]} pedidos - Pedidos disponibles
 * @param {number} capacidad - Capacidad máxima del vehículo
 * @param {Object} [opciones={}] - Configuración del recorrido
 * @param {Object} [opciones.central={fila: 0, columna: 0}] - Ubicación inicial
 * @param {boolean} [opciones.regresar=true] - Indica si se vuelve a la central
 * @returns {Object} Resultados de carga y ruta, tiempo total y por etapa, operaciones totales y métricas separadas
 * @throws {Error} Si la selección o el cálculo de la ruta fallan
 */

export function planificarCargaYRuta(pedidos, capacidad, opciones = {}) {
  const inicio = performance.now()
  const carga = seleccionarPedidosVoraz(pedidos, capacidad)
  const recorrido = rutaVecinoMasCercano(carga.seleccionados, opciones.central ?? { fila: 0, columna: 0 }, opciones.regresar ?? true)
  
  return { ...carga, ...recorrido,
    pasos: carga.pasos,
    tiempoMs: performance.now() - inicio,
    tiempoCargaMs: carga.tiempoMs, tiempoRutaMs: recorrido.tiempoMs,
    operaciones: carga.operaciones + recorrido.operaciones,
    metricas: { carga: carga.metricas, ruta: recorrido.metricas } }
}