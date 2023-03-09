<script>
    let pos = {x: 0, y:0}
    export function move(_pos){
        pos = _pos
    }
</script>

<div
    style:top = "{pos.y +16}px"
    style:left = "{pos.x +16}px"
>
    NewVar
</div>

<style>
    div{
        background-color: #191919;
        padding: 7px 3px 7px 25px;
        width: max-content;
        height: min-content;
        position: absolute;
        outline-style: solid;
        outline-width: 1px;
        outline-color: black;

    }
</style>