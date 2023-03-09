<script lang="ts">
  import VariableSelectDrop from "$lib/Variables/VariableSelectDrop.svelte";
  import Tooltip from "$lib/tooltip/tooltip.svelte";


    let name = "NewVar"
    let type = "Boolean"
    let isDragging = false
    let pos = {x: 0, y: 0}
    let toolTipRef: Tooltip
    

    function onPointerDown(e){
        e.target.style.backgroundColor  = "#0070e0"
        e.target.style.color = "#f9fcfe"

       isDragging = true
        toolTipRef = new Tooltip ({
            target: e.target
        })

        
        onPointerMove(e) 
    }

    function onPointerMove(e){
        if (!isDragging)return
        pos.x = e.clientX
        pos.y = e.clientY
        toolTipRef.move(pos)
        
    }

    function onPointerUp(e){

        if(toolTipRef){
            isDragging = false
            toolTipRef.$destroy()
            toolTipRef = null
            let node = new VariableSelectDrop ({
                target: e.target.parentNode
            })
            node.setPos(pos)
            console.log(e.target)
        }

        
    }

    function selectVarType(e){
        e.stopPropagation()
    }

    

</script>


<svelte:window
    on:pointermove={(e)=>onPointerMove(e)}
    on:pointerup={(e)=>onPointerUp(e)}
/>

<button 
    id="main"
    on:pointerdown={(e)=>onPointerDown(e)}
    
    title= "Boolean"
>
    {name}
    <button 
        id="var"
        on:pointerup={(e)=>selectVarType(e)}
    >
        {type}
    </button>
</button>

<style>
    #main{
        background-color: #1a1a1a;
        border: 0;
        display: flex;
        justify-content: space-between;
        padding: 2px 5px 2px 25px;
        margin: 3px 0px 1px;
        flex-direction: row;
        color: #c0c0c0;
    }
    #main:hover{
        background-color: #242424;
    }
    #main:hover > #var{
        border: 1px;
        background-color: #0f0f0f;
        border-radius: 3px;
    }
    #var{
        background-color: #1a1a1a00;
        border: 0;
        color: #c0c0c0;
    }
    
</style>

