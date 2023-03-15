<script>
    import {SimulationStart} from "../../utils/Simulation/simulation"

    function onClick(e){
        SimulationStart()
    }
	
</script>


<hb>
    <button 
        class="
            bg-green-500 p-1.5 rounded-sm 
            text-white  shadow shadow-green-300
        "
        on:click={(e)=>{onClick(e)}}
    >Simulate</button>
</hb>
    
<style>
    

    hb{
        grid-area: h;
        display: flex;
        flex-direction: row;
        width: 100vw;
        background-color: #242424;
        padding: 10px 15px;
        margin-bottom: 2px;
        z-index: 2;
    }

</style>