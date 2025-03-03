var xmlMenuHttp;
var menuAlreadyGotInfo;
var categoryId;
var curImage;
var g_yearOfCensus;
var g_pageOfCensus;
const g_spaceBetweenImages = 10;

//**********************************************************************************************************************************************
function SetupPhotoMenu(g_menuList, infoTitle, year, page, schoolYear = "") 
{
    curImage = new Image();
    curImageArray = [];
    curImageArray.push(curImage);
	curImageArray[imgCount] = 1;
    xmlMenuHttp = createXmlHttpRequestObject();
	if (g_gradeFromPersonInfo == "0")
	{
        document.getElementById("backf2").style.display = "none";
	}
    document.getElementById("slides1").style.display = "none";
    document.getElementById("slides2").style.display = "none";
    document.getElementById("slides3").style.display = "none";
    document.getElementById("slides4").style.display = "none";
    document.getElementById("prevLink").style.display = "none";
    document.getElementById("nextLink").style.display = "none";
    var title = GetPageTitle(infoTitle);
    document.getElementById("titleLabel").innerHTML = title;
    document.getElementById("titleLabel").style.display = "inline";
    //SetMinimums();
    LoadPhotoOptions(g_menuList, infoTitle);
    if (infoTitle == "Census" && year != 0) 
    {
        g_yearOfCensus = year;
		g_pageOfCensus = page;
        if (g_pageOfCensus == 0) 
        {
            CensusInfo(g_yearOfCensus);
        }
        else 
        {
            g_fixedSize = true;           
            document.getElementById("photoSidebar").style.display = "";
            document.getElementById("backf2").style.display = "";
            DisplayCensusImage();
        }
    }
    else if (infoTitle == "School" && page != 0) 
    {
        personId = page;
		var grade = year;
		var personId = page;
        document.getElementById("photoSidebar").style.display = "";
		var menuElements = GetCorrectMenuElementForSchoolYear(g_menuList, schoolYear);
		SchoolInfo(menuElements[1], menuElements[0], grade, personId, schoolYear);
    }
    else 
    {
        PhotoInfoAndOptions();
    }
}
//**********************************************************************************************************************************************
function GetCorrectMenuElementForSchoolYear(g_menuList, schoolYear)
{
    var menuArray = g_menuList.split("|");
    if (!schoolYear)
	{
        var menuElements = menuArray[0].split(";");
	    return menuElements;
	}
	var index = 0;
	while ( index < menuArray.length)
	{
        var menuElements = menuArray[index].split(";");
		if (menuElements[0] == schoolYear)
		{
		    return menuElements;
		}
		index++
	}
    var menuElements = menuArray[0].split(";");
	return menuElements;
}
//**********************************************************************************************************************************************
function PhotoInfoAndOptions() 
{
    document.getElementById("slides1").style.display = "none";
    var textmessage = document.getElementById("textmessage");
	textmessage.style.display = "";
    var photoInfoAndOptions = document.createElement("div");
    photoInfoAndOptions.id = "photoInfoAndOptions";
    textmessage.appendChild(photoInfoAndOptions);
    var photoTitle = document.createElement("div");
    photoTitle.id = "photoTitle";
    photoTitle.setAttribute("class", "photoTitle");
    var textnode = document.createTextNode(GetPageTitle(g_infoTitle));
    photoTitle.appendChild(textnode);
    photoInfoAndOptions.appendChild(photoTitle);

    var photoText = document.createElement("div");
    photoText.setAttribute("class", "photoText");
    photoText.id = "photoText";
    switch (g_infoTitle) 
    {
        case "Maps":
            g_minimumPictureHeight = 500;
            g_minumumHeight = g_minimumPictureHeight + 25;
            photoText.innerHTML = MapsText(photoText);
            break;
        case "Census":
            g_minimumPictureHeight = 500;
            g_minumumHeight = g_minimumPictureHeight + 25;
            photoText.innerHTML = CensusText(photoText);
            break;
        case "School":
            g_minimumPictureHeight = 500;
            g_minumumHeight = g_minimumPictureHeight + 25;
            photoText.innerHTML = SchoolText(photoText);
            break;
        default:
            photoText.innerHTML = PhotosText(photoText);
            break;
    }
    photoInfoAndOptions.appendChild(photoText);
    ZoomOptionText();
    ShowZoomOption();
    document.getElementById("photoSidebar").style.display = "";
}
//**********************************************************************************************************************************************
function MapsText(photoText) {
    return "The menu on the left side of the screen is a list of Historical Maps of Jamaica. Click the map you wish to view.";
}
//**********************************************************************************************************************************************
function SchoolText(photoText) {
    return "The menu on the left side of the screen is the list of the years for which we have School Records. " +
           "When you click the menu item for a given year, a list of grades will be presented. " +
           "Select a grade from the list to see the students and teachers.";
}
//**********************************************************************************************************************************************
function CensusText(photoText) {
    return "The US government has taken the federal census every 10 years since 1790. " +
           "The menu on the left side of the screen is the list of the years for which the census has been released. " +
           "When you click the menu item for a given year, a list of page numbers will be presented. " +
           "Select a page from the list to see an image taken of the original US census record.";
}
//**********************************************************************************************************************************************
function PhotosText() {
    return "The menu on the left side of the screen is a list of photo Categories. " +
           "Clicking on the Category will either take you to a list of Subcategories or display the photos in that Category. " +
           "Clicking on the subcategory will display the photos in that subcategory. " +
           "Clicking the All Category button after the list of Subcategories will display all the photos for all Subcategories";
}
//**********************************************************************************************************************************************
function ZoomOptionText() 
{
    var photoInfoAndOptions = document.getElementById("photoInfoAndOptions");
    var mapsText = document.createElement("div");
    mapsText.setAttribute("class", "photoText");
    mapsText.innerHTML = "The '+' and '-' in the menu title box will allow you to either enlarge the " +
                         "image or zoom in and out depending on option you select below.";
    photoInfoAndOptions.appendChild(mapsText);
}
//**********************************************************************************************************************************************
function ShowZoomOption() 
{
    var photoInfoAndOptions = document.getElementById("photoInfoAndOptions");
    var radioButtonGroup = document.createElement("span");
    radioButtonGroup.setAttribute("class", "photoText");
    radioButtonGroup.id = "optionGroup";
    photoInfoAndOptions.appendChild(radioButtonGroup);
    g_fixedSize = GetZoomOptionFromCookie();
    var radio1 = document.createElement("input");
    radio1.type = "radio";
    radio1.id = "zoomButton";
    radio1.name = "zoomOptionGroup";
    radio1.value = "zoomButton";
    radio1.onclick = GetPhotoOptions
    var textnode1 = document.createTextNode("Zoom");

    var radio2 = document.createElement("input");
    radio2.type = "radio";
    radio2.id = "enlarge";
    radio2.name = "zoomOptionGroup";
    radio2.value = "Enlarge";
    radio2.onclick = GetPhotoOptions
    var textnode2 = document.createTextNode("Enlarge");

    if (g_fixedSize)
        radio1.checked = true;
    else
        radio2.checked = true;
    radioButtonGroup.appendChild(radio1);
    radioButtonGroup.appendChild(textnode1);
    radioButtonGroup.appendChild(radio2);
    radioButtonGroup.appendChild(textnode2);
}
//**********************************************************************************************************************************************
function GetPageTitle(infoTitle) 
{
    switch (infoTitle)
    {   
        case "Maps": return "Historic Maps";
        case "Census": return "US Goverment Census";
        case "School": return "School Records";
        default: return "Photos";
    }
}
//**********************************************************************************************************************************************
function LoadPhotoOptions(g_menuList, infoTitle) 
{
    RemoveChildren("info");
    var info = document.getElementById("info");
    imgArray = g_menuList.split("|");
    g_totalRecords = imgArray.length;
    for (i = 0; i < g_totalRecords; i++) 
	{
        var li = document.createElement('li');
        var photoInfo = imgArray[i].split(';');
        li.id = photoInfo[0];
        li.class = "li";
        var a = document.createElement('a');
        a.id = photoInfo[0] + "text";
        var textnode2 = document.createTextNode(photoInfo[1]);
        a.appendChild(textnode2);
        li.appendChild(a);
        li.onclick = menuClick;
        info.appendChild(li);
    }
	var infoHeight = 410;
	if (g_totalRecords < 19)
	{
	    infoHeight = g_totalRecords * 18 + 30;
	}
	if (infoTitle == "School")
	{
	    var heightStr = infoHeight.toString();
	    info.style.height = heightStr + "px";
	    info.style.overflowY = "auto";
	}
    SetFormHeight();
}
//**********************************************************************************************************************************************
function CategoryClick() 
{
    document.getElementById("InfoWindow").style.display = "none";
    getMenuData("CategoryID", categoryId);
}
//**********************************************************************************************************************************************
function CategoryValueClicked() 
{
    var id = this.id;
    var categoryValueID = this.value;
    document.getElementById("InfoWindow").style.display = "none";
    document.getElementById("slideimage1").style.display = "";
    getMenuData("CategoryValueID", categoryValueID);
}
//**********************************************************************************************************************************************
function getMenuData(idName, Id) 
{
    // proceed only if the xmlMenuHttp object isn't busy
    if (xmlMenuHttp.readyState == 4 || xmlMenuHttp.readyState == 0) 
    {
        url = callbackURL(g_historicJHSite, "CategoryValues") + "&" + idName + "=" + Id + "&" + "CategoryID" + "=" + categoryId + "&tmpl=component";
        menuAlreadyGotInfo = false;
        xmlMenuHttp.open("GET", url, true);
        xmlMenuHttp.onreadystatechange = handleMenuServerResponse;
        xmlMenuHttp.send(null);
    }
    else // if the connection is busy, try again after one second 
    {
        setTimeout('getMenuData(photoID)', 1000);
    }
}
//**********************************************************************************************************************************************
function handleMenuServerResponse() 
{
    if (xmlMenuHttp.status == 200) // status of 200 indicates the transaction completed successfully
    {
        imageInfo = xmlMenuHttp.responseText;
        var foo = '' || undefined;
        if (xmlMenuHttp.responseText.length != 0 && !menuAlreadyGotInfo) 
        {
            g_imageInfo = xmlMenuHttp.responseText.split('|');
            if (g_imageInfo.length > 1) // firefox processes this request twice
            {
                var numRecords = toInt(g_imageInfo[1]);
	    		if (g_imageInfo.length > numRecords + 1)
                {
                    var location = g_imageInfo.length-1;
                    g_imageInfo.splice(location, 1);
                    numRecords--;
                    menuAlreadyGotInfo = true;
                    LoadPhotos(removeTwoElements(xmlMenuHttp.responseText));
                }
            }
        }
    }
    else if (xmlMenuHttp.status != 0) // status of 200 indicates the transaction completed successfully
    {
        alert("There was a problem accessing the server: " + xmlMenuHttp.statusText);
    }
}
//**********************************************************************************************************************************************
function menuClick() 
{
    document.getElementById("slides1").style.display = "inline";
    GetOptionsAndRemovePhotoInfoAndOptions();
    if (g_infoTitle == "Maps")
    {
        ShowSingleImage(HFSinglePhoto(this.id));
        document.getElementById("slides1").style.display = "";
    }
    else if (g_infoTitle == "School") 
    {
        ClearPageNumber();
        SchoolInfo(this.innerText,this.id);
    }
    else if (g_infoTitle == "Census") 
    {
        if (+this.id != 1890) 
        {
            ClearPageNumber();
            g_yearOfCensus = this.id;
            CensusInfo(g_yearOfCensus);
        }
    }
    else 
    {
        categoryId = this.id;
        g_photoMenu = true;
        if (categoryId == 0)
        {
            if (!g_firstTime)
            {
                document.getElementById("InfoWindow").style.display = "none";
            }
            document.getElementById("slideimage1").style.display = "";
            getMenuData("CategoryID", categoryId);
        }
        else
        {
            CategoryInfo(categoryId, this.textContent);
        }
    }
}
//**********************************************************************************************************************************************
function HFSinglePhoto(photoID)
{
	var photoNum = toInt(photoID) + 1000000;
	var photoStr = photoNum.toString();
	str = "HF" +  photoStr.substring(1,7) + ".jpg";
	return str;
}
//**********************************************************************************************************************************************
function ShowSingleImage(photoName) 
{
    SetMinimums();
    g_pictureHeight = g_minumumHeight;
    url = g_HJ_Photos + photoName;
    curImage.src = url;
    if (g_fixedSize) 
    {
        SetFixedImage(curImage, "slides1");
        //setTimeout(function () { SetFixedImage(); }, 2000);
    }
    else 
    {
        curImage.height = g_pictureHeight + "px";
        var img = document.getElementById("slides1");
        img.src = curImage.src;
    }
}
//**********************************************************************************************************************************************
function ShowPhotoImage() 
{
    g_pictureHeight = g_minumumHeight;

    if (g_CurPhotoIsQRCode)
	{
      	SetAdjustableImage(0);
   	    SetAdjustableImage(1);
   	    SetAdjustableImage(2);
   	    SetAdjustableImage(3);
	}
	else
	{
        SetFixedImage(curImageArray[img1], "slides1");
        document.getElementById("ThenNow1").style.display = "none";
        document.getElementById("ThenNow2").style.display = "none";
        document.getElementById("ThenNow3").style.display = "none";
        document.getElementById("ThenNow4").style.display = "none";
        document.getElementById("slides2").style.display = "none";
        document.getElementById("slides3").style.display = "none";
        document.getElementById("slides4").style.display = "none";
        document.getElementById("textBox1").style.display = "none";
	}
}
//**********************************************************************************************************************************************
function SetThenNow(curImage, thenNowText)
{
   	var element = document.getElementById(thenNowText);
	element.innerHTML = curImage.title;
    element.style.display = "";
}
//**********************************************************************************************************************************************
function AlignImages() 
{
	var noOccupantsOrNotesToShow = (g_OccupantList.length == 0 && !Notes2Found() && curImageArray[imgCount] == 1)
    if (!g_CurPhotoIsQRCode || noOccupantsOrNotesToShow)
	{
	    g_CurPhotoIsQRCode = false;
		return;
	}
    if (curImageArray[imgCount] == 0)
	{
    	var left = 240 + g_spaceBetweenImages;
   	    var occupantTable = document.getElementById("occupantTable");
		if (g_OccupantList.length == 0)
		{
		    occupantTable.style.display = "none";
		}
		else
		{
	        occupantTable.style.left = left + "px";
		}
	    ShowAreaForText(left, 0);
	}
	else
    if (curImageArray[imgCount] == 1)
	{
	    AlignSingleImage(curImageArray[img1]);
	}
	else
    if (curImageArray[imgCount] == 4)
	{
	    AlignTwoImages(curImageArray[img1], curImageArray[img2], "slideimage1", "slideimage2");
	    AlignTwoImages(curImageArray[img3], curImageArray[img4], "slideimage3", "slideimage4");
    	var left = curImageArray[img1].width + 240 + g_spaceBetweenImages;
		document.getElementById("slideimage3").style.left = left + "px";
		document.getElementById("slideimage4").style.left = left + "px";
	}
    else if (curImageArray[imgCount] == 3)
	{
        var curImage1 = curImageArray[img1];
        var curImage2 = curImageArray[img2];
        var curImage3 = curImageArray[img3];
        AlignTwoImages(curImage1, curImage2, "slideimage1", "slideimage2");
        AlignThreeImagesHeight(curImage1, curImage2, curImage3);
	}
	else
	{
        var curImage1 = curImageArray[img1];
        var curImage2 = curImageArray[img2];
    	var widthArray = GetAdjustedPercent(curImage1.width, curImage2.width, curImage1.height, curImage2.height, g_minumumHeight + 200);
        var img1Width = widthArray[0];
        var img2Width = widthArray[1];
	    var alignByWidth = (img1Width * 2 < img2Width || img2Width * 2 < img1Width);
	    if (alignByWidth)
	    {
            AlignImagesWidth(widthArray, curImage1, curImage2);
		}
		else
        if (curImageArray[imgCount] == 2)
		{
            AlignTwoImages(curImage1, curImage2, "slideimage1", "slideimage2");
            AlignTwoImagesHeight(curImage1, curImage2);
		}
	}
}
//**********************************************************************************************************************************************
function AlignSingleImage(curImage1) 
{
	var heightArray = GetAdjustedPercent(curImage1.height, curImage1.height, curImage1.width, curImage1.width, g_minumumHeight);
	curImage1.height = heightArray[0];
	curImage1.width = heightArray[2];
	var left = curImage1.width + 240 + g_spaceBetweenImages;
	var occupantTable = document.getElementById("occupantTable");
	occupantTable.style.left = left + "px";
	ShowAreaForText(left, 0);
}
//**********************************************************************************************************************************************
function AlignTwoImages(curImage1, curImage2, element1Name, element2Name) 
{
	var heightArray = GetAdjustedPercent(curImage1.height, curImage2.height, curImage1.width, curImage2.width, g_minumumHeight);
	curImage1.height = heightArray[0];
	curImage2.height = heightArray[1];
	curImage1.width = heightArray[2];
	curImage2.width = heightArray[2];
	var element2 = document.getElementById(element2Name);
	var top = curImage1.height + 20 + g_spaceBetweenImages;
	element2.style.top = top + "px";
	var width = Math.trunc(heightArray[2]);
	element2.style.width = width + "px";
	var element1 = document.getElementById(element1Name);
	element1.style.width = width + "px";
}
//**********************************************************************************************************************************************
function AlignTwoImagesHeight(curImage1, curImage2) 
{
	var left = curImage1.width + 240 + g_spaceBetweenImages;
	left = ShowAreaForText(left, 0);
	var occupantTable = document.getElementById("occupantTable");
	occupantTable.style.left = left + "px";
}
//**********************************************************************************************************************************************
function AlignThreeImagesHeight(curImage1, curImage2, curImage3) 
{
	var image1Height = curImage1.height;
    var thenNowType = curImage3.textContent[0];
    var imageTop = (thenNowType == 'T') ? 20 : image1Height + 20 + g_spaceBetweenImages;
    var occupantTop = (thenNowType == 'T') ? image1Height + 20 + g_spaceBetweenImages : 20;
	var left = curImage1.width + 240 + g_spaceBetweenImages;
   	var widthArray = GetAdjustedPercent(curImage2.width, curImage3.width, curImage2.height, curImage3.height, g_minumumHeight + 200);
	var image3Width = widthArray[1];
	var image3Height = widthArray[2];
	var percentHeightDifference = image1Height / image3Height;
	curImage3.height = image3Height * percentHeightDifference;
	curImage3.width = image3Width * percentHeightDifference;
	var element = document.getElementById("slideimage3");
	var left = curImage1.width + 240 + 20;
	element.style.top = imageTop + "px";
	element.style.left = left + "px";
   	var div1 = document.getElementById("grid-body");
   	var div2 = document.getElementById("gridId");
    left = ShowAreaForText(left, image1Height + g_spaceBetweenImages);
	var occupantTable = document.getElementById("occupantTable");
	occupantTable.style.left = left + "px";
	var top = image1Height + g_spaceBetweenImages;
	occupantTable.style.top = occupantTop + "px";
}
function ShowAreaForText(left, photoAboveHeight)
{
    var textElement = document.getElementById("textBox1");
	var text = GetNotes2Text();
	if (text.length == 0)
	{
        textElement.style.display = "none";
	    return left;
	}
    textElement.style.display = "";
	var dataTable = document.getElementById("gridId");
	if (g_OccupantList.length <= 22)
	{
        document.getElementById("textBox1").style.left = left + "px";
        document.getElementById("textHeader").style.width = "400px";
        document.getElementById("areaForText").style.width = "400px";
    	document.getElementById("navigation").style.width = "400px";
	    var top = 0;
 		if (g_OccupantList.length != 0)
		{
	        top = OccupantTableHeight() + photoAboveHeight + 20 + g_spaceBetweenImages;
		}
   	    document.getElementById("textBox1").style.top = top + "px";
	}
	else
	{
   	    textElement.style.left = left + "px";
   	    left += 150 + g_spaceBetweenImages;
	}
    textElement = document.getElementById("areaForText");
	textElement.innerHTML = text;
	SetTextareaHeight(textElement);
    var numLines = textElement.innerHTML.length / 25;
	return left;
}
//**********************************************************************************************************************************************
function OccupantTableHeight() 
{
	if (g_OccupantList.length == 0)
	{
	    return 0;
	}
	var dataTable = document.getElementById("occupantTable");
   	var div1 = document.getElementById("gridId");
    return div1.clientHeight;
}
//**********************************************************************************************************************************************
function AlignImagesWidth(widthArray, curImage1, curImage2) 
{
	curImage1.width = widthArray[0];
	curImage2.width = widthArray[1];
	curImage1.height = widthArray[2];
	curImage2.height = widthArray[2];
	var element = document.getElementById("slideimage2");
	var left = curImage1.width + 240 + 20;
	element.style.top = "0px";
	element.style.left = left + "px";
	var text = GetNotes2Text();
	if (text.length > 0)
	{
	    var textElement = document.getElementById("slideimage1");
		var left = textElement.style.left;
        textElement = document.getElementById("slides1");
		var left = textElement.style.left;
        textElement = document.getElementById("textBox1");
        textElement.style.display = "";
	    textElement.style.left = "240px";
	    var top =  Math.trunc(widthArray[2]) + 30
	    textElement.style.top = top + "px";
    	if (g_OccupantList.length == 0)
        {
			var width = Math.trunc(widthArray[0] + widthArray[1] - 15);
            textElement = document.getElementById("textHeader");
        	textElement.style.width = width + "px";
            textElement = document.getElementById("areaForText");
        	textElement.style.width = width + "px";
    		textElement.innerHTML = text;
			SetTextareaHeight(textElement);
		}
		else
		{
            textElement = document.getElementById("textHeader");
        	textElement.style.width = "300px";
            textElement = document.getElementById("areaForText");
        	textElement.style.width = "300px";
    		textElement.innerHTML = text;
			SetTextareaHeight(textElement);
        	var occupantTable = document.getElementById("occupantTable");
	        occupantTable.style.left = 240 + 300 + g_spaceBetweenImages + "px";
	        occupantTable.style.top = top + 4 + "px";
		}
    }
}
//**********************************************************************************************************************************************
function SetTextareaHeight(textElement) 
{
  textElement.style.height = "1px";
  textElement.style.height = (textElement.scrollHeight)+"px";
}
//**********************************************************************************************************************************************
function GetNotes2Text()
{
    var text = "";
   	if (Notes2Found())
	{
        var textElement = document.getElementById("areaForText");
		var index = g_notesList.length - 1;
	    text = g_notesList[index];
	}
	return text;
}
//**********************************************************************************************************************************************
function Notes2Found()
{
   	return (g_notesList.length > 3 || g_notesList[0] == "*Notes2");
}
//**********************************************************************************************************************************************
function GetAdjustedPercent(value1X, value2X, value1Y, value2Y, minimumValue)
{
	var value1Z = value1X * minimumValue / value1Y;
	var value2Z = value2X * minimumValue / value2Y;
	var combinedValue = value1Z + value2Z;
	var percent = minimumValue / combinedValue;
	var adjustedValue1 = value1Z * percent;
	var adjustedValue2 = value2Z * percent;
	var adjustedValueCombined = adjustedValue1 + adjustedValue2;
	var value3 = minimumValue * percent;
    valueArray = [];
    valueArray.push(adjustedValue1);
    valueArray.push(adjustedValue2);
    valueArray.push(value3);
    return valueArray;
}
//**********************************************************************************************************************************************
function SetAdjustableImage(imgNum) 
{
	var imgNumber = imgNum + 1;
    var img = document.getElementById("slides" + imgNumber);
	var thenNowId = "ThenNow" + imgNumber;
    if (curImageArray[imgCount] > imgNum)
    {
	    curImage = curImageArray[imgNum];
        img.style.height = curImage.height + "px";
    	img.style.display = "";
        img.src = curImage.src;
    	SetThenNow(curImageArray[imgNum], thenNowId);
        document.getElementById("ThenNow1").style.display = "";
	}
	else
	{
	    img.style.display = "none";
	    var photoId = "2251";
     	var photoNum = toInt(photoId) + 1000000;
        var photoStr = photoNum.toString();
        img.src = g_HJ_Photos + "HF" +  photoStr.substring(1,7) + ".jpg";
        document.getElementById(thenNowId).style.display = "none";
	}
    img.style.left = "0px";
    img.style.top = "0px";
	img.alt = "JamaicaHF Photo";
}
//**********************************************************************************************************************************************
function SetFixedImage(curImage, slide) 
{
    var img = document.getElementById(slide);
    img.style.height = g_pictureHeight + "px";
    img.style.left = "0px";
    img.style.top = "0px";
	img.style.display = "";
	img.alt = "JamaicaHF Photo";
    img.src = curImage.src;
}
//**********************************************************************************************************************************************
function ClearPageNumber() 
{
    if (g_yearOfCensus == 0) return;
    var censusYear = document.getElementById(g_yearOfCensus + "text");
    censusYear.innerHTML = g_yearOfCensus + " Census ";
}
//**********************************************************************************************************************************************
function GetOptionsAndRemovePhotoInfoAndOptions(photoNum) {
    var element = document.getElementById("photoInfoAndOptions");
    if (element != null) {
        GetPhotoOptions();
        RemoveElementAndChildren("photoInfoAndOptions");
    }
}
//**********************************************************************************************************************************************
function GetPhotoOptions() 
{
    g_fixedSize = false;
    var allElems = document.getElementsByTagName('input');
    for (i = 0; i < allElems.length; i++) 
    {
        if (allElems[i].type == 'radio')
        {
            if (allElems[i].checked) 
            {
                if (allElems[i].value == 'zoomButton') 
                {
                    g_fixedSize = true;
                }
            }
        }
    }
    setCookie("zoomOption", g_fixedSize);
}
//**********************************************************************************************************************************************
function SetMinimums() 
{
    g_minumumHeight = g_minimumPictureHeight + 25;
    g_pictureHeight = g_minumumHeight;
    var element = document.getElementById("slides1");
    element.style.height = g_pictureHeight + "px";
    SetFormHeight();
    if (map == null) //     mouse down and mouse move to move the window position
    {                //     mouse wheel up/down to zoom in/out
                     //     navigation elements at the top left corner
        map = new SpryMap(
        {
            id: "slides1",
            height: g_minumumHeight,
            width: 889,
            startX: 200,
            startY: 200,
            cssClass: "mappy"
        });
    }
    var element = document.getElementById("slides2");
    element.style.height = g_pictureHeight / 2 + "px";
}
//**********************************************************************************************************************************************
function removeTwoElements(str) 
{
    var n = str.indexOf("|") + 1;
    var str1 = str.substring(n);
    var n2 = str1.indexOf("|") + 1;
    var str2 = str1.substring(n2);
    var last = str2.lastIndexOf("|");
    var str3 = str2.substring(0, last);
    return str3;
}
//**********************************************************************************************************************************************
function GetCanvasWidth() 
{
    var screenWidth = 0;
	var left = 0;
	var width = 0;
    if (g_OccupantList.length > 0)
	{
        var occupantTable = document.getElementById("occupantTable");
        var occupantLeft = occupantTable.style.left.replace("px", "");
	    left = parseInt(occupantLeft);
		width = (maxOccupantTextLength * 6) + 10;
    }
	var text = GetNotes2Text();
	if (text.length != 0)
	{
        var textElement = document.getElementById("textBox1");
	    var textLeft = textElement.style.left.replace("px", "");
		var textLeftInt = parseInt(textLeft);
		if (left == 0)
		{
		    left = textLeftInt;
		}
		else if (textLeftInt == left)
		{
            textElement = document.getElementById("areaForText");
    	    var textWidth = textElement.style.width.replace("px", "");
	    	var textWidthInt = parseInt(textWidth) + 20;
		    width = (textWidthInt > width) ? textWidthInt : width;
		}
	}
	if (width == 0)
	{
		width = WidthFromPhotos();
	}
    screenWidth = left + width;
	return screenWidth;
}
//**********************************************************************************************************************************************
function WidthFromPhotos()
{
	var elementTop = InitElementTop();
	var	elementWidth = InitElementWidth();
    var row1Width = 0;
    var row2Width = 0;
    var i;
    for (i = 0; i < 4; i++) 
	{
	    var top = elementTop[i];
		var width = elementWidth[i];
	    if (top == 0)
		{
		    row1Width += width;
		}
		else
		{
		    row2Width += width;
		}
	}
	var canvasWidth = (row1Width > row2Width) ? row1Width : row2Width;
 	return canvasWidth + 240 + (g_spaceBetweenImages * 2);
}
//**********************************************************************************************************************************************
function InitElementTop() 
{
	var elementTop = [0, 0, 0, 0];
	elementTop[0] = InitTop(1);
	elementTop[1] = InitTop(2);
	elementTop[2] = InitTop(3);
	elementTop[3] = InitTop(4);
	return elementTop;
}
//**********************************************************************************************************************************************
function InitTop(num) 
{
    if (curImageArray[imgCount] >= num)
	{
	    var slideimage = "slideimage" + num;
    	element = document.getElementById(slideimage);
		return Remove_px(element.style.top);
	}
	return 0;
}
//**********************************************************************************************************************************************
function InitElementLeft() 
{
	var elementLeft = [0, 0, 0, 0, 0, 0];
	elementLeft[0] = InitLeft(1);
	elementLeft[1] = InitLeft(2);
	elementLeft[2] = InitLeft(3);
	elementLeft[3] = InitLeft(4);
	elementLeft[4] = Remove_px(occupantTable.style.left);
	var textElement = document.getElementById("textBox1");
	elementLeft[5] = Remove_px(textElement.style.left);
	return elementLeft;
}
//**********************************************************************************************************************************************
function InitLeft(num) 
{
    if (curImageArray[imgCount] >= num)
	{
	    var slideimage = "slideimage" + num;
    	element = document.getElementById(slideimage);
		return Remove_px(element.style.left);
	}
	return 0;
}
//**********************************************************************************************************************************************
function InitElementHeight()
{
	var elementHeight = [0, 0, 0, 0, 0, 0];
	elementHeight[0] = InitHeight(1);
	elementHeight[1] = InitHeight(2);
	elementHeight[2] = InitHeight(3);
	elementHeight[3] = InitHeight(4);
	elementHeight[4] = OccupantTableHeight();
	textElement = document.getElementById("areaForText");
	elementHeight[5] = Remove_px(textElement.style.height);
	return elementHeight;
}
//**********************************************************************************************************************************************
function InitHeight(num) 
{
    if (curImageArray[imgCount] >= num)
	{
	    var slides = "slides" + num;
    	element = document.getElementById(slides);
		return Remove_px(element.style.height);
	}
	return 0;
}
//**********************************************************************************************************************************************
function InitElementWidth()
{
	var elementWidth = [0, 0, 0, 0];
	elementWidth[0] = InitWidth(1);
	elementWidth[1] = InitWidth(2);
	elementWidth[2] = InitWidth(3);
	elementWidth[3] = InitWidth(4);
	return elementWidth;
}
//**********************************************************************************************************************************************
function InitWidth(num) 
{
    if (curImageArray[imgCount] >= num)
	{
	    var slides = "slideimage" + num;
    	element = document.getElementById(slides);
		return Remove_px(element.style.width);
	}
	return 0;
}
//**********************************************************************************************************************************************
function GetCanvasHeight() 
{
	var colLeft = [0, 0, 0, 0];
	var colHeight = [50, 0, 0, 0];
	elementLeft = InitElementLeft();
	elementHeight = InitElementHeight();
	var elementIndex = 0;
	var colIndex = 0;
	while (elementIndex < 6)
	{
	    var left = elementLeft[elementIndex];
		done = (left == colLeft[colIndex] || left == 0);
	    while (!done)
		{
		    colIndex++;
			if (colLeft[colIndex] == 0)
			{
			    colLeft[colIndex] = left;
    		    colHeight[colIndex] = 50;
				done = true;
			}
			else if (left == colLeft[colIndex])
			{
    		    colHeight[colIndex] += g_spaceBetweenImages;
			    done = true;
			}
			else if (colIndex >= 3)
			{
			    done = true;
			}
		}
		if (elementHeight[elementIndex] != 0)
		{
    		colHeight[colIndex] += elementHeight[elementIndex] + g_spaceBetweenImages;
		}
	    elementIndex++;
	}
	var canvasHeight = (g_numSidebarEntries * 22) + 110;
    var i;
    for (i = 0; i < 4; i++) 
	{
	    if (colHeight[i] > canvasHeight)
		{
		    canvasHeight = colHeight[i];
		}
	}
 	return canvasHeight;
}
//**********************************************************************************************************************************************
function SetupCanvas(convertToImage) 
{
    var photoSidebarNode = document.getElementById('photoSidebar');
	photoSidebarNode.style.top = "20px";
    var node = document.getElementById('photoForm');
	node.style.width = GetCanvasWidth() + "px";
	node.style.height = GetCanvasHeight() + "px";
	if (convertToImage)
	{
	    node.style.backgroundColor  = "#FFFFFF";
		convertCanvasToImage(node);
	}
}
//**********************************************************************************************************************************************
function convertCanvasToImage(node) 
{
    domtoimage.toPng(node)
    .then(function (dataUrl) 
	{
        var img = new Image();
        img.src = dataUrl;
        document.body.appendChild(img);
    })
    .catch(function (error) 
	{
        console.error('oops, something went wrong!', error);
    });
    domtoimage.toBlob(document.getElementById('photoForm'))
    .then(function (blob) 
	{
        saveAs(blob, 'my-node.png');
    });
    domtoimage.toJpeg(document.getElementById('photoForm'), { quality: 0.95 })
    .then(function (dataUrl) 
	{
        var link = document.createElement('a');
        link.download = 'my-image-name.jpeg';
        link.href = dataUrl;
        link.click();
    });
}
//**********************************************************************************************************************************************
