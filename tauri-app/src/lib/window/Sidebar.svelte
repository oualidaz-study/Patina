<script>
  import { onMount } from 'svelte';
  import * as panel from '../../utils/Panel/panel'

  onMount(()=>{
    panel.setMap()
  })
</script>

<vb >
    <hb>
        <button>Add</button>
        <input>
        <div>S</div>
    </hb>
    {#each panel.categories as cat}
    <div class="li" id="cat_{cat.name}">
        <cat>
            <div>
                <button
                on:pointerup={(e)=>panel.categoryToggle(cat)}
                >></button>
                 {cat.name}
            </div>
            <button 
                class="var_add"
                on:pointerup={(e) =>panel.addValue(cat)}
            >+</button>
        </cat>
    </div>
    
    {/each}
</vb>

<style>
    vb{
        grid-area: s;
        display: flex;
        flex-direction: column;
        z-index: 2;
        background: #1a1a1a;
        margin: 5px;
        
    }

    hb{
        display: flex;
        flex-direction: row;
        background-color: #242424;
    }
    

    cat{
        background-color: #383838;
        display: flex;
        justify-content: space-between;
        padding: 2px 3px;
        margin: 2px 0px 1px;
        flex-direction: row;
    }

    .li{
        display: flex;
        flex-direction: column;
    }
</style>