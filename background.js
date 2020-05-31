var production = "agjgjbleobioeigeinglgfnhnpliokcm";
var development = "bapneoaakajabemjcankjbihphjbdeeh"


var managerExtensionId = production;

var pptData = [{
            	"id":0,
            	"type":"ppt",
            	"title":"main title 1",
            	"maxNoteId":2,
            	"notes":[]
            	}];

var contextMenuMap = {};
var maxNoteId = 0;
var maxPointId = 0;
var currentPPTId = 0;

var dataManager = new DataManipulator(pptData);
var menuCreator = new contextMenuCreator();
var dataCreator = new DataCreator();
var context =  ["page", "selection", "image", "link"];

var parent = chrome.contextMenus.create({
	"title": "notes",
	"contexts": context,
	"onclick" : clickHandler
});

chrome.storage.sync.get('value', function(items) 
		{
	// Notify that we saved.
	pptData = items;// alert('retriee');
		});

function addtoContextMenuMap(id, note)
{
	contextMenuMap[id] = note;
}

addtoContextMenuMap(parent, "note");



chrome.browserAction.onClicked.addListener(function(tab) {
	var viewTabUrl = chrome.extension.getURL('image.html');
	var imageUrl ="" /* an image's URL */;

	// Look through all the pages in this extension to find one we can use.
	var views = chrome.extension.getViews();
	for (var i = 0; i < views.length; i++) {
		var view = views[i];

		// If this view has the right URL and hasn't been used yet...
		if (view.location.href == viewTabUrl && !view.imageAlreadySet) {

			// ...call one of its functions and set a property.
			view.setImageUrl(imageUrl);
			view.imageAlreadySet = true;
			break; // we're done
		}
	}
});


var clickHandler = function(info)
{

	var details = {};
	details.title = info.selectionText;
	details.url = info.linkUrl;
	details.editable = info.editable;
	details.id = info.menuItemId;
	details.pageUrl = info.pageUrl;
	details.text = info.selectionText;

	chrome.runtime.sendMessage({ details: details }, function(response) {});
//	var url = e.pageUrl;
//	var buzzPostUrl = "http://www.google.com/buzz/post?";

//	if (e.selectionText) {
//	// The user selected some text, put this in the message.
//	buzzPostUrl += "message=" + encodeURI(e.selectionText) + "&";
//	}

//	if (e.mediaType === "image") {
//	buzzPostUrl += "imageurl=" + encodeURI(e.srcUrl) + "&";
//	}

//	if (e.linkUrl) {
//	// The user wants to buzz a link.
//	url = e.linkUrl;
//	}

//	buzzPostUrl += "url=" + encodeURI(url);

//	// Open the page up.
//	chrome.tabs.create(
//	{"url" : buzzPostUrl });
};


//var port = chrome.runtime.connect({name: "notes-channel"});
//chrome.runtime.onConnect.addListener(function(port1) {
//if(port1.name == "notes-channel"){
//port1.onMessage.addListener(function(msg) {
//// do some stuff here
//alert("hi in background notes");
//});
//}
//});



//port.postMessage({myProperty: "value"});
//port.onMessage.addListener(function(msg) {
//// do some stuff here
//alert("hi in notes content script");
//});



function genericOnClick(info, tab) {
	console.log("item " + info.menuItemId + " was clicked");
	console.log("info: " + JSON.stringify(info));
	console.log("tab: " + JSON.stringify(tab));
}






function noteClickHandler(event)
{

}

function comunicateClickHandler(event)
{
	
}



function createContextMenu()
{

	var allNotes = dataManager.getNotesFromPPT(currentPPTId);
	for(var i=0;i<allNotes.length;i++)
	{
		var note = allNotes[i];
		noteMenu(note);
	}

	var tmp = menuCreator.createAddNoteItem(parent,context,AddNoteCLickHandler);
	addtoContextMenuMap(tmp, "add to note");
}


function AddToManager(title)
{

	dataManager.data[0].title = title;
	// Make a simple request:
	chrome.runtime.sendMessage(managerExtensionId, {title: dataManager.data[0]},
			function(response) {
		alert("success fully added");
		reset()
		});
}

function reset()
{
	currentPPTId = 0;
	pptData = [{
            	"id":0,
            	"type":"ppt",
            	"title":"main title 1",
            	"maxNoteId":2,
            	"notes":[]
            	}];

 chrome.contextMenus.remove(parent);
    parent = chrome.contextMenus.create({
	"title": "notes",
	"contexts": context,
	"onclick" : clickHandler
	});        	
    dataManager.resetWithData(pptData);
   
    createContextMenu();
    contextMenuMap = {};

}





function noteMenu(note)
{
	var child =  menuCreator.createNoteMenu(note,parent,context,AddPointClickHandler);
	addtoContextMenuMap(child,note);

}

createContextMenu();



function AddPointClickHandler(event)
{

	var data = {"text":event.selectionText,"selectionText":event.selectionText, "url": event.pageUrl};
	var note = contextMenuMap[event.menuItemId];

	
	var id = note.maxPointId;
	++id;
	var pointData =  dataCreator.createPointStructure(id, note.id, data);
	dataManager.addPointToNote(note.id, pointData, 0);
	note.maxPointId = id;
}

function AddNoteCLickHandler(event)
{


	var data = {"selectionText":event.selectionText, "url": event.pageUrl};

	var index = dataManager.getPPTById(currentPPTId).maxNoteId;
	var id = ++index;
	// create notes
	var note  = dataCreator.createNoteStructure(id,event.selectionText,data);
	
	//	var noteId = dataCreator.createIdObjStructure(id,event.selectionText,note);
	// add to ppt
	dataManager.addNoteToPPT(currentPPTId, note, index);
	// increase the index
	dataManager.getPPTById(currentPPTId).maxNoteId  = index;
	
	noteMenu(note);


	// create data 
	// add to the context menu 
}

var savedFileEntry;
function saveNoteClickHandler(event)
{

	var theValue = {
			
			"notesid":noteids,
			"pointsData":pointsData,
			"maxNoteId" : maxNoteId,
			"maxPointId":maxPointId,
			
			
	};
	
	chrome.storage.sync.set({'value': pptData}, function() {
		// Notify that we saved.
		alert('Settings saved');
	});

	// store the note data in storage 
}









