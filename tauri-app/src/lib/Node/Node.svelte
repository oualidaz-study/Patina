

<!--Script---------------------------------------------------------------------->

<script lang="ts">
    import { onMount } from "svelte";
    import Link from "./ConnectionLine.svelte";
    import {getNode, VariablesAdd, variableUpdate} from "../../utils/Simulation/simulation"
    import { ENodeType, EConnectionType, getColour, getConnectionColour, getConnectionShape, EVariableType} from "../../utils/Node/node"
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
                connectedTo: null,
                linkRef: null
            },
            
        ],
        variable: null
    }

    let pos = {x: 0, y: 0}

    function makeid(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
        }
        return result;
    }
    
    export function setNodeData(_data){
        data.name = _data.name
        data.type = _data.type
        data.inputs = _data.inputs
        data.outputs = _data.outputs  
        data.variable = _data.variable 

        VariablesAdd(self.id, data)
    }

    export function getNodeData(){
        return data
    }

    export function getId(){
        return self.id
    }
    
    
    export function setPos(_pos){
        pos = _pos
    }

    let isDragging = false
    let delta = {x: 0, y: 0}

    function linesMaintain(e){

        let d = {
            x: startPos.x - e.clientX,
            y: startPos.y - e.clientY,
        }    

        for (const input of data.inputs){
            if(!input.linkRef) continue
            input.linkRef.maintainLine(d, false)
        }
        for (const output of data.outputs){
            if(!output.linkRef) continue
            output.linkRef.maintainLine(d, true)
        }
    }

    function linesMaintainUpdate(e){

        for (const input of data.inputs){
            if(!input.linkRef) continue
            input.linkRef.setPrevPosition(false)
        }
        for (const output of data.outputs){
            if(!output.linkRef) continue
            output.linkRef.setPrevPosition(true)
        }
    }
    

    function onPointerDown(e){
        if(inLinkState) {
            return
        }

        isDragging = true
        delta.x = pos.x - e.clientX
        delta.y = pos.y - e.clientY
        //set StartPosition for the Link
        startPos.x = e.clientX
        startPos.y = e.clientY
        onPointerMove(e)
    }

    function onPointerMove(e){
        if(!isDragging)return
        pos.x = e.clientX + delta.x
        pos.y = e.clientY + delta.y
        linesMaintain(e)
    }

    function onPointerUp(e){
        if(inLinkState) {
            return
        }
        isDragging = false
        linesMaintainUpdate()
    }

    
    //curve
    let inLinkState = false;
    let startPos = {x: 0, y:0}
    let endPos = {x: 0, y:0}
    let link: any


    function createLink(parent){
        link = new Link ({
                target: parent
        })
        link.Construct(startPos.x - pos.x, startPos.y -pos.y)
        link.setConnection(getNode(self.id), parent, link)
    }

    function getLink(btnRef){
        
        const id = btnRef.parentNode.id
        const isOutput = id.includes("output")
        const index = Number(id.replace(/\D/g,''))

       return isOutput ? data.outputs[index].linkRef : data.inputs[index].linkRef
    }

    function onLinkPointerDown(e){

        //set State to Link
        inLinkState=true

        //set StartPosition for the Link
        startPos.x = e.clientX
        startPos.y = e.clientY

        //Create Link Component and set the connection
        if(getLink(e.target)){
            getLink(e.target).$destroy()
        }
        createLink(e.target)
        
        
        onLinkPointerMove(e)
        
    }

    function onLinkPointerMove(e){
        if (!inLinkState || !link) return
        
        endPos.x =  e.clientX - startPos.x 
        endPos.y =  e.clientY - startPos.y 
        
        link.DragLine(endPos.x, endPos.y)
    }


    function onLinkPointerUp(e){
        if (!link) return
        
        inLinkState = false

        if(e.target.id === "link" && link.checkPin(e.target)){
            
            let targetNode = getNode(e.target.offsetParent.id)
        
            link.setConnection(targetNode, e.target, link)
            link.linkNodes()
            link = null
            return
        }
        
        link.$destroy()
        link = null

    }

    const id = data.name + '_'  + makeid(5)


    function findConnection(id){
        const index = id.split('_')[1]
        return id.match("input") ?  data.inputs[index].variable : data.outputs[index].variable 
    }
    
    function handleOnChange(e){
    
        const id = e.target.parentNode.id
        const variable =findConnection(id)
        const key = self.id + (id.match("input") ? "_in" : "_out") + "put_" + variable.name
        const newValue = variable.value
        if(!data.variable)
            variableUpdate(key, newValue)
        
    }

    onMount(()=>{
    })
    

</script>

<!--HTML---------------------------------------------------------------------->

<svelte:window
    on:pointermove={(e)=>{onLinkPointerMove(e)}}
    on:pointerup={(e)=>{onLinkPointerUp(e)}}
/>

<button 
    bind:this={self}
    id={id}
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

        focus:outline-none focus:ring-4 focus:ring-offset-3 focus:ring-offset-transparent focus:ring-amber-700
    "
>   


    {#if data.type != ENodeType.Operator && data.type != ENodeType.Pure }
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
            {#each data.inputs as input, i}
            <div 
                id ="input_{i}"
                class="flex gap-2 h-6 items-between " 
            >
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
                    <input 
                        type="checkbox" 
                        bind:checked={input.variable.value}
                    >
                    {/if}
                    {#if input.variable.type == EVariableType.STRING && !input.linkRef }
                    <input 
                        type="text" 
                        bind:value= {input.variable.value}
                        on:change={(e)=>{handleOnChange(e)}}
                        class="
                            w-12 bg-[#0000001f] rounded-sm
                            outline outline-1 outline-slate-400
                            text-white
                       
                        "
                    />
                    {/if}
                    {#if input.variable.type == EVariableType.INTEGER || (input.type == EConnectionType.VARIABLE && data.variable == EVariableType.INTEGER)}
                    <input 
                        type="number" 
                        id={self.id + "_input_" + data.variable.name }
                        bind:value= {input.variable.value}
                        on:change={(e)=>{handleOnChange(e)}}
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
            {#each data.outputs as output, i}
            <div
                id ="output_{i}" 
                class="flex flex-row-reverse gap-2 items-between "
            >
                <button
                    id="link"
                    class="exec place-self-center"
                    style="
                        outline-color:{getConnectionColour(data.variable && output.type == EConnectionType.VARIABLE ? data.variable : output.variable)};
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

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
</style>
