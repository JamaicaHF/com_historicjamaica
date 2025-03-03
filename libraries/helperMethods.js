var xPoint = 0;
var yPoint = 1;

//**********************************************************************************************************************************************
function isEmpty(str)
{
    return (!str || 0 === str.length);
}
//**********************************************************************************************************************************************
function Remove_px(str) 
{
	if (isEmpty(str))
	{
	    return 0;
	}
	return parseInt(str.replace("px", ""));
}
//**********************************************************************************************************************************************
function setCookie(name, value) 
{
    var date = new Date();
    date.setTime(date.getTime() + (60 * 60 * 1000));
    var expires = "; expires=" + date.toGMTString();
    document.cookie = name + "=" + value + expires + "; path=/";
}
//**********************************************************************************************************************************************
function getPageScroll() 
{
    var xScroll, yScroll;
    if (self.pageYOffset) 
    {
        yScroll = self.pageYOffset;
        xScroll = self.pageXOffset;
    }
    else if (document.documentElement && document.documentElement.scrollTop) 
    {
        yScroll = document.documentElement.scrollTop;
        xScroll = document.documentElement.scrollLeft;
    }
    else if (document.body) 
    {// all other Explorers
        yScroll = document.body.scrollTop;
        xScroll = document.body.scrollLeft;
    }
    return new Array(xScroll, yScroll)
}
//**********************************************************************************************************************************************
function alphaCharacter(char)
{ 
    var letters = /^[a-zA-Z]+$/;
    if(char.match(letters))
    {
        return true;
    }
    else
    {
        return false;
    }
}
//**********************************************************************************************************************************************
function RemoveChildren(elementID) 
{
    var element = document.getElementById(elementID);
    if (element == null) return;
    while (element.firstChild) 
    {
        RemoveChildren(element.firstChild.id);
        element.removeChild(element.firstChild);
    }
}
//**********************************************************************************************************************************************
function RemoveElementAndChildren(elementID) 
{
    var element = document.getElementById(elementID);
    if (element != null)
    {
        RemoveChildren(elementID);
    }
    var parent = element.parentNode
    parent.removeChild(element);
}
//**********************************************************************************************************************************************
function ClearChildrenNodes(element) 
{
    while (element.firstChild) 
    {
        element.removeChild(element.firstChild);
    } 
}
//**********************************************************************************************************************************************
function getPageHeight() 
{
    var windowHeight
    if (self.innerHeight) 
    { // all except Explorer
        windowHeight = self.innerHeight;
    } 
    else if (document.documentElement && document.documentElement.clientHeight) {
        windowHeight = document.documentElement.clientHeight;
    }
    else if (document.body) 
    { // other Explorers
        windowHeight = document.body.clientHeight;
    }
    return windowHeight
}
//**********************************************************************************************************************************************
function YMDtoMDY(date)
{
	year  = date.substring(0, 4);
	month = date.substring(5, 7);
	day   = date.substring(8, 10);
	return month + '/' + day + '/' + year;
}
//**********************************************************************************************************************************************
function callbackURL(historicJHSite, action, tab='')
{
    var insert = (tab === "") ? "" :  '/index.php/' + tab;
    return historicJHSite + insert + "?option=com_historicjamaica&action=" + action;
}
//**********************************************************************************************************************************************
function createXmlHttpRequestObject()
{
    var xmlHttp;
    // will store the reference to the XMLHttpRequest object
    if(window.ActiveXObject)
    {
        try
        {
            xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        catch (e)
        {
            xmlHttp = false;
        }
    }
    else // if running Mozilla or other browsers
    {
        try
        {
            xmlHttp = new XMLHttpRequest();
        }
        catch (e)
        {
            xmlHttp = false;
        }
    }
    // return the created object or display an error message
    if (!xmlHttp)
    {
        alert("Error creating the XMLHttpRequest object.");
    }
    else
    {
        return xmlHttp;
    }
}
//**********************************************************************************************************************************************
function getCookie(name)
{
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) 
	{
		var c = ca[i];
		while (c.charAt(0)==' ') 
		{
			c = c.substring(1,c.length);
		}
		if (c.indexOf(nameEQ) == 0)
		{
			return c.substring(nameEQ.length,c.length);
		}
	}
	return null;
}
//**********************************************************************************************************************************************
function toInt(str)
{
	len = str.length;
	return parseInt(str.substring(0,len));
}
//**********************************************************************************************************************************************
function GetBrowser()
{
	var version=0;
    var browser="";
	
	if (/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent))
	{
	    version=new Number(RegExp.$1);
	    browser="FireFox";} else {

	    if (/MSIE (\d+\.\d+);/.test(navigator.userAgent))
	    {
	        version=new Number(RegExp.$1);
	        browser="Internet Explorer";} 
	    else 
   	    if (/Opera[\/\s](\d+\.\d+)/.test(navigator.userAgent))
   	    {
	        version=new Number(RegExp.$1);
	        browser="Opera";
	    } 
   	    else 
   	    if (/Chrome[\/\s](\d+\.\d+)/.test(navigator.userAgent))
	    {
	        version=new Number(RegExp.$1);
	        if (version==18) 
	        {
	          	version=3; browser="Maxthon";
	        } 
	        else 
	        { 
	          	browser="Google Chrome"
	        }
	    } 
	    else 
	    {
	       	version=0; 
	       	browser="Undetermined";
	    }
	}
	alert(browser+' '+version);
}
//**********************************************************************************************************************************************
