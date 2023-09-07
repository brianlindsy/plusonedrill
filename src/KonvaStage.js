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
    const [isNumberOfPerformersPopupVisible, setIsNumberOfPerformersPopupVisible] = useState(false)
    const [isDrawShapesPopupVisible, setIsDrawShapesPopupVisible] = useState(false)
    const [position, setPosition] = useState({ top: 0, left: 0 })
    const [performerCount, setPerformerCount, performerCountRef] = useState(null)
    const [group, setGroup, groupRef] = useState(null)

    const handlePerformerCount = (e) => {
        setPerformerCount(e.target.value)
    }

    const togglePopup = (e) => {
        setIsNumberOfPerformersPopupVisible(!isNumberOfPerformersPopupVisible)
        var cancel = createKonvaButton('Cancel', position.top, position.left, 100, 50, 'cancel')
        var create = createKonvaButton('Create', position.top + 100, position.left, 100, 50, 'create')
        e.target.getLayer().add(create)
        e.target.getLayer().add(cancel)
    }

    const handleCreate = (e) => {
        if (currentState === 'drawStraightLine') {
            setIsNumberOfPerformersPopupVisible(false)
            e.target.getLayer().children.pop()
            e.target.getLayer().children.pop()
            e.target.getLayer().children.pop()
            drawCirclesOnStraightLine(e)
            setPerformerCount(null)
            setStraightLineStartPoint([-1, -1])
            setLastLinePoint([-1, -1])
        } else if (currentState === 'drawCircle') {
            setIsNumberOfPerformersPopupVisible(false)
            e.target.getLayer().children.pop()
            e.target.getLayer().children.pop()
            // we want to turn the circle transparent and add circles around the edge of the circle
            drawCirclesOnCircle(e)
            setPerformerCount(null)
            setStraightLineStartPoint([-1, -1])
            setLastLinePoint([-1, -1])
        }
    }

    const drawCirclesOnCircle = (e) => {
        // add circles around the edge of the circle equidistant from each other
        var group = new Konva.Group({
            draggable: true
        })
        setGroup(group)
        var numberOfCircles = 8
        var radius = 50
        var x = e.currentTarget.getPointerPosition().x
        var y = e.currentTarget.getPointerPosition().y
        var angle = 360 / numberOfCircles
        for (var i = 0; i < numberOfCircles; i++) {
            var newCircle = new Konva.Circle({
                x: x + radius * Math.cos(angle * i * Math.PI / 180),
                y: y + radius * Math.sin(angle * i * Math.PI / 180),
                radius: 4,
                fill: 'red',
            })
            var newGroup = groupRef.current
            newGroup.add(newCircle)
            setGroup(newGroup)
        }
        e.target.getLayer().add(groupRef.current)
        setCurrentState('')
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
        setIsNumberOfPerformersPopupVisible(false)
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
        } else if (currentState === 'drawSquare') {
            addSquare(e)
        } else if (currentState === 'drawCircle') {
            addCircle(e)
        }
    }

    const addCircle = (e) => {
        togglePopup(e)
        var layer = e.target.getLayer()
        var newShape = new Konva.Circle({
            x: e.currentTarget.getPointerPosition().x,
            y: e.currentTarget.getPointerPosition().y,
            radius: 50,
            draggable: true,
        })
    }

    const addSquare = (e) => {
        var layer = e.target.getLayer()
        var newShape = new Konva.Rect({
            x: e.currentTarget.getPointerPosition().x,
            y: e.currentTarget.getPointerPosition().y,
            width: 100,
            height: 100,
            draggable: true,
            stroke: 'red',
        })
        layer.add(newShape)
        setCurrentState('')
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

    const handleDrawShape = () => {
        setCurrentState('drawShape')
        setIsDrawShapesPopupVisible(true)
    }

    // Create a floating left options panel with options for free form shape and line with x performers
    // on the left side of the screen
    const floatingLeftDrawer = () => {
        return (
            <div style={menuStyle}>
                <ul style={ulStyle}>
                    <li style={liStyle}><button style={linkStyle} onClick={() => setCurrentState('drawCurvedLine')}>Draw Free Form</button></li>
                    <li style={liStyle}><button style={linkStyle} onClick={() => setCurrentState('drawStraightLine')}>Draw Straight Line</button></li>
                    <li style={liStyle}><button style={linkStyle} onClick={() => handleDrawShape()}>Draw Shape</button></li>
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
            if (buttonType === 'create') handleCreate(e)
        })

        return button
    }

    // this will be a combination of html component from react-konva-utils and konvajs shapes
    const numberOfPerformersPopup = () => {
        return (
            <div style={numberOfPerformersPopupStyle}>
                <label>Number of Performers: </label>
                <input type="text" onChange={(e) => handlePerformerCount(e)} />
            </div>
        )
    }

    const handleSelectSquare = () => {
        setIsDrawShapesPopupVisible(false)
        setCurrentState('drawSquare')

    }

    const handleSelectCircle = () => {
        setIsDrawShapesPopupVisible(false)
        setCurrentState('drawCircle')
    }

    const drawShapesPopup = () => {
        return (
            <div style={drawShapesPopupStyle}>
                <button onClick={() => handleSelectSquare()}>Square</button>
                <button onClick={() => handleSelectCircle()}>Circle</button>
            </div>
        )
    }

    const onMouseOverEvent = (e) => {
        e.target.getStage().container().style.cursor = 'crosshair'
    }

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
            {isNumberOfPerformersPopupVisible && numberOfPerformersPopup()}
            {isDrawShapesPopupVisible && drawShapesPopup()}
            {currentState}
            <Stage
                onDblClick={onDoubleClickEvent}
                onMouseDown={onMouseDownEvent}
                onMouseMove={onMouseMoveEvent}
                onMouseUp={onMouseUpEvent}
                onMouseOver={onMouseOverEvent}
                width={window.innerWidth * .9} height={window.innerHeight * .9}
                style={stageStyle}>
                <Layer>
                    <Image image={image} width={window.innerWidth * .9} height={window.innerHeight * .9}/>
                </Layer>
            </Stage>
        </div>
    )
}

