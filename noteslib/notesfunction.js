
var b = chrome.extension.getBackgroundPage();
var dataManager = b.dataManager;

var selectedPPTId = 0;

var divCreator = new DivCreator();
var dataCreator = new DataCreator();

function onLoad()
{

createUI();

document.getElementById("addnote").addEventListener("click",addNote);
document.getElementById("addToManager").addEventListener("click",addToManagerClickListener);


}


function addPPTToManager(data)
{
  b.AddToManager(data.text);
}

function cancelPopUp()
{

}



function createUI()
{
   

    var notesDiv = document.getElementById("notes");
	 notesDiv.innerHtml = "";
    removeAllChildOfDiv(notesDiv);

   var notesData = b.dataManager.data[0].notes;
    for(var i=0;i < notesData.length;i++)
    {
        var perNotes = notesData[i];
        var noteDiv = createNote(perNotes);
        notesDiv.appendChild(noteDiv);

        var pointWrapper = getChildComponent(noteDiv, "div", "class", "pointsWrapperClass" ); 
        for(var j=0 ; j < perNotes.points.length ; j++)
        {
            var perPoint =  perNotes.points[j];
            var pointdiv = createPoint(perPoint);
            pointWrapper.appendChild(pointdiv);
        }
         
    }
}

function addNote()
{
	createPop("Add Note", submitNote,{})
}

function submitNote(data)
{
	var notesDiv = document.getElementById("notes");
    // creating id
  	 var pptData = dataManager.data[0];
    var noteId = ++(pptData.maxNoteId);

    var currentNote = dataCreator.createNoteStructure(noteId, data.text, data);
   	dataManager.addNoteToPPT(selectedPPTId, currentNote)
   
    
    var innerDiv = divCreator.createNoteDiv(noteId, data.text);
    var addPointBtn =    getChildComponent(innerDiv, "img", "id", "addpoint");
	var addCloseBtn =    getChildComponent(innerDiv, "img", "id", "close");

// 	addCloseBtn.addEventListener("click",deleteNote)  
	addPointBtn.addEventListener("click",addPoint);
    notesDiv.appendChild(innerDiv);

   

}

function addPoint(evnt)
{
   createPop("Add Point", submitPoint, {"event":evnt});
}

function submitPoint(data)
{
	 var btn = data.event.srcElement;
	    var noteDiv = getParentDiv(btn, "class", "note");
	    var pointWrapper = getChildComponent(noteDiv, "div", "class", "pointsWrapperClass");
	    var notesDiv = noteDiv;
	    
		var pptData = dataManager.data[0];
	    var noteData = dataManager.getNotesById(noteDiv.id,selectedPPTId);           
	    var pointId = ++(noteData.maxPointId);
	    console.log(data);
	    var pointData = dataCreator.createPointStructure(pointId, noteDiv.id, data);
		// updating ui	
	   data.event = null;
	    var innerDiv = divCreator.createPointsDiv(pointId, data.text);
		noteData.points.push(pointData);
	    pointWrapper.appendChild(innerDiv);
}





function addToManagerClickListener()
{
  createPop("Save To Manager", addPPTToManager, {});	
}


function createPop(title, listener, data)
{
	var popdiv =document.getElementById("pop");
	var titleDiv   = getChildComponent(popdiv, "div", "id", "title");
	var input = getChildComponent(popdiv, "input", "id", "popInput");
	var okBtn  = getChildComponent(popdiv, "button", "id", "okBtn");
	var cancelBtn  = getChildComponent(popdiv, "button", "id", "cancelBtn");
	
	if(data.type == "edit")
	{
		
		input.value = data.text;
	}else
	{
		input.value ="";
	}
	titleDiv.innerHtml = title;
	titleDiv.textContent = title;
	var okBtnListener = function(event)
	{
		var src = event.srcElement;
		var parentDiv = getParentDiv(src, "id", "pop");
		var input = getChildComponent(parentDiv, "input", "id", "popInput");
		
		data["text"] = input.value;
		document.body.removeChild(dimmer);   
		popdiv.style.visibility = 'hidden';
		listener(data);
		okBtn.removeEventListener("click", okBtnListener);


	}

	var cancellistener = function(event){
		
		document.body.removeChild(dimmer);   
		popdiv.style.visibility = 'hidden';
	}; 
	
	okBtn.addEventListener("click", okBtnListener);
	cancelBtn.addEventListener("click", cancellistener);
	
    dimmer = document.createElement("div");
    
    dimmer.style.width =  window.innerWidth + 'px';
    dimmer.style.height = window.innerHeight + 'px';
    dimmer.className = 'dimmer';
    
    
    dimmer.onclick = cancellistener;
        
    document.body.appendChild(dimmer);

    popdiv.style.visibility = 'visible';
    popdiv.style.top = window.innerHeight/2 - 50 + 'px';
    popdiv.style.left = window.innerWidth/2 - 100 + 'px';
}

 






// console.log(b.satyendraData.title);
// data 

function createNote(note)
{
   
    var innerDiv = divCreator.createNoteDiv(note.id, note.title);
    
      var addPointBtn =    getChildComponent(innerDiv, "img", "id", "addpoint");
	var addCloseBtn =    getChildComponent(innerDiv, "img", "id", "close");

	addCloseBtn.addEventListener("click",deleteOperation)  
	addPointBtn.addEventListener("click",addPoint);
   
    return innerDiv; 
}

function createPoint(point)
{
    
    var innerDiv = divCreator.createPointsDiv(point.id, point.title);
    
    var deleteBtn =    getChildComponent(innerDiv, "img", "id", "delete");
	var editBtn =    getChildComponent(innerDiv, "img", "id", "edit");

	deleteBtn.addEventListener("click",deleteOperation);  
	editBtn.addEventListener("click",editOperation);
    
    return innerDiv;
}


function deleteOperation(event)
{		
	var div = event.srcElement;
	var type = div.getAttribute("type");

	var parentDiv = getParentDiv(div, "type", type);

	var id = parentDiv.id;

	switch(type)
	{
		
		
		case "note":
		dataManager.deleteNote(id, 0);
		createUI();
		break;
		
		case "point":
		var noteid =  getParentDiv(div, "type", "note").id;
		dataManager.deletePoint(id, noteid, 0);
		createUI();
		break;
		
		default:
}
	
}


 function editPPTTitle(data)
 {
	var ppt = dataManager.getPPTById(data.pptId);
	ppt.title = data.text;
	createNoteManager(dataManager.data);
 }

 function editNotesTitle(data)
{
	var note = dataManager.getNoteById(data.noteId, data.pptId);
	note.title = data.text;
	createUI();

}

function editPointTitle(data)
{
	var point = dataManager.getPointById(data.pointId, data.noteId, data.pptId);
	point.title = data.text;
	point.data.text = data.text;
	createUI();

}


function editOperation(event){

	var div = event.srcElement;
	var type = div.getAttribute("type");

	var parentDiv = getParentDiv(div, "type", type);
	var id = parentDiv.id;
	
	var popupTitle = "Edit "+type +" Title";

	
	switch(type)
	{
		case "note":

		createPop(popupTitle, editNoteTitle, {"event":event, "pptId": 0, "noteId":id});
		break;
		
		case "point":
		
		var noteid =  getParentDiv(div, "type", "note").id;
		createPop(popupTitle, editPointTitle, {"event":event, type:"edit", text:dataManager.getPointById(id, noteid, 0).data.text , "pptId":0, "noteId":noteid, "pointId":id});
		break;
		
		default:


	}
	


	




}


window.onload = onLoad;







