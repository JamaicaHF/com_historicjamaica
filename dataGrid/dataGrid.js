var xmlHttp = createXmlHttpRequestObject();
var dataHttp = createXmlHttpRequestObject();
var g_idList;
var g_VitalRecordsPersonID;
var g_lastName;
var g_firstName
var g_middleName;
var g_suffix;
var g_prefix;
var g_personOption;
var maxNum = 99999999;
var minNum = -99999999;
var g_table;
var g_numPagesInBlock = 17;
var g_numRowsOnPage = 15;
var g_firstPageInBlock = 1;
var g_lastPageInBlock = g_numPagesInBlock;
var g_currentPage = 1;
var g_numPeople = 0;
var g_numFields = 0;
var g_numPages = 0;
var g_alreadyGotData = false;
var g_alreadyMultipleIDs = false;
var g_hideRow = "none";
var g_showRow = "";
var g_tableData;
var tr;
var th;
var g_searchOption;
var g_personOption;
var g_censusYear;
var g_censusPage;
var g_PersonType;
var g_lastName;
var g_firstName;
var g_middleName;
var g_suffix;
var g_prefix;
var g_firstPage;
var g_returnID;
var g_action;
var g_dataFunction;
var g_returnAction;
var g_dataTable;
var g_historicJHSite;
//**********************************************************************************************************************************************
function loadPersonTable(historicJHSite, action, searchOption, personOption, lastNameOrID, firstName, middleName, suffix, prefix, firstPage)
{
    g_historicJHSite = historicJHSite;
	g_action = action;
	DataFunction(action);
	if (action == "DataGridCivilWar")
	{
	    g_currentPage = searchOption;
		g_firstPage = searchOption;
	}
	else if (firstPage.length == 0)
	{
		g_firstPage = 1;
	}
	else
	{
	    g_firstPage = firstPage;
	    g_currentPage = g_firstPage;
	}
	g_searchOption = searchOption;
	g_personOption = personOption;
    g_table = document.getElementById("dataTable");
    var personDataURL = callbackURL(g_historicJHSite, g_dataFunction)
    if (g_searchOption == "PersonCensus")
    {
	    g_censusYear = personOption;
	    g_censusPage = lastNameOrID;
        GetCensusData(personDataURL, g_censusYear, g_censusPage);
        g_returnID = g_censusYear;
    }
    else
	if (g_dataFunction == "VitalRecordsByPersonID")
	{
		g_VitalRecordsPersonID = lastNameOrID;
		g_returnID = firstName;
		getVitalRecordsDataByPersonID(personDataURL, g_VitalRecordsPersonID);
	}
	else
	{
		g_lastName = lastNameOrID;
		g_firstName = firstName;
		g_middleName = middleName;
		g_suffix = suffix;
		g_prefix = prefix;
	    getPersonData(personDataURL,g_searchOption,g_lastName,firstName,g_middleName,g_suffix,g_prefix,g_personOption);
	}
}
//**********************************************************************************************************************************************
function DataFunction(action)
{
	if (action == "DataGridPerson")
	{
		g_dataFunction = "PersonByName";
		g_returnAction = "Person";
		g_dataTable = "person";
	}
	else
	if (action == "PersonCensus")
	{
	    g_dataFunction = "PersonByCensusYear";
	    g_returnAction = "Census";
	    g_dataTable = "person";
	}
	if (action == "DataGridCivilWar")
	{
		g_dataFunction = "CivilWarVeterans";
		g_returnAction = "DataGridCivilWar";
		g_dataTable = "personcw";
	}
	else
	if (action == "DataGridVitalRecord")
	{
		g_dataFunction = "VitalRecordByName";
		g_returnAction = "VitalRecord";
		g_dataTable = "vitalrecord";
	}
	else
	if (action == "PersonVitalRecord")
	{
		g_dataFunction = "VitalRecordsByPersonID";
		g_returnAction = "PersonFamily";
		g_dataTable = "vitalrecord";
	}
}
//**********************************************************************************************************************************************
function getPageData()
{
	var curID = (g_currentPage - 1) * g_numRowsOnPage;
	multipleIDs = "";
	for (var i = 0; i < g_numRowsOnPage; i++)
	{
		if (curID >= g_idList.length)
		{
			break;
		}
		multipleIDs += (g_idList[curID] + ';');
		curID++;
	}
    var personDataURL = callbackURL(g_historicJHSite, "MultipleRecordIDs");
	GetMultipleIds(personDataURL, g_dataTable, multipleIDs, g_lastName)
}
//**********************************************************************************************************************************************
function previousScreen()
{
    var parmArray = new Array();
    if (g_dataFunction == "PersonByCensusYear")
    {
        var url = callbackURL(g_historicJHSite, g_returnAction, "people-in-jamaica") + "&Value=" + g_returnID;
    }
    else
    {
        if (g_dataFunction == "VitalRecordsByPersonID")
        {
		    parmArray[0] = "PersonID";
		    parmArray[1] = g_returnID;
        }
	    else
	    {
	        parmArray[0] = g_lastName;
	        parmArray[1] = g_firstName;
	        parmArray[2] = g_middleName;
	        parmArray[3] = g_suffix;
	        parmArray[4] = g_prefix;
	        parmArray[5] = g_personOption;
	    }
	    var url = callbackURL(g_historicJHSite, g_returnAction, "people-in-jamaica") + "&parms=" + parmArray;
    }
	window.open(url, "_self");
}
//**********************************************************************************************************************************************
function createHeadings(stats)
{
	  // Insert a row into the header.
	  tr=document.createElement('tr');
	  tr.id = "heading";
	  tr.style.display = g_hideRow;
      document.getElementById('tbl_bdy').appendChild(tr);
	  // Insert cells into the header row.
	  for (i=2; i<stats.length; i++)
	  {
	      th = document.createElement('th');
   	      th.onclick = showFirstRecords;
	      th.innerHTML = stats[i];
	      th.style.padding = "4px";  // css is not working for all properties
	  	  th.style.background = "#8dbdd8";
	  	  th.style.border = "1px solid #FFF";
	  	  th.style.font  = "14px helvetica";
          document.getElementById("heading").appendChild(th);
	  }
}
//**********************************************************************************************************************************************
function GetMultipleIds(personDataURL, tableName, multipleIDs, sortLastName)
{
    if (dataHttp.readyState == 4 || dataHttp.readyState == 0) // proceed only if the xmlHttp object isn't busy
    {
    	var url=personDataURL + "&TableName=" + tableName + "&multipleIDs=" + multipleIDs + "&SortLastName=" + sortLastName + "&tmpl=component";
    	dataHttp.open("GET", url, true); 
    	g_alreadyMultipleIDs = false;
    	dataHttp.onreadystatechange = handleRecordIDsServerResponse;
    	dataHttp.send(null);
    }
    else // if the connection is busy, try again after one half second 
    {
        setTimeout('getMultipleIDs(personDataURL, tableName, multipleIDs, sortLastName)', 500);
    }
}
//**********************************************************************************************************************************************
function getVitalRecordsDataByPersonID(personDataURL,personID)
{
    if (xmlHttp.readyState == 4 || xmlHttp.readyState == 0) // proceed only if the xmlHttp object isn't busy
    {
    	g_VitalRecordsPersonID = personID;
    	var url=personDataURL + "&personID=" + personID + "&tmpl=component";
        xmlHttp.open("GET", url, true); 
        xmlHttp.onreadystatechange = handleServerResponse;
        xmlHttp.send(null);
    }
    else // if the connection is busy, try again after one half second 
    {
        setTimeout('getVitalRecordsDataByPersonID(personDataURL,PersonID)', 500);
    }
}
//**********************************************************************************************************************************************
function GetCensusData(personDataURL, censusYear, censusPage)
{
    if (xmlHttp.readyState == 4 || xmlHttp.readyState == 0) // proceed only if the xmlHttp object isn't busy
    {
        var url = personDataURL + "&censusYear=" + toString(censusYear) + "&censusPage=" + toString(censusPage) + "&tmpl=component";
        xmlHttp.open("GET", url, true);
        xmlHttp.onreadystatechange = handleServerResponse;
        xmlHttp.send(null);
    }
    else // if the connection is busy, try again after one half second 
    {
        setTimeout('GetCensusData(personDataURL, personOption, censusPage)', 500);
    }
}
//**********************************************************************************************************************************************
function getPersonData(personDataURL,searchOption,lastName,firstName,middleName,suffix,prefix,personOption)
{
    if (xmlHttp.readyState == 4 || xmlHttp.readyState == 0) // proceed only if the xmlHttp object isn't busy
    {
    	g_lastName = lastName;
    	g_firstName = firstName;
    	g_middleName = middleName;
    	g_suffix = suffix;
    	g_prefix = prefix;
    	g_personOption = personOption;
    	url=personDataURL+"&searchOption="+searchOption+"&lastName="+toString(lastName)+"&firstName="+toString(firstName)+"&middleName="+toString(middleName)+
	                      "&suffix="+toString(suffix)+"&prefix="+toString(prefix)+"&personOption="+personOption+"&tmpl=component";
        xmlHttp.open("GET", url, true); 
        xmlHttp.onreadystatechange = handleServerResponse;
        xmlHttp.send(null);
    }
    else // if the connection is busy, try again after one half second 
    {
        setTimeout('getPersonData(personDataURL,searchOption,lastName,firstName,middleName,suffix,prefix)', 500);
    }
}
//**********************************************************************************************************************************************
function rowProperties(rowCount)
{
    var oddRow = false;
    if ((rowCount + 1) % 2 == 0)
    {
        tr.className = "even";
        tr.onmouseout = function ()
        { 
        	this.className = "even";
        }
    }
    else
    {
    	oddRow = true;
    	tr.className = "odd";
    	tr.onmouseout = function() 
        { 
        	this.className = "odd";
        }
    }
    tr.onmouseover = function() 
    { 
    	this.className = "mouseover"; 
    }
}
//**********************************************************************************************************************************************
function addRow(rowNum) 
{
	tr=document.createElement('tr');
    tr.id = rowNum;
	tr.style.display = g_hideRow;
    tr.onclick = elementClicked;
    var oddRow = false;
    rowProperties(rowNum);
    for (var curField = 1;curField < g_numFields;curField++)
    {
    	var td=document.createElement('td');
    	tr.style.display = g_hideRow;
    	var span=document.createElement('span');
    	span.className = "whitespace";
        span.appendChild(document.createTextNode(rowNum));
        td.appendChild(span);
        tr.appendChild(td);
    }
    document.getElementById('tbl_bdy').appendChild(tr);
}
//**********************************************************************************************************************************************
function elementClicked()
{
    if (g_dataFunction == 'PersonByCensusYear') 
    {
        ShowPersonFamily(this.id, "PersonFamilyFromCensus");
        //ShowCensusImage(this.id);
    }
    else
    if (g_dataFunction == 'PersonByName')
    {
		ShowPersonFamily(this.id, "PersonFamily");
    }
	else
	if (g_dataFunction == 'VitalRecordByName' || g_dataFunction == 'VitalRecordsByPersonID')
    {
        ShowVitalRecord(callbackURL(g_historicJHSite, "VitalRecordByID"), this.id);
    }
	else
	if (g_dataFunction == 'CivilWarVeterans')
	{
		ShowPersonFamily(this.id, "PersonFamilyFromCivilWar");
	}
}
//**********************************************************************************************************************************************
function ShowCensusImage(PersonID)
{
    setCookie("JamaicaHFPage", g_currentPage);
}
//**********************************************************************************************************************************************
function ShowPersonFamily(PersonID, familyOption)
{
	setCookie("JamaicaHFPage",g_currentPage);
	gotPhotos = false;
    photos = "";
    parmArray = new Array();
    parmArray[0] = "PersonID";
    parmArray[1] = PersonID;
	parmArray[2] = g_currentPage;
	url = callbackURL(g_historicJHSite, familyOption, "people-in-jamaica") + "&parms=" + parmArray;
    window.open(url, "_self");
}
//**********************************************************************************************************************************************
function firstRow(page) 
{
	return (g_currentPage-1) * g_numRowsOnPage + 2;  // 1 relative-row-1 is the column headings row 
}
//**********************************************************************************************************************************************
function finalRow(page, firstRowDisplayed) 
{
    var finalRowDisplayed = firstRowDisplayed + g_numRowsOnPage-1;
    var maxNumRows = g_numPeople+1;
    if (finalRowDisplayed > maxNumRows)
    {
    	finalRowDisplayed = maxNumRows;
    }
    return finalRowDisplayed;
}
//**********************************************************************************************************************************************
function showRecords(page)
{
	var numRowsDisplayed = 0;
	for (var i = 0; i < g_numRowsOnThisPage; i++)
	{
		tr = g_table.rows[numRowsDisplayed+1];
		rowData = g_tableData[i+2].split(';');
	    tr.id = rowData[0];
	    for (var curField = 1;curField < g_numFields;curField++)
	    {
	        tr.cells[curField-1].childNodes[0].childNodes[0].data = rowData[curField];  	
	    	tr.style.display = g_showRow;
        }
		numRowsDisplayed++;
	}
	var div1 = document.getElementById("gridId");
	var height = (numRowsDisplayed + 1) * 27 + 8;
	div1.style.height = height + "px";
	var div2 = document.getElementById("gridIdRemaining");
	div2.style.height = (450 - height) + "px";
	for (var j = numRowsDisplayed + 1; j <= g_numRowsOnPage; j++)
	{
	    if (j < g_table.rows.length)
	    {
	        tr = g_table.rows[j];
	        tr.style.display = g_hideRow;
	    }
	}
}
//**********************************************************************************************************************************************
function showPage(page) 
{
	g_currentPage = page;
    showNavigation();
	showRecords(g_currentPage);
}
//**********************************************************************************************************************************************
function showDots(page)
{
	var a = document.createElement('a');
	a.innerHTML = "....";
	a.id = page;
	a.type = "text";
	a.onclick = pageNumber;
  	a.className = "grid-navigation-dots"
    document.getElementById('pageNumber').appendChild(a);
}
//**********************************************************************************************************************************************
function showPageNumber(page)
{
	var a = document.createElement('a');
	a.innerHTML = page;
	a.id = page;
	a.type = "button";
	if (page == g_currentPage)
    	a.className = "grid-navigation-item-selected";
	else
    	a.className = "grid-navigation-item-selectable"
	a.onclick = pageNumber;
    document.getElementById('pageNumber').appendChild(a);
}
//**********************************************************************************************************************************************
function deletePageNumbers()
{
	var thisOne = document.getElementById("pageNumber");
	var items = thisOne.getElementsByTagName("a");
	var num = items.length;
	for (var i = 0;i < num;i++)
	{
		thisOne.removeChild(items[0]);
	}
}
//**********************************************************************************************************************************************
function showingRecords()
{
	var firstRowDisplayed = firstRow(g_currentPage);
	var finalRowDisplayed = finalRow(g_currentPage, firstRowDisplayed);
	str = "Records " + (firstRowDisplayed-1) + " to " + (finalRowDisplayed-1) + " of " + g_numPeople;
	document.getElementById("showingRecords").innerHTML = str;
}
//**********************************************************************************************************************************************
function showPagesBeforeBlock(firstPageInBlock, numBetweenPages)
{
	var firstPageBeforeBlock = numBetweenPages;
	while (firstPageBeforeBlock < firstPageInBlock)
	{
    	showPageNumber(firstPageBeforeBlock);
		firstPageBeforeBlock += numBetweenPages;
	}
}
//**********************************************************************************************************************************************
function showPagesBlock(firstPageInBlock,lastPageInBlock)
{
	for (var i=firstPageInBlock;i <= lastPageInBlock;i++)
	{
    	showPageNumber(i);
	}
}
//**********************************************************************************************************************************************
function showPagesAfterBlock(lastPageInBlock, numBetweenPages)
{
	var firstPageAfterBlock = g_numPages;
	if (numBetweenPages != 0)
	{
    	while (firstPageAfterBlock > lastPageInBlock)
	    {
		    firstPageAfterBlock -= numBetweenPages;
	    }
	}
    if (firstPageAfterBlock < g_numPages)
    {
		if (lastPageInBlock < (g_numPages-1))
		{
       	    showDots(maxNum);
		}
	    while (firstPageAfterBlock < g_numPages)
	    {
		    firstPageAfterBlock += numBetweenPages;
    	    showPageNumber(firstPageAfterBlock);
	    }
	}
}
//**********************************************************************************************************************************************
function showNavigation()
{
	showingRecords();
	deletePageNumbers();
	if (g_numPages <= g_numPagesInBlock)
	{
		showPagesBlock(1,g_numPages);
	}
	else
	{
		var numBetweenPages = Math.floor((g_numPages - g_numPagesInBlock)/6)
		if (numBetweenPages == 0)
		{
			g_numPagesInBlock = g_numPages;
			showPagesBlock(1,g_numPages);
		}
		else
		{
    		if (g_firstPageInBlock > 1)
	    	{
    	    	showPageNumber(1);
    		    if (g_firstPageInBlock > 2)
    		    {
            	    showPagesBeforeBlock(g_firstPageInBlock,numBetweenPages);
    			    showDots(minNum);
    		    }
		    }
    	    showPagesBlock(g_firstPageInBlock,g_lastPageInBlock);
		    showPagesAfterBlock(g_lastPageInBlock, numBetweenPages);
		}
	}
}
//**********************************************************************************************************************************************
function toString(str)
{
	if (str == undefined || str.length == 0)
	{
		str = " ";
	}
	return str;
}
//**********************************************************************************************************************************************
function showFirstRecords()
{
	showRecords(g_currentPage);
	g_currentPage = 1;
	setTimeout('showRecords(1)', 500);  // g_showRow = "";
}
//**********************************************************************************************************************************************
function changeRecordsOnPage()
{
	var recordsOnPage = document.getElementById("recordsOnPage").innerHTML;
}
//**********************************************************************************************************************************************
function setBlockLocation(page)
{
    if (page < g_numPagesInBlock)
    {
    	g_firstPageInBlock = 1;
    	g_lastPageInBlock = g_numPagesInBlock;
    }
    else
    if (page > (g_numPages - g_numPagesInBlock))
    {
    	g_firstPageInBlock = (g_numPages - g_numPagesInBlock)+1;
    	g_lastPageInBlock = g_numPages;
    }
    else
    {
    	halfBlock = Math.floor(g_numPagesInBlock / 2);
    	g_firstPageInBlock = page - halfBlock;
    	g_lastPageInBlock = page + halfBlock;
    }
}
//**********************************************************************************************************************************************
function nextBlock()
{
	g_firstPageInBlock = g_lastPageInBlock +1;
	g_lastPageInBlock = g_firstPageInBlock + g_numPagesInBlock - 1;
	if (g_lastPageInBlock >= g_numPages)
	{
		g_lastPageInBlock = g_numPages;
		g_firstPageInBlock = g_numPages - g_numPagesInBlock + 1;
		page = g_numPages;
	}
	else
	{
    	halfBlock = Math.floor(g_numPagesInBlock / 2);
    	page = g_firstPageInBlock + halfBlock;
	}
	return page;
}
//**********************************************************************************************************************************************
function prevBlock()
{
	g_lastPageInBlock = g_firstPageInBlock - 1;
	g_firstPageInBlock = g_lastPageInBlock - g_numPagesInBlock + 1;
	if (g_firstPageInBlock <= 1)
	{
		g_firstPageInBlock = 1;
		g_lastPageInBlock = g_numPagesInBlock;
		page = 1;
	}
	else
	{
    	halfBlock = Math.floor(g_numPagesInBlock / 2);
    	page = g_firstPageInBlock + halfBlock;
	}
	return page;
}
//**********************************************************************************************************************************************
function pageNumber()
{
	var page = toInt(this.id);
	if (page == minNum)
	{
		page = prevBlock();
	}
	else
	if (page == maxNum)
	{
		page = nextBlock();
	}
	else
	if (page < g_firstPageInBlock || page > g_lastPageInBlock)
	{
		setBlockLocation(page);
	}
	g_currentPage = page;
 	getPageData();
}
//**********************************************************************************************************************************************
function nextPage()
{
	var page = g_currentPage + 1;
	if (page > g_numPages)
	{
		page = 1;
		g_firstPageInBlock = 1;
		g_lastPageInBlock = g_firstPageInBlock + g_numPagesInBlock - 1;
		if (g_lastPageInBlock > g_numPages)
		{
			g_lastPageInBlock = g_numPages;
		}
	}
	else
	if (page > g_lastPageInBlock)
	{
		g_firstPageInBlock ++;
		g_lastPageInBlock ++;
	}
	g_currentPage = page;
 	getPageData();
}
//**********************************************************************************************************************************************
function calcNumPages()
{
	var numPages = Math.floor(g_numPeople / g_numRowsOnPage);
	var remainder = g_numPeople % g_numRowsOnPage;
	if (remainder != 0)
		numPages++;
	return numPages;
}
//**********************************************************************************************************************************************
function prevPage()
{
	var page = g_currentPage - 1;
	if (page < 1)
	{
		page = g_numPages;
		g_firstPageInBlock = page - g_numPagesInBlock + 1;
		if (g_firstPageInBlock < 1)
		{
			g_firstPageInBlock = 1;
		}
		g_lastPageInBlock = page;
	}
	else
	if (page < g_firstPageInBlock)
	{
		g_firstPageInBlock --;
		g_lastPageInBlock --;
	}
	g_currentPage = page;
 	getPageData();
}
//**********************************************************************************************************************************************
function loadFirstPage()
{
    g_numPages = calcNumPages();
    var numRowsToShow = (g_numPeople < g_numRowsOnPage) ? g_numPeople : g_numRowsOnPage;
	for (var i = 1; i <= numRowsToShow; i++)
	{
		addRow(i);
	}
}
//**********************************************************************************************************************************************
function createIDList(numRecords)
{
	g_idList = new Array();
	for (var i = 0; i < numRecords; i++)
	{
		var personData = g_tableData[i+2].split(';');
		g_idList[i] = personData[0];
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
        alert("There was a problem accessing the server: " + xmlHttp.status);
        return;
    }
    if (xmlHttp.responseText.length != 0 && !g_alreadyGotData)
    {
        g_tableData = xmlHttp.responseText.split('|'); 
	   	if (g_tableData.length > 1) // firefox processes this request twice
	   	{
            var stats = g_tableData[1].split(';'); // Person[0] is the HTML at the beginning of the string
    	   	if (stats.length > 1) // firefox processes this request twice
            {
    	        g_numPeople = toInt(stats[0]);
   	            g_numFields = toInt(stats[1]);
    	        if (g_numPeople == 0)
    	        {
    	            alert("No Persons Found");
    	            previousScreen();
                }
                else
          	  	if (g_tableData.length >= (g_numPeople + 3))
                {
                    g_alreadyGotData = true;
                    createIDList(g_numPeople);
        	        createHeadings(stats);
        	        loadFirstPage();
                 	getPageData();
                }
            }
        }
    }
}
//**********************************************************************************************************************************************
function handleRecordIDsServerResponse()
{   // move forward only if the transaction has completed
    if (dataHttp.status == 0) // status of 200 indicates the transaction completed successfully
    {
        return;
    }
    else
    if (dataHttp.status != 200) // status of 200 indicates the transaction completed successfully
    {
        alert("There was a problem accessing the server: " + dataHttp.status);
        return;
    }
    if (dataHttp.responseText.length != 0 && !g_alreadyMultipleIDs)
    {
        g_tableData = dataHttp.responseText.split('|'); 
	   	if (g_tableData.length > 1) // firefox processes this request twice
	   	{
            var stats = g_tableData[1].split(';'); // Person[0] is the HTML at the beginning of the string
    	   	if (stats.length > 1) // firefox processes this request twice
            {
    	   		g_numRowsOnThisPage = toInt(stats[0]);
          	  	if (g_tableData.length >= (g_numRowsOnThisPage + 3))
                {
    	   		    g_alreadyMultipleIDs = true;
    	   		    var tr = document.getElementById("heading");
    	   		    tr.id = "heading";
    	   		    tr.style.display = g_showRow;
    	   		    showPage(g_currentPage);
    	   		}
            }
        }
    }
}
//**********************************************************************************************************************************************
