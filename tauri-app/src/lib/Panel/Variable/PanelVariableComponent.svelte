<script lang="ts">
  import PanelVariableConfig from "./PanelVariableConfig.svelte";

    let self:HTMLElement

    let lock = '🔒'
    
    export function toggle(isVisible: boolean){
        self.style.display = isVisible ? "none" : "flex"
    }


    function toggleLock(){
        lock = lock === '🔒' ? '🔓' : '🔒'
    }

    function DisplayConfigPanel(e){
        let parent = document.getElementById("header-variable")
        let panel = new PanelVariableConfig ({
            target: parent?.parentElement
        })
        panel.setPos(e.clientX, e.clientY)
    }

</script>
<button
    bind:this={self}
    class="w-full bg-[#000000cc] rounded p-1 flex place-content-between "
    on:click={(e)=>{DisplayConfigPanel(e)}}
>
    <button
        on:click={(e)=>{toggleLock()}}
    >
        {lock}
    </button>
    <p class="text-sm self-center">
        New Variable
    </p>
    <button>
        &#128309; 
    </button>
</button>