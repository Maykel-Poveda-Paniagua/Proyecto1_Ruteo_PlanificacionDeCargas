import { resultadoEjemplo } from '../utils/datosEjemplo'
import TruckCapacity from '../components/TruckCapacity'

function Home() {
    return (
        <div>
            <h1>Ruteo y Planificación de Cargas</h1>
                {/* Componentes */}
                <TruckCapacity pesoActual={resultadoEjemplo.pesoTotal} capacidad={100} />
                
        </div>
    )
}

export default Home