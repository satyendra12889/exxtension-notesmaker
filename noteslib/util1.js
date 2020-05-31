function getParentDiv(div, attr, attrVal)
{
    var parentDiv= div.parentElement;

    while (parentDiv != div.ownerDocument) {
        if(parentDiv.getAttribute(attr)== attrVal)
        {
            return parentDiv;
        }
        parentDiv = parentDiv.parentElement;
      }
    return -1; 
}


function getChildComponent(div, type, att, attrVal)
{
    var childNodes= div.getElementsByTagName(type);
    for(var i=0;i<childNodes.length;i++)
    {
        var node = childNodes[i];
        if(node.getAttribute(att) == attrVal)
        {
            return node;
        }
    }
    return -1; 
}
