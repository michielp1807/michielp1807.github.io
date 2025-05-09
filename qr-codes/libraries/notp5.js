function p5(fn, id) {
    function parseColor(...[r, g, b]) {
        if (Array.isArray(r)) {
            [r, g, b] = r;
        };
        g = g ?? r;
        b = b ?? r;
        return `rgb(${r},${g},${b})`;
    }

    let div = document.getElementById(id);
    let obj = {};
    obj.createCanvas = function (w, h) {
        obj._canvas = document.createElement("canvas");
        obj._ctx = obj._canvas.getContext("2d");
        div.appendChild(obj._canvas);
        obj.resizeCanvas(w, h);
        return {
            mouseClicked(handler) {
                obj._canvas.addEventListener("click", handler);
            }
        }
    };
    obj.resizeCanvas = function (w, h) {
        obj._canvas.width = w;
        obj._canvas.height = h;
        obj._canvas.style.width = w + "px"
        obj._canvas.style.height = h + "px"
    }
    obj.stroke = function (...color) {
        obj._ctx.strokeStyle = parseColor(...color);
    };
    obj.fill = function (...color) {
        obj._ctx.fillStyle = parseColor(...color);
    };
    obj.rect = function (x, y, w, h) {
        obj._ctx.fillRect(x, y, w, h);
        obj._ctx.strokeRect(x, y, w, h);
    };
    fn(obj);
    document.addEventListener("DOMContentLoaded", () => { obj.setup(); obj._setupDone = true; });
    return obj;
}