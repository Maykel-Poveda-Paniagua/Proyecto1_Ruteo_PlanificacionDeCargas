// Módulos independientes de React. No modifican los pedidos recibidos.
function validarPedidos(pedidos) {
  if (!Array.isArray(pedidos)) throw new Error('Los pedidos deben ser una lista.')
  const ids = new Set()
  for (const p of pedidos) {
    if (!p || typeof p.id !== 'string' || !p.id.trim() || ids.has(p.id)) {
      throw new Error('Cada pedido necesita un ID de texto único.')
    }
    ids.add(p.id)
    if (![p.peso, p.beneficio, p.x, p.y].every(Number.isFinite) ||
        p.peso <= 0 || p.beneficio <= 0) {
      throw new Error('Peso y beneficio deben ser positivos; coordenadas finitas.')
    }
  }
}

export function generarPedidosAleatorios(cantidad) {
  if (!Number.isSafeInteger(cantidad) || cantidad < 1) {
    throw new Error('La cantidad debe ser un entero positivo.')
  }
  return Array.from({ length: cantidad }, (_, i) => ({
    id: `P${i + 1}`,
    peso: Math.floor(Math.random() * 20) + 5,
    beneficio: Math.floor(Math.random() * 50) + 10,
    x: Math.floor(Math.random() * 100),
    y: Math.floor(Math.random() * 100),
  }))
}

// Merge sort explícito: permite contar comparaciones y justificar O(N log N).
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
    // En empate se conserva el orden original (ordenamiento estable).
    if (a[i].ratio >= b[j].ratio) salida.push(a[i++])
    else salida.push(b[j++])
  }
  while (i < a.length) salida.push(a[i++])
  while (j < b.length) salida.push(b[j++])
  return salida
}

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

export function rutaVecinoMasCercano(pedidos, central = { x: 0, y: 0 }, regresar = true) {
  validarPedidos(pedidos)
  if (!central || ![central.x, central.y].every(Number.isFinite)) {
    throw new Error('La central necesita coordenadas finitas.')
  }
  const inicio = performance.now()
  const visitados = new Set()
  const ruta = []
  const pasosRuta = []
  let actual = { ...central }
  let distanciaTotal = 0
  const metricas = { calculosDistancia: 0, comparacionesDistancia: 0, revisionesVisitados: 0 }
  const distancia = (a, b) => {
    metricas.calculosDistancia++
    const d = Math.hypot(a.x - b.x, a.y - b.y)
    if (!Number.isFinite(d)) throw new Error('Distancia fuera del rango numérico.')
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

// Punto de entrada para quien implemente el hook y la integración en Home.
export function planificarCargaYRuta(pedidos, capacidad, opciones = {}) {
  const inicio = performance.now()
  const carga = seleccionarPedidosVoraz(pedidos, capacidad)
  const recorrido = rutaVecinoMasCercano(carga.seleccionados, opciones.central, opciones.regresar)
  return { ...carga, ...recorrido,
    pasos: carga.pasos,
    tiempoMs: performance.now() - inicio,
    tiempoCargaMs: carga.tiempoMs, tiempoRutaMs: recorrido.tiempoMs,
    operaciones: carga.operaciones + recorrido.operaciones,
    metricas: { carga: carga.metricas, ruta: recorrido.metricas } }
}
