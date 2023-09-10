export const DrawShapesPopup = ({handleSelectSquare, handleSelectCircle, isDrawShapesPopupVisible}) => {

    const drawShapesPopupStyle = {
        height: window.innerHeight * .1,
        width: window.innerWidth * .1,
        position: 'absolute',
        top: window.innerHeight * .1,
        left: window.innerWidth * .1,
        backgroundColor: '#fff',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
        padding: '10px',
        borderRadius: '4px',
        display: isDrawShapesPopupVisible ? 'block' : 'none',
        zIndex: '100',
    }

    return (
        <div style={drawShapesPopupStyle}>
            <button onClick={() => handleSelectSquare()}>Square</button>
            <button onClick={() => handleSelectCircle()}>Circle</button>
        </div>
    )
}
export default DrawShapesPopup;