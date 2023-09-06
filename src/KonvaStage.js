import { Stage, Layer, Image } from 'react-konva'
import useImage from 'use-image'
import Konva from "konva"
import useState from 'react-usestateref'

const drillPaperImage = "assets/drill-paper.png"
export const KonvaStage = () => {

    const [image] = useImage(drillPaperImage)
    const [currentState, setCurrentState] = useState('')
    const [isDrawing, setIsDrawing] = useState(false)
    const [lastLinePoint, setLastLinePoint] = useState([-1, -1])
    const [straightLineStartPoint, setStraightLineStartPoint] = useState([-1, -1])
    const [isPopupVisible, setIsPopupVisible] = useState(false)
    const [position, setPosition] = useState({ top: 0, left: 0 })
    const [performerCount, setPerformerCount, performerCountRef] = useState(null)
    const [group, setGroup, groupRef] = useState(null)

    const handlePerformerCount = (e) => {
        setPerformerCount(e.target.value)
    }

    const togglePopup = (e) => {
        setIsPopupVisible(!isPopupVisible)
        var cancel = createKonvaButton('Cancel', position.top, position.left, 100, 50, 'cancel')
        var create = createKonvaButton('Create', position.top + 100, position.left, 100, 50, 'create')
        e.target.getLayer().add(create)
        e.target.getLayer().add(cancel)
    }

    const handleCreateLine = (e) => {
        setIsPopupVisible(false)
        e.target.getLayer().children.pop()
        e.target.getLayer().children.pop()
        e.target.getLayer().children.pop()
        drawCirclesOnStraightLine(e)
        setPerformerCount(null)
        setStraightLineStartPoint([-1, -1])
        setLastLinePoint([-1, -1])
    }

    const drawCirclesOnStraightLine = (e) => {
        let numberOfPerformersToDraw = performerCountRef.current
        var startPointX = straightLineStartPoint[0]
        var startPointY = straightLineStartPoint[1]
        var endPointX = lastLinePoint[0]
        var endPointY = lastLinePoint[1]
        var xDiff = endPointX - startPointX
        var yDiff = endPointY - startPointY
        var xStep = xDiff / numberOfPerformersToDraw
        var yStep = yDiff / numberOfPerformersToDraw
        let group = new Konva.Group({
            draggable: true
        })
        for (var i = 0; i < numberOfPerformersToDraw; i++) {
            var newShape = new Konva.Circle({
                x: startPointX + (i * xStep),
                y: startPointY + (i * yStep),
                radius: 4,
                fill: 'red',
            })
            group.add(newShape)
        }
        e.target.getLayer().add(group)
    }

    const handleCancel = (e) => {
        console.log(e.target.getLayer().children)
        setIsPopupVisible(false)
        e.target.getLayer().children.pop()
        e.target.getLayer().children.pop()
        e.target.getLayer().children.pop()
        setPerformerCount(null)
        setStraightLineStartPoint([-1, -1])
        setLastLinePoint([-1, -1])
    }

    const onDoubleClickAddCircle = (e) => {
        var layer = e.target.getLayer()
        var newShape = new Konva.Circle({
            x: e.currentTarget.getPointerPosition().x,
            y: e.currentTarget.getPointerPosition().y,
            radius: 4,
            fill: 'red',
            draggable: true
        })
        layer.add(newShape)
    }

    const addCurvedLineStart = (e) => {
        setGroup(new Konva.Group({
            draggable: true
        }))
        addCurvedLinePoint(e)
        setIsDrawing(true)
    }

    const addCurvedLinePoint = (e) => {
        var newShape = new Konva.Circle({
            x: e.currentTarget.getPointerPosition().x,
            y: e.currentTarget.getPointerPosition().y,
            radius: 4,
            fill: 'red',
        })
        var newGroup = groupRef.current
        newGroup.add(newShape)
        setGroup(newGroup)
    }

    const addStraightLineStartPoint = (e) => {
        setStraightLineStartPoint([e.currentTarget.getPointerPosition().x, e.currentTarget.getPointerPosition().y])
        var layer = e.target.getLayer()
        var newShape = new Konva.Circle({
            x: e.currentTarget.getPointerPosition().x,
            y: e.currentTarget.getPointerPosition().y,
            radius: 4,
            fill: 'red',
            draggable: true
        })
        layer.add(newShape)
        setIsDrawing(true)
    }

    const addStraightLineWhileMouseMove = (startPointX, startPointY, e) => {
        var layer = e.target.getLayer()
        var newShape = new Konva.Line({
            points: [straightLineStartPoint[0], straightLineStartPoint[1], e.currentTarget.getPointerPosition().x, e.currentTarget.getPointerPosition().y],
            stroke: 'red',
            draggable: true
        })
        layer.add(newShape)
    }

    const onMouseDownEvent = (e) => {
        if (currentState === 'drawCurvedLine') {
            addCurvedLineStart(e)
        } else if (currentState === 'drawStraightLine') {
            addStraightLineStartPoint(e)
        }
    }

    const onDoubleClickEvent = (e) => {
        if (currentState === '') {
            onDoubleClickAddCircle(e)
        }
    }

    const onMouseMoveEvent = (e) => {
        const currX = e.currentTarget.getPointerPosition().x
        const currY = e.currentTarget.getPointerPosition().y
        const layer = e.target.getLayer()
        if (currentState === 'drawCurvedLine') {
            if (!isDrawing) {
                return
            }
            if (lastLinePoint[0] === -1 && lastLinePoint[1] === -1) {
                setLastLinePoint([currX, currY])
                addCurvedLinePoint(e)
            }
            else if (Math.abs(lastLinePoint[0] - currX) > 20
                || Math.abs(lastLinePoint[1] - currY) > 20) {
                setLastLinePoint([currX, currY])
                addCurvedLinePoint(e)
            }
        }
        if (currentState === 'drawStraightLine') {
            if (!isDrawing) {
                return
            }
            if (lastLinePoint[0] === -1 && lastLinePoint[1] === -1) {
                setLastLinePoint([currX, currY])
            }
            if (Math.abs(lastLinePoint[0] - currX) > 1
                || Math.abs(lastLinePoint[1] - currY) > 1) {
                layer.children.pop()
                addStraightLineWhileMouseMove(lastLinePoint[0], lastLinePoint[1], e)
                setLastLinePoint([currX, currY])
            }
        }
    }

    const onMouseUpEvent = async (e) => {
        if (currentState === 'drawStraightLine') {
            setPosition({ top: e.currentTarget.getPointerPosition().y, left: e.currentTarget.getPointerPosition().x })
            togglePopup(e)
            setCurrentState('')
        }
        if (currentState === 'drawCurvedLine') {
            e.target.getLayer().add(groupRef.current)
            setCurrentState('')
            setGroup(null)
        }
        setIsDrawing(false)
    }

    // Create a floating left options panel with options for free form shape and line with x performers
    // on the left side of the screen
    const floatingLeftDrawer = () => {
        return (
            <div style={menuStyle}>
                <ul style={ulStyle}>
                    <li style={liStyle}><button style={linkStyle} onClick={() => setCurrentState('drawCurvedLine')}>Draw Free Form</button></li>
                    <li style={liStyle}><button style={linkStyle} onClick={() => setCurrentState('drawStraightLine')}>Draw Straight Line</button></li>
                </ul>
            </div>
        )
    }

    const createKonvaButton = (text, x, y, width, height, buttonType) => {
        var button = new Konva.Label({
            x: x,
            y: y,
            opacity: 0.75,
            height: height,
            width: width
        })

        button.add(new Konva.Tag({
            fill: 'blue',
            lineJoin: 'round',
            shadowBlur: 10,
            shadowOffset: 10,
            shadowOpacity: 0.5
        }))

        button.add(new Konva.Text({
            text: text,
            fontSize: 18,
            padding: 5,
            fill: 'white'
        }))

        button.on('click', (e) => {
            if (buttonType === 'cancel') handleCancel(e)
            if (buttonType === 'create') handleCreateLine(e)
        })

        return button
    }

    // this will be a combination of html component from react-konva-utils and konvajs shapes
    const popupCard = () => {
        return (
            <div style={popupStyle}>
                <label>Number of Performers: </label>
                <input type="text" onChange={(e) => handlePerformerCount(e)} />
            </div>
        )
    }

    const topLevelScreenStyle = {
        position: 'relative'
    }

    const stageStyle = {
        position: 'absolute',
        right: '0px',
        top: window.innerHeight * .1,
    }

    const menuStyle = {
        position: 'fixed',
        left: 0,
        top: 0,
        width: window.innerWidth * .1 - 10,
        height: '100%',
        backgroundColor: '#FFFFFF',
        color: '#fff', // Text color
        boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.25)'
    }

    const ulStyle = {
        listStyleType: 'none',
        margin: 0,
        padding: 0,
    }

    const liStyle = {
        marginBottom: '15px',
    }

    const linkStyle = {
        fontWeight: 'bold',
    }

    const popupStyle = {
        position: 'absolute',
        top: position.top + 10, // Adjust the offset as needed
        left: position.left + 100, // Adjust the offset as needed
        transform: 'translateX(-50%)',
        backgroundColor: '#fff',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
        padding: '10px',
        borderRadius: '4px',
        display: isPopupVisible ? 'block' : 'none',
        zIndex: '100',
    }

    const closeIconStyle = {
        position: 'absolute',
        top: '5px',
        right: '5px',
        cursor: 'pointer',
        padding: '5',
    }

    return (
        <div style={topLevelScreenStyle}>
            {floatingLeftDrawer()}
            {isPopupVisible && popupCard()}
            {currentState}
            <Stage
                onDblClick={onDoubleClickEvent}
                onMouseDown={onMouseDownEvent}
                onMouseMove={onMouseMoveEvent}
                onMouseUp={onMouseUpEvent}
                width={window.innerWidth * .9} height={window.innerHeight * .9}
                style={stageStyle}>
                <Layer>
                    <Image image={image} width={window.innerWidth * .9} height={window.innerHeight * .9}/>
                </Layer>
            </Stage>
        </div>
    )
}