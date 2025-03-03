var xmlHttp = createXmlHttpRequestObject();
var jg;
var leftX;
var rightX;
var height = 80;
var width = 284;
var g_currentPersonID = 0;
var previousNumChildren = 0;
var g_alreadyGotData = false;
var g_groupButtonClicked = false;
var g_person;
var g_Spouses;
var g_CurrentSpouse;
var g_NumSpouses;
var g_historicJHSite;
var g_previousScreen;
var g_returnToSchoolParm;

//**********************************************************************************************************************************************
function loadPersonFamily(historicJHSite, personID, previousScreen, returnToSchoolParm)
{
    g_returnToSchoolParm = returnToSchoolParm;
    g_historicJHSite = historicJHSite;
	g_previousScreen = previousScreen;
	jg = new jsGraphics("Canvas");    // Use the "Canvas" div for drawing
    getPersonData(personID);
}
//**********************************************************************************************************************************************
function ChangeSpouse()
{
	g_CurrentSpouse++;
	if (g_CurrentSpouse >= g_NumSpouses)
	{
		g_CurrentSpouse = 0;
	}
	var childHeight = showChildren();
	RemoveAllSpouseButtonsBeforeShowingButtons();
	ShowSpouse(g_Spouses[g_CurrentSpouse]["Person"].split(';'),g_Spouses[g_CurrentSpouse]["PersonFather"].split(';'),
               g_Spouses[g_CurrentSpouse]["PersonMother"].split(';'), g_Spouses[g_CurrentSpouse]["numChildren"], leftX, rightX, childHeight);}
//**********************************************************************************************************************************************
function PersonInfoWindow()
{
    var personInfo = document.createElement('div');
    personInfo.style.height="200px";
    personInfo.style.width="300px";
    personInfo.style.position="absolute";
    personInfo.style.left="500px";
    personInfo.style.top="100px";
    personInfo.style.background = "#A9D0F5";
    document.getElementById("Canvas").appendChild(personInfo);
}
//**********************************************************************************************************************************************
function PersonInfoPage()
{
    g_groupButtonClicked = true;
	var personID = this.id;
	personID = personID.replace("PersonInfo","");
	parmArray = new Array();
	parmArray[0] = "PersonID";
	parmArray[1] = personID;
	parmArray[2] = g_currentPersonID;
    url="index.php?option=com_historicjamaica?&action=PersonInfo&parms=" + parmArray;
    window.open(url, "_self");
}
//**********************************************************************************************************************************************
function groupBoxClicked()
{
    if (g_groupButtonClicked)
	{
    	g_groupButtonClicked = false;
	}
    else
    {
    	var elementID = this.id;
	    var newKey = document.getElementById(elementID).value;
	    if (newKey != 0 && newKey != g_currentPersonID)
        {
	        getPersonData(newKey);
        }
    }
}
//**********************************************************************************************************************************************
function showBox(group,person)
{
    var groupboxName = group + "GroupBox";
    document.getElementById(groupboxName).onclick = groupBoxClicked;
    document.getElementById(groupboxName).style.cursor = "pointer";
	document.getElementById(groupboxName).value = person[0];
	document.getElementById(group + "Name").innerHTML = person[1];
	document.getElementById(group + "Name").style.cursor = "pointer";
	document.getElementById(group + "Born").innerHTML = PersonDate(person[2]) + " - " + PersonDate(person[3]);
	document.getElementById(group + "Born").style.cursor = "pointer";
	CreateButton(groupboxName, person[0], person[4], 'PersonInfo', 'Info', ShowPersonInfo);
	CreateButton(groupboxName, person[0], person[5], 'Photos', 'Photos', showPhotos);
	CreateButton(groupboxName, person[0], person[6], 'VitalRecords', 'Vitals', ShowVitalRecords);
	var additionalSpouses = (group == "person" && g_NumSpouses > 1) ? g_NumSpouses - 1 : 0;
	CreateButton(groupboxName, person[0], additionalSpouses, 'Vital', 'Spouses', ChangeSpouse);
}
//**********************************************************************************************************************************************
function RemoveAllButtons(group)
{
	var elementGroup = document.getElementById(group);
	var children =  elementGroup.childNodes;
	var buttonArray = new Array();
	var buttonNum = 0;
	for (var i = 0; i < children.length; i++)
	{
		if (children[i].type == "button")
		{
			buttonArray[buttonNum] = children[i].id;
			buttonNum++;
		}
	}
	for (var i = 0; i <buttonNum; i++)
    {
		var childId = buttonArray[i];
		var element = document.getElementById(childId);
		elementGroup.removeChild(element);	
    }
}
//**********************************************************************************************************************************************
function CreateButton(group, personID, person, id, value, onClick)
{
	if (person == 0)
	{
	    return;	
	}
    button=document.createElement('input');
    button.type = 'button';
    button.id = id + personID;
    button.style.background = '#D0977B';
    button.style.height = '22px';
    button.style.fontsize = '10px';
    button.onclick = onClick;
    button.value = value;
    button.style.cursor = "pointer";
    document.getElementById(group).appendChild(button);
}
//**********************************************************************************************************************************************
function PersonDate(date)
{
	if (date.length == 0)
	{
		return "";
	}
	else
	{
		return date;
	}	
}
//**********************************************************************************************************************************************
function RemoveAllPersonButtonsBeforeShowingButtons(group)
{
	RemoveAllButtons("person" + "GroupBox");
	RemoveAllButtons("personFather" + "GroupBox");
	RemoveAllButtons("personMother" + "GroupBox");
}
//**********************************************************************************************************************************************
function RemoveAllSpouseButtonsBeforeShowingButtons(group)
{

	RemoveAllButtons("spouse" + "GroupBox");
	RemoveAllButtons("spouseFather" + "GroupBox");
	RemoveAllButtons("spouseMother" + "GroupBox");
}
//**********************************************************************************************************************************************
function ShowSpouse(spouse,spouseFather,spouseMother,numChildren,leftX,rightX,childHeight)
{
	showBox("spouse",spouse);
	showBox("spouseFather",spouseFather);
	showBox("spouseMother",spouseMother);
	if (numChildren == 0)
	{
		drawLines(leftX, "", "personGroupBox","spouseGroupBox", height);
	}
	else
	{
		drawLines(leftX, "childrenGroupBox", "personGroupBox","spouseGroupBox", childHeight);
	}
    if (spouseFather[0] == 0 && spouseMother[0] == 0)
	{
    	document.getElementById("spouseGroupBox").style.visibility = "visible";
		document.getElementById("spouseFatherGroupBox").style.visibility = "hidden";
		document.getElementById("spouseMotherGroupBox").style.visibility = "hidden";
   	}
    else
    {
        drawLines(rightX, "spouseGroupBox", "spouseFatherGroupBox","spouseMotherGroupBox", height);
    }
}
//**********************************************************************************************************************************************
function ShowPerson(person,personFather,personMother,rightX)
{
	var personTop =       (g_NumSpouses == 0) ? "200px" : "70px";
	var personFatherTop = (g_NumSpouses == 0) ? "150px" : "20px";
	var personMotherTop = (g_NumSpouses == 0) ? "250px" : "120px";
	document.getElementById("personGroupBox").style.top = personTop;
	document.getElementById("personFatherGroupBox").style.top = personFatherTop;
	document.getElementById("personMotherGroupBox").style.top = personMotherTop;
	showBox("person",person);
	showBox("personFather",personFather);
	showBox("personMother",personMother);
    if (personFather[0] == 0 && personMother[0] == 0)
   	{
     	document.getElementById("personGroupBox").style.visibility = "visible";
    	document.getElementById("personFatherGroupBox").style.visibility = "hidden";
    	document.getElementById("personMotherGroupBox").style.visibility = "hidden";
   	}
    else
    {
    	drawLines(rightX, "personGroupBox", "personFatherGroupBox","personMotherGroupBox", height);
    }
}
//**********************************************************************************************************************************************
function NoSpouse(person,personFather,personMother,numChildren,rightX,childHeight)
{
	document.getElementById("spouseGroupBox").style.visibility = "hidden";
	document.getElementById("spouseFatherGroupBox").style.visibility = "hidden";
	document.getElementById("spouseMotherGroupBox").style.visibility = "hidden";
	if (numChildren != 0)
	{
		drawLines(rightX, "personGroupBox", "personFatherGroupBox","personMotherGroupBox", childHeight);
		document.getElementById("renGroupBox").style.visibility = "visible";
		var renRight = getNum(document.getElementById("childrenGroupBox").style.left) + width;
		var personLeft = getNum(document.getElementById("personGroupBox").style.left);
		var personTop = getNum(document.getElementById("personGroupBox").style.top);
		var personMidpoint = boxCenter(personTop, height);
		jg.drawLine(childrenRight, personMidpoint, personLeft, personMidpoint);
	}
}
//**********************************************************************************************************************************************
function showChildren()
{
	var numChildren;
	if (g_NumSpouses == 0)
	{
		numChildren = 0;
	    document.getElementById("childrenGroupBox").style.visibility = "hidden";
	}
	else if (g_Spouses.length <= g_CurrentSpouse)
	{
		alert("current spouse: " + g_CurrentSpouse + " length: " + g_Spouses.length)
	}
	else
	{
		var spouse = g_Spouses[g_CurrentSpouse];
		if (spouse.length < 5)
		{
			alert("spouse: " + g_CurrentSpouse + " length of array: " + spouse.length)
		}
   		numChildren = spouse["numChildren"];
   		var children = spouse["children"].split(';');
		if (numChildren == 0)
		{
		    document.getElementById("childrenGroupBox").style.visibility = "hidden";
		}
    	if (numChildren > 3)
	    {
		    childrenBoxHeight = (numChildren - 3) * 25;
		    document.getElementById("childrenGroupBox").style.height = (height + childrenBoxHeight) + "px";
		    document.getElementById("childrenGroupBox").style.top = (200 - (childrenBoxHeight/2)) + "px";
	    }
	    else
	    {
    	    document.getElementById("childrenGroupBox").style.height = height + "px";
		    document.getElementById("childrenGroupBox").style.top = 200 + "px";
		}
	}
	var childHeight = getNum(document.getElementById("childrenGroupBox").style.height);
	if (previousNumChildren > numChildren)
		num = previousNumChildren;
	else
		num = numChildren
	for (j = 0;j < num; j++)
	{
		childStr = "child"+(j+1).toString();
		if (j >= numChildren)
		{
		    document.getElementById(childStr).value = 0;
		    document.getElementById(childStr).style.cursor = "pointer";
			document.getElementById(childStr).innerHTML = "";	
		}
		else
		{
     		var child = children[j].split('@');
			document.getElementById(childStr).onclick = groupBoxClicked;
			document.getElementById(childStr).value = child[0];
			document.getElementById(childStr).style.cursor = "pointer";
			var personName = child[1].trim();
			var bornDate = child[2];
			if (bornDate.length != 0 && personName.length < 28)
			{
			    bornDate = "-Born " + bornDate;	
			}
			else
			{
			    bornDate = "";
            }
    		document.getElementById(childStr).innerHTML = personName + bornDate;	
		}
	}
	previousNumChildren = numChildren;
	return childHeight;
}
//**********************************************************************************************************************************************
function showPage()
{
	jg.clear();
	var childHeight = showChildren();
	var childrenLeft = getNum(document.getElementById("childrenGroupBox").style.left);
	var childrenWidth = getNum(document.getElementById("childrenGroupBox").style.left);
	var personLeft = getNum(document.getElementById("personGroupBox").style.left);
	var personFatherLeft = getNum(document.getElementById("personFatherGroupBox").style.left);
	leftX = getMidpoint(childrenLeft,personLeft);
	rightX = getMidpoint(personLeft, personFatherLeft);
	RemoveAllPersonButtonsBeforeShowingButtons();
	RemoveAllSpouseButtonsBeforeShowingButtons();
	if (g_NumSpouses != 0)
    {
		ShowPerson(g_Person["Person"].split(';'),g_Person["PersonFather"].split(';'),g_Person["PersonMother"].split(';'), rightX);
		ShowSpouse(g_Spouses[g_CurrentSpouse]["Person"].split(';'),g_Spouses[g_CurrentSpouse]["PersonFather"].split(';'),
	               g_Spouses[g_CurrentSpouse]["PersonMother"].split(';'), g_Spouses[g_CurrentSpouse]["numChildren"], leftX, rightX, childHeight);
    }
	else
	{
	    numChildren = 0;
	    ShowPerson(g_Person["Person"].split(';'), g_Person["PersonFather"].split(';'), g_Person["PersonMother"].split(';'), rightX);
		NoSpouse(g_Person["Person"].split(';'),g_Person["PersonFather"].split(';'),g_Person["PersonMother"].split(';'),
				 numChildren,rightX,childHeight);
	}
	jg.paint();
}
//**********************************************************************************************************************************************
function getNum(str)
{
	len = str.length;
	return parseInt(str.substring(0,len-2));
}
//**********************************************************************************************************************************************
function getMidpoint(left1, left2)
{
	len = (left1 + width);
	return len + (left2 - len) / 2;
}
//**********************************************************************************************************************************************
function boxCenter(boxTop, boxheight)
{
	return (boxTop + (boxheight/2) - 10);
}
//**********************************************************************************************************************************************
function drawLines(x, person, father, mother, personHeight)
{
	if (person.length != 0)
	{
		document.getElementById(person).style.visibility = "visible";
		var personRight = getNum(document.getElementById(person).style.left) + width;
		var personTop = getNum(document.getElementById(person).style.top);
		var personMidpoint = boxCenter(personTop, personHeight);
		jg.drawLine(personRight, personMidpoint, x, personMidpoint);
	}
	document.getElementById(father).style.visibility = "visible";
	document.getElementById(mother).style.visibility = "visible";
	var fatherLeft = getNum(document.getElementById(father).style.left);
	var fatherTop = getNum(document.getElementById(father).style.top);
	var fatherMidpoint = boxCenter(fatherTop, height);
	var motherLeft = getNum(document.getElementById(mother).style.left);
	var motherTop = getNum(document.getElementById(mother).style.top);
	var motherMidpoint = boxCenter(motherTop, height);
	jg.drawLine(x, fatherMidpoint, x, motherMidpoint);
	jg.drawLine(x, fatherMidpoint, fatherLeft, fatherMidpoint);
	jg.drawLine(x, motherMidpoint, motherLeft, motherMidpoint);
}
//**********************************************************************************************************************************************
function previousScreen()
{
	var url = "";
	if (g_previousScreen == "School")
	{
                      url = callbackURL(g_historicJHSite, "School", 'people-in-jamaica') + "&Value=" + g_returnToSchoolParm + "&Page=" + g_currentPersonID + "&ReturnAction=" + "PersonFamily" + "&ReturnID=" + g_currentPersonID;
	}
	else
	if (g_previousScreen == "DataGridCensus")
	{
                      parmArray = new Array();
	    parmArray[0] = "DataGridCensus";
                      url = callbackURL(g_historicJHSite, "DataGridCensus", 'people-in-jamaica') + "&parms=" + parmArray + "&ReturnAction=" + "PersonFamily" + "&ReturnID=" + g_currentPersonID;
	}
	else
	{
                      parmArray = new Array();
	    parmArray[0] = "ReturnFromFamily";
	    parmArray[1] = g_currentPersonID;
	    parmArray[2] = g_returnToSchoolParm;
                      url = callbackURL(g_historicJHSite, g_previousScreen, 'people-in-jamaica') + "&Value=" + g_returnToSchoolParm + "&Page=" + g_currentPersonID + "&ReturnID=" + g_currentPersonID + "&parms=" + parmArray;
	}
	window.open(url, "_self");
}
//**********************************************************************************************************************************************
function showPhotos()
{
    g_groupButtonClicked = true;
	var personID = this.id;
	personID = personID.replace("Photos","");
	parmArray = new Array();
	parmArray[0] = "PersonID";
	parmArray[1] = personID;
	parmArray[2] = g_currentPersonID;
	var url = callbackURL(g_historicJHSite, "PhotoViewer") + "&parms=" + parmArray;
    window.open(url, "_self");
}
//**********************************************************************************************************************************************
function ShowVitalRecords()
{
    var parmArray = new Array();
	var personID = this.id;
	personID = personID.replace("VitalRecords","");
	parmArray[0] = "VitalRecordsByPersonID";
	parmArray[1] = personID;
	parmArray[2] = g_currentPersonID;
	var url = callbackURL(g_historicJHSite, "PersonVitalRecord", "people-in-jamaica") + "&parms=" + parmArray;
	window.open(url, "_self");
}
//**********************************************************************************************************************************************
function getPersonData(personID)
{
	g_currentPersonID = personID
    if (xmlHttp.readyState == 4 || xmlHttp.readyState == 0) // proceed only if the xmlHttp object isn't busy
    {
    	g_alreadyGotData = false;
	    var url = callbackURL(g_historicJHSite, "PersonFamilyData") +"&personID="+personID+"&tmpl=component";
        xmlHttp.open("GET", url, true); 
        xmlHttp.onreadystatechange = handleServerResponse;
        xmlHttp.send(null);
    }
    else // if the connection is busy, try again after one second 
    {
        setTimeout('getPersonData(personID)', 1000);
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
      	var personStr = xmlHttp.responseText;
	    var person = personStr.split('|'); // Person[0] is the HTML at the beginning of the string
	    if (person.length > 5) 
        {
            var numPersons = toInt(person[1]);
			if (person.length > numPersons + 1)
            {
                g_alreadyGotData = true;
                g_Person = PersonStats(person, 2);
                g_NumSpouses = person[5];
                g_CurrentSpouse = 0;
                g_Spouses = new Array(g_NumSpouses);
                for (var i = 0; i < g_NumSpouses; i++) 
                {
                    g_Spouses[i] = PersonStats(person, (i * 5 + 6));
                }
                showPage();
            }
        }
    }
}
//**********************************************************************************************************************************************
function PersonStats(person, index)
{
	if (person.length <= index + 5)
	{
        alert("Person Length: " + person.length + " index: " + index)	
        alert(person);
        return "";
	}
	else
	{
    	var personStats = new Array(5);
	    personStats["Person"]=person[index];
	    personStats["PersonFather"]=person[index+1];
	    personStats["PersonMother"]=person[index+2];
	    personStats["numChildren"]=person[index+3];
	    personStats["children"]=person[index+4];
		return personStats;
	}
}
//**********************************************************************************************************************************************
