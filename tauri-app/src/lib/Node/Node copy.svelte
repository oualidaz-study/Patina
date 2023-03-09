

<!--Script---------------------------------------------------------------------->

<script>
  import { onMount } from "svelte";
  import Curve from "./curve.svelte";

    //Parameters
    let node
    let name = "Event Start"
    let headerColour = ["#902F2F", "#DD4949"]
    let ins =[
      
    ]
    let outs =[
        {id: "exec", type: "#ffffff", label: ""},

    ]
    let isOperator = false

    export function setInfo(info){
        name = info.name
        headerColour = info.headerColour
        ins = info.ins
        outs = info.outs
        isOperator = info.isOperator
        node.querySelector("#header").style.background = `linear-gradient(90deg, ${headerColour[0]} 33%, ${headerColour[1]} 100%)`
        node.querySelector("#header").style.boxShadow = `0px 3px 12px 0px ${headerColour[0]}`;
        if(isOperator){
        node.querySelector("#main").style.width = "100px"
        node.querySelector(".in").style.paddingRight = "0px"
        }
    }


    onMount(()=>{
        node.querySelector("#header").style.background = `linear-gradient(90deg, ${headerColour[0]} 33%, ${headerColour[1]} 100%)`
        node.querySelector("#header").style.boxShadow = `0px 3px 12px 0px ${headerColour[0]}`;
    })

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
         //   curve.$destroy()
            return
        }

    }

</script>

<!--HTML---------------------------------------------------------------------->

<svelte:window
    on:pointermove={(e)=>{onLinkPointerMove(e)}}
    on:pointerup={(e)=>{onLinkPointerUp(e)}}
/>

<button 
    bind:this={node}
    id="main"
    style:top = "{pos.y}px"
    style:left = "{pos.x}px"
    on:pointerdown={(e)=>{onPointerDown(e)}}
    on:pointermove={(e)=>{onPointerMove(e)}}
    on:pointerup={(e)=>{onPointerUp(e)}}
    on:blur={(e)=>{onPointerUp(e)}}
    on:pointerout={(e)=>{onPointerUp(e)}}
>   

    {#if !isOperator}
    <p id="header" class="header">{name}</p>
    {/if}
    {#if isOperator}
    <p class = "operation">{name}</p>
    {/if}

    <div class="in">
        {#each ins as out}
        <div class=label>
            
            
            <button
                id={out.id}
                style="outline-color:{out.type}"
                on:pointerdown={(e)=>{onLinkPointerDown(e)}}
            >
            
            </button>
            <p>
                {out.label}
            </p>
            {#if out.id == "bool"}
            <input type="checkbox">
            {/if}
            {#if out.id == "link"}
            <input type="text">
            {/if}
        </div>
        {/each}
        

        
    </div>
    <div class="out">
        {#each outs as out}
        <div class=label>
            <p>
                {out.label}
            </p>
            
            <button
                id={out.id}
                style="outline-color:{out.type}"
                on:pointerdown={(e)=>{onLinkPointerDown(e)}}
            >
            
            </button>
        </div>
        {/each}
    </div>
    

    
</button>


<!--Styling---------------------------------------------------------------------->

<style>

.operation{
        grid-area: l;
        font-size: large;
        align-self: center;
        justify-self: center;
    }

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
        padding-right: 10px;
    }

    .out{
        grid-area: o;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 20px;
        padding-left: 10px;
    }

    .header{
        grid-area: h;
        text-align: start;
        
        margin:  -5px -12px 10px -12px;
        padding: 2px 10px;
        border-radius: 5px 5px 0px 0px;

    }

    #main{
        min-width: 150px;
        width: max-content;
        min-height: max-content;
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
        box-shadow: 0px 7px 10px 1px rgba(0, 0, 0, 0.429);
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
        outline-width: 2px;
        background-color: #110f0e;
        padding: 0px;
    }

    #bool{
        height: 10px;
        width: 10px;
        border-radius: 10px;
        border: 0;
        outline-style: solid;
        outline-width: 2px;
        background-color: #110f0e;
        padding: 0px;
    }

    input[type=text] {
        width: 32px;
        background-color: rgba(0, 0, 0, 0.12);
        border-color: rgba(0, 0, 0, 0.408);        
        border-radius: 3px;
        color: #ffffff;
        margin-right: 10px;
    }

    input[type=checkbox] {
        
        background-color: #110f0e;
    }

</style>