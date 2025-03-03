var infoxmlHttp = createXmlHttpRequestObject();
var g_personID = 0;
var g_numPeople = 0;
var g_numFields = 0;
var g_alreadyGotData = false;
var g_tableData;
var g_PersonCWID;
var g_personId;
var PersonID_col = 0;
var PersonName_col = 1;
var SpouseName_col = 2;
var FatherName_col = 3;
var MotherName_col = 4;
var Source_col = 5;
var Description_col = 6;
var BornDate_col = 7;
var BornHome_col = 8;
var BornSource_col = 9;
var DiedDate_col = 10;
var DiedHome_col = 11;
var DiedSource_col = 12;
var BuriedDate_col = 13;
var BuriedSource_col = 14;
var SchoolRecords_col = 15;
var BuildingsLivedIn_col = 16;
var CensusYears_col = 17;
var PersonCW_col = 18;
var g_personInfo;

//**********************************************************************************************************************************************
function ShowPersonInfo()
{
	g_personId = this.id;
	g_personId = g_personId.replace("PersonInfo","");
	PersonInfo(callbackURL(g_historicJHSite, "GetPersonInfo"), g_personId);
}
//**********************************************************************************************************************************************
function DisplayPersonInfo()
{
	var personName = g_personInfo[PersonName_col];
	InfoWindow(personName, true);
    LoadInformation(g_personInfo);
}
//**********************************************************************************************************************************************
function LoadInformation(personInfo)
{
	var origHeight = 40;
	var height = origHeight;
	height += ShowSourceInfoIfUniqueSource(personInfo);
	height += VitalRecordInfo("BornInfo", personInfo[BornDate_col], personInfo[BornSource_col]);
	height += VitalRecordInfo("DiedInfo", personInfo[DiedDate_col], personInfo[DiedSource_col]);
	height += VitalRecordInfo("BuriedInfo", personInfo[BuriedDate_col], personInfo[BuriedSource_col]);
	height += ShowSourceInfoIfJamaicaVitalRecordsAndNoOtherSource(personInfo, height == origHeight);
	height += ShowNotes("Description", personInfo[Description_col]);
	height += ShowSchoolRecords(personInfo[SchoolRecords_col].split('@'));
	height += ShowAllBuildingLivedIn(personInfo[BuildingsLivedIn_col].split('@'));
	height += ShowAllCensusYears(personInfo[CensusYears_col].split('@'));
	var width = 450;
	cwheight = ShowAllPersonCW(personInfo[PersonCW_col].split('@'));
	if (cwheight > 0)
	{
    	height += cwheight;
		width = 520;
	}
    originalSizing(height, width, 0);
}
//**********************************************************************************************************************************************
function ShowSourceInfoIfUniqueSource(personInfo)
{
	if (personInfo[Source_col] != "Manual Entry" && 
			personInfo[Source_col] != "Jamaica Vital Records" && 
			personInfo[Source_col] != personInfo[BornSource_col] && 
			personInfo[Source_col] != personInfo[DiedSource_col] && 
			personInfo[Source_col] != personInfo[BuriedSource_col])
	{
		return SourceInfo("Source", personInfo[Source_col]);
	}
	return 0;
}
//**********************************************************************************************************************************************
function ShowSourceInfoIfJamaicaVitalRecordsAndNoOtherSource(personInfo, NoOtherSource)
{
	if (NoOtherSource && personInfo[Source_col] == "Jamaica Vital Records")
	{
		return SourceInfo("Source", personInfo[Source_col]);
	}
	return 0;
}
//**********************************************************************************************************************************************
function SourceInfo(newBlockID, source)
{
	if (source.length == 0)
	{
		return 0;
	}
	CreateBlock("infoBlock", newBlockID, "groupBlock");
	AddInfo(newBlockID, "Source of Information: " + source);
	return 25;
}
//**********************************************************************************************************************************************
function ShowAllBuildingLivedIn(buildingsLivedIn)
{
	var numBuildingLivedIn = buildingsLivedIn[0];
	if (numBuildingLivedIn == 0)
	{
		return 0;
	}
	newBlockID = "BuildingsLivedIn";
	CreateBlock("infoBlock", newBlockID, "groupBlock");
	AddInfo(newBlockID, "Buildings Lived In");
	buildingsBlockID = "Buildings";
	CreateBlock(newBlockID, buildingsBlockID, "IndentedBlock");
    for (var i = 0;i < numBuildingLivedIn; i++)
    {
   	    AddInfo(buildingsBlockID, "   " + buildingsLivedIn[i+1]);
    }
	return numBuildingLivedIn * 25 + 25 ;
}
//**********************************************************************************************************************************************
function ShowSchoolRecords(schoolRecords)
{
	var numSchoolRecords = schoolRecords[0];
	if (numSchoolRecords == 0)
	{
		return 0;
	}
	newBlockID = "SchoolRecords";
	CreateBlock("infoBlock", newBlockID, "groupBlock");
	AddInfo(newBlockID, "School Records");
	schoolRecordsBlockID = "SchoolRecords";
	CreateBlock(newBlockID, schoolRecordsBlockID, "IndentedBlock");
    for (var i = 0;i < numSchoolRecords; i++)
    {
        var id = "ID" + i;
   	    AddInfo(schoolRecordsBlockID, "   " + schoolRecords[i+1] + " (Click to View)", id);
        var message = document.getElementById(id);
        message.style.cursor = "pointer";
        message.onclick = SchoolRecordClicked;
    }
	return numSchoolRecords * 25 + 25 ;
}
//**********************************************************************************************************************************************
function SchoolRecordClicked() 
{
    var SchoolYear = this.innerText;
    var url = callbackURL(g_historicJHSite, "School") + "&Value=" + SchoolYear + "&Page=" + g_currentPersonID + "&ReturnAction=" + "PersonFamily" + "&ReturnID=" + g_currentPersonID;
    window.open(url, "_self");
}
//**********************************************************************************************************************************************
function ShowCivilWarReference(personCWInfo) 
{
    var numPersonCWInfo = personCWInfo[0];
    if (numPersonCWInfo == 0) 
    {
        return 0;
    }
    newBlockID = "CivalWarInformation";
    CreateBlock("infoBlock", newBlockID, "groupBlock");
	var reference = personCWInfo[6];
	var numRows = 0;
	var charsToShow = reference.length;
	while (charsToShow > 0)
	{
	    numRows++;
	    var lastChar = (reference.length >= 74) ? 74 : reference.length;
	    var info = reference.substring(0, lastChar);
		if (reference.length > 74)
		{
    		while (info.charAt(lastChar - 1) != ' ')
	    	{
		        lastChar--;
    		    char = info.charAt(lastChar);
		    }
		    if (lastChar != 74)
		    {
		        info = info.substring(0, lastChar - 1);
			}
		}
        AddInfo(newBlockID, info, numRows);
		if (reference.length > lastChar)
		{
    		reference = reference.substring(lastChar);
		}
		charsToShow -= lastChar;
	}
    originalSizing(numRows * 16 + 50, 525, 0);
}
//**********************************************************************************************************************************************
function ShowAllPersonCW(personCWInfo) 
{
    var numPersonCWInfo = personCWInfo[0];
    if (numPersonCWInfo == 0) 
    {
        return 0;
    }
    newBlockID = "CivalWarInformation";
    CreateBlock("infoBlock", newBlockID, "groupBlock");
	var reference = personCWInfo[6];
	var heading = "Cival War Information";
	if (reference)
	{
	    heading += " (Click for More Info)";
	}
    AddInfo(newBlockID, heading);
    var message = document.getElementById(newBlockID);
    message.style.cursor = "pointer";
    message.onclick = MoreCivalWarInfoClicked;
    CivalWarBlock = "CivalWarBlock";
    CreateBlock(newBlockID, CivalWarBlock, "IndentedBlock");
	g_PersonCWID = personCWInfo[4];
	var enlistmentDate = personCWInfo[1];
	var cemeteryName = personCWInfo[2];
	var battleKilled = personCWInfo[3];
	numRows = 0;
	if (enlistmentDate.length > 0)
	{
	    AddCivalWarInfo(1, "Enlistment Date: " + enlistmentDate);
		numRows++;
	}
	if (cemeteryName.length > 0)
	{
	    AddCivalWarInfo(2, "Cemetery: " + cemeteryName);
		numRows++;
	}
	if (battleKilled.length > 0)
	{
	    AddCivalWarInfo(3, "Battle Site Killed/MIA/Wounded: " + battleKilled);
		numRows++;
	}
    numRows += ShowDataMilitary(personCWInfo);
    return numRows * 25;
}
//**********************************************************************************************************************************************
function ShowDataMilitary(personCWInfo)
{
    var DataMilitary = personCWInfo[5].split('!');
    var numRows = DataMilitary.length;
	for (var i = 0; i < numRows; i++)
	{
	    AddCivalWarInfo(numRows + 3, DataMilitary[i]);
	}
	return numRows;
}
//**********************************************************************************************************************************************
function AddCivalWarInfo(id, info)
{
    AddInfo(CivalWarBlock, info, id);
    var message = document.getElementById(id);
    message.style.cursor = "pointer";
    message.onclick = MoreCivalWarInfoClicked;
}
//**********************************************************************************************************************************************
function MoreCivalWarInfoClicked()
{
    var personCWInfo = g_personInfo[PersonCW_col].split('@');
	var reference = personCWInfo[6];
	if (reference)
	{
        g_moreCivilWarInfoClicked = true;
        RemoveChildren("infoBlock");
	    var height = ShowCivilWarReference(personCWInfo);
	}
}
//**********************************************************************************************************************************************
function ShowAllCensusYears(censusYears) 
{
    var numCensusYears = censusYears[0];
    if (numCensusYears == 0) 
    {
        return 0;
    }
    newBlockID = "YearsOnJamaicaCensus";
    CreateBlock("infoBlock", newBlockID, "groupBlock");
    AddInfo(newBlockID, "Years On Jamaica Census");
    CensusYearsBlock = "CensusYears";
    CreateBlock(newBlockID, CensusYearsBlock, "IndentedBlock");
    var col = 1;
    for (var i = 0; i < numCensusYears; i++) 
    {
        var year = censusYears[col++];
        var page = censusYears[col++];
        var id = year + "," + page;
        AddInfo(CensusYearsBlock, "   " + year + " Census Page " + page + " (Click to View Census Image)", id);
        var message = document.getElementById(id);
        message.style.cursor = "pointer";
        message.onclick = CensusPageClicked;
    }
    return numCensusYears * 25;
}
//**********************************************************************************************************************************************
function CensusPageClicked()
{
    var YearPage = this.id.split(',');
    if (YearPage.length == 2)
    {
        var url = callbackURL(g_historicJHSite, "Census", "people-in-jamaica") + "&Value=" + YearPage[0] + "&Page=" + YearPage[1] + "&ReturnAction=" + "PersonFamily" + "&ReturnID=" + g_currentPersonID;
        window.open(url, "_self");
    }
}
//**********************************************************************************************************************************************
function VitalRecordInfo(newBlockID, date, source)
{
	if (date.length == 0)
	{
		return 0;
	}
	CreateBlock("infoBlock", newBlockID, "groupBlock");
	AddInfo(newBlockID, date);
	AddInfo(newBlockID, source);
	return 56;
}
//**********************************************************************************************************************************************
function PersonInfo(callbackUrl,personID)
{
    if (infoxmlHttp.readyState == 4 || infoxmlHttp.readyState == 0) // proceed only if the xmlHttp object isn't busy
    {
    	g_personID = personID;
    	g_alreadyGotData = false;
    	var url=callbackUrl+"&personID="+personID+"&tmpl=component";
    	infoxmlHttp.open("GET", url, true); 
    	infoxmlHttp.onreadystatechange = infoHandleServerResponse;
    	infoxmlHttp.send(null);
    }
    else // if the connection is busy, try again after one half second 
    {
        setTimeout('PersonInfo(callbackUrl,personID)', 500);
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
            var g_tableData = infoxmlHttp.responseText.split('|'); 
            if (g_tableData.length >= 3)
            {
          	    g_alreadyGotData = true;
				g_personInfo = g_tableData[1].split('^');
                DisplayPersonInfo();
            }
        }
    }
}
//**********************************************************************************************************************************************
