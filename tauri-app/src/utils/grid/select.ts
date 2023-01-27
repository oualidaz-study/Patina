"use strict"

import * as universal from "./universal"
import { cameraZoom, cameraOffset } from "./grid"
let canvas:HTMLCanvasElement

export function setCanvas(_canvas: HTMLCanvasElement){
    canvas = _canvas
}

export const rect = (() => {
    var x1, y1, x2, y2;
    var show = false;
    function fix() {
        rect.x = Math.min(x1, x2);
        rect.y = Math.min(y1, y2);
        rect.w = Math.max(x1, x2) - Math.min(x1, x2);
        rect.h = Math.max(y1, y2) - Math.min(y1, y2);
    }
    function draw(ctx) { 
        ctx.strokeRect(this.x, this.y, this.w, this.h) 
        ctx.fillRect(this.x, this.y, this.w, this.h)}
    const rect = {x : 0, y : 0, w : 0, h : 0,  draw};
    const API = {
        restart(e: PointerEvent) {
            x2 = x1 = universal.getEventLocation(e)!.x/1-cameraZoom - cameraOffset.x;
            y2 = y1 = universal.getEventLocation(e)!.y/1-cameraZoom - cameraOffset.y;
            fix();
            show = true;
        },
        update(e: PointerEvent) {
            if (!show) return
            x2 = universal.getEventLocation(e)!.x/1-cameraZoom - cameraOffset.x;
            y2 = universal.getEventLocation(e)!.y/1-cameraZoom - cameraOffset.y;
            fix();
            show = true;
        },
        clear(){
            show = false;
        },
        toRect() {
            show = false;
            return Object.assign({}, rect);
        },
        draw(ctx) {
            if (show) { rect.draw(ctx) }
        },
        show : false,
    }
    return API;
})();

export function draw(){
    const ctx = canvas.getContext("2d")!
    ctx.setLineDash([5, 15]);
    ctx.strokeStyle = "white";
    ctx.fillStyle = "rgba(255, 255, 255, 0.1)"
    rect.draw(ctx);
}