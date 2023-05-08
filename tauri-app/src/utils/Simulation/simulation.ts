
import { readable } from 'svelte/store';
import Node from "$lib/Node/Node.svelte";
import type { SNode, SVariable } from '../Node/node';


const NodeMap = new Map<string, Node>()


interface SToken {
    key: string,
    outIndex: number,
    canMove: boolean,
    doneAction: boolean
}


let Tokens:SToken[] = []
let originToken

let VariableMap= new Map<string, SVariable>()

export function VariablesAdd(id, data){
    if(data.variable){
        VariableMap.set(data.variable.name, data.variable)
        return 
    }

    for(const input of data.inputs){
        const variable = input.variable
        if (! variable) continue
        const key = id + "_input_" + variable.name 
        VariableMap.set(key, variable)
    }
    for(const output of data.outputs){
        const variable = output.variable
        if (! variable) continue
        const key = id + "_output_" + variable.name 
        VariableMap.set(key, variable)
    }
    

}

export function variableUpdate(key, newValue){
    const variable = VariableMap.get(key)
    variable.value = newValue
    VariableMap.set(key, variable)
}

export function getNodeListData(){
    
}

export function NodeAdd(info, pos){
    let parent = document.getElementById("container")
    let node = new Node ({
            target: parent
        })

    if (info)
        node.setNodeData(info)
    node.setPos(pos)
    
    const nodeData = node.getNodeData()

    NodeMap.set(node.getId(), node)

    if (NodeMap.size == 1){

        originToken = {
            key: node.getId(),
            outIndex: 0,
            canMove: true,
            doneAction: false
        }

    }
}

export function getNode(id){
    return NodeMap.get(id)
}


export function SimulationStart(){
    Tokens = [JSON.parse(JSON.stringify(originToken))]
   loop()
}



//Evaluate Value
function Eval(input){
    if(!input.linkRef){
        return input.variable.value
    }
    return input.linkRef.getVariable().value
}

function getValue(output){

    for (const input of output.parent.inputs){

    }

    return output.value
}

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

//search in Func Library and perform action

function doAction(token: SToken){
    
    const currentNode = NodeMap.get(token.key)?.getNodeData()
    token.doneAction = true
    switch(currentNode.name){
        case "Branch":
            Branch(token, currentNode)
            break

        case "Fork": 
            Fork(token.key) 
            break
        case "Print": 
            Print(currentNode, token.key)
            break
        case "Add":
            return Add(currentNode.inputs)
        case "Set":
            SetVariable(currentNode.variable.name, currentNode.inputs[1], currentNode.outputs[1])
            break
        case "Get":
            return GetVariable(currentNode.variable.name, currentNode?.outputs[1])
                                
    }
}


function canTraverse(token){
    const currentNode = NodeMap.get(token.key).getNodeData()
    return currentNode.outputs[token.outIndex].connectedTo ? true : false
}

function traverse(token){
    const currentNode = NodeMap.get(token.key).getNodeData()
    const NextNode = currentNode.outputs[token.outIndex].connectedTo
    token.key = NextNode.getId()
    token.outIndex = 0
    token.doneAction = false
}


function focus(name){
    document.getElementById(name)?.focus()

}

function canTokensTraverse(){
    for (const t of Tokens){
        if (t.canMove) return true
    }
    return false
}

//loop through tokens

async function loop(){
    while(canTokensTraverse()){
        for (const t of Tokens){
            focus(t.key)
            if(!t.doneAction){
                doAction(t)
                await delay(778)
            } 
            if (!canTraverse(t)){
                t.canMove = false
                document.getElementById(t.key)?.blur()
                continue
            }
            traverse(t)  
        }
    }
}

//Function Library

function Branch(token:SToken, node:SNode){
    token.outIndex = node.inputs[1].variable?.value ? 0:1
}

function Fork(key){
    Tokens.push({
        key: key,
        outIndex: 1,
        canMove: true,
        doneAction: true
    })
}

function Print(node, key){
    const value = Eval(node.inputs[1])
    alert(value)
}

function Add(inputs){
    function sum (input){
        return input.connection ?
            Eval(input.connection):
            input.value
    }

    return inputs.reduce("sum", 0)
}

function SetVariable(key, input, output){
    let newValue
    if(!input.linkRef){
        newValue = input.variable   
    }
    VariableMap.set(key, newValue)
    GetVariable(key, output)
}

function GetVariable(key, output){
    if(!output.linkRef) return
    output.linkRef.setVariable(VariableMap.get(key))
}