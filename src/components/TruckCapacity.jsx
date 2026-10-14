
// El componente TruckCapacity muestra la capacidad de un camion mostrando
// una barra que indica el porcentaje de carga actual
function TruckCapacity({ pesoActual, capacidad}) {
const porcentaje = capacidad  > 0 ? Math.min((pesoActual / capacidad) * 100, 100) : 0;
const excedido = pesoActual > capacidad;
const lleno = pesoActual === capacidad;

// mensaje de alerta si se pasa o llega al limite
let mensaje = '';
if (excedido) {
mensaje = 'La capacidad del vehiculo ha sido excedida';
} else if (lleno) {
mensaje = 'Capacidad maxima alcanzada';
}

return (
 <div className= "truck_capacity " >
 <p className= "truck_capacity_label " >Ocupación: ({Math.round(porcentaje)}%) </p >
 <div className= "truck_barra " >
 <div className= "truck_relleno " style={{ width:  `${porcentaje}%`  }} / >
 </div >
 {mensaje && <p className= "truck_alerta" >{mensaje}</p>}
 </div >
);
}
export default TruckCapacity;