<script lang="ts">
	import { onMount } from 'svelte'
  import * as grid from '../utils/grid/grid'
	
  let canvas:HTMLCanvasElement

  onMount(()=>{
    grid.setCanvas(canvas)
    grid.draw()
  })
</script>

<canvas
	bind:this={canvas}
	width={grid.viewportSize.x }
	height={grid.viewportSize.y} 
  on:mousedown={grid.onPointerDown}
  on:touchstart={(e) => grid.handleTouch(e, grid.onPointerDown)}
  on:mouseup={grid.onPointerUp}
  on:touchend={(e) => grid.handleTouch(e, grid.onPointerUp)}
  on:mousemove={grid.onPointerMove}
  on:touchmove={(e) => grid.handleTouch(e, grid.onPointerMove)}
  on:wheel={(e) => grid.adjustZoom(e.deltaY* grid.SCROLL_SENSITIVITY)}
  on:contextmenu={(e) => grid.contextMenu(e)}
>
</canvas>

<style>
	canvas { 
    background: #1d1d1d; 
    position: absolute;
    left: 0;
    top: 0;  
    z-index: 0;
  }
</style>