

<!--Script---------------------------------------------------------------------->

<script lang="ts">
    import { onMount } from "svelte";
    import Link from "./ConnectionLine.svelte";
    import { ENodeType, EConnectionType, getColour, getConnectionColour, getConnectionShape, EVariableType} from "../../utils/Node/node"
  import { identity } from "svelte/internal";
    //Parameters
    let self:HTMLElement

    let data = {
        name: "Event Start",
        type: ENodeType.Start,
        inputs: [
            
        ],
        outputs: [
            
            {
                label: "Start",
                type: EConnectionType.EXEC,
                variable: null,
                connectedTo: null
            },
            
        ],
    }

    let pos = {x: 0, y: 0}
    
    export function setNodeData(_data){
        data.name = _data.name
        data.type = _data.type
        data.inputs = _data.inputs
        data.outputs = _data.outputs   
    }

    
    
    export function setPos(_pos){
        pos = _pos
    }

    let isDragging = false
    let delta = {x: 0, y: 0}

    function onPointerDown(e){
        if(isLink) return

        isDragging = true
        delta.x = pos.x - e.clientX
        delta.y = pos.y - e.clientY
    
        onPointerMove(e)
    }

    function onPointerMove(e){
        if(!isDragging)return
        pos.x = e.clientX + delta.x
        pos.y = e.clientY + delta.y

        if(!curve)return
        console.log(pos)
        curve.maintainLine(startPos.x , delta.y)
    }

    function onPointerUp(e){
        isDragging = false
    }

    
    //curve
    let isLink = false;
    let startPos = {x: 0, y:0}
    let endPos = {x: 0, y:0}
    let btnRef
    let curve

    function onLinkPointerDown(e){
        isLink=true
        btnRef = e.target
        btnRef.style.backgroundColor= "#ffffff"
        startPos.x = e.clientX
        startPos.y = e.clientY
        let grid = document.getElementById("container")
        curve = new Link ({
                target: e.target
        })
        curve.Construct(startPos.x - pos.x, startPos.y -pos.y)
        onLinkPointerMove(e, curve)
        
        
    }

    function onLinkPointerMove(e){
        if (!isLink) return
        
        
        
        endPos.x =  e.clientX - startPos.x 
        endPos.y =  e.clientY - startPos.y 
        
        curve.DragLine(endPos.x, endPos.y)
    }
    function onLinkPointerUp(e){
        if (!btnRef || data.outputs[0].connectedTo) return
        isLink = false

        if(e.target.id === "link"){
            let other = e.target
            data.outputs[0].connectedTo = other
            other.style.backgroundColor= "#ffffff"
            return
        }

        
        btnRef.style.backgroundColor= "#110f0e"
        if(curve == null) return

    }

    

</script>

<!--HTML---------------------------------------------------------------------->

<svelte:window
    on:pointermove={(e)=>{onLinkPointerMove(e)}}
    on:pointerup={(e)=>{onLinkPointerUp(e)}}
/>

<button 
    bind:this={self}
    id="main"
    style:top = "{pos.y}px"
    style:left = "{pos.x}px"
    on:pointerdown={(e)=>{onPointerDown(e)}}
    on:pointermove={(e)=>{onPointerMove(e)}}
    on:pointerup={(e)=>{onPointerUp(e)}}
    on:blur={(e)=>{onPointerUp(e)}}
    on:pointerout={(e)=>{onPointerUp(e)}}
    class="
        absolute z-10 pb-3 min-w-[150px] w-max min-h-max
        bg-[#00000052] rounded-md drop-shadow-lg
    "
>   


    {#if data.type != ENodeType.Operator}
        <p 
            class={`
                px-2  
                rounded-t-md 
                shadow-md 
                text-start text-slate-50
            `}

            style = "
                background: linear-gradient(90deg, {getColour(data.type, 0)} 33%, {getColour(data.type, 1)} 100%);
                box-shadow: 0px 3px 12px 0px {getColour(data.type)}
            "
        >
            {data.name}
            
        </p>
    {/if}

    

    <div
    class= "
        flex gap-4 
        justify-between align-top
        p-2
    "
    >
        <div>
            {#each data.inputs as input}
            <div class="flex gap-2 h-6 items-between " >
                <button
                    id="link"
                    class="exec place-self-center"
                    style="
                        outline-color:{getConnectionColour(input.variable)};
                        border-radius: {getConnectionShape(input.type)};
                        "
                    on:pointerdown={(e)=>{onLinkPointerDown(e)}}
                />
                <p class=" text-white ">
                    {input.label}
                </p>
                {#if input.variable}
                    {#if input.variable.type == EVariableType.BOOLEAN}
                    <input type="checkbox" value= {input.variable.value}>
                    {/if}
                    {#if input.variable.type == EVariableType.STRING}
                    <input 
                        type="text" 
                        value= {input.variable.value}
                        class="
                            w-12 bg-[#0000001f] rounded-sm
                            outline outline-1 outline-slate-400
                            text-white
                       
                        "
                    />
                    {/if}
                    {#if input.variable.type == EVariableType.INTEGER}
                    <input 
                        type="text" 
                        value= {input.variable.value}
                        class=" justify-center
                            w-5 h-5 bg-[#0000001f] rounded-sm
                            outline outline-1 outline-slate-400
                            text-white
                       
                        "
                    />
                    {/if}
                {/if}
            </div>
            {/each} 
        </div>

        {#if data.type == ENodeType.Operator}
            <p class="text-gray-400 text-2xl mr-5 mt-2">
                {data.name}
            </p>
        {/if}
        
        <div>
            {#each data.outputs as output}
            <div class="flex flex-row-reverse gap-2 items-between ">
                <button
                    id="link"
                    class="exec place-self-center"
                    style="
                        outline-color:{getConnectionColour(output.variable)};
                        border-radius: {getConnectionShape(output.type)};
                        "
                    on:pointerdown={(e)=>{onLinkPointerDown(e)}}
                />
                <p class=" text-white ">
                    {output.label}  
                </p>
            </div>
            {/each}
        </div>
    </div>
</button>


<style lang="scss">
.exec{
    height: 10px;
    width: 10px;

    border: 0;
    outline-style: solid;
    outline-color: #ffffff;
    outline-width: 2px;
    background-color: #110f0e;
    padding: 0px;
}
</style>
