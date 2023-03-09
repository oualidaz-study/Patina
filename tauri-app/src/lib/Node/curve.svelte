<script>
    import { onMount } from 'svelte'
    let canvas
    let ctx

    let x = 10
    let y = 10

    let xs
    let ys

    let colour = '#ffffff'
    export function setColour(_colour){
        colour = _colour
        console.log(colour)
    }

    export function setStartPoint(xs, ys){
        xs = xs
        ys = ys
        canvas.width = 10000
        canvas.height = 10000
        canvas.style.top = `${ys - canvas.height/2}px` 
        canvas.style.left = `${xs - canvas.width/2}px` 
    }

    export function setEndPoint(_x, _y){
        x = _x
        y = _y
        canvas.style.top = `${ys - canvas.height/2}px` 
        canvas.style.left = `${xs - canvas.width/2}px` 
        ctx = canvas.getContext("2d");
        ctx.clearRect(0,0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.moveTo(canvas.width/2, canvas.height/2);
        ctx.lineTo(canvas.width/2 + x, canvas.height/2 + y);
        ctx.lineWidth = 3
        ctx.strokeStyle = colour
        ctx.lineCap = "round"
        ctx.stroke();  

    }

    export function moveLink(_x, _y){
        canvas.style.top = `${ys - canvas.height/2}px` 
        canvas.style.left = `${xs - canvas.width/2}px` 
        ctx = canvas.getContext("2d");
        ctx.clearRect(0,0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.moveTo(canvas.width/2 + _x, canvas.height/2 + _y);
        ctx.lineTo(canvas.width/2 + x, canvas.height/2 + y);
        ctx.lineWidth = 3
        ctx.strokeStyle = colour
        ctx.stroke();  

    }

    
    
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