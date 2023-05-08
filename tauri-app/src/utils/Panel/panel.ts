"use strict"

import ComponentDetails from '$lib/window/ComponentDetails.svelte';

export let categories = [
    {name: "Variables", toggle: false},
]

type Detail = {
    name: String;
    type: String;
    defaultValue: String;
    ref: ComponentDetails    
}

const map = new Map();

export function setMap(){
    for (const cat of categories){
        map.set(cat.name, [])
    }
}

export function addValue(cat){
    let list = map.get(cat.name)
    const newValue = {
        name: "NewVar",
        type: "Boolean",
        defaultValue: "0"
    }
    list.push(newValue)
    map.set(cat.name, list)
    categoryShow(cat)
}

function categoryShow(cat){

    for (const child of map.get(cat.name)){
        if (child.ref) continue
        child.ref = new ComponentDetails ({
            target: document.getElementById(`cat_${cat.name}`)
        })
    }
    cat.toggle = true
}

function categoryHide(cat){
    for (const child of map.get(cat.name)){
        child.ref.$destroy()
        child.ref = null
    }
    cat.toggle = false
}

export function categoryToggle(cat){
    if (cat.toggle)
        categoryHide(cat)
    else
        categoryShow(cat)   
}