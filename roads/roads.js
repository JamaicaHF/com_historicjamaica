var xmlHttp = createXmlHttpRequestObject();
var g_historicJHSite;
var g_width = 160;
var g_height = 20;
var g_padding = 50;
var roadID_col = 0;
var roadSection_col = 1;
var roadvalue_col = 2;
var g_roadType;
function loadRoads(historicJHSite)
{
    g_roadType = 'H';
    g_historicJHSite = historicJHSite;
    GetRoads();
}
function refreshRoads() 
{
    g_roadType = (g_roadType == 'H') ? 'M' : 'H';
    GetRoads();
}
function roadSelected() 
{
    if (this.id > 999) 
    {
        return;
    }
    var label = document.getElementById(this.id);
    parmArray = new Array();
    parmArray[0] = "ModernRoad";
    parmArray[1] = this.id;
    parmArray[2] = document.getElementById(this.id).value;
    var url = callbackURL(g_historicJHSite, "ModernRoad") + "&parms=" + parmArray;
    window.open(url, "_self");
}
function DisplayRoads(numRoads, roads)
{
    var block = document.getElementById("RoadsTable");
    var row = 0;
    var col = 0;
    var numRows = (numRoads / 6) + 1;
	if (numRows > 20)
	{
		numRows++;
	}
    var headingNum = 0;
    var i = 0;
    while (i < numRoads) 
    {
        var road = roads[i+2].split(';');
        if (road[roadSection_col] != headingNum)
        {
		    
            if (DisplayHeading(++headingNum, block, col, row))
			{
                row++;
			}
        }
        else
        {
            block.appendChild(CreateLabel(road[roadID_col], road[roadvalue_col], col, row, false));
            i++;
            row++;
        }
        if (row > numRows)
        {
            col++;
            row = 0;
        }
    }
}
function DisplayHeading(headingNum, block, col, row)
{
    var headingDisplayed = true;
    switch (headingNum)
    {
        case 1: 
            block.appendChild(CreateLabel(1001, "Jamaica Village", col, row, true));
            break;
        case 2: 
            block.appendChild(CreateLabel(1006, "Route 30 North", col, row, true));
            break;
        case 3: 
            block.appendChild(CreateLabel(1003, "Pikes Falls Road", col, row, true));
            break;
        case 4: 
		    if (g_roadType != 'H')
			{
                block.appendChild(CreateLabel(1004, "West Jamaica Road", col, row, true));
			}
			else
			{
				headingDisplayed = false;
			}
            break;
        case 5: 
            block.appendChild(CreateLabel(1005, "South Hill Road", col, row, true));
            break;
        case 6: 
            block.appendChild(CreateLabel(1007, "Rawsonville", col, row, true));
            break;
        case 7:
            block.appendChild(CreateLabel(1002, "East Jamaica", col, row, true));
            break;
        case 8: 
            block.appendChild(CreateLabel(1008, "South Windham", col, row, true));
            break;
    }
	return headingDisplayed;
}
//**********************************************************************************************************************************************
function CreateLabel(id, text, Column, Row, heading) 
{
    var label = document.createElement("label");
    label.innerHTML = text;
    label.value = text;
    label.id = id;
    label.style.position = "absolute";
    label.style.left = (Column * g_width) + "px";
    label.style.top = (Row * g_height + g_padding) + "px";
    label.style.fontSize = "13px";
    if (heading)
    {
        label.style.fontWeight = 'bold';
        label.style.textDecoration = 'underline';
    }
    else
    {
        label.style.cursor = "pointer";
    }
    //    label.style.background = "#FFCC99";
    label.onclick = roadSelected;
    return label;
}
//**********************************************************************************************************************************************
function GetRoads() 
{
    if (xmlHttp.readyState == 4 || xmlHttp.readyState == 0) // proceed only if the xmlHttp object isn't busy
    {
        g_alreadyGotData = false;
        var url = callbackURL(g_historicJHSite, "GetRoads") + "&RoadType=" + g_roadType + "&tmpl=component";
        xmlHttp.open("GET", url, true);
        xmlHttp.onreadystatechange = handleServerResponse;
        xmlHttp.send(null);
    }
    else // if the connection is busy, try again after one second 
    {
        setTimeout('GetRoads()', 1000);
    }
}
//**********************************************************************************************************************************************
function handleServerResponse() 
{   // move forward only if the transaction has completed
    if (xmlHttp.status == 0) // status of 200 indicates the transaction completed successfully
    {
        return;
    }
    else
    if (xmlHttp.status != 200) // status of 200 indicates the transaction completed successfully
    {
        alert("There was a problem accessing the server: " + xmlHttp.statusText);
        return;
    }
    if (xmlHttp.responseText.length != 0 && !g_alreadyGotData) 
    {
        var roadsStr = xmlHttp.responseText;
        var roads = roadsStr.split('|'); // Person[0] is the HTML at the beginning of the string
        if (roads.length > 1) 
        {
            var stats = roads[1].split(';');
            var numRoads = toInt(stats[0]);
			if (roads.length > numRoads + 1)
            {
                g_alreadyGotData = true;
                g_roadType = stats[1];
                SetTitles();
                DisplayRoads(numRoads, roads);
            }
        }
    }
}
function SetTitles()
{
    var textnode;
    ClearElement(document.getElementById("RoadsTable"));
    var titleElement = document.getElementById("roadTitle");
    ClearElement(titleElement);
    var buttonElement = document.getElementById("roadsButton");
    buttonElement.style.display = "block";
    if (g_roadType == 'H') 
    {
        textnode = document.createTextNode("Historic Roads");
        buttonElement.value = "Modern Roads";
        document.getElementById("roadsForm").style.height = "415px";
    }
    else 
    {
        textnode = document.createTextNode("Modern Roads");
        buttonElement.value = "Historic Roads";
        document.getElementById("roadsForm").style.height = "520px";
    }
    titleElement.appendChild(textnode);
}
function ClearElement(element)
{
    while (element.childNodes.length > 0) 
    {
        element.removeChild(element.firstChild);
    }
}