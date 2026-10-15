# Ruteo y Planificación de Cargas

- Proyecto #1 · IC-3002 Análisis de Algoritmos · Escuela de Ingeniería en Computación, TEC
- Profesor: Ing. Joss Pecou Johnson

## Integrantes

- Rashely González Thompson
- Yeinery Durán Bastos 
- Maykel Poveda Paniagua

## Aplicación desplegada

[Link GitHub Pages]

## Descripción

Aplicación web hecha con React que selecciona qué pedidos cargar en un vehículo de reparto con capacidad limitada y calcula la ruta de entrega desde la central. El resultado se muestra de forma visual con una barra de ocupación, estadísticas, una tabla de pedidos y un mapa con la ruta animada.

## Algoritmo elegido: Greedy (voraz)

La solución tiene dos partes:

1. **Selección de pedidos:** se ordenan de mayor a menor según la razón beneficio/peso y se van cargando mientras quepan en la capacidad restante del camión.
2. **Ruta de entrega:** se usa el vecino más cercano. Desde la central (0,0) se visita siempre el pedido más cercano que falte, y al final se regresa a la central. El mapa es una cuadrícula de 9 filas por 12 columnas y la distancia es Manhattan, porque el camión recorre calles.

**Por qué Greedy:** responde casi al instante aunque haya muchos pedidos, y es fácil de seguir paso a paso en la interfaz.

**Limitación:** no garantiza la ganancia óptima del problema de la mochila 0/1. Un ejemplo con capacidad 50 y pedidos de peso y beneficio (10, 60), (20, 100) y (30, 120) lo demuestra: Greedy obtiene 160 y la mejor combinación da 220.

## Complejidad

| Parte | Complejidad |
|---|---|
| Ordenamiento por razón beneficio/peso (merge sort) | O(N log N) |
| Selección de pedidos | O(N) |
| Ruta del vecino más cercano | O(N²) |
| **Total** | **O(N²)** |

El análisis formal del mejor, peor y caso promedio está en el documento externo.

## Cómo usar la interfaz

1. Escribe la **capacidad máxima** del camión.
2. Indica la **cantidad de pedidos** (entre 1 y 50) y presiona **Generar pedidos**. También puedes agregarlos a mano con peso, beneficio, fila y columna.
3. Presiona **Ejecutar Algoritmo**.
4. Revisa el resultado:
   - **Barra de ocupación:** porcentaje de la capacidad que se usó, con avisos cuando el camión está cerca del límite o lleno.
   - **Estadísticas:** pedidos cargados sobre procesados, ganancia total, tiempo en milisegundos y operaciones realizadas.
   - **Tabla de pedidos:** peso, beneficio, rentabilidad, ubicación y estado de cada pedido (cargado o descartado).
   - **Mapa:** muestra la central, los pedidos y la ruta. Con **Reproducir ruta** se dibuja tramo por tramo, con **Siguiente paso** avanza de uno en uno y con **Ver completa** se muestra el recorrido entero.

Si dos pedidos caen en la misma intersección, el mapa muestra uno y un contador con los demás. Al pasar el mouse se ve el estado de cada uno. Un pedido agregado después de ejecutar aparece como "Pendiente" hasta que se vuelva a ejecutar el algoritmo.

## Flujo de trabajo

1. La rama **main** guarda el código estable.
2. La rama **dev** es la de integración, donde se juntan y se prueban los cambios.
3. Cada funcionalidad se desarrolló en su propia rama **feature**, creada a partir de dev.
4. Al terminar, cada rama se unió a dev mediante un Pull Request revisado por otra persona del equipo.
5. Cuando dev quedó probada y estable, se pasó a main mediante otro Pull Request.

Nadie subió cambios directamente a main.
