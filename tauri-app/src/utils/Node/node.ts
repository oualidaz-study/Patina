"use strict"

export enum ENodeType{
    Start,
    Control,
    Function,
    Operator,
    Pure
}

interface SNodeColour{
    primary: String;
    secondary: String;
}

interface SNodeType{
    type: ENodeType;
    colour: SNodeColour;
}

export enum EConnectionType {
    EXEC,
    VARIABLE
}


export enum EVariableType {
    BOOLEAN,
    INTEGER,
    STRING
}

export interface SVariable {
    name: String;
    type: EVariableType;
    value: any;
}

interface SConnection {
    label: String,
    type: EConnectionType;
    variable: null|SVariable;
    connectedTo: any;
}

export interface SNode {
    name: String;
    type: ENodeType;
    inputs: Array<SConnection>;
    outputs: Array<SConnection>;
        
}


export function getColour(type, colour){


    if(type == ENodeType.Pure) return

    const NodeTypeMap = new Map()

    NodeTypeMap.set(ENodeType.Start, {
        primary: "#902F2F",
        secondary: "#DD4949ac"
    })
    NodeTypeMap.set(ENodeType.Control, {
        primary: "#434343",
        secondary: "#888888ac"
    })
    NodeTypeMap.set(ENodeType.Function, {
        primary: "#3F617A",
        secondary: "#7CAFDCac"
    })
    NodeTypeMap.set(ENodeType.Operator, {
        primary: "#04c28f",
        secondary: "#04c28fac"
    })



    return colour == 0 ? NodeTypeMap.get(type).primary : NodeTypeMap.get(type).secondary
}

export function getConnectionColour(variable:null|SVariable){
    if (!variable) return "#ffffff"
    switch(variable.type){
        case EVariableType.BOOLEAN:
            return "#c2041d"
        case EVariableType.INTEGER:
            return "#04c28f"
        case EVariableType.STRING:
            return "#9c04c2"
        
    }
}

export function getConnectionShape(type:EConnectionType){
    switch(type){
        case EConnectionType.EXEC:
            return "1px 15px 15px 1px"
        case EConnectionType.VARIABLE:
            return "15px 15px 15px 15px"      
    }
}

