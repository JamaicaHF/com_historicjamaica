var xmlHttp = createXmlHttpRequestObject();
var jg;
var startTop = 50;
var heightOfBox = 40;
var widthOfBox = 330;
var topIncrement = 60;
var betweenElements = heightOfBox + 20;
var left = 0;
var right = 615;
var midPoint = 474;
var g_alreadyGotData;
var g_buildingCallbackUrl;
var streetnum_col = 0;
var Name_col = 1;
var BuildingID_col = 2;
var BuildingName_col = 3;
var numPhotos_col = 4;
var g_historicJHSite;
var g_modernRoadID;
var g_formHeight;

//****************************************************************************************************************************
function loadStreetViewer(historicJHSite, modernRoadID) 
{
    g_historicJHSite = historicJHSite;
    jg = new jsGraphics("Canvas");    // Use the "Canvas" div for drawing
    g_modernRoadID = modernRoadID;
    getBuildings(modernRoadID);
}
//****************************************************************************************************************************
function showPhotos() 
{
    var streetNum = this.id;
    parmArray = new Array();
    parmArray[0] = "Building";
    parmArray[1] = g_modernRoadID;
    parmArray[2] = streetNum;
    var url = callbackURL(g_historicJHSite, "PhotoViewer") + "&parms=" + parmArray;
    window.open(url, "_self");
}
//****************************************************************************************************************************
function showPage(buildings)
{
    jg.clear();
    var numBuildings = buildings.length - 1;
    var currentRow = 2;
    var numBuildingRows = 0;
    while (currentRow < numBuildings)
    {
        var oddBuildingID = "";
        var evenBuildingID = "";
        var oddName = "";
        var evenName = "";
        var oddBuildingName = "";
        var evenBuildingName = "";
        var oddPhotosFound = false;
        var evenPhotosFound = false;
        var row = buildings[currentRow].split(';');
        var oddStreetNum = getNextRow(row, true);
        if (oddStreetNum != -1)
        {
            oddName = row[Name_col];
            oddBuildingID = row[BuildingID_col];
            oddBuildingName = row[BuildingName_col];
            oddPhotosFound = row[numPhotos_col] != 0;
            currentRow++;
            if (currentRow < numBuildings)
            {
                row = buildings[currentRow].split(';');
            }
        }
        var evenStreetNum = -1;
        if (currentRow < numBuildings)
        {
            evenStreetNum = getNextRow(row, false);
            if (evenStreetNum != -1)
            {
                row = buildings[currentRow].split(';');
                evenName = row[Name_col];
                evenBuildingID = row[BuildingID_col];
                evenBuildingName = row[BuildingName_col];
                evenPhotosFound = row[numPhotos_col] != 0;
                currentRow++;
            }
        }
        drawHouse(startTop + topIncrement * numBuildingRows, right, oddStreetNum, oddName, oddBuildingID, oddBuildingName, oddPhotosFound);
        drawHouse(startTop + topIncrement * numBuildingRows, left, evenStreetNum, evenName, evenBuildingID, evenBuildingName, evenPhotosFound);
        numBuildingRows++;
    }
    var form = document.getElementById("streetForm");
    g_formHeight = (numBuildingRows > 6) ? (startTop + betweenElements * numBuildingRows - 20) : 405;
    form.style.height = g_formHeight + "px";
    drawRoad(g_formHeight);
    jg.paint();
}
//****************************************************************************************************************************
function drawRoad(g_formHeight) 
{
    widthOfLane = 60;
    jg.drawLine(midPoint - widthOfLane, startTop, midPoint - widthOfLane, g_formHeight);
    jg.drawLine(midPoint - 2, startTop, midPoint - 2, g_formHeight);
    jg.drawLine(midPoint + 2, startTop, midPoint + 2, g_formHeight);
    jg.drawLine(midPoint + widthOfLane, startTop, midPoint + widthOfLane, g_formHeight);
}
//**********************************************************************************************************************************************
function drawHouse(top, left, streetAddress, currentOwner, buildingID, buildingName, photosFound) 
{
    var streetForm = document.getElementById("streetForm");
    if (streetAddress < 0)
    {
        return;
    }
	var allowClick = buildingName.length != 0;
    var buildingStillExists = true;
    if (currentOwner.length == 0)
    {
        var buildingStillExists = false;
        currentOwner = buildingName;
		buildingName = "";
    }
    var home = document.createElement('div');
    if (allowClick)
    {
        home.onclick = ShowBuildingInfo;
        home.style.cursor = "pointer";
    }
    home.id = buildingID;
    home.style.position = "absolute";
    home.style.left = left + "px";
    home.style.top = top + "px";
    home.style.height = heightOfBox + "px";
    home.style.width = widthOfBox + "px";
    home.style.background = "transparent";
    home.style.border = "1px solid #000";
    home.style.font = "14px helvetica";
    if (left == 0)
    {
        home.appendChild(OwnerAndKnown(2, currentOwner, buildingName));
        streetForm.appendChild(showAddress(top, left + 384, streetAddress, photosFound, buildingStillExists));
        streetForm.appendChild(houseImage(top, left + 342));
    }
    else
    {
        home.appendChild(OwnerAndKnown(2, currentOwner, buildingName));
        streetForm.appendChild(showAddress(top, left - 80, streetAddress, photosFound, buildingStillExists));
        streetForm.appendChild(houseImage(top, left - 50));
    }
    streetForm.appendChild(home);
}
//**********************************************************************************************************************************************
function showAddress(top, left, streetAddress, photosFound, buildingStillExists)
{
    var labelStreetNum = document.createElement("label");
    labelStreetNum.id = streetAddress;
    labelStreetNum.style.position = "absolute";
    labelStreetNum.style.left = left + "px";
    labelStreetNum.style.top = top + 12 + "px";
    labelStreetNum.style.fontSize = "12px";
    labelStreetNum.style.width = "30px";
    if (photosFound)
    {
        labelStreetNum.style.background = "#FFCC99";
        labelStreetNum.onclick = showPhotos;
        labelStreetNum.style.cursor = "pointer";
    }
    if (buildingStillExists) 
    {
        labelStreetNum.innerHTML = streetAddress;
    }
    else
    {
        labelStreetNum.innerHTML = (photosFound) ? "____" : "";
        labelStreetNum.style.color = "#FFCC99";
    }
    return labelStreetNum;
}
//**********************************************************************************************************************************************
function houseImage(top, left)
{
    var img = document.createElement("img");
    img.style.position = "absolute";
    img.style.left = left + "px";
    img.style.top = top + 2 + "px";
    img.className = "HouseImg";
    img.src = g_historicJHSite + "/images/House.png";
    img.alt = "images/House.png";
    img.style.height = "40px";
    img.style.width = "40px";
    return img;
}
//**********************************************************************************************************************************************
function OwnerAndKnown(left, currentOwner, buildingName)
{
    var labelOwner = document.createElement("label");
    var knownAs = document.createElement("label");
    var top = 12;
    if (buildingName.length != 0)
    {
        labelOwner.style.cursor = "pointer";
        knownAs.style.cursor = "pointer";
        top = 3;        
    }
    var textDiv = document.createElement('div');
    textDiv.style.position = "absolute";
    textDiv.style.left = left + "px";
    textDiv.style.top = top + "px";
    labelOwner.innerHTML = currentOwner + "</br>";
    textDiv.appendChild(labelOwner);
    knownAs.innerHTML = buildingName;
    textDiv.appendChild(knownAs);
    return textDiv;
}
//****************************************************************************************************************************
function getNextRow(row, bLookingFor) 
{
    iAddress = row[streetnum_col];
    bIs = IsOdd(iAddress);
    if (bLookingFor == bIs) 
    {
        iStreetNum = row[streetnum_col];
        return iStreetNum;
    }
    else 
    {
        return -1;
    }
}
//****************************************************************************************************************************
function IsOdd(iNum) 
{
    return (iNum % 2 == 1);
}
//**********************************************************************************************************************************************
function previousScreen() 
{
    parmArray = new Array();
    parmArray[0] = "ReturnFromBuilding";
    var url = callbackURL(g_historicJHSite, "Roads") + "&parms=" + parmArray;
    window.open(url, "_self");
}
//**********************************************************************************************************************************************
function getBuildings(modernRoadID) 
{
    if (xmlHttp.readyState == 4 || xmlHttp.readyState == 0) // proceed only if the xmlHttp object isn't busy
    {
        g_alreadyGotData = false;
        url = callbackURL(g_historicJHSite, "BuildingsOnRoad") + "&modernRoadID=" + modernRoadID + "&tmpl=component";
        xmlHttp.open("GET", url, true);
        xmlHttp.onreadystatechange = handleServerResponse;
        xmlHttp.send(null);
    }
    else // if the connection is busy, try again after one second 
    {
        setTimeout('getBuildings(modernRoadID)', 1000);
    }
}
//**********************************************************************************************************************************************
function handleServerResponse() {   // move forward only if the transaction has completed
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
        var buildingStr = xmlHttp.responseText;
        var buildings = buildingStr.split('|'); // Person[0] is the HTML at the beginning of the string
        if (buildings.length > 1) 
        {
            var numBuildings = toInt(buildings[1]);
			if (buildings.length > numBuildings + 1)
            {
                g_alreadyGotData = true;
                showPage(buildings);
            }
        }
    }
}
