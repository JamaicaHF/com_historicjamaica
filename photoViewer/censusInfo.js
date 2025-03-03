var g_firstTime = true;
var g_tableID;
var g_numCensusPageRows;
var xmlInfoHttp;
var origHeight;
var height;
var title;
var maxTextLength;
var subcategoryAlreadyGotInfo;

//**********************************************************************************************************************************************
function CensusInfo(censusYear)
{
    PrepareInfoPage("Choose Page From " + censusYear + " Census");
    var numValues = NumPages(toInt(censusYear));
    g_numCensusPageRows = displayCensusInfo(censusYear, numValues);
    height = origHeight + g_numCensusPageRows * 18 + 20;
    var infoWindowWidth = 300;
	g_pageOfCensus = 0;
	if (CensusPersonYears(censusYear))
    {
        height += 20;
        AddButton("Show All People on " + g_yearOfCensus + " Census", 300, "infoBlock", ButtonClicked);
    }
    originalSizing(height, infoWindowWidth, g_pictureHeight);
}
//**********************************************************************************************************************************************
function CensusPersonYears(censusYear) 
{
    return (censusYear == 1850 || 
	        censusYear == 1860 || 
    		censusYear == 1870 || 
    		censusYear == 1880 || 
    		censusYear == 1900 ||
            censusYear == 1910 || 
    		censusYear == 1920 || 
    		censusYear == 1930 || 
    		censusYear == 1940 || 
    		censusYear == 1950);
}
//**********************************************************************************************************************************************
function CategoryInfo(category, categoryName) 
{
    title = categoryName;
    xmlInfoHttp = createXmlHttpRequestObject();
    getSubcategoryData(category);
}
//**********************************************************************************************************************************************
function DisplayCategoryValues(categoryValues)
{
    PrepareInfoPage(title);
    var numRecords = categoryValues[1];
    g_numCensusPageRows = displayCategoryValueInfo(categoryValues);
    height = origHeight + g_numCensusPageRows * 18 + 40;
    var infoWindowWidth = maxTextLength * 7 + 110;
    if (categoryId > 2) 
	{
        AddButton("All " + title, infoWindowWidth, "infoBlock", CategoryClick);
    }
    originalSizing(height, infoWindowWidth, g_pictureHeight);
}
//**********************************************************************************************************************************************
function PrepareInfoPage(title) 
{
    document.getElementById("slides1").style.display = "none";
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
    parmArray[1] = g_yearOfCensus;
    parmArray[2] = g_pageOfCensus;
    var url = callbackURL(g_historicJHSite, "PersonCensus", "people-in-jamaica") + "&parms=" + parmArray;
    window.open(url, "_self");
}
//**********************************************************************************************************************************************
function displayCategoryValueInfo(categoryValues) 
{
    var newTableID = "Category Values";
    g_tableID = newTableID;
    CreateTable(newTableID);
    var numValues = categoryValues[1];
    var numColumns = Math.ceil(numValues / 20);
    var numRows = Math.ceil(numValues / numColumns);
    var value1 = 2;
    var value2 = numRows + 2;
    var value3 = numRows * 2 + 2;
    var value = 0;
    maxTextLength1 = 0;
    maxTextLength2 = 0;
    maxTextLength3 = 0;
    for (var i = 0; i < numRows; i++)
    {
        var categoryValueInfo = categoryValues[value1++].split(';')
        var valueId1 = categoryValueInfo[0];
        var strValue1 = categoryValueInfo[1];
        var textLength = strValue1.length;
        if (textLength > maxTextLength1)
        {
            maxTextLength1 = textLength;
        }
        value++;
        var valueId2 = 0;
        var strValue2 = "";
        if (numColumns > 1 && value < numValues)
        {
            var categoryValueInfo = categoryValues[value2++].split(';')
            valueId2 = categoryValueInfo[0];
            strValue2 = categoryValueInfo[1];
            value++;
            var textLength = strValue2.length;
            if (textLength > maxTextLength2) {
                maxTextLength2 = textLength;
            }
        }
        strValue3 = "";
        if (numColumns > 2 && value < numValues) {
            var categoryValueInfo = categoryValues[value3++].split(';')
            var strValue3 = categoryValueInfo[1];
            value++;
            var textLength = strValue3.length;
            if (textLength > maxTextLength3) {
                maxTextLength3 = textLength;
            }
        }
        AddTwoFieldInfo(newTableID, i + 1, strValue1, strValue2, strValue3, false, numColumns);
        SetCategoryValueOnClick(i + 1, valueId1, valueId2);
    }
    maxTextLength = maxTextLength1 + maxTextLength2 + maxTextLength3;
    if (maxTextLength < 20)
    {
        maxTextLength = 20;
    }
    return numRows;
}
//**********************************************************************************************************************************************
function displayCensusInfo(censusYear, numValues) {
    var newTableID = "Census" + censusYear;
    g_tableID = newTableID;
    CreateTable(newTableID);
    var numColumns = Math.ceil(numValues / 20);
    var numRows = Math.ceil(numValues / numColumns);
    var value1 = 0;
    var value2 = numRows;
    var value = 0;
    for (var i = 0; i < numRows; i++) {
        var strValue1 = SetValue(++value1);
        value++;
        var strValue2 = "";
        if (numColumns > 1 && value < numValues) {
            strValue2 = SetValue(++value2);
            value++;
        }
        AddTwoFieldInfo(newTableID, value1, strValue1, strValue2, "", false, numColumns);
        SetCencusOnClick(value1);
    }
    return numRows;
}
//**********************************************************************************************************************************************
function SetCategoryValueOnClick(rowNum, categoryValueID1, categoryValueID2)
{
    var nodes = document.getElementById("tr" + rowNum).childNodes;
    for (var i = 0; i < nodes.length; i++) 
    {
        nodes[i].value = (i == 0) ? categoryValueID1 : categoryValueID2;
        nodes[i].onclick = CategoryValueClicked;
        nodes[i].style.cursor = "pointer";
    }

}
//**********************************************************************************************************************************************
function SetCencusOnClick(rowNum) 
{
    var buttonParentNode = document.getElementById("slideimage1");
	var inputNode = document.getElementById("censusButton");
	if (inputNode != null)
	{
    	buttonParentNode.removeChild(inputNode);
	}
    var nodes = document.getElementById("tr" + rowNum).childNodes;
    for (var i = 0; i < nodes.length; i++)
    {
        nodes[i].onclick = CensusPageClicked;
        nodes[i].style.cursor = "pointer";
    }
}
//**********************************************************************************************************************************************
function CensusPageClicked() 
{
    var id = this.id;
    var indexOfTd = id.indexOf("td");
    if (indexOfTd > 0) {
        document.getElementById("InfoWindow").style.display = "none";
        g_pageOfCensus = GetPageFromID(id, indexOfTd);
        DisplayCensusImage();
    }
}
//**********************************************************************************************************************************************
function DisplayCensusImage() 
{
    ShowSingleImage(CensusPhotoName(g_yearOfCensus, g_pageOfCensus));
	if (CensusPersonYears(g_yearOfCensus))
	{
	    var message = "Show All People on " + g_yearOfCensus + " Census, Page " + g_pageOfCensus;
        AddButton(message, 400, "slideimage1", ButtonClicked);
	}
    var censusYear = document.getElementById(g_yearOfCensus + "text");
    censusYear.innerHTML = g_yearOfCensus + " Census " + " - Page " + g_pageOfCensus;
}
//**********************************************************************************************************************************************
function GetPageFromID(id, indexOfTd) {
    var rowNum = +id.substring(2, indexOfTd);
    var colNum = id.substring(indexOfTd + 2, id.length);
    return (colNum == 2) ? g_numCensusPageRows + rowNum : rowNum;
}
//**********************************************************************************************************************************************
function CensusPhotoName(year, page) {
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
function getSubcategoryData(categoryId) 
{
    // proceed only if the xmlInfoHttp object isn't busy
    if (xmlInfoHttp.readyState == 4 || xmlInfoHttp.readyState == 0) 
    {
        url = callbackURL(g_historicJHSite, "CategoryInfoValues", "people-in-jamaica") + "&categoryID=" + categoryId + "&tmpl=component";
        subcategoryAlreadyGotInfo = false;
        xmlInfoHttp.open("GET", url, true);
        xmlInfoHttp.onreadystatechange = handleSubcategoryServerResponse;
        xmlInfoHttp.send(null);
    }
    else // if the connection is busy, try again after one second 
    {
        setTimeout('getImageData(photoID)', 1000);
    }
}
//**********************************************************************************************************************************************
function handleSubcategoryServerResponse() 
{
    if (xmlInfoHttp.status == 200) // status of 200 indicates the transaction completed successfully
    {
        imageInfo = xmlInfoHttp.responseText;
        var foo = '' || undefined;
        if (xmlInfoHttp.responseText.length != 0 && !subcategoryAlreadyGotInfo) 
        {
            var categoryValues = xmlInfoHttp.responseText.split('|');
            if (categoryValues.length > 1) // firefox processes this request twice
            {
                var numRecords = toInt(categoryValues[1]);
    			if (categoryValues.length > numRecords + 1)
                {
                    subcategoryAlreadyGotInfo = true;
                    if (numRecords == 1)
                    {
                        document.getElementById("InfoWindow").style.display = "none";
                        getMenuData("CategoryID", g_currentMenu);
                    }
                    else
                    {
                        DisplayCategoryValues(categoryValues);
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
