var g_firstTime = true;
var g_tableID;
var g_numSchoolGradeRows;
var xmlInfoHttp;
var origHeight;
var height;
var title;
var maxTextLength;
var subcategoryAlreadyGotInfo;
var infoRequest;
var g_grade;
var g_gradeToHighlight;
var g_schoolYearGrades;
var g_numGrades;
var g_initialGrade = "0";
var g_initialSchoolYearId = "";
var g_personIdToHighlight = 0;
var g_SchoolYear;

//**********************************************************************************************************************************************
function SchoolInfo(text, schoolYearId, gradeToShow="0", personId=0, schoolYear = "")
{
    g_SchoolYear = schoolYear;
    g_grade = gradeToShow;
	g_gradeToHighlight = g_grade;
	if (gradeToShow != "0")
	{
		g_initialGrade = gradeToShow;
		g_initialSchoolYearId = schoolYearId;
	}
	else if (g_gradeFromPersonInfo != "0")
	{ 
	    g_grade = DifferenceBetweenInitialYearAndCurrentYear(schoolYearId);
	}
	else
	{
		g_initialSchoolYearId = schoolYearId;
	}
	if (personId != 0)
	{
    	g_personIdToHighlight = personId;
	}
    title = text;
    var infoTitle = "Choose Grade From " + title;
    xmlInfoHttp = createXmlHttpRequestObject();
	request = "grades";
	infoRequest = "SchoolInfoValues";
	if (!g_SchoolYear)
	{
    	g_SchoolYear = schoolYearId;
	}
    getSchoolData(g_SchoolYear);
}
//**********************************************************************************************************************************************
function DifferenceBetweenInitialYearAndCurrentYear(schoolYearId)
{
    var initialYearArray = g_initialSchoolYearId.split("-");
	var initialYear = Number(initialYearArray[1]);
    var currentYearArray = schoolYearId.split("-");
	var currentYear = Number(currentYearArray[1]);
    var difference = currentYear - initialYear;
	return IncrementGrade(g_initialGrade, difference);
}
//**********************************************************************************************************************************************
function IncrementGrade(initialGrade, increment)
{
    var grade = initialGrade.charCodeAt(0);
	grade += increment - 48;
	return grade.toString();
}
//**********************************************************************************************************************************************
function DisplaySchoolGrades(schoolGrades)
{
    g_numGrades = schoolGrades[1];
    g_schoolYearGrades = schoolGrades;
    var schoolYearGrades = g_schoolYearGrades[2].split(";");
	if (g_grade == "0")
	{
       var res = schoolYearGrades[0].split(" ");
	   g_grade = res[1];
	   g_returnToFamilyParm = g_initialSchoolYearId + "-" + g_grade;
    }
    xmlInfoHttp = createXmlHttpRequestObject();
	infoRequest = "SchoolGradeInfoValues";
	if (g_grade == "")
	{
	    g_grade = "0";
	}
    getSchoolData(g_SchoolYear + "-" + g_grade + "-" + g_personIdToHighlight);
}
//**********************************************************************************************************************************************
function SchoolPersonClicked() 
{
    var id = this.id;
	var personId = Number(this.title);
	if (personId == 0)
	{
	    return;
	}
	var schoolGrade = this.innerText;
    var res = schoolGrade.split(" ");
	if (res[0] == "Teacher")
	{
	    return;
	}
    parmArray = new Array();
    parmArray[0] = "PersonID";
    parmArray[1] = personId;
	parmArray[2] = g_SchoolYear + "-" + g_grade; //g_returnToFamilyParm;
	url = callbackURL(g_historicJHSite, "PersonFamilyFromSchoolRecords", "people-in-jamaica") + "&parms=" + parmArray;
    window.open(url, "_self");
}
//**********************************************************************************************************************************************
function SchoolGradeClicked() 
{
    var id = this.id;
	var schoolGrade = this.innerText;
    var res = schoolGrade.split(" ");
	if (res[0] == "Teacher")
	{
	    return;
	}
	var grade = res[1];
	g_gradeToHighlight = grade;
	if (grade == "Primary" || grade == "Grammer")
	{
	    g_grade = "0";
	} 
	else
	{
	    g_grade = grade;
	}
	infoRequest = "SchoolGradeInfoValues";
	g_returnToFamilyParm = g_SchoolYear + "-" + grade + "-0";
    getSchoolData(g_returnToFamilyParm);
}
//**********************************************************************************************************************************************
function DisplaySchoolRecords(SchoolRecords)
{
    var numSchoolRecords = SchoolRecords[1];
    var gradeToHighlight = SetGradeToHighlight(SchoolRecords, numSchoolRecords);
    var displayTitle = title.trim();
	if (gradeToHighlight == "Primary" || gradeToHighlight == "Grammer")
	{
        displayTitle += "-" + gradeToHighlight;
	}
	else
	if (gradeToHighlight != "" && gradeToHighlight != "0")
	{
        displayTitle += "-Grade " + gradeToHighlight;
	}
    PrepareInfoPage(displayTitle);
    g_numSchoolGradeRows = displaySchoolInfo(g_schoolYearGrades, g_numGrades, SchoolRecords, numSchoolRecords, gradeToHighlight);
    height = origHeight + g_numSchoolGradeRows * 18 + 40;
    var infoWindowWidth = maxTextLength * 7 + 110;
    originalSizing(height, infoWindowWidth, g_pictureHeight);
}
//**********************************************************************************************************************************************
function displaySchoolInfo(schoolGrades, numGrades, SchoolRecords, numSchoolRecords, gradeToHighlight) 
{
    var newTableID = schoolGrades;
    g_tableID = newTableID;
    CreateTable(newTableID);
    var numColumns = 2;
	var numGrades = Number(numGrades);
	var numRows = numGrades;
	if (Number(numSchoolRecords) > numRows)
	{
	    numRows = Number(numSchoolRecords);
	}
	var schoolRecordType;
	var gradeIndex = 0;
	var firstStudent = false;
	var numTeachers = 0;
	var offset = 0;
	var alreadyDisplayedBlankRows = false;
    for (var i = 0; i < numRows; i++) 
	{
	    var highlightColumn1 = false;
	    var highlightColumn2 = false;
		var strValue1 = "";
		var strValue2 = "";
		var personIdValue2 = 0;
		if (i < numSchoolRecords)
		{
            var schoolRecordInfo = SchoolRecords[i + 2].split(';')
			schoolRecordType =  Number(schoolRecordInfo[3]);
            strValue2 = FirstNameFirst(schoolRecordInfo[4]);
			personIdValue2 = Number(schoolRecordInfo[5]);
			var personId = Number(schoolRecordInfo[5]);
			if (g_personIdToHighlight != 0 && personId == g_personIdToHighlight)
			{
			    highlightColumn2 = true;
			}
			if (schoolRecordType == 0)
			{
			    numTeachers++;
			    firstStudent = true;
				strValue1 = "Teacher";
    			grades =  schoolRecordInfo[2];
				if (grades)
				{
				    strValue1 +=  "-Grades " + grades;
				}
			}
			else if (firstStudent)
			{
				firstStudent = false;
				alreadyDisplayedBlankRows = true;
                AddTwoFieldInfo(newTableID, i + 1, "", "", "", false, numColumns);
                AddTwoFieldInfo(newTableID, i + 2, "", "", "", false, numColumns);
				offset = 2;
            	if (numRows < numGrades + numTeachers)
	            {
	                numRows = numGrades + numTeachers;
	            }
			}
		}
		if (!strValue1)
		{
    	    if (gradeIndex < numGrades)
	    	{
			    if (!alreadyDisplayedBlankRows)
				{
    				alreadyDisplayedBlankRows = true;
                    AddTwoFieldInfo(newTableID, i + 1, "", "", "", false, numColumns);
                    AddTwoFieldInfo(newTableID, i + 2, "", "", "", false, numColumns);
    				offset = 2;
                	if (numRows < numGrades + numTeachers)
	                {
	                    numRows = numGrades + numTeachers;
	                }
				}
                var schoolGradeInfo = schoolGrades[gradeIndex + 2].split(';')
                var gradeArray = schoolGradeInfo[0].split(" ");
				if (gradeArray[1] == "" || gradeArray[1] == "0")
				{
				    schoolGradeInfo[0] = "Students";
				}
				else
				if (gradeToHighlight == "Primary" || gradeToHighlight == "Grammer")
				{
				    if (gradeArray[1] == gradeToHighlight)
					{
    				    highlightColumn1 = true;
					}
				}
				else
				if (Number(gradeArray[1]) == gradeToHighlight)
				{
				    highlightColumn1 = true;
                }
                strValue1 = schoolGradeInfo[0];
				gradeIndex++;
			}
		}
        AddTwoFieldInfo(newTableID, i + offset + 1, strValue1, strValue2, "", false, numColumns, highlightColumn1, highlightColumn2);
        SetSchoolOnClick(i + offset + 1, personIdValue2);
    }
    return numRows;
}
//**********************************************************************************************************************************************
function SetGradeToHighlight(SchoolRecords, numSchoolRecords) 
{
    if (g_gradeToHighlight == "Primary" || g_gradeToHighlight == "Grammer")
	{
	    return g_gradeToHighlight;
	}
    if (g_personIdToHighlight == 0)
	{
	    return g_grade;
	}
	for (var i = 0; i < numSchoolRecords; i++)
	{
        var schoolRecordInfo = SchoolRecords[i + 2].split(';');
		var personId = Number(schoolRecordInfo[5]);
		if (personId == g_personIdToHighlight)
		{
  			schoolRecordType =  Number(schoolRecordInfo[3]);
			if (schoolRecordType == 0)
			{
        	    return g_grade;
			}
			else
			{
		        return Number(schoolRecordInfo[2]);
			}
		}
	}
	return g_grade;
}
//**********************************************************************************************************************************************
function FirstNameFirst(person) 
{
    var nameArray = person.split(",");
	var lastName = nameArray[0].trim();
	var firstName = nameArray[1].trim();
	return firstName + " " + lastName;
}
//**********************************************************************************************************************************************
function PrepareInfoPage(title) 
{
    document.getElementById("slides").style.display = "none";
    if (g_firstTime) 
    {
        InfoWindow(title, false);
        g_firstTime = false;
    }
    else 
    {
        document.getElementById("InfoWindow").style.display = "";
        document.getElementById("title").innerHTML = title;
        RemoveChildren("infoBlock");
    }
    origHeight = 40;
}
//**********************************************************************************************************************************************
function ButtonClicked() 
{
    var parmArray = new Array();
    parmArray[0] = "PersonCensus";
    parmArray[1] = g_SchoolYear;
    var url = callbackURL(g_historicJHSite, "PersonCensus") + "&parms=" + parmArray;
    window.open(url, "_self");
}
//**********************************************************************************************************************************************
function SetSchoolOnClick(rowNum, personIdValue2) 
{
    var nodes = document.getElementById("tr" + rowNum).childNodes;
    nodes[0].onclick = SchoolGradeClicked;
    nodes[0].style.cursor = "pointer";
    nodes[1].onclick = SchoolPersonClicked;
	nodes[1].title = personIdValue2;
    nodes[1].style.cursor = "pointer";
}
//**********************************************************************************************************************************************
function ShowSchoolRecords()
{
    var indexOfTd = id.indexOf("td");
    if (indexOfTd > 0) {
        document.getElementById("InfoWindow").style.display = "none";
        document.getElementById("slides").style.display = "";
        var page = GetPageFromID(id, indexOfTd);
        ShowSchoolRecords(g_SchoolYear, page);
    }
}
//**********************************************************************************************************************************************
function GetPageFromID(id, indexOfTd) 
{
    var rowNum = +id.substring(2, indexOfTd);
    var colNum = id.substring(indexOfTd + 2, id.length);
    return (colNum == 2) ? g_numCensusPageRows + rowNum : rowNum;
}
//**********************************************************************************************************************************************
function ShowSchoolRecords(year, page) 
{
    ShowImage(CensusPhotoName(year, page));
    var censusYear = document.getElementById(g_SchoolYear + "text");
    censusYear.innerHTML = g_SchoolYear + " Census " + " - Page " + page;
}
//**********************************************************************************************************************************************
function CensusPhotoName(year, page) 
{
    var strPage = (page < 10) ? "0" + page : page;
    var fileName = "/Jamaica " + year + "_" + strPage;
    return "/Census" + fileName + ".jpg";
}
//**********************************************************************************************************************************************
function SetValue(value) 
{
    return "Page " + value;
}
//**********************************************************************************************************************************************
function NumPages(censusYear) 
{
    switch (censusYear) 
    {
        case 1790: return 2;
        case 1800: return 5;
        case 1810: return 3;
        case 1820: return 5;
        case 1830: return 10;
        case 1840: return 20;
        case 1850: return 38;
        case 1860: return 40;
        case 1870: return 32;
        case 1880: return 27;
        case 1890: return 0;
        case 1900: return 16;
        case 1910: return 15;
        case 1920: return 13;
        case 1930: return 12;
        case 1940: return 16;
        case 1950: return 27;
        default: return 0;
    }
}
//**********************************************************************************************************************************************
function getSchoolData(schoolYearId) 
{
    // proceed only if the xmlInfoHttp object isn't busy
    if (xmlInfoHttp.readyState == 4 || xmlInfoHttp.readyState == 0) 
    {
        url = callbackURL(g_historicJHSite, infoRequest) + "&SchoolYearID=" + schoolYearId + "&tmpl=component";
        subcategoryAlreadyGotInfo = false;
        xmlInfoHttp.open("GET", url, true);
        xmlInfoHttp.onreadystatechange = handleSchoolRecordsServerResponse;
        xmlInfoHttp.send(null);
    }
    else // if the connection is busy, try again after one half second 
    {
        setTimeout('getSchoolData(schoolYearId)', 500);
    }
}
//**********************************************************************************************************************************************
function handleSchoolRecordsServerResponse() 
{
    if (xmlInfoHttp.status == 200) // status of 200 indicates the transaction completed successfully
    {
        imageInfo = xmlInfoHttp.responseText;
        var foo = '' || undefined;
        if (xmlInfoHttp.responseText.length != 0 && !subcategoryAlreadyGotInfo) 
        {
            var schoolValues = xmlInfoHttp.responseText.split('|');
            if (schoolValues.length > 1) // firefox processes this request twice
            {
                var numRecords = toInt(schoolValues[1]);
	    		if (schoolValues.length > numRecords + 1)
                {
                    subcategoryAlreadyGotInfo = true;
                    if (infoRequest == "SchoolInfoValues")
                    {
                        DisplaySchoolGrades(schoolValues);
                    }
					else
                    {
                        DisplaySchoolRecords(schoolValues);
                    }
                }
            }
        }
    }
    else if (xmlInfoHttp.status != 0) // status of 200 indicates the transaction completed successfully
    {
        alert("There was a problem accessing the server: " + xmlInfoHttp.statusText);
    }
}
//**********************************************************************************************************************************************
