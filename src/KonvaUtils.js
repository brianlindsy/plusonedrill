import Konva from "konva";

export const createKonvaButton = (text, x, y, width, height, buttonType, onClick) => {
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
        if (buttonType === 'cancel') onClick(e)
        if (buttonType === 'create') onClick(e)
    })

    return button
}