// Ventana de aviso en la pantalla 
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