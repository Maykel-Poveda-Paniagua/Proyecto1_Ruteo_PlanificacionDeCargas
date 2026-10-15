/**
 * Componente que muestra una ventana de aviso en pantalla
 *
 * Presenta un mensaje y un boton para cerrar la ventana
 * Si no hay mensaje, no muestra ningun elemento
 *
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {string} props.mensaje - Texto que se muestra en la ventana
 * @param {Function} props.onCerrar - Funcion que se ejecuta al cerrar el aviso
 * @returns {JSX.Element|null} Ventana de aviso o null si no hay mensaje
 */

function Aviso({ mensaje, onCerrar }) {
    if (mensaje === '') return null

    return (

        <div className="aviso_fondo">
            <div className="aviso_ventana">
                <p>{mensaje}</p>
                <button onClick={onCerrar}>Aceptar</button>
            </div>
        </div>
    )
}
export default Aviso