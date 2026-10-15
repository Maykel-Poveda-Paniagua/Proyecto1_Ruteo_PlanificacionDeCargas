import { test } from 'node:test'
import assert from 'node:assert/strict'
import { generarPedidosAleatorios, seleccionarPedidosVoraz, rutaVecinoMasCercano, planificarCargaYRuta } from '../src/algorithms/logistica.js'
const pedidos = [
  { id: 'P1', peso: 12, beneficio: 45, x: 30, y: 80 },
  { id: 'P2', peso: 9, beneficio: 38, x: 55, y: 60 },
  { id: 'P3', peso: 20, beneficio: 15, x: 10, y: 20 },
  { id: 'P4', peso: 7, beneficio: 30, x: 75, y: 40 },
]
test('selección, métricas y ausencia de mutación', () => {
  const antes = JSON.stringify(pedidos)
  const r = planificarCargaYRuta(pedidos, 28)
  assert.deepEqual(r.seleccionados.map(p => p.id), ['P4', 'P2', 'P1'])
  assert.equal(r.ganancia, 113)
  assert.equal(r.pesoTotal, 28)
  assert.equal(r.ocupacion, 100)
  assert.equal(r.procesados, 4)
  assert.equal(r.pasos.length, 4)
  assert.equal(JSON.stringify(pedidos), antes)
  assert.ok(r.tiempoMs >= 0 && r.operaciones > 0)
})
test('no termina al encontrar un pedido que no cabe', () => {
  const p = [{ id: 'A', peso: 10, beneficio: 100, x: 0, y: 0 },
    { id: 'B', peso: 2, beneficio: 1, x: 3, y: 4 }]
  assert.deepEqual(seleccionarPedidosVoraz(p, 2).seleccionados.map(p => p.id), ['B'])
})
test('vecino cercano desde central y regreso opcional', () => {
  const p = [{ id: 'A', peso: 1, beneficio: 1, x: 3, y: 4 },
    { id: 'B', peso: 1, beneficio: 1, x: 6, y: 8 }]
  const r = rutaVecinoMasCercano(p)
  assert.deepEqual(r.ruta, ['A', 'B'])
  assert.equal(r.distanciaTotal, 20)
  assert.equal(r.metricas.calculosDistancia, 4)
  assert.equal(r.metricas.revisionesVisitados, 4)
  assert.equal(rutaVecinoMasCercano(p, { x: 0, y: 0 }, false).distanciaTotal, 10)
  assert.equal(planificarCargaYRuta([], 1).distanciaTotal, 0)
})
test('contraejemplo de optimalidad de mochila 0/1', () => {
  const p = [ [10, 60], [20, 100], [30, 120] ].map(([peso, beneficio], i) => ({ id: `${i}`, peso, beneficio, x: 0, y: 0 }))
  assert.equal(seleccionarPedidosVoraz(p, 50).ganancia, 160)
  assert.equal(p[1].beneficio + p[2].beneficio, 220)
})
test('generación y validación de entradas', () => {
  const p = generarPedidosAleatorios(100)
  assert.equal(new Set(p.map(p => p.id)).size, 100)
  assert.ok(p.every(p => p.peso >= 5 && p.peso <= 24 && p.beneficio >= 10 && p.beneficio <= 59 && p.x >= 0 && p.x <= 99))
  assert.throws(() => generarPedidosAleatorios(1.5))
  assert.throws(() => seleccionarPedidosVoraz(pedidos, 0))
  assert.throws(() => seleccionarPedidosVoraz([pedidos[0], pedidos[0]], 100))
  assert.throws(() => seleccionarPedidosVoraz([{ ...pedidos[0], peso: -1 }], 100))
})
