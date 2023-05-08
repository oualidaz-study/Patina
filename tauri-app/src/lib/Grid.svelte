<script lang="ts">
	import { onMount } from 'svelte'
  import * as grid from '../utils/viewport/grid'
	
  let canvas:HTMLCanvasElement

  onMount(()=>{
    grid.setCanvas(canvas)
    grid.draw()
  })
</script>

<canvas id="grid"
	bind:this={canvas}
	on:mousedown={grid.onPointerDown}
  on:touchstart={(e) => grid.handleTouch(e, grid.onPointerDown)}
  on:mouseup={grid.onPointerUp}
  on:touchend={(e) => grid.handleTouch(e, grid.onPointerUp)}
  on:mousemove={grid.onPointerMove}
  on:touchmove={(e) => grid.handleTouch(e, grid.onPointerMove)}
  on:wheel={(e) => grid.adjustZoom(e.deltaY* grid.SCROLL_SENSITIVITY)}
  on:keydown={(e) => grid.addMenu(e)}
  on:contextmenu={(e) => grid.contextMenu(e)}
>
</canvas>


<style>
	canvas { 
    grid-area: g;
    background: #1d1d1d; 
    position: relative;
    z-index: 0;
    min-width: 0;
    min-height: 0;
    margin: 5px 2px;
    border-radius: 5px;
  }
</style>