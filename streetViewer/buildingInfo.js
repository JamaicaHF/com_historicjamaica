var infoxmlHttp = createXmlHttpRequestObject();
var g_BuildingID = 0;
var g_alreadyGotData = false;
var g_tableData;
var buildingValue_col = 0;
var buildingNotes_col = 1;
var totalNumRows;
var notesFound;
//**********************************************************************************************************************************************
function ShowBuildingInfo()
{
    var url = callbackURL(g_historicJHSite, "BuildingInfo");
    var buildingID = this.id;
    BuildingInfo(url, buildingID);
}
//**********************************************************************************************************************************************
function DisplayBuilding()
{
    var buildingValue = g_tableData[2].split(';');
    var buildingName = buildingValue[buildingValue_col];
    InfoWindow(buildingName, true);
	LoadInformation();
}
//**********************************************************************************************************************************************
function LoadInformation()
{
    var origHeight = 40;
    var height = origHeight;
    var numValues = g_tableData.length - 1;
    var curValue = 3;
    totalNumRows = 0;
    notesFound = CheckForNotes(curValue, numValues);
    while (curValue < numValues) 
    {
        curValue = displayBuildingInfo("Info" + curValue, curValue, numValues);
    }
    height += totalNumRows * 18 + 30;
    var infoWindowWidth = (notesFound) ? 800 : 450;
    originalSizing(height, infoWindowWidth, g_formHeight);
}
//**********************************************************************************************************************************************
function CheckForNotes(firstValue, numValues)
{
    for (i = firstValue; i < numValues; i++)
    {
        var value = g_tableData[i].split(';');
        var notes = value[buildingNotes_col];
        if (notes != "xxxx" && notes.length != 0)
        {
            return true;
        }
    }
    return false;
}
//**********************************************************************************************************************************************
function displayBuildingInfo(newTableID,  curValue, numValues)
{
    CreateTable(newTableID);
    var headerValue = g_tableData[curValue].split(';');
    var rowNum = 1;
    AddTwoFieldInfo(newTableID, rowNum, headerValue[buildingValue_col], headerValue[buildingNotes_col], false, notesFound, 2);
    totalNumRows++;
    curValue++;
    var doneWithThisBlock = false;
    while (curValue < numValues && !doneWithThisBlock)
    {
        var value = g_tableData[curValue].split(';');
        if (value[buildingNotes_col] == "xxxx")
        {
            doneWithThisBlock = true;
        }
        else
        {
            var notes = CheckNotes(value[buildingNotes_col]);
            var info = value[buildingValue_col];
            rowNum++;
            AddTwoFieldInfo(newTableID, rowNum, info, notes, true, notesFound, 2);
            curValue++;
        }
    }
    return curValue;
}
//**********************************************************************************************************************************************
function CheckNotes(notes)
{
    if (notes.length == 0)
    {
        totalNumRows++;
    }
    else
    {
        var notesLen = Math.floor(notes.length / 54);
        totalNumRows += (notesLen + 1);
    }
    return notes;
}
//**********************************************************************************************************************************************
function BuildingInfo(callbackUrl,buildingID)
{
    if (infoxmlHttp.readyState == 4 || infoxmlHttp.readyState == 0) // proceed only if the xmlHttp object isn't busy
    {
    	g_alreadyGotData = false;
    	var url = callbackUrl + "&buildingID=" + buildingID + "&tmpl=component";
    	infoxmlHttp.open("GET", url, true); 
    	infoxmlHttp.onreadystatechange = infoHandleServerResponse;
    	infoxmlHttp.send(null);
    }
    else // if the connection is busy, try again after one half second 
    {
        setTimeout('BuildingInfo(callbackUrl,buildingID)', 500);
    }
}
//**********************************************************************************************************************************************
function infoHandleServerResponse()
{   // move forward only if the transaction has completed
    if (infoxmlHttp.status == 0) // status of 200 indicates the transaction completed successfully
    {
        return;
    }
    else
    if (infoxmlHttp.status == 200) // status of 200 indicates the transaction completed successfully
    {
        if (infoxmlHttp.responseText != 0 && !g_alreadyGotData)  // firefox processes this request twice
        {
            g_tableData = infoxmlHttp.responseText.split('|');
            if (g_tableData.length > 1)
            {
                var stats = g_tableData[1].split(';');
                var numInfoRows = toInt(stats[0]);
				if (g_tableData.length > numInfoRows + 1)
                {
                    g_alreadyGotData = true;
          	        DisplayBuilding();
                }
            }
        }
    }
}
//**********************************************************************************************************************************************
