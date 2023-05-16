<script lang="ts">
    import {SimulationStart, setCurrentSimOption, getCurrentSimOption, ESimulationOption} from "../../utils/Simulation/simulation"

    let modal:HTMLDialogElement
    let current_sim = getCurrentSimOption()

    function modalToggle(){
        if(modal.open)
            modal.close()
        else
            modal.show()
    }

    function modalClose(){
        modal.close()
    }

    function setSimulationMode(e){
        current_sim = setCurrentSimOption(e.target.childNodes[0].data)
        modalClose()
    }

</script>


<div class="flex gap-4">
    <button 
        class="bg-green-400 p-2 rounded"
        on:click={SimulationStart}
    >
        Simulate
    </button>
    <button 
        class="bg-green-300 p-2 rounded"
        on:click={modalToggle}
        
    >
        {current_sim}
    </button>
    <dialog
        class="left-[180px] rounded bg-[#131313] "
        bind:this={modal}
    >
        <div
            class="flex flex-col gap-3"
        >
            <button class="bg-green-300 p-2 rounded w-full"
                on:click={setSimulationMode}
            >
                Sequential
            </button>
            <button class="bg-green-300 p-2 rounded w-full"
            on:click={setSimulationMode}
            >
                Random
            </button>
            <button class="bg-green-300 p-2 rounded w-full"
            on:click={setSimulationMode}
            >
                Manual
            </button>
        </div>
        
    </dialog>
</div>

