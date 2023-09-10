const menuStyle = {
    position: 'fixed',
    left: 0,
    top: '10%',   // Positioned a little down from the top for a floating feel
    width: '10vw',
    height: '80%',   // Does not occupy the full height for a more floating appearance
    backgroundColor: '#F7F8FA',   // Slightly off-white for a subtle and soft look
    color: '#333',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.08)',   // Soft shadow
    borderRadius: '0 12px 12px 0',   // Rounded corners, but only on the right side
    overflowY: 'auto',   // Allows scrolling if content exceeds the drawer height
    transition: 'transform 0.3s',   // Transition for a possible future animation
    zIndex: 1,   // Ensures the drawer is on top of other elements
}

const ulStyle = {
    listStyleType: 'none',
    margin: 0,
    padding: 0,
}

const liStyle = {
    marginBottom: '20px',
}

const linkStyle = {
    fontWeight: '500',   // Slightly less than bold for a modern feel
    backgroundColor: 'transparent',   // No background by default
    color: '#007BFF',    // Miro blue
    padding: '8px 12px',
    borderRadius: '8px',   // Completely rounded buttons
    border: '2px solid #007BFF',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
    transition: 'background-color 0.2s, color 0.2s',
    ':hover': {
        backgroundColor: '#007BFF',   // Switch colors on hover
        color: '#FFFFFF',
    }
}

export const FloatingLeftDrawer = ({ setCurrentState, setIsDrawShapesPopupVisible }) => {
    const handleDrawShape = () => {
        setIsDrawShapesPopupVisible(true)
        setCurrentState('drawShape')
    }

    const actions = [
        { label: 'Draw Free Form', action: 'drawCurvedLine' },
        { label: 'Draw Straight Line', action: 'drawStraightLine' },
        { label: 'Draw Shape', action: handleDrawShape }
    ]

    return (
        <div style={menuStyle}>
            <ul style={ulStyle}>
                {actions.map(({label, action}) => (
                    <li key={label} style={liStyle}>
                        <button
                            style={linkStyle}
                            onClick={() =>
                                typeof action === 'string'
                                    ? setCurrentState(action)
                                    : action()
                            }
                        >
                            {label}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default FloatingLeftDrawer;