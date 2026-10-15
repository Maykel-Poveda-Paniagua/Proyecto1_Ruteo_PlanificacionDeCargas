/**
 * Componente que muestra la capacidad de carga del camion
 *
 * Representa el porcentaje de ocupacion mediante una barra visual
 * y muestra una alerta cuando se alcanza, se supera o se aproxima
 * al limite de capacidad.
 *
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {number} props.pesoActual - Peso total de la carga actual
 * @param {number} props.capacidad - Capacidad maxima del camion
 * @returns {JSX.Element} Barra de ocupacion y mensaje de alerta
 */
function TruckCapacity({ pesoActual, capacidad}) {
    const porcentaje = capacidad > 0 ? Math.min((pesoActual / capacidad) * 100, 100) : 0;
    const excedido = pesoActual > capacidad;
    const lleno = pesoActual === capacidad;
    const cercaDelLimite = porcentaje >= 90 && !lleno;

    // mensaje de alerta si se pasa o llega al limite
    let mensaje = '';
    
    if (excedido) {
        mensaje = 'La capacidad del vehiculo ha sido excedida';
    } else if (lleno) {
        mensaje = 'Capacidad maxima alcanzada';
    } else if (cercaDelLimite) {
        mensaje = 'Atencion: Estas cerca del limite de capacidad';
    }

    return (
    <div className="truck_capacity">
        <p className="truck_capacity_label">Ocupación: ({Math.round(porcentaje)}%)</p>
        
        <div className="truck_barra">
            <div className="truck_relleno" style={{ width: `${porcentaje}%` }} />
        
        </div>
        {mensaje && <p className="truck_alerta">{mensaje}</p>}
    </div>
    );
}
export default TruckCapacity;