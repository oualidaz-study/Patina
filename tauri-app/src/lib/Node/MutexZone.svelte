<script lang="ts">
    import { onDestroy, onMount } from 'svelte'
  import { self } from 'svelte/internal';
    
    let canvas: HTMLCanvasElement
    let ctx: CanvasRenderingContext2D

    interface position {
        x:number,
        y:number
    }


    let connection = {
        input: {
            positon: {x: 0, y:0},
        },
        output: {
            positon: {x: 0, y:0},
        }
    }

    let NodeList = []


    function setPos(x, y, isOutput){
        let p:position ={
            x: 0,
            y:0
        }
        p.x = x + canvas.width /2
        p.y = y + canvas.height /2

        isOutput ? connection.output.positon = p :  connection.input.positon = p
    }


    export function Construct(x:number, y:number){
        setPos(0, 0, false)
        setPos(0, 0, true)
        canvas.width = 4000
        canvas.height = 4000
        canvas.style.left = `${x-canvas.height/2}px` 
        canvas.style.top = `${y-canvas.width/2}px` 
    }

    function updateLine(){
        const x = connection.input.positon.x
        const y = connection.input.positon.y
        const w = connection.input.positon.x - connection.output.positon.x
        const h = connection.input.positon.y - connection.output.positon.y
        ctx = canvas.getContext("2d")!
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.beginPath()
        ctx.fillStyle = "#69122356";
        ctx.strokeStyle = "491223";
        ctx.rect(x,y,w,h)
        ctx.fillRect(x,y,w,h)
        ctx.stroke()
    }

    function draw(){
        updateLine()
        requestAnimationFrame(updateLine)
    }

    export function DragLine(x, y){
        setPos(x, y, true)
        draw()
    }

    export function NodeSelect(){
        
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
        z-index: 5;
    }
</style>