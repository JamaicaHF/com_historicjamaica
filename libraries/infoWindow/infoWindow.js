var overlayWidth;
var overlayHeight;
var infoWindowWidth;
var infoWindowHeight;
var infoWindowPositionLeft;
var infoWindowPositionTop;
var g_width1 = 0;
var g_disableOriginalSheet;
var g_moreCivilWarInfoClicked;

function InfoWindow(title, disableOriginalSheet)
{
    g_moreCivilWarInfoClicked = false;
    g_disableOriginalSheet = disableOriginalSheet;
//    loadCssStyleSheet();
    g_disableOriginalSheet ? DefineCssStyleSheet() : DefineWindowOnlyStyleSheet();
    window.onresize = resizeCheck;
    var overlay = document.createElement('div');
    overlay.setAttribute("id","overlay");
    document.body.appendChild(overlay);

    var box = document.createElement('div');
    box.setAttribute("id","InfoWindow");
    box.innerHTML = SetInnerHTML(title);
    document.body.appendChild(box);
    var element = document.getElementById("backImgF2");
    g_disableOriginalSheet ? element.addEventListener('click', resume, false) : element.style.display = "none";
    if (!g_disableOriginalSheet)
    {
        element.addEventListener('click',resume,false)
    }
}
//**********************************************************************************************************************************************
function CreateBlock(parentBlockID, blockID, elementClass)
{
    var block=document.getElementById(parentBlockID);
    var message = document.createElement('div');
    message.setAttribute("class", elementClass);
    message.setAttribute("id",blockID);
    block.appendChild(message);
}
//**********************************************************************************************************************************************
function AddInfo(parentBlockID, info, id) 
{
    var block = document.getElementById(parentBlockID);
    var message = document.createElement('p');
    message.setAttribute("class", "information");
    message.innerHTML = info;
    if (id != null && id.length != 0)
    {
        message.id = id;
    }
    block.appendChild(message);
}
//**********************************************************************************************************************************************
function CreateTable(tableID) 
{
    var table = document.createElement('table');
    table.id = tableID;
    table.setAttribute("class", "groupBlock");
    var block = document.getElementById("infoBlock");
    block.appendChild(table);
}
//**********************************************************************************************************************************************
function AddButton(btnLabel, width, parentNode, onClickResponse)
{
    var button = document.createElement('input');
    button.id = "censusButton";
    button.type = "button";
    button.value = btnLabel;
    button.onclick = onClickResponse;
    button.style.cursor = "pointer";
    var remainingWidth = width - (btnLabel.length * 7);
    var left = remainingWidth / 2;
    button.style.marginLeft = left + "px";
    var block = document.getElementById(parentNode);
    block.appendChild(button);
}
//**********************************************************************************************************************************************
function AddTwoFieldInfo(tableID, rowNum, info, info2, info3, indentFirstColumn, numColumns, highlightColumn1=false, highlightColumn2=false)
{
    tr = document.createElement('tr');
    tr.id = "tr" + rowNum;
    var td = document.createElement('td');
    td.id = tr.id + "td1";
    td.style.width = "auto";
	if (highlightColumn1)
	{
	    td.style.color="#FF0000";
	}
    td.style.fontSize = "14px";
    td.style.width = "500px";
    td.style.paddingLeft = "5px";
    if (indentFirstColumn) 
    {
        td.style.paddingLeft = "20px";
    }
    var textnode1 = document.createTextNode(info);
    td.appendChild(textnode1);
    var width = td.clientWidth;
    tr.appendChild(td);
    if (numColumns > 1 && info2 != "xxxx")
    {
        var td2 = document.createElement('td');
        td2.id = tr.id + "td2";
        var textnode2 = document.createTextNode(info2);
        td2.appendChild(textnode2);
        td2.style.width = "400px";
    	if (highlightColumn2)
	    {
	        td2.style.color="#FF0000";
	    }
        td2.style.fontSize = "14px";    
        td2.style.paddingLeft = "10px";
        //td2.style.paddingRight = "5px";
        tr.appendChild(td2);
    }
    if (numColumns > 2) {
        var td3 = document.createElement('td');
        td3.id = tr.id + "td3";
        var textnode3 = document.createTextNode(info3);
        td3.appendChild(textnode3);
        td3.style.width = "600px";
        td3.style.fontSize = "14px";
        td3.style.paddingLeft = "10px";
        td3.style.paddingRight = "5px";
        tr.appendChild(td3);
    }
    var table = document.getElementById(tableID);
    table.appendChild(tr);
}
//**********************************************************************************************************************************************
function ShowNotes(newBlockID, description)
{
	if (description.length == 0)
	{
		return 0;
	}
	CreateBlock("infoBlock", newBlockID, "groupBlock");
	var ApproximateNumLines = ~~(description.length / 64) + 1;
	var occurances = 0;
	for (var i = 0; i < description.length; i++)
	{
		var ch = description[i];
		if (ch == '~')
		{
			occurances++;
		}
	}
	for (var j = 0; j < description.length; j++)
	{
		description = description.replace(" ~ ","</br>");
	}
	ApproximateNumLines += occurances;
	AddInfo(newBlockID, description);
    var block=document.getElementById(newBlockID);
    block.style.height = ApproximateNumLines * 17 + "px";
	return ApproximateNumLines * 18;
}
//**********************************************************************************************************************************************
function getPageHeight() 
{
    var windowHeight
    if (self.innerHeight) { // all except Explorer
        windowHeight = self.innerHeight;
    } else if (document.documentElement && document.documentElement.clientHeight) {
        windowHeight = document.documentElement.clientHeight;
    } else if (document.body) { // other Explorers
        windowHeight = document.body.clientHeight;
    }
    return windowHeight
}

function originalSizing(height, width, formHeight)
{
    if (g_disableOriginalSheet)
    {
        overlayWidth = window.innerWidth;
        overlayHeight = (formHeight == 0) ? 600 // window.innerHeight - 190;  // minus Width of header 
                                          : formHeight + 192;
    }
    infoWindowWidth = width;
    infoWindowHeight = height;
    resizeCheck();
}
function resizeCheck() 
{
    xyScrollPoints = getPageScroll();
    if (g_disableOriginalSheet)
    {
        infoWindowPositionLeft = (window.innerWidth / 2) - (infoWindowWidth / 2) + xyScrollPoints[xPoint];
        infoWindowPositionTop = (window.innerHeight / 2) - (infoWindowHeight / 2) + xyScrollPoints[yPoint];
    }
    else
    {
        infoWindowPositionLeft = 730;
        infoWindowPositionTop = 176;
    }
	setStyleHeightWidth();
}
function setStyleHeightWidth()
{
    var overlay = document.getElementById('overlay');
    overlay.style.width=overlayWidth+"px";
    overlay.style.height=overlayHeight+"px";
    var infoWindow=document.getElementById('InfoWindow');
    infoWindow.style.width=infoWindowWidth+"px";
    infoWindow.style.height=infoWindowHeight+"px";
    infoWindow.style.left=infoWindowPositionLeft+"px";
    infoWindow.style.top=infoWindowPositionTop+"px";
}
function resume()
{
    if (g_moreCivilWarInfoClicked)
	{
		RemoveChildren("infoBlock");
	    LoadInformation(g_personInfo);
		g_moreCivilWarInfoClicked = false;
	}
	else
	{
        var element=document.getElementById("overlay");
        document.body.removeChild(element);
        element=document.getElementById("InfoWindow");
        document.body.removeChild(element);
	}
}
function loadCssStyleSheet()
{
	var cssFile = "components/com_historicjamaica/libraries/infoWindow/infoWindow.css";
	var fileref=document.createElement("link");
   	fileref.setAttribute("rel", "stylesheet");
	fileref.setAttribute("type", "text/css");
	fileref.setAttribute("href", cssFile);
   	document.getElementsByTagName("head")[0].appendChild(fileref);
}
function DefineCssStyleSheet()
{
    var sheet = document.createElement('style')
    sheet.innerHTML = "#overlay{background-color: #000;" +
                               "opacity: .5;" +
                               "filter: alpha(opacity=70);" +
                               "position:absolute;" +
                               "top: 0;" +
                               "left: 0;" +
                               "width: 450px;" +
                               "height: 40px;" +
                               "z-index: 99999;}" + WindowStyle();
    document.body.appendChild(sheet);
}
function DefineWindowOnlyStyleSheet()
{
    var sheet = document.createElement('style')
    sheet.innerHTML = WindowStyle();
    document.body.appendChild(sheet);
}
function WindowStyle()
{
    return "#InfoWindow{width: 450px;" +
                    "height: 40px;" +
                    "background:#FFF4EA;" +
                    "position:absolute;" + 
                    "left: 20px;" +
                    "top: 20px;" +
                    "z-index: 999999;" +
                    "border-radius:8px;" +
                    "border:13px; " +
                    "box-shadow:1px 2px 5px #676767;}" +
            "#title{font:bold 16px sans-serif;" +
                    "padding-Top: 6px;" +
                    "padding-Bottom: 6px;}" +
            "#backImgF2{position:absolute;" +
                    "top:4px;" +
                    "left:4px;" +
                    "cursor:pointer;}" +
            "#infoBlock {font:25px sans-serif;" +
                    "border-style:solid;" +
                    "background-image:none;" +
                    "background-color:#FFF4EA;}" +
            ".IndentedBlock {margin:4px 14px}" +
            ".groupBlock {width:auto; margin:4px 14px;border-style:solid;border-width:2px;}" +
            ".information {font:bold 13px sans-serif;" +
                    "height: 1px;}";
}

function SetInnerHTML(title)
{
    return '<div id="InformationWindow" >' +
               '<img id="backImgF2" src=' + g_historicJHSite + '/images/back_f2.png>' + 
               '<center id="title" class="title">' + title + '</center>' +
               '<div id="infoBlock" class="infoBlock">' +
               '</div>' +
           '</div>'
}
