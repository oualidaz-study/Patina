<script>
    import PanelInfo from "./PanelInfo.svelte";
    import PanelSimulation from "./PanelSimulation.svelte";
    import PanelVariable from "./PanelVariable.svelte";
    import PanelConsoleLog from "./PanelConsoleLog.svelte";
</script>

<div class= "absolute z-50 p-3 w-[200px] text-white flex flex-col gap-2">
    <PanelInfo />
    <PanelSimulation />
    <div class="h-3" />
    <PanelVariable />
    <PanelConsoleLog />
</div>