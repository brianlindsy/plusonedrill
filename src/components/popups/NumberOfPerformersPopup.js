const NumberOfPerformersPopup = ({isNumberOfPerformersPopupVisible, position, handlePerformerCount}) => {

    const numberOfPerformersPopupStyle = {
        position: 'absolute',
        top: position.top + 10,
        left: position.left + 100,
        transform: 'translateX(-50%)',
        backgroundColor: '#fff',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
        padding: '10px',
        borderRadius: '4px',
        display: isNumberOfPerformersPopupVisible ? 'block' : 'none',
        zIndex: '100',
    }

    return (
        <div style={numberOfPerformersPopupStyle}>
            <label>Number of Performers: </label>
            <input type="text" onChange={(e) => handlePerformerCount(e)} />
        </div>
    )
}
export default NumberOfPerformersPopup;