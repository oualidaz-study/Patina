<script lang="ts">
  import {NodeAdd} from "../../utils/Simulation/simulation"
  import {ENodeType, EConnectionType, EVariableType} from "../../utils/Node/node"
  import { onMount } from "svelte";
    let MenuRef: HTMLElement

   

   const Set = {
        name: "Set",
        type: ENodeType.Function,
        inputs: [
            {
                label: "",
                type: EConnectionType.EXEC,
                variable: null,
                connectedTo: null
            },
            {
                label: "X",
                type: EConnectionType.VARIABLE,
                variable: {
                    name: "X",
                    type: EVariableType.INTEGER,
                    value: 0
                },
                connectedTo: null
            },
        ],
        outputs: [
            {
                label: "",
                type: EConnectionType.EXEC,
                variable: null,
                connectedTo: null
            },
            {
                label: "X",
                type: EConnectionType.VARIABLE,
                connectedTo: null
            },
        ],
        variable: {
            name: "X",
            type: EVariableType.INTEGER,
            value: 0
        },
    }

    const Get = {
        name: "Get",
        type: ENodeType.Function,
        inputs: [
            {
                label: "",
                type: EConnectionType.EXEC,
                variable: null,
                connectedTo: null
            },
        ],
        outputs: [
            {
                label: "",
                type: EConnectionType.EXEC,
                variable: null,
                connectedTo: null
            },
            {
                label: "X",
                type: EConnectionType.VARIABLE,
                
                connectedTo: null
            },
        ],
        variable: {
            name: "X",
            type: EVariableType.INTEGER,
            value: 0
        },
    }

    let Nodenames = [Get, Set]

    let pos = {x: 0, y: 0};   
    let remember = 15
    export function setPos(e){

        pos = {x: e.x - 50, y: e.y -50}   
        let correct = {x: -160, y:-remember}
        if (e.clientY < 100 ){
            correct.y = 0
        }
        else if (e.clientY > window.innerHeight - 90 ){
            correct.y = -181
        }
        if (e.clientX < 180 ){
            correct.x = 0
        }
        else if (e.clientX > window.innerWidth - 90 ){
            correct.x = -220
        }
        

        pos = {x: pos.x + correct.x, y: pos.y + correct.y}   
        MenuRef.style.display = "block"

        
    }

    function blur(e){
        MenuRef.style.display = "none"
    }

    function handleButton(e: PointerEvent, info){
        remember =  (e.y )  - (pos.y  + 50 ) //works but prefer to have the mouse on the center of the button
        MenuRef.style.display = "none"
        const data = JSON.parse(JSON.stringify(info)) // clone info
        NodeAdd(data, pos)
    }

    export function setData(name, type){
        Set.inputs[1].label = name
        Set.outputs[1].label = name
        Get.outputs[1].label = name
    }

</script>

<div bind:this={MenuRef}
    class ="boundingBox"
    on:blur={(e) => blur(e)}
    on:mouseleave={(e) => blur(e)}
    style:left="{pos.x}px" 
        style:top="{pos.y}px"
>
    <div 
        class="menu"
        
    >
        {#each Nodenames as info}
            <button 
                on:pointerdown={(e) => handleButton(e, info)}
            >
                <div class="btnName">{info.name}</div>
            </button>
        {/each}

    </div>
</div>

<style>
    .boundingBox{
        padding: 50px;
        position: absolute;
    

    }
    .menu{
        z-index: 2;
        background-color: #161414a7;
        border: 1px solid;
        border-color: #2f2f2f;
        border-radius: 5px;
        font-family: 'Trebuchet MS';
        font-size: 12px;
        color: #848484;
        padding: 2px;
        width: fit-content;
        
    }

    

    p{
        padding: 3px 8px;
        margin: 0px;
    }
    button{
        padding-left: 25px;
        text-align: left;
        background-color: rgba(0, 0, 0, 0);
        border: 0;
        border-radius: 3px;
        color: #ffffff;
        text-shadow: 1px 1px 2px black;
        display: flex;
        width: 100%;
        
        
    }

    button:hover{
        background-color: #4772b3; 
        
    }

    hr {
    display: block;
    height: 1px;
    border: 0;
    border-top: 1px solid #2f2f2f;
    margin: 7px 0px 2px 0px;
    padding: 0;
    }

    .btnName{
        padding: 0px;
        margin: 0px;
        
        
    }

    .btnShortcut{
        padding: 0px;
        margin: 0px;
        text-align: end;
        flex: 2;
        color: #848484;
    }
        
</style>