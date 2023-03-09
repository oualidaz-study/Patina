<script lang="ts">
    import { onMount } from 'svelte'
    
    let canvas: HTMLCanvasElement
    let ctx: CanvasRenderingContext2D

    interface position {
        x:number,
        y:number
    }

    let posStart:position
    let posEnd:position
    let colour:string


    function setPos(x, y){
        let p:position ={
            x: 0,
            y:0
        }
        p.x = x + canvas.width /2
        p.y = y + canvas.height /2

        return p
    }

    export function Construct(x:number, y:number){
        colour = "#FFFFFF"
        posStart = setPos(0, 0)
        posEnd = setPos(0, 0)
        canvas.width = 4000
        canvas.height = 4000
        canvas.style.left = `${x-canvas.height/2}px` 
        canvas.style.top = `${y-canvas.width/2}px` 
    }

    function updateLine(){
        ctx = canvas.getContext("2d")!
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.beginPath()
        ctx.lineWidth = 3
        ctx.strokeStyle = colour
        ctx.lineCap = "round"
        ctx.moveTo(posStart.x, posStart.y)
        ctx.lineTo(posEnd.x, posEnd.y)
        ctx.stroke()
    }

    function draw(){
        updateLine()
        requestAnimationFrame(updateLine)
    }

    export function DragLine(x, y){
        posEnd = setPos(x, y)
        draw()
    }

    export function maintainLine(x, y){
        posEnd.x += x
        posEnd.y += y
        draw()
    }
    
    onMount(()=>{
      Construct()  
    })
</script>

<canvas

    bind:this={canvas} 
/>

<style>
    canvas{
        position: absolute;
        pointer-events: none;
    }
</style>