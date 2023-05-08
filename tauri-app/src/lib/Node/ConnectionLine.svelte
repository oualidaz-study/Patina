<script lang="ts">
  import { EVariableType, getConnectionColour } from "../../utils/Node/node";
    import { onDestroy, onMount } from 'svelte'
  import { self } from 'svelte/internal';
    
    let canvas: HTMLCanvasElement
    let ctx: CanvasRenderingContext2D

    interface position {
        x:number,
        y:number
    }

    interface iconnection{
        node: any,
        index: number,
        position: position,
        prevPosition: position,
        btnRef: any,
        isOutput: boolean
    }

    let connection = {
        input: {
            node: null,
            index: -1,
            positon: {x: 0, y:0},
            prevPosition: {x: 0, y:0},
            btnRef: null,
            isOutput: false
        },
        output: {
            node: null,
            index: -1,
            positon: {x: 0, y:0},
            prevPosition: {x: 0, y:0},
            btnRef: null,
            isOutput: true
        },
        variable: null,
    }

    let colour:string


    export function getVariable(){
        return connection.variable
    }

    export function setVariable(newVariable){
        connection.variable = newVariable
    }

    function getColour(isOutput){
        let pin = isOutput ? connection.output : connection.input
        console.log(isOutput, pin.btnRef)
        if (!pin.btnRef){
            pin = isOutput ? connection.input : connection.output
        }
       
        return pin.btnRef.style.outlineColor
    }


    function setPos(x, y, isOutput){
        let p:position ={
            x: 0,
            y:0
        }
        p.x = x + canvas.width /2
        p.y = y + canvas.height /2

        isOutput ? connection.output.positon = p :  connection.input.positon = p
    }

    export function checkPin(btnRef:any){
        const id = btnRef.parentNode.id
        const isOutput = id.includes("output")

        if(isOutput){
            return connection.output.btnRef ? false : true
        } 
        return connection.input.btnRef ? false : true
    }

    export function setConnection(node:any, btnRef:any, linkComponent){

        btnRef.style.backgroundColor= btnRef.style.outlineColor
        const id = btnRef.parentNode.id
        const isOutput = id.includes("output")
        const index = Number(id.replace(/\D/g,''))
        isOutput ? connection.output.btnRef = btnRef :  connection.input.btnRef = btnRef
        isOutput ? connection.output.node = node :  connection.input.node = node
        isOutput ? connection.output.index = index :  connection.input.index = index

        const data = node.getNodeData()
        isOutput ? data.outputs[index].linkRef = linkComponent
         : data.inputs[index].linkRef = linkComponent

        if (!isOutput){
           const inputbox = document.getElementById(id)?.querySelector('input')
           if(!inputbox) return
           inputbox.style.visibility = "hidden"
        }    
        draw()
    }

    export function disconnect(pin: iconnection){
        if (!pin.btnRef) return
        
        //link removal
        pin.btnRef.style.backgroundColor= "#110f0e"
        const data = pin.node.getNodeData()
        pin.isOutput ? data.outputs[pin.index].linkRef = null 
                     : data.inputs[pin.index].linkRef = null

        pin.isOutput ? data.outputs[pin.index].connectedTo = null 
        : data.inputs[pin.index].connectedTo = null

        if (!pin.isOutput){
           const inputbox = document.getElementById(`input_${pin.index}`)?.querySelector('input')
           if(!inputbox) return
           inputbox.style.visibility = "visible"
        }  
        draw() 
    }

    onDestroy(()=>{
        disconnect(connection.input)
        disconnect(connection.output)
    })

    export function linkNodes(){
        if (!(connection.input.node && connection.output.node)) return
        const inputNode = connection.input.node
        
        const outputNode = connection.output.node

        const inputData = inputNode.getNodeData().inputs[connection.input.index]
        const outputData = outputNode.getNodeData().outputs[connection.output.index]

        inputData.connectedTo = outputNode
        outputData.connectedTo = inputNode

        setPrevPosition(false)
        setPrevPosition(true)
    }



    export function Construct(x:number, y:number){
        colour = "#FFFFFF"
        setPos(0, 0, false)
        setPos(0, 0, true)
        canvas.width = 4000
        canvas.height = 4000
        canvas.style.left = `${x-canvas.height/2}px` 
        canvas.style.top = `${y-canvas.width/2}px` 
    }

    function updateLine(){
        ctx = canvas.getContext("2d")!
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        
        var grad= ctx.createLinearGradient(connection.input.positon.x, connection.input.positon.y, 
                                           connection.output.positon.x, connection.output.positon.y);
        grad.addColorStop(0, getColour(true))
        grad.addColorStop(1, getColour(false))
        
        ctx.beginPath()
        ctx.lineWidth = 3
        ctx.strokeStyle = grad
        ctx.lineCap = "round"
        ctx.moveTo(connection.input.positon.x, connection.input.positon.y)
        ctx.lineTo(connection.output.positon.x, connection.output.positon.y)
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

    export function setPrevPosition(isOutput){
        if(isOutput){
            connection.output.prevPosition.x = connection.output.positon.x - connection.input.positon.x
            connection.output.prevPosition.y = connection.output.positon.y - connection.input.positon.y
        }
        else{
            connection.input.prevPosition.x = connection.output.positon.x - connection.input.positon.x
            connection.input.prevPosition.y = connection.output.positon.y - connection.input.positon.y
        }
    }

    export function maintainLine(delta, isOutput){
        
        const prevPos = isOutput ? connection.output.prevPosition : connection.input.prevPosition 
        
        if(!isOutput){
            delta.x *= -1
            delta.y *= -1
        }
        
        setPos(prevPos.x + delta.x, prevPos.y - delta.y, true)
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