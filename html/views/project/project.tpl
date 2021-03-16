<div id="projectId" class="argSys">{{items[0]["id"]}}</div>
<style>
    input#changeOpus{
        border: none;
        font-size: 90%;
    }
    input#changeOpus:focus{
        border: none;
    }
</style>

<div class='project_mainFrame' onDragStart='startDrag()' onDrop='onDragDrop("drop")' ondragover='onDragDrop()' onDragEnd='stopDrag()'>
    <input type='hidden' name='opusProject_id' value='' />
    <datalist id='opusProject_data'></datalist>
    <div class='project_detail'>
    <div id="loadLabel">Projekt wird geladen...</div>
    </div>
    <div class='project_menu_container'>
        <div class='project_menu'>
            <div class='article_container'></div>
        </div>
    </div>
</div>
<div class='detailZettel'></div>
