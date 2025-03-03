var infoxmlHttp = createXmlHttpRequestObject();
var vitalRecordID_col = 0;
var vitalRecordType_col = 1;
var vitalRecordPersonName_col = 2;
var vitalRecordSpouseName_col = 3;
var vitalRecordFatherName_col = 4;
var vitalRecordMotherName_col = 5;
var vitalRecordBook_col = 6;
var vitalRecordPage_col = 7;
var vitalRecordDate_col = 8;
var vitalRecordDeathInfo_col = 9;
var vitalRecordBornDate_col = 10;
var vitalRecordNotes_col = 11;
var vitalRecordSpouseFatherName_col = 12;
var vitalRecordSpouseMotherName_col = 13;

//**********************************************************************************************************************************************
function ShowVitalRecord(vitalRecordByIdURL,vitalRecordID)
{
	VitalRecordInfo(vitalRecordByIdURL, vitalRecordID);
}
//**********************************************************************************************************************************************
function DisplayVitalRecordInfo(vitalRecordInfo)
{
	InfoWindow(vitalRecordInfo[1], true);
    LoadInformation(vitalRecordInfo);
}
//**********************************************************************************************************************************************
function LoadInformation(vitalRecordInfo)
{
	var origHeight = 40;
	var height = origHeight;
	height += recordInfo(vitalRecordInfo);
    height += parents(vitalRecordInfo[vitalRecordType_col],
	    		          vitalRecordInfo[vitalRecordFatherName_col], 
	    		          vitalRecordInfo[vitalRecordMotherName_col],
                          vitalRecordInfo[vitalRecordSpouseFatherName_col], 
                          vitalRecordInfo[vitalRecordSpouseMotherName_col]);
	height += ShowNotes("Notes", vitalRecordInfo[vitalRecordNotes_col]);
    originalSizing(height, 450, 0);
}
//**********************************************************************************************************************************************
function recordInfo(vitalRecordInfo)
{
	var newBlockID = "vitalRecordInfo";
	CreateBlock("infoBlock", newBlockID, "groupBlock");
	isMarriageRecord = MarriageRecord(vitalRecordInfo[vitalRecordType_col]);
	if (isMarriageRecord)
	{
		AddInfo(newBlockID, vitalRecordInfo[vitalRecordPersonName_col] + " - " + vitalRecordInfo[vitalRecordSpouseName_col]);
	}
	else
	{
		AddInfo(newBlockID, vitalRecordInfo[vitalRecordPersonName_col]);
	}
	var height = 25;
	var recordType = vitalRecordInfo[vitalRecordType_col];
	var deathRecord = DeathRecord(recordType);
	if (deathRecord)
	{
	    var spouse = vitalRecordInfo[vitalRecordSpouseName_col];
	    if (spouse.length > 0)
	    {
	        AddInfo(newBlockID, "Spouse " + spouse);
	        height += 25;
	    }
	    var bornDate = vitalRecordInfo[vitalRecordBornDate_col];
	    if (bornDate.length > 0)
	    {
	        AddInfo(newBlockID, "Born " + YMDtoMDY(bornDate));
	        height += 25;
        }
	    var diedDate = vitalRecordInfo[vitalRecordDate_col];
	    if (diedDate.length > 0)
	    {
	        AddInfo(newBlockID, "Died " + YMDtoMDY(diedDate));
	        height += 25;
        }
	    var deathInfo = vitalRecordInfo[vitalRecordDeathInfo_col];
	    if (deathInfo.length > 0)
	    {
	        AddInfo(newBlockID, deathInfo);
	        height += 25;
	    }
	}
	else
	{
	    AddInfo(newBlockID, RecordType(isMarriageRecord, recordType) +
			            YMDtoMDY(vitalRecordInfo[vitalRecordDate_col]));
	    height += 25;
    }
	if (recordType != "Cemetery")
	{
	    AddInfo(newBlockID, "Book: " + vitalRecordInfo[vitalRecordBook_col] +
                            " - Page: " + vitalRecordInfo[vitalRecordPage_col]);
	    height += 25;
    }
	return height;
}
//**********************************************************************************************************************************************
function burrialTypeRecord(DeathInfo)
{
	return DeathInfo.substring(0, 6) == "Burial";
}
//**********************************************************************************************************************************************
function parents(recordType, father, mother, spouseFather, spouseMother)
{
	if (father.length == 0 && mother.length == 0 && spouseFather.length == 0 && spouseMother.length == 0)
	{
		return 0;
	}
	var newBlockID = "vitalRecordParentInfo";
	CreateBlock("infoBlock", newBlockID, "groupBlock");
	var type = (MarriageRecord(recordType)) ? recordType.substring(9) : "";
	var oposite = oppositeType(type);
	height  = addParentName(newBlockID, type, "Father: ", father);
	height += addParentName(newBlockID, type, "Mother: ", mother);
	height += addParentName(newBlockID, oposite, "Father: ", spouseFather);
	height += addParentName(newBlockID, oposite, "Mother: ", spouseMother);
	return height;
}
//**********************************************************************************************************************************************
function addParentName(newBlockID, type, relationship, name)
{
	if (name.length == 0)
		return 0;
	var typestring = (type == "") ? type : type + "'s ";
	AddInfo(newBlockID, typestring + relationship + " " + name);
	return 25;
}
//**********************************************************************************************************************************************
function oppositeType(type)
{
	if (type == "Bride")
		return "Groom";
	else
	if (type == "Groom")
		return "Bride";
	else
	if (type == "Party A")
		return "Party B";
	else
	if (type == "Party B")
		return "Party A";
	else
		return "";
}
//**********************************************************************************************************************************************
function RecordType(isMarriageRecord, recordType)
{
    var type = recordType.substring(0, 5);
    if (type == "Birth") {
        return "Born ";
    }
    if (DeathRecord(recordType)) {
        return "Died ";
    }
    if (isMarriageRecord)
	{
		return "Married ";
	}
}
//**********************************************************************************************************************************************
function DeathRecord(recordType)
{
    var type = recordType.substring(0, 5);
    if (type == "Death" || type == "Buria" || type == "Cemet") 
    {
        return true;
    }
    else
    {
		return false;
    }
}
//**********************************************************************************************************************************************
function MarriageRecord(recordType)
{
	var type = recordType.substring(0, 8);
	if (type == "Marriage")
    {
		return true;
    }
	else
	{
		return false;
	}
}
//**********************************************************************************************************************************************
function VitalRecordInfo(callbackUrl,vitalRecordID)
{
    if (infoxmlHttp.readyState == 4 || infoxmlHttp.readyState == 0) // proceed only if the xmlHttp object isn't busy
    {
    	g_alreadyGotData = false;
    	url=callbackUrl+"&vitalRecordID="+vitalRecordID+"&tmpl=component";
    	infoxmlHttp.open("GET", url, true); 
    	infoxmlHttp.onreadystatechange = infoHandleServerResponse;
    	infoxmlHttp.send(null);
    }
    else // if the connection is busy, try again after one half second 
    {
        setTimeout('VitalRecordInfo(callbackUrl,vitalRecordID)', 500);
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
    if (infoxmlHttp.status != 200) // status of 200 indicates the transaction completed successfully
    {
    	return;
    }
    if (infoxmlHttp.responseText != 0 && !g_alreadyGotData)  // firefox processes this request twice
    {
        var g_tableData = infoxmlHttp.responseText.split('|');
        if (g_tableData.length >= 3)
        {
      	    g_alreadyGotData = true;
            DisplayVitalRecordInfo(g_tableData[1].split(';'));
        }
    }
}
//**********************************************************************************************************************************************
