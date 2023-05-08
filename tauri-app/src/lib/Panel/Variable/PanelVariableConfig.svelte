<script lang="ts">
    let self:HTMLElement
    export function setPos(x, y){
        self.style.left = "200px"
        self.style.top = `${y}px`

    }

    function checkHit(e){
        if (e.target !== self)
            self.style.display = "none"
    }

</script>



<div 
    bind:this={self}
    class="absolute bg-black"
>
    Hello
</div>