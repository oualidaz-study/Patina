<script lang="ts">
    import PanelVariableComponent from "./Variable/PanelVariableComponent.svelte";

    
    let components:PanelVariableComponent[] = []
    let isVisible = true

    
    function TogglePanel(){
        for (const component of components){
            component.toggle(isVisible)
        }
        isVisible = !isVisible
    }

    function AddVariable(){
        let parent = document.getElementById("header-variable")
        let component = new PanelVariableComponent ({
            target: parent?.parentElement
        })

        components.push(component)
    }

</script>
<div
    id="header-variable" 
    class="self-center bg-[#000000CC] p-1 rounded-xl ">
    <button 
        class="text-sm"
        on:click={(e)=>{TogglePanel()}}
    >
        𝒱 Variable
    </button>
    <button
    on:click={(e)=>{AddVariable()}}
    >
        +
    </button>
    
</div>
