
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

export enum ESimulationOption {
    Sequential = "Sequential",
    Random = "Random", 
    Manual = "Manual"
}


let Tokens:SToken[] = []
let originToken


let current_sim_option: ESimulationOption = ESimulationOption.Sequential

export function getCurrentSimOption(){
    return current_sim_option
}

export function setCurrentSimOption(newOption:string){
    return current_sim_option =  ESimulationOption[newOption] 
}



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
    console.log("check", Tokens)
    for (const t of Tokens){
        if (t.canMove) return true
    }
    console.log("finish", Tokens)
    return false
}

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    console.log("shuffle", array)
    return array;
}

async function performAction(t){
    console.log(t)
    focus(t.key)
    if(!t.doneAction){
        doAction(t)
        await delay(778)
    } 
    if (!canTraverse(t)){
        t.canMove = false
        document.getElementById(t.key)?.blur()
        return
    }
    traverse(t)  
}

async function loopSequential(){
    //for each token
    for (const t of Tokens)
        await performAction(t)
}

async function loopRandom(){
    await shuffle(Tokens)
    await loopSequential()
}

async function loopManual(){
    //TODO
}

async function loop() {
    console.log("start sim")
    while(canTokensTraverse()){
        if (current_sim_option === ESimulationOption.Sequential)
            await loopSequential()
        if (current_sim_option === ESimulationOption.Random)
            await loopRandom()
        if (current_sim_option === ESimulationOption.Manual)
            await loopManual()
    }
    console.log("finish", Tokens)
    // do something else here after firstFunction completes
  }



//Function Library_____________________________________________________________
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
    console.log(value)
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