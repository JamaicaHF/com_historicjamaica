var imgArray;
var imgCt;
var imageInfo;
var g_historicJHSite;
var g_HJ_Photos;
var g_returnAction;
var g_infoTitle;
var g_alreadyGotInfo;
var g_imageInfo;
var g_menuList;
var g_currentMenu;
var g_photoMenu;
var g_returnID;
var g_totalRecords;
var g_minimumPictureHeight;
var g_minumumHeight;
var g_pictureHeight;
var g_fixedSize;
var map;
var g_numRowsOnPage = 22;
var xmlHttp;
var g_returnToFamilyParm;
var global_SchoolYear;
var maxOccupantTextLength = 0;
var g_gradeFromPersonInfo = "0";
var curImageArray;
var prevImageArray;
var nextImageArray;
var firstPhoto = true;
var g_OccupantList;
var g_showInOccupantList = false;
var g_ownerList;
var g_notesList;
var g_numSidebarEntries = 0;
const img1 = 0;
const img2 = 1;
const img3 = 2;
const img4 = 3;
const imgStart = 4;
const imgEnd = 5;
const imgCount = 6;

//**********************************************************************************************************************************************
function loadImages(historicJHSite, returnAction, returnID, photos, infoTitle, year, page) 
{
    g_returnToFamilyParm = year;
    map = null;
    g_photoMenu = false;
    InitializeComponent();
    xmlHttp = createXmlHttpRequestObject();
    g_infoTitle = infoTitle;
    g_historicJHSite = historicJHSite;
    g_returnAction = returnAction;
    g_returnID = +returnID;
    var backf2 = document.getElementById("backf2").src;
    var historicJHSiteParts = g_historicJHSite.split("JamaicaHF");
    g_HJ_Photos = historicJHSiteParts[0] + "/JamaicaHFPhotos/";
    document.getElementById("occupantTable").style.display = "none";
    document.getElementById("ThenNow1").style.display = "none";
    document.getElementById("ThenNow2").style.display = "none";
    document.getElementById("ThenNow3").style.display = "none";
    document.getElementById("ThenNow4").style.display = "none";
    document.getElementById("slides1").style.display = "none";
    document.getElementById("slides2").style.visibility = "none";
    document.getElementById("slides3").style.visibility = "none";
    document.getElementById("slides4").style.visibility = "none";
    document.getElementById("textBox1").style.display = "none";

    if (infoTitle == "HFPhotos") 
    {
        g_currentMenu = 99;
        LoadPhotos(photos);
    }
    else if (infoTitle == "School") 
    {
        g_currentMenu = 0;
        g_menuList = photos;
		var grade =  ConvertStringToGrade(year);
		//global_SchoolYear = YearStringToSchoolGrade(year);
		var personId = page;
        SetupPhotoMenu(g_menuList, infoTitle, grade, +personId, global_SchoolYear);
    }
    else
    {
        g_currentMenu = 0;
        g_menuList = photos;
        SetupPhotoMenu(g_menuList, infoTitle, +year, +page);
    }
}
//**********************************************************************************************************************************************
function ConvertStringToGrade(gradeStr) 
{
    global_SchoolYear = "";
    var strArray = gradeStr.split("(");
    if (strArray.length > 1) 
    {
	    g_gradeFromPersonInfo = YearStringToGrade(gradeStr);;
        return g_gradeFromPersonInfo;
    }
    var strArray = gradeStr.split("-");
    if (strArray.length < 3)
	{
        var strArray = gradeStr.split(",");
	} 
    if (strArray.length >= 3) 
	{
	    global_SchoolYear = strArray[0] + "-" + strArray[1];
   	    return strArray[2];
	}
	return "0";
}
//**********************************************************************************************************************************************
function YearStringToSchoolGrade(yearString) 
{
    var strArray = yearString.split(",");
    if (strArray.length < 3) 
    {
        return 0;
    }
	var schoolId = strArray[0];
	var yearStr = strArray[2];
    strArray = yearStr.split(" ");
	var year = strArray[1];
    var strArray = year.split("-");
	if (strArray.length > 1)
	{
	    year = strArray[0];
	}
	return schoolId + "-" + year;
}
//**********************************************************************************************************************************************
function YearStringToGrade(grade) 
{
    var strArray = grade.split(",");
    if (strArray.length <= 1) 
    {
        return "0";
    }
	var gradeStr = strArray[1].trim();
	if (gradeStr == "Grammer" || gradeStr == "Primary")
	{
	    return gradeStr;
	}
	if (gradeStr == "Teacher")
	{
	    return "0";
	}
    gradeStr = strArray[1].split(" ");
    if (gradeStr.length == 0) 
    {
        return "0";
    }
	var grades = gradeStr[2].split("-");
    var numGrades = grades.length;
    if (numGrades == 0) 
    {
        return gradeStr;
    }
	return grades[0];
}
//**********************************************************************************************************************************************
function InitializeComponent() 
{
    g_returnID = 0;
    g_totalRecords = 0;
    g_minimumPictureHeight = 485;
    g_minumumHeight = g_minimumPictureHeight + 25;
    g_pictureHeight = g_minumumHeight;
    g_yearOfCensus = 0;
    g_fixedSize = GetZoomOptionFromCookie();
}
//**********************************************************************************************************************************************
function GetZoomOptionFromCookie()
{
    var zoomOptionFixedSize = getCookie("zoomOption");
    if (zoomOptionFixedSize == null)
    {
        return true;
    }
    return zoomOptionFixedSize == "true";
}
//**********************************************************************************************************************************************
function DisplayImageInfo(numRecords) 
{
    document.getElementById("occupantTable").style.display = "none";
    document.getElementById("titleLabel").style.display = "none";
    document.getElementById("titleLabel").style.display = "none";
    document.getElementById("backf2").style.display = "inline";
    document.getElementById("prevLink").style.display = "inline";
    document.getElementById("nextLink").style.display = "inline";
    var info = document.getElementById("info");
    ClearChildrenNodes(info);
	var showOccupants = false;
	var showOwners = false;
	var occupantIndex = 0;
	var ownerIndex = 0;
	var notesIndex = 0;
   	g_OccupantList = new Array();
   	g_ownerList = new Array();
   	g_notesList = new Array();
    for (var i = 0; i < numRecords; i++) 
    {
        var text = g_imageInfo[i + 2];
		if (text == "*Notes1" || text == "*Notes2")
		{
		    g_notesList[notesIndex] = text;
			notesIndex++;
			i++;
            text = g_imageInfo[i + 2];
		    g_notesList[notesIndex] = text;
			notesIndex++;
		}
		else if (text == "*Current Owner" || text == "*Recent Owners")
		{
			i++;
            text = g_imageInfo[i + 2];
		    showOccupants = false;
			showOwners = true;
    		g_ownerList[ownerIndex] = text;
			ownerIndex++;
		}
		else if (showOwners)
		{
    		g_ownerList[ownerIndex] = text;
			ownerIndex++;
		}
		else if (text == "Occupants")
		{
		    showOccupants = true;
			showOwners = false;
		}
		else if (showOccupants)
		{
    		g_OccupantList[occupantIndex] = text;
			if (text.length	> maxOccupantTextLength)
			{
			    maxOccupantTextLength = text.length;
			}
			occupantIndex++;
		}
		else
		{
		    DisplayPhotoInfo(text);
			var numRows = text.length / 36 + 1;
			g_numSidebarEntries += Math.trunc(numRows);
		}
    }
    DisplayInfoLists();
    SetFormHeight();
    document.getElementById("photoSidebar").style.display = "";
}
//**********************************************************************************************************************************************
function DisplayInfoLists() 
{
	if (g_ownerList.length > 0)
	{
	    if (g_OccupantList.length > 0)
		{
    	    g_showInOccupantList = g_ownerList.length + g_OccupantList.length <= g_numRowsOnPage + 1;
		}
        g_ownerList.forEach(function(element)
		{
		    var occupantIndex = g_OccupantList.length;
		    if (g_showInOccupantList)
			{
			    g_OccupantList[occupantIndex] = element;
				occupantIndex++;
			}
			else
			{
    			g_numSidebarEntries++;
        	    DisplayPhotoInfo(element);
			}
        });	    
	}
	if (g_notesList.length == 0)
	{
        document.getElementById("areaForText").innerHTML = "";
	}
	else
	{
	    if (g_notesList[0] == "*Notes1")
		{
    	    DisplayPhotoInfo("*Notes");
			g_numSidebarEntries++;
	        DisplayPhotoInfo(g_notesList[1]);
			var numRows = g_notesList[1].length / 33 + 1;
			g_numSidebarEntries += Math.trunc(numRows);
		}
	}
	if (g_OccupantList.length != 0)
	{
	    g_numPeople = g_OccupantList.length;
	    loadOccupantTable();
		document.getElementById("occupantTable").style.display = "";
	}
}
//**********************************************************************************************************************************************
function DisplayPhotoInfo(text) 
{
    g_totalRecords += Math.floor(text.length / 34) + 1;
    var li = document.createElement('li');
    if (text.length > 0)
	{
   		if (text[0] == '*') 
        {
            text = text.substring(1, text.length);
            li.style.fontWeight = 'bold';
            li.style.fontSize = '15px';
        }
	}
    li.innerHTML = text;
	//li.style.height = "16px";
    li.style.listStyleType = "none";
    li.style.marginLeft = "-4px";
    info.appendChild(li);
}
//**********************************************************************************************************************************************
function LoadPhotos(photos) 
{
	InitializeImageArrays();
    imgArray = photos.split("|");
    imgCt = imgArray.length;
    if (imgCt == 0) 
    {
        return;
    }
    SetMinimums();
    var curImage = GetPhotoFromCookies();
	g_CurPhotoIsQRCode = PhotoIsQRCode(imgArray[curImage]);
    HFPhoto(curImageArray, curImage);
	var imgNum = curImageArray[imgStart];
    getImageData(imgArray[imgNum]);
    if (imgCt <= curImageArray[imgEnd] + 1) 
    {
        document.getElementById("prevLink").style.display = "none";
        document.getElementById("nextLink").style.display = "none";
		DeepCopyImageArray(nextImageArray, curImageArray);
		DeepCopyImageArray(prevImageArray, curImageArray);
    }
    else 
    {
	    curImage = curImageArray[imgEnd];
		curImage++;
        HFPhoto(nextImageArray, curImage);
        if (imgCt == 2) 
        {
		    prevImageArray = nextImageArray;
        }
        else 
        {
    		curImage = imgCt-1;
            SetPrevImageFromQRCode(curImage);
	    	HFPhoto(prevImageArray, curImage);
        }
        document.getElementById("prevLink").onclick = function () { newPhoto(-1); }
        document.getElementById("nextLink").onclick = function () { newPhoto(1); }
    }
}
//**********************************************************************************************************************************************
function InitializeImageArrays()
{
    curImageArray = [];
    curImageArray.push(new Image);
    curImageArray.push(new Image);
    curImageArray.push(new Image);
    curImageArray.push(new Image);
    curImageArray.push(0);
    curImageArray.push(0);
    curImageArray.push(0);
    prevImageArray = [];
    prevImageArray.push(new Image);
    prevImageArray.push(new Image);
    prevImageArray.push(new Image);
    prevImageArray.push(new Image);
    prevImageArray.push(0);
    prevImageArray.push(0);
    prevImageArray.push(0);
    nextImageArray = [];
    nextImageArray.push(new Image);
    nextImageArray.push(new Image);
    nextImageArray.push(new Image);
    nextImageArray.push(new Image);
    nextImageArray.push(0);
    nextImageArray.push(0);
    nextImageArray.push(0);
}
//**********************************************************************************************************************************************
function DeepCopyImageArray(ImageArray1, ImageArray2)
{
    ImageArray1[img1].src = ImageArray2[img1].src;
    ImageArray1[img2].src = ImageArray2[img2].src;
    ImageArray1[img3].src = ImageArray2[img3].src;
    ImageArray1[img4].src = ImageArray2[img4].src;
    ImageArray1[imgStart] = ImageArray2[imgStart];
    ImageArray1[imgEnd] = ImageArray2[imgEnd];
    ImageArray1[imgCount] = ImageArray2[imgCount];
}
//**********************************************************************************************************************************************
function GetPhotoFromCookies()
{
    if (g_currentMenu == 99)
    {
        return 0; // first photo in list
    }
    var photoNum = getCookie("Category" + g_currentMenu);
    if (photoNum == null)
    {
        return 0;
    }
    for (var i = 0; i < imgArray.length; i++)
    {
        if (imgArray[i] == photoNum)
        {
            return i;
        }
    }
    return 0;
}
//**********************************************************************************************************************************************
function HFPhoto(ImageArray, curImage)
{
    if (curImage >= imgArray.Length)
	{
		return;
	}
	ImageArray[imgStart] = curImage;
    var photoId = imgArray[curImage];
    var firstChar = photoId.charAt(0);
	if (firstChar == '@')
	{
    	ImageArray[imgStart] = curImage - 1;
	    SetImagesFromQRCode(ImageArray, curImage);
	}
	else
    if (alphaCharacter(firstChar))
	{
        curImage++;
	    SetImagesFromQRCode(ImageArray, curImage);
	}
	else
	{
	    BuildHFPhoto(ImageArray, img1, photoId, "", "");
    	ImageArray[imgEnd] = curImage;
		ImageArray[imgCount] = 1;
	}
}
//**********************************************************************************************************************************************
function SetImagesFromQRCode(ImageArray, curImage) 
{
	var done = false;
	var imgNum = 0;
  	while (!done)
    {
        var thenNowPhoto = imgArray[curImage];
        var thenNowType = thenNowPhoto.charAt(0);
	    if (thenNowType == '@')
	    {
	        thenNowType = thenNowPhoto.charAt(1);
	    }
	    if (thenNowType == 'Q')
		{
			done = true;
		}
		else
		{
            var thenNowPhotoArray = thenNowPhoto.split("^");
			var photoId = thenNowPhotoArray[1];
    	    BuildHFPhoto(ImageArray, imgNum, photoId, thenNowType, thenNowPhotoArray[2]);
			imgNum++;
		}
        curImage++;
    }
	ImageArray[imgEnd] = curImage - 1;
	ImageArray[imgCount] = imgNum;
}
//**********************************************************************************************************************************************
function BuildHFPhoto(ThisImage, imgNum, photoId, thenNowType, title) 
{
   	var photoNum = toInt(photoId) + 1000000;
    var photoStr = photoNum.toString();
    var imageUrl = g_HJ_Photos + "HF" +  photoStr.substring(1,7) + ".jpg";
    ThisImage[imgNum].src = imageUrl;
    ThisImage[imgNum].title = title;
	ThisImage[imgNum].textContent = thenNowType;
	firstPhoto = false;
}
//**********************************************************************************************************************************************
function SetPrevImageFromQRCode(currImage)
{
    var thenNowPhoto = imgArray[currImage];
    var thenNowType = thenNowPhoto.charAt(0);
	var done = thenNowType != '@';
	while (!done)
	{
	    currImage--;
        thenNowPhoto = imgArray[currImage];
        var firstChar = thenNowPhoto.charAt(0);
        if (firstChar != "@")
		{
			done = true;
		}
	}
	return currImage;
}
//**********************************************************************************************************************************************
function PhotoIsQRCode(photoId) 
{
    var firstChar = photoId.charAt(0);
	if (firstChar == '@')
	{
	    return true;
	}
    if (alphaCharacter(firstChar))
	{
	    return true;
	}
	return false;
}
//**********************************************************************************************************************************************
function newPhoto(direction) 
{
    g_totalRecords = 0;
    if (direction < 0)
	{
		DeepCopyImageArray(nextImageArray, curImageArray);
		DeepCopyImageArray(curImageArray, prevImageArray);
    	var curImage = curImageArray[imgStart];
    	g_CurPhotoIsQRCode = PhotoIsQRCode(imgArray[curImage]);
    	curImage--;
    	if (curImage < 0) 
    	{
    		curImage = imgCt-1;
    	}
        curImage = SetPrevImageFromQRCode(curImage);
		HFPhoto(prevImageArray, curImage);
	}
	else
	{
		DeepCopyImageArray(prevImageArray, curImageArray);
		DeepCopyImageArray(curImageArray, nextImageArray);
    	var curImage = curImageArray[imgEnd];
    	g_CurPhotoIsQRCode = PhotoIsQRCode(imgArray[curImage]);
    	curImage++;
    	if (curImage >= imgCt) 
    	{
    		curImage = 0;
    	}
		HFPhoto(nextImageArray, curImage);
	}
    if (g_currentMenu != 99)
    {
        SaveImageAsCookie(g_currentMenu, imgArray[curImage]);
    }
   	var imgNum = curImageArray[imgStart];
   	getImageData(imgArray[imgNum]);
}
//**********************************************************************************************************************************************
function SaveImageAsCookie(categoryNum, photoNum)
{
    setCookie("Category" + categoryNum, photoNum);
}
//**********************************************************************************************************************************************
function previousScreen()
{
    if (g_photoMenu) 
    {
        document.getElementById("slideimage1").style.display = "none";
        SetupPhotoMenu(g_menuList, g_infoTitle, 0, 0);
    }
    else 
    {
        parmArray = new Array();
        parmArray[0] = g_returnAction;
        parmArray[1] = g_returnID;
        var url = callbackURL(g_historicJHSite, g_returnAction, "people-in-jamaica") + "&parms=" + parmArray;
        window.open(url, "_self");
    }
}
//**********************************************************************************************************************************************
function Increase() 
{
    if (curImageArray[imgCount] != 1)
	{
		return;
	}
    AdjustSize(400);
    if (!g_fixedSize) 
    {
        SetFormHeight();
    }
    var i = 0;
}
//**********************************************************************************************************************************************
function Decrease() 
{
    if (curImageArray[imgCount] != 1)
	{
		return;
	}
    AdjustSize(-400);
    if (!g_fixedSize)
    {
        SetFormHeight();
    }
}
//**********************************************************************************************************************************************
function AdjustSize(increment) 
{
    var img = document.getElementById("slides1");
    var resize = increment; // resize amount in percentage
    var origH = img.height;  // original image height
    var origW = img.width; // original image width
    //var mouseX = event.x;
    //var mouseY = event.y;
    g_pictureHeight = (img.height + increment);
    if (g_pictureHeight < g_minimumPictureHeight)
    {
        g_pictureHeight = img.height;
    }
    img.style.height = g_pictureHeight + "px";
}
//**********************************************************************************************************************************************
function SetFormHeight()
{
    form = document.getElementById("photoForm");
    var infoHeight = g_totalRecords * g_numRowsOnPage + 90;
	if (infoHeight > 442)
	{
	    infoHeight = 442;
	}
    var pictureHeight = g_pictureHeight + (g_minumumHeight - g_minimumPictureHeight);
    var height = (infoHeight > g_pictureHeight) ? infoHeight : g_pictureHeight;
	height = g_minumumHeight + 100;
    if (height < g_minumumHeight) 
    {
        form.style.height = g_minumumHeight + "px";
    }
    else 
    {
        form.style.height = height + "px";
    }
}
//**********************************************************************************************************************************************
function getImageData(photoID) 
{
    // proceed only if the xmlHttp object isn't busy
    if (xmlHttp.readyState == 4 || xmlHttp.readyState == 0) 
    {
        var url = callbackURL(g_historicJHSite, "PhotoInfo") + "&photoID=" + photoID + "&tmpl=component";
        g_alreadyGotInfo = false;
        xmlHttp.open("GET", url, true);
        xmlHttp.onreadystatechange = handleServerResponse;
        xmlHttp.send(null);
    }
    else // if the connection is busy, try again after one second 
    {
        setTimeout('getImageData(photoID)', 1000);
    }
}
//**********************************************************************************************************************************************
function handleServerResponse() 
{
    if (xmlHttp.status == 200) // status of 200 indicates the transaction completed successfully
    {
        imageInfo = xmlHttp.responseText;
        var foo = '' || undefined;
        if (xmlHttp.responseText.length != 0 && !g_alreadyGotInfo)
        {
            g_imageInfo = xmlHttp.responseText.split('|');
            if (g_imageInfo.length > 1) // firefox processes this request twice
            {
                var numRecords = toInt(g_imageInfo[1]);
	    		if (g_imageInfo.length > numRecords + 1)
                {
                    g_alreadyGotInfo = true;
                    DisplayImageInfo(+numRecords);
					AlignImages();
					ShowPhotoImage();
					SetupCanvas(false);
                }
            }
        }
    }
    else
    if (xmlHttp.status != 0) // status of 200 indicates the transaction completed successfully
    {
        alert("There was a problem accessing the server: " + xmlHttp.statusText);
    }
}
function RemoveTagsFromFinalPhoto()
{
    str.replace("</body></html>", "");
}
//**********************************************************************************************************************************************
