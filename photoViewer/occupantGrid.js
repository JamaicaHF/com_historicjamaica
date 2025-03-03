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
var g_firstPageInBlock = 1;
var g_lastPageInBlock = g_numPagesInBlock;
var g_currentPage = 1;
var g_numPeople = 0;
var g_numFields = 0;
var g_numPages = 0;
var g_alreadyGotData = false;
var g_alreadyMultipleIDs = false;
var g_tableData;
var tr;
var th;
var g_searchOption;
var g_personOption;
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
var g_dataTable;
var g_historicJHSite;
var g_OccupantList;
//**********************************************************************************************************************************************
function loadOccupantTable()
{
	g_dataFunction = "PersonByName";
	g_dataTable = "person";
	g_firstPage = 1;
    var element = document.getElementById("tbl_head");
	ClearChildrenNodes(element);
    var element = document.getElementById("tbl_bdy");
	ClearChildrenNodes(element);
    g_table = document.getElementById("dataTable");
    loadFirstPage();
    createHeadings();
}
//**********************************************************************************************************************************************
function getPageData()
{
	var curID = (g_currentPage - 1) * g_numRowsOnPage;
	showPage(g_currentPage);
}
//**********************************************************************************************************************************************
function createHeadings()
{
	  // Insert a row into the header.
	  tr=document.createElement('tr');
	  tr.id = "heading";
	  tr.style.display = "";
      document.getElementById('tbl_head').appendChild(tr);
	  // Insert cells into the header row.
      th = document.createElement('th');
      th.innerHTML = "Occupants";
      th.style.padding = "4px";  // css is not working for all properties
  	  th.style.background = "#331a00";
  	  th.style.border = "1px solid #FFF";
  	  th.style.font  = "14px helvetica";
  	  th.style.color  = "white";
      document.getElementById("heading").appendChild(th);
	if (g_OccupantList.length > g_numRowsOnPage)
    {
	    tr.style.display = "none";
    	showNavigationHeadings();
	}
	else
	{
        document.getElementById("navigation").style.display = "none";
	}
    showPage(g_currentPage);
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
function GetCensusData(personDataURL, censusYear)
{
    if (xmlHttp.readyState == 4 || xmlHttp.readyState == 0) // proceed only if the xmlHttp object isn't busy
    {
        var url = personDataURL + "&censusYear=" + toString(censusYear) + "&tmpl=component";
        xmlHttp.open("GET", url, true);
        xmlHttp.onreadystatechange = handleServerResponse;
        xmlHttp.send(null);
    }
    else // if the connection is busy, try again after one half second 
    {
        setTimeout('GetCensusData(personDataURL, personOption)', 500);
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
function ShowPersonFamily(PersonID, familyOption)
{
	setCookie("JamaicaHFPage",g_currentPage);
	gotPhotos = false;
    photos = "";
    parmArray = new Array();
    parmArray[0] = "PersonID";
    parmArray[1] = PersonID;
	parmArray[2] = g_currentPage;
	url = callbackURL(g_historicJHSite, familyOption) + "&parms=" + parmArray;
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
	var curID = (g_currentPage - 1) * g_numRowsOnPage;
	var numRecordToShow = g_OccupantList.length - curID;
	if (numRecordToShow > g_numRowsOnPage)
	{
	    numRecordToShow = g_numRowsOnPage;
	}
	//var numRecordToShow = (g_OccupantList.length >= g_numRowsOnPage) ? g_numRowsOnPage : g_OccupantList.length;
	for (var i = 0; i < numRecordToShow; i++)
	{
		var index = curID + i;
	    text = g_OccupantList[index];
		if (text == "*Current Owner")
		{
		   i++;
    	   text = g_OccupantList[index] + " (Current Owner)";
		}
		else if (text == "*Recent Owners")
		{
		   i++;
    	   text = g_OccupantList[index];
		}
		tr = g_table.rows[numRowsDisplayed+1];
	    tr.id = "row" + index;
        tr.cells[0].childNodes[0].childNodes[0].data = text;  
		tr.style.display = "";
		numRowsDisplayed++;
	}
	var div1 = document.getElementById("gridId");
	var height = (numRowsDisplayed + 1) * g_numRowsOnPage + 8;
	div1.style.height = height + "px";
	var div2 = document.getElementById("gridIdRemaining");
	div2.style.height = (450 - height) + "px";
	tr = g_table.rows[numRowsDisplayed+1];
	for (var j = numRowsDisplayed + 1; j <= g_numRowsOnPage; j++)
	{
	    if (j < g_table.rows.length)
	    {
	        tr = g_table.rows[j];
	        tr.style.display = "none";
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
function showNavigationHeadings()
{
	document.getElementById("navigation").style.display = "";
	var navigationElements = document.getElementById("showingRecords");
    navigationElements.style.padding = "4px";  // css is not working for all properties
  	navigationElements.style.background = "#331a00";
  	navigationElements.style.border = "";
  	navigationElements.style.font  = "14px helvetica";
  	navigationElements.style.color  = "white";
	var nextpreviousarrowsElements = document.getElementById("nextpreviousarrows");
  	nextpreviousarrowsElements.style.background = "#331a00";
	
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
	var firstRowDisplayed = firstRow(g_currentPage);
	var finalRowDisplayed = finalRow(g_currentPage, firstRowDisplayed);
	var navigationElements = document.getElementById("showingRecords");
	str = "Occupants " + (firstRowDisplayed-1) + " to " + (finalRowDisplayed-1) + " of " + g_numPeople;
	navigationElements.innerHTML = str;
	//deletePageNumbers();
	//if (g_numPages <= g_numPagesInBlock)
	//{
	//	showPagesBlock(1,g_numPages);
	//}
	//else
	/*{
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
	}*/
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
	setTimeout('showRecords(1)', 500);
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
function calcNumPages()
{
	var numPages = Math.floor(g_OccupantList.length / g_numRowsOnPage);
	var remainder = g_numPeople % g_numRowsOnPage;
	if (remainder != 0)
		numPages++;
	return numPages;
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
function addRow(rowNum) 
{
	tr=document.createElement('tr');
	var rowId = "row" + rowNum;
    tr.id = rowId;
   	var td=document.createElement('td');
   	var span=document.createElement('span');
   	span.className = "whitespace";
    span.appendChild(document.createTextNode(rowId));
    td.appendChild(span);
    tr.appendChild(td);
    document.getElementById('tbl_bdy').appendChild(tr);
}
//**********************************************************************************************************************************************
function createIDList(numRecords)
{
	g_OccupantList = new Array();
	for (var i = 0; i < numRecords; i++)
	{
		var personData = g_tableData[i+2].split(';');
		g_OccupantList[i] = personData[0];
	}
}
//**********************************************************************************************************************************************
