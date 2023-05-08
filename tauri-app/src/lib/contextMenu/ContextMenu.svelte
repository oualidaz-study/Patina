<script lang="ts">
    let MenuRef: HTMLElement

    let functions = [
        {name: "Duplicate", shortcut: "Shift D"},
        {name: "Rename", shortcut: "F2"},
        {name: "Delete", shortcut: "X"},
        {name: "Copy", shortcut: "Ctrl C"},
        {name: "Paste", shortcut: "Ctrl V"},
        {name: "Delete with Reconnect", shortcut: "Ctrl X"},
        {name: "Ungroup", shortcut: "Ctrl Alt G"},
        {name: "Edit Group", shortcut: "Tab"},
    ]


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

    function handleButton(e: PointerEvent, name: String){
        remember =  (e.y )  - (pos.y  + 50 ) //works but prefer to have the mouse on the center of the button
        MenuRef.style.display = "none"
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

        <p>Node Context Menu</p>
        <hr />
        {#each functions as f}
            <button 
                on:pointerdown={(e) => handleButton(e, f.name)}
            >
                <div class="btnName">{f.name}</div>
                <div class="btnShortcut">{f.shortcut}</div>
           

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
        width: 225px;
        
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