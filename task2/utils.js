
// Convert RGB to alpha
function fromAlpha(color, alpha, assumedBackground = 255) {
    return (color * alpha) + ((1 - alpha) * assumedBackground);
}

function toHex(color) {
    return ('0' + color.toString(16)).slice(-2);
}

function rgbaToHex(r, g, b, a) {
    const alpha = a / 255;
    r = fromAlpha(r, alpha);
    g = fromAlpha(g, alpha);
    b = fromAlpha(b, alpha);        
    return '#' + toHex(r) + toHex(g) + toHex(b);
}

function mergeArraysCustomizer(objValue, srcValue) {
    if (_.isArray(objValue)) {
        return objValue.concat(srcValue);
    }
}

function sharp(values, delays) {
    const r_colors = [];
    const r_times = [];
    const colors = values.slice(0, -2);
    const times = delays.slice(1, -1);
    times.forEach((time, index) => {
        r_colors.push(colors[index], colors[index]);
        r_times.push(time - 0.01);
        r_times.push(time);
    });
    return {
        values: [ ...r_colors, ...values.slice(-2) ],
        keyTimes: [ 0, ...r_times, 1 ]
    };
}

async function parseGif(url) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const reader = new GifReader(new Uint8Array(arrayBuffer));
    // borrowed from https://github.com/scijs/get-pixels
    if (reader.numFrames() > 0) {
        var nshape = [reader.numFrames(), reader.height, reader.width, 4]
        var ndata = new Uint8Array(nshape[0] * nshape[1] * nshape[2] * nshape[3])
        var result = ndarray(ndata, nshape)
        try {
            for (var i = 0; i < reader.numFrames(); ++i) {
                reader.decodeAndBlitFrameRGBA(i, ndata.subarray(
                    result.index(i, 0, 0, 0),
                    result.index(i + 1, 0, 0, 0)
                ))
            }
        } catch (err) {
            cb(err)
            return
        }
        return result.transpose(0, 2, 1);
    } 
    var nshape = [reader.height, reader.width, 4]
    var ndata = new Uint8Array(nshape[0] * nshape[1] * nshape[2])
    var result = ndarray(ndata, nshape)
    try {
        reader.decodeAndBlitFrameRGBA(0, ndata)
    } catch (err) {
        cb(err)
        return
    }
    return result.transpose(1, 0);        
}