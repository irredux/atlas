export class ContextMenu{
    constructor(){
        this.menu = [];
    }
    addEntry(selector, element, description, action){
        this.menu.push({
            'selector': selector,
            'element': element,
            'description': description,
            'action': action
        });
    }
}
