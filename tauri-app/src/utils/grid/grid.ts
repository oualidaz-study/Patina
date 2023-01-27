"use strict";

import { prevent_default, prop_dev } from "svelte/internal";
import ContextMenuNode from "$lib/contextMenu/ContextMenu.svelte";
import * as select from "./select"
import * as universal from "./universal"
//canvas
let canvas: HTMLCanvasElement
let ctx: CanvasRenderingContext2D
let contextMenuRef

//Viewport Parameters
export const viewportSize = {x: window.innerWidth, y: window.innerHeight};


//Camera Parameters
export const cameraOffset = { x: viewportSize.x/2, y: viewportSize.y/2 }
export const SCROLL_SENSITIVITY = 0.0005
const MAX_ZOOM = 5
const MIN_ZOOM = 0.1
export let cameraZoom = 1
let lastZoom = cameraZoom

//Dragging Variables
let isDragging = false

const dragStart = { x: 0, y: 0 }

//Pinch
let initialPinchDistance: null | number = null

//refresh
let refresh = true



//set canvas
export function setCanvas(_canvas:HTMLCanvasElement){
    canvas = _canvas
    ctx = canvas.getContext("2d")!
    select.setCanvas(canvas)
}

//Draw cycle
export function draw(){
    //Centerize the camera
    cameraCenter() 

    //Update layers
    updateLayerBg()
    updateLayerNode()

    select.draw()

    //Request Anim Frame to refresh
    requestAnimationFrame( draw )
}


function cameraCenter(){
    canvas.width = viewportSize.x
    canvas.height = viewportSize.y

    
    ctx.translate( viewportSize.x / 2, viewportSize.y / 2 )
    ctx.scale(cameraZoom, cameraZoom)
    ctx.translate( -viewportSize.x / 2 + cameraOffset.x, -viewportSize.y / 2 + cameraOffset.y ) 
}



function updateLayerBg(){
    //setup pattern
    let canvas_pattern = document.createElement('canvas')
    canvas_pattern.width = 42
    canvas_pattern.height = 42

    //Create Pattern (Dot Matrix)
    const pctx = canvas_pattern.getContext("2d")!
    pctx.beginPath()
    pctx.fillStyle = '#282828'
    pctx.fillRect(0, 0, 3, 3)

    //get canvas context
    let pattern = ctx.createPattern(canvas_pattern, "repeat")
    ctx.clearRect(MAX_ZOOM * -viewportSize.x/2, MAX_ZOOM * -viewportSize.y/2, MAX_ZOOM * viewportSize.x, MAX_ZOOM * viewportSize.y)
    ctx.rect(MAX_ZOOM * -viewportSize.x/2, MAX_ZOOM * -viewportSize.y/2, MAX_ZOOM * viewportSize.x, MAX_ZOOM * viewportSize.y)
    ctx.fillStyle = pattern!
    ctx.fill()

}

function updateLayerNode(){

    
    const ntx = canvas.getContext("2d")!
    ntx.fillStyle = '#ff33ff'
    ntx.fillRect(0, 0, 20, 20)
}



//Handling functions
export function onPointerDown(e:PointerEvent){

    console.log(e.button)

    switch(e.button){
        case 0: { //LMB
            select.rect.restart(e);
            break;
        }
        case 1: { //Mouse wheel
            isDragging = true
            dragStart.x = universal.getEventLocation(e)!.x/cameraZoom - cameraOffset.x
            dragStart.y = universal.getEventLocation(e)!.y/cameraZoom - cameraOffset.y
            break;
        }
        case 2: {
            e.preventDefault()
        }
    }

    
}

export function onPointerUp(e:PointerEvent){
    select.rect.clear();
    isDragging = false
    initialPinchDistance = null
    lastZoom = cameraZoom
}

export function onPointerMove(e:PointerEvent){
    if (!isDragging) {
        select.rect.update(e);    
        return
    }
    cameraOffset.x = universal.getEventLocation(e)!.x/cameraZoom - dragStart.x
    cameraOffset.y = universal.getEventLocation(e)!.y/cameraZoom - dragStart.y
}

export function handleTouch(e: PointerEvent, SingleTouchHandler:(e: PointerEvent) => void){
    if( e.touches.length == 1 ){
        SingleTouchHandler(e)
    return
    }

    if (!(e.type == "touchmove" || e.touches.length == 2)) return 
        isDragging = false
        handlePinch(e)
}


export function handlePinch(e){
    e.preventDefault()

    const touch = [ { x: e.touches[0].clientX, y: e.touches[0].clientY },
                    { x: e.touches[1].clientX, y: e.touches[1].clientY }]

    // This is distance squared, but no need for an expensive sqrt as it's only used in ratio
    let currentDistance = (touch[0].x - touch[1].x)**2 + (touch[0].y - touch[1].y)**2


    if (initialPinchDistance == null)
        initialPinchDistance = currentDistance
    else
        adjustZoom( null, currentDistance/initialPinchDistance )
}

export function adjustZoom(zoomAmount:number|null, zoomFactor?: number){
    if(isDragging) return

    cameraZoom = zoomAmount ? cameraZoom - zoomAmount
                            : zoomFactor ? zoomFactor*lastZoom 
                                            : cameraZoom

    cameraZoom = Math.min( cameraZoom, MAX_ZOOM )
    cameraZoom = Math.max( cameraZoom, MIN_ZOOM )
}

export function contextMenu(e){
    e.preventDefault()
    if (contextMenuRef == null){
        contextMenuRef = new ContextMenuNode({
            target: canvas.parentElement
        })
    }
    
    contextMenuRef.setPos(e)
}