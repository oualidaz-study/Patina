<script>
  import Curve from "./curve.svelte";


  

  let delta = {x: 0, y: 0}
    let pos = {x: 0, y: 0}
    export function setPos(_pos){
        pos = _pos
        console.log("placed")
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

    //curve
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
        curve.setStartPoint(e.clientX, e.clientY)
        if (e.target.id == "link"){
            curve.setColour("#20deaa")
        }
        
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
            curve.$destroy()
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
    <p class="header">Set</p>
    
    <div class="in">

        

        <div class=label>
            
            
            <button
                id="exec"
                on:pointerdown={(e)=>{onLinkPointerDown(e)}}
            >
            
            </button>

            <p>
                
            </p>
        </div>

        <div class=label>
            
            <button
                id="link"
                on:pointerdown={(e)=>{onLinkPointerDown(e)}}
            >
            
            </button>
            <p>
                X
            </p>
            
        </div>
    </div>
    <div class="out">
        <div class=label>
            <p>
                
            </p>
            
            <button
                id="exec"
                on:pointerdown={(e)=>{onLinkPointerDown(e)}}
            >
            
            </button>
        </div>
        <div class=label>
            
            <p>
                
            </p>
            <button
                id="link"
                on:pointerdown={(e)=>{onLinkPointerDown(e)}}
            >
            
            </button>
        </div>
    </div>
    

    
</button>

<style>

    .label{
        display: flex;
        flex-direction: row;
        justify-content: end;
        align-items: center;
        gap: 8px;
        height: 15px;
    } 

    p{
        padding: 0px;
        margin: 0px;
    }

    .in{
        grid-area: i;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 20px;
    }

    .out{
        grid-area: o;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 20px;
    }

    .header{
        grid-area: h;
        text-align: center;
        background: linear-gradient(90deg, rgba(11,126,113,1) 33%, rgba(32,222,170,1) 100%);
        margin:  -5px -12px 10px -12px;
        padding: 2px 10px;
        border-radius: 5px 5px 0px 0px;

    }

    #main{
        width: 150px;
        height: max-content;
        padding: 10px 15px;
        position: absolute;
        z-index: 2;
        text-align: end;
        color: azure;
        background-color: #00000052;
        
        border-radius: 5px;
        border: 0;
        display: grid;
        grid-template-areas:
                        "h h h"
                        "i l o"
                        "i l o";
        justify-content: space-between;
        align-items: center;
        box-shadow: 0px 7px 10px 1px rgba(0,0,0,0.75);
    }

    #exec{
        height: 10px;
        width: 10px;
        border-radius: 1px 15px 15px 1px;
        border: 0;
        outline-style: solid;
        outline-color: #ffffff;
        outline-width: 2px;
        background-color: #110f0e;
        padding: 0px;
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