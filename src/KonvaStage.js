import { Stage, Layer, Image } from 'react-konva'
import useImage from 'use-image'
import Konva from "konva"
import useState from 'react-usestateref'
import FloatingLeftDrawer from "./components/FloatingLeftDrawer";
import NumberOfPerformersPopup from "./components/popups/NumberOfPerformersPopup";
import DrawShapesPopup from "./components/popups/DrawShapesPopup";
import { createKonvaButton } from "./KonvaUtils";

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
        var cancel = createKonvaButton('Cancel', position.top, position.left, 100, 50, 'cancel', handleCancel)
        var create = createKonvaButton('Create', position.top + 100, position.left, 100, 50, 'create', handleCreate)
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
            drawCirclesOnCircle(e)
            setPerformerCount(null)
            setStraightLineStartPoint([-1, -1])
            setLastLinePoint([-1, -1])
        }
    }

    const drawCirclesOnCircle = (e) => {
        var group = new Konva.Group({
            draggable: true
        })
        var numberOfCircles = performerCountRef.current
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
            group.add(newCircle)
        }
        e.target.getLayer().add(group)
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

    function drawSquareFormation(layer, rectX, rectY, sideLength, n) {
        const m = Math.ceil(n / 4);  // approx performers per side
        const spacing = sideLength / (m - 1);  // space between performers

        for (let i = 0; i < m; i++) {
            // Top side
            drawCircle(layer, rectX + i * spacing, rectY);
            // Right side
            drawCircle(layer, rectX + sideLength, rectY + i * spacing);
            // Bottom side
            drawCircle(layer, rectX + i * spacing, rectY + sideLength);
            // Left side
            drawCircle(layer, rectX, rectY + i * spacing);
        }

        layer.draw()
    }

    function drawCircle(layer, x, y) {
        const circle = new Konva.Circle({
            x: x,
            y: y,
            radius: 4,  // adjust as necessary
            fill: 'red'  // adjust color as needed
        });
        var newGroup = groupRef.current
        newGroup.add(circle)
    }

    const addSquare = (e) => {
        var layer = e.target.getLayer()
        var sqaureGroup = new Konva.Group({
            draggable: true
        })
        setGroup(sqaureGroup)
        var x = e.currentTarget.getPointerPosition().x
        var y = e.currentTarget.getPointerPosition().y
        drawSquareFormation(layer, x, y, 100, 20)
        layer.add(groupRef.current)
        setCurrentState('')
        setGroup(null)
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

    const handleSelectSquare = () => {
        setIsDrawShapesPopupVisible(false)
        setCurrentState('drawSquare')

    }

    const handleSelectCircle = () => {
        setIsDrawShapesPopupVisible(false)
        setCurrentState('drawCircle')
    }

    const onMouseOverEvent = (e) => {
        e.target.getStage().container().style.cursor = 'crosshair'
    }

    const topLevelScreenStyle = {
        position: 'relative',
    }

    const stageStyle = {
        position: 'absolute',
        right: '0px',
        top: window.innerHeight * .1,
    }

    return (
        <div style={topLevelScreenStyle}>
            <FloatingLeftDrawer
                setCurrentState={setCurrentState}
                setIsDrawShapesPopupVisible={setIsDrawShapesPopupVisible}
            />
            <NumberOfPerformersPopup
                isNumberOfPerformersPopupVisible={isNumberOfPerformersPopupVisible}
                position={position}
                handlePerformerCount={handlePerformerCount}
            />
            <DrawShapesPopup
                isDrawShapesPopupVisible={isDrawShapesPopupVisible}
                handleSelectSquare={handleSelectSquare}
                handleSelectCircle={handleSelectCircle}
            />
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