const width = 34;
const height = 34;
const ctx = document.createElement('canvas').getContext('2d');
const img = new Image();

Object.assign(ctx.canvas, {width, height});

img.src = 'data:image/gif;base64,R0lGODlhIgAiAIIAMTIwMrSeTPzfMNTOzGdjYPz58VRONLCqqCwAAAAAIgAiAAID/ii63P4wykldKTWvW87V0zUABGB4GAh1xzAcRKquhcvN230ZQI8Ktwpn2InVAMSgJQlA1Qwi5wFJZESbHcNJRD1Aj94agTD4AAfa8ujZwV5KLw8BxfMoiKMy7O2cF8FVdy8EBmUFAIaHB15OiDsnZVYkiXtDi05sIjyRQIeJhyJjojCLO5+FMkdfoGIBrq9bBX6yWFYXVJ5ZDmO3HGRmG2tcLgQCrgQBxi1usj93fG+TMMZaxQFyPWqOH21GR6EKAQbhRrNtdp0GYyh+A8XU4Si46o457iilaOTxmfdKnQW+7HHn4FoWaDJsbXF36104R/moRNjhgYo7ZAFK0FlmLmhiNGbuUHGZBIyGiE94agzJQGROixqMAoG4AKOHzZc4bCUpmfNOJyA9gwoFkQAAOw==';

function consoleLog(...messages) {
    let parts = [''];
    for (let item of messages) {
        if (Array.isArray(item)) {
            const [message, color] = item;
            parts[0] += `%c${message}`;
        }
    }
    for (let item of messages) {
        if (Array.isArray(item)) {
            const [message, color] = item;
            parts.push(`font: 16px/10px monospace; background: ${color}; color: ${color}`);
        } else {
            parts.push(item);
        }
    }
    console.log.apply(console, parts);
}

img.onload = () => {
    ctx.drawImage(img, 0, 0);

    const {data} = ctx.getImageData(0, 0, width, height);

    console.clear();
    for (let y = 0; y < height; y++) {
        let attributes = [];
        for (let x = 0; x < width; x++) {
            let i = ((y * width) + x) * 4;
            const [r, g, b, a] = data.slice(i , i + 4);
            attributes.push([`${i}`.padStart(2).substr(-2), `rgba(${r}, ${g}, ${b}, ${a})`]);
        }

        consoleLog(...attributes);
    }
};