<script>
  import Grid from "$lib/Grid.svelte";
  import Node from "$lib/Node/Node.svelte";
  import HeaderBar from "$lib/window/HeaderBar.svelte";
  import PanelDetails from "$lib/window/PanelDetails.svelte";
  import ResultsCompiler from "$lib/window/ResultsCompiler.svelte";
  import Sidebar from "$lib/window/Sidebar.svelte";
  import { onMount } from "svelte/internal";
  import {NodeAdd} from "../utils/Simulation/simulation"
  import PanelSide from "$lib/Panel/PanelSide.svelte";

  onMount(()=>{

    NodeAdd(null, {x: 275, y: 100})

  })

</script>

<container id="container">
  <PanelSide />
  <Grid />
</container>
