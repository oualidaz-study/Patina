
import { readable } from 'svelte/store';
import Node from "$lib/Node/Node.svelte";
import type { SNode } from '../Node/node';


const NodeMap = new Map<string, Node>()


interface SToken {
    key: String,
    outIndex: number
}


let Tokens:SToken[] = []
let originToken



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
            outIndex: 0
        }

    }
        
    console.log("printed", nodeData.name)
    console.log("printed", node.getId())
    console.log("is", NodeMap.has(node.getId()))
    console.log(NodeMap)
}

export function getNode(id){
    return NodeMap.get(id)
}


export function SimulationStart(){
    Tokens = [JSON.parse(JSON.stringify(originToken))]
    console.log("Starting Simulation !!FRONTEND")
   loop()
}



//Evaluate Value
function Eval(input){
    return input.connection ? 
              getValue(input.connection)
            : input.value
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

function doAction(token){
    const currentNode = NodeMap.get(token.key)?.getNodeData()
    switch(currentNode.name){
        case "Branch":
            Branch(token, currentNode)
            break

        case "Fork": 
            Fork() 
            break
        case "Print": 
            Print(currentNode, token.key)
            break
        case "Add":
            return Add(currentNode.inputs)
        case "Set":
            SetVariable(currentNode.variable.name, Eval(currentNode.inputs[1]))
            break
        case "Get":
            return GetVariable(currentNode.variable.name)
                                
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
    console.log("traversed to", token.key, NextNode.getNodeData().name)
    token.outIndex = 0
}


function focus(name){
    document.getElementById(name)?.focus()

}

//loop through tokens

async function loop(){
    let isTraversing = true
    while(isTraversing){
        for (const t of Tokens){
            focus(t.key)
            doAction(t)
            await delay(778)
            if (!canTraverse(t)){
                isTraversing = false
                document.getElementById(t.key)?.blur()
                return
            }
            traverse(t)
            
        }
    }
}

//Function Library

function Branch(token:SToken, node:SNode){
    token.outIndex = node.inputs[1].variable?.value ? 0:1
}

function Fork(){
    Tokens.push({
        node_key: "Fork"
    })
}

function Print(node, key){

    const value = node.inputs[1].variable.value 
    console.log(key, value)
}

function Add(inputs){
    function sum (input){
        return input.connection ?
            Eval(input.connection):
            input.value
    }

    return inputs.reduce("sum", 0)
}

function SetVariable(name, newValue){
    VariableMap.set(name, newValue)
}

function GetVariable(name){
    return VariableMap.get(name)
}