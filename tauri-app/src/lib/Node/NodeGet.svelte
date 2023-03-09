<script>
   import Curve from "./curve.svelte";

    
    

    //Mouse Behaviour
    let delta = {x: 0, y: 0}
    let pos = {x: 0, y: 0}
    export function setPos(_pos){
        pos = _pos
    }

    let isDragging = false

    function onPointerDown(e){
        isDragging = true
        delta.x = pos.x - e.clientX
        delta.y = pos.y - e.clientY
        onPointerMove(e)
    }

    function onPointerMove(e){
        if(!isDragging)return
        pos.x = e.clientX + delta.x
        pos.y = e.clientY + delta.y
    }

    function onPointerUp(e){
        isDragging = false
    }

    //Link Behaviour
    let isLink = false;
    let startPos = {x: 0, y:0}
    let endPos = {x: 0, y:0}
    let curve

    function onLinkPointerDown(e){
        isLink=true
        startPos.x = e.clientX
        startPos.y = e.clientY
        let grid = document.getElementById("container")
        curve = new Curve ({
                target: grid
        })
        curve.setColour("#20deaa")
        curve.setStartPoint(e.clientX, e.clientY)

        onLinkPointerMove(e, curve)
        
    }

    function onLinkPointerMove(e){
        if (!isLink) return
        
        
        
        endPos.x =  e.clientX - startPos.x 
        endPos.y =  e.clientY - startPos.y 
        
        curve.setEndPoint(endPos.x, endPos.y)
    }
    function onLinkPointerUp(e){
        isLink = false

        if(curve == null) return


        console.log(e)

        if(e.target.id != "exec"){
           // curve.$destroy()
            return
        }

    }

</script>


<svelte:window
    on:pointermove={(e)=>{onLinkPointerMove(e)}}
    on:pointerup={(e)=>{onLinkPointerUp(e)}}
/>

<button 
    id="main"
    style:top = "{pos.y}px"
    style:left = "{pos.x}px"
    on:pointerdown={(e)=>{onPointerDown(e)}}
    on:pointermove={(e)=>{onPointerMove(e)}}
    on:pointerup={(e)=>{onPointerUp(e)}}
    on:blur={(e)=>{onPointerUp(e)}}
    on:pointerout={(e)=>{onPointerUp(e)}}
>
    <div>
        <p>
            X
        </p>
        
        <button
            id="link"
            on:pointerdown={(e)=>{onLinkPointerDown(e)}}
        >
        
        </button>
    </div>
</button>

<style>

    div{
        display: flex;
        flex-direction: row;
        justify-content: end;
        align-items: center;
        gap: 8px;
    }

    p{
        padding: 0px;
        margin: 0px;
    }

    #main{
        width: 120px;
        height: max-content;
        padding: 8px 15px;
        position: absolute;
        z-index: 2;
        text-align: end;
        color: azure;
        background-color: #00000052;

        border-radius: 15px;
        border: 0;
        box-shadow: 0px 7px 10px 1px rgba(0,0,0,0.75);
    }

    #link{
        height: 10px;
        width: 10px;
        border-radius: 10px;
        border: 0;
        outline-style: solid;
        outline-color: #20deaa;
        outline-width: 2px;
        background-color: #110f0e;
        padding: 0px;
    }

</style>