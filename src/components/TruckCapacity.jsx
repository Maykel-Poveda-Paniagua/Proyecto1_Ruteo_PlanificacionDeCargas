// El componente TruckCapacity muestra la capacidad de un camion mostrando
//  una barra que indica el porcentaje de carga actual

function TruckCapacity({ pesoActual, capacidad}) {
    const porcentaje = capacidad > 0 ? Math.min((pesoActual / capacidad) * 100, 100) : 0;  // Evita dividir entre cero y no pasa de 100%
    return (
        <div className="truck_capacity">
            <label htmlFor="ocupacion">Ocupación: ({Math.round(porcentaje)}%)</label>
            <div className="truck_barra">
                <div className="truck_relleno" style={{ width: `${porcentaje}%` }} /> {/* Muestra el progreso de la carga */}
            </div>
        </div>
    );
}

export default TruckCapacity;