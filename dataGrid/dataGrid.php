<?php 
    defined( '_JEXEC' ) or die( 'Restricted access' );
    define("JamaicaHFSearchOption","JamaicaHFSearchOption");
    define("JamaicaHFLastName","JamaicaHFLastName");
    define("JamaicaHFFirstName","JamaicaHFFirstName");
    define("JamaicaHFMiddleName","JamaicaHFMiddleName");
    define("JamaicaHFSuffix","JamaicaHFSuffix");
    define("JamaicaHFPrefix","JamaicaHFPrefix");
    define("JamaicaHFPersonOption","JamaicaHFPersonOption");
    define("JamaicaHFPage","JamaicaHFPage");

Function GetCivilWarData()
{
    $searchOption = ""; 
    $lastNameOrID = "";
    $firstName = "";
    $middleName = "";
    $suffix = "";
    $prefix = "";
    $personOption = "";
    $firstPage = "";
    $page = (isset($_GET["Value"])) ? $_GET["Value"] : 1;

    $templateFile = HJ_COMPONENT_PATH."dataGrid/dataGrid.html";
    if(file_exists($templateFile)) 
    {
        $template = implode("", file($templateFile));
    }
    else 
    {
        $template = "";
        echo "<b>ERROR:</b> Can't find the template.html file!";
        HJHelper::returnHome();
    }
    $template = str_replace("hostServer",HJHelper::historicJHSite(),$template);
    $action = 'DataGridCivilWar';
    $template = str_replace("action",$action,$template);
    $template = str_replace("searchOption",$page,$template);
    $template = str_replace("personOption",$personOption,$template);
    $template = str_replace("LastNameOrID",$lastNameOrID,$template);
    $template = str_replace("FirstName",$firstName,$template);
    $template = str_replace("MiddleName",$middleName,$template);
    $template = str_replace("Suffix",$suffix,$template);
    $template = str_replace("Prefix",$prefix,$template);
    $template = str_replace("firstPage",$firstPage,$template);
    echo $template;
}
Function CollectInformation($action, $parms)
{
    $searchOption = ""; 
    $lastNameOrID = "";
    $firstName = "";
    $middleName = "";
    $suffix = "";
    $prefix = "";
    $personOption = "";
    $firstPage = "";
    $parmArray = explode(",", $parms);
    $searchOption = isset($parmArray[0]) ? $parmArray[0]: "";
    if ($searchOption == "PersonCensus")
    {
        $personOption = isset($parmArray[1]) ? $parmArray[1]: "";
        $lastNameOrID = isset($parmArray[2]) ? $parmArray[2]: "";
        SetCensusCookies($searchOption, $personOption, $lastNameOrID);
    }
    else
    if ($searchOption == "DataGridCensus")
    {
        GetParmsFromCookies($action,$searchOption, $lastNameOrID, $firstName, $middleName, $suffix, $prefix, $personOption, $firstPage);
    }
    else
    if ($searchOption == "VitalRecordsByPersonID")
    {
        $lastNameOrID = isset($parmArray[1]) ? $parmArray[1]: "";
        $firstName = isset($parmArray[2]) ? $parmArray[2]: "";
    }
    else
    if ($searchOption == "ReturnFromFamily")
    {
        GetParmsFromCookies($action,$searchOption, $lastNameOrID, $firstName, $middleName, $suffix, $prefix, $personOption, $firstPage);
    }
    else 
    {
        $firstPage = 1;
        $lastNameOrID = isset($parmArray[1]) ? $parmArray[1]: "";
        $firstName = isset($parmArray[2]) ? $parmArray[2]: "";
        $middleName = isset($parmArray[3]) ? $parmArray[3]: "";
        $suffix = isset($parmArray[4]) ? $parmArray[4]: "";
        $prefix = isset($parmArray[5]) ? $parmArray[5]: "";
        $personOption = isset($parmArray[6]) ? $parmArray[6]: "";
        SetCookies($searchOption, $lastNameOrID, $firstName, $middleName, $suffix, $prefix, $personOption);
    }

    $templateFile = HJ_COMPONENT_PATH."dataGrid/dataGrid.html";
    if(file_exists($templateFile)) 
    {
        $template = implode("", file($templateFile));
    }
    else 
    {
        $template = "";
        echo "<b>ERROR:</b> Can't find the template.html file!";
        HJHelper::returnHome();
    }
    $template = str_replace("hostServer",HJHelper::historicJHSite(),$template);
    $template = str_replace("action",$action,$template);
    $template = str_replace("searchOption",$searchOption,$template);
    $template = str_replace("personOption",$personOption,$template);
    $template = str_replace("LastNameOrID",$lastNameOrID,$template);
    $template = str_replace("FirstName",$firstName,$template);
    $template = str_replace("MiddleName",$middleName,$template);
    $template = str_replace("Suffix",$suffix,$template);
    $template = str_replace("Prefix",$prefix,$template);
    $template = str_replace("firstPage",$firstPage,$template);
    echo $template;
}
function SetCensusCookies($searchOption, $yearOption, $pageOption)
{
  	setcookie(JamaicaHFSearchOption,  $searchOption, time() + 60 * 60,'/');
    setcookie(JamaicaHFPersonOption,  $yearOption, time() + 60 * 60,'/');
    setcookie(JamaicaHFLastName,  $pageOption, time() + 60 * 60,'/');
}
function GetParmsFromCookies(&$action,&$searchOption, &$lastName, &$firstName, &$middleName, &$suffix, &$prefix, &$personOption, &$firstPage)
{
	  $searchOption = HJHelper::GetCookie(JamaicaHFSearchOption);
    if ($searchOption == "PersonCensus")
    {
	    $personOption = HJHelper::GetCookie(JamaicaHFPersonOption);
	    $lastName = HJHelper::GetCookie(JamaicaHFLastName);
	    $firstName = "";
	    $middleName = "";
	    $suffix = "";
	    $prefix = "";
      $action = "PersonCensus";
    }
    else
    {
      $lastName = HJHelper::GetCookie(JamaicaHFLastName);
	    $firstName = HJHelper::GetCookie(JamaicaHFFirstName);
	    $middleName = HJHelper::GetCookie(JamaicaHFMiddleName);
	    $suffix = HJHelper::GetCookie(JamaicaHFSuffix);
	    $prefix = HJHelper::GetCookie(JamaicaHFPrefix);
	    $personOption = HJHelper::GetCookie(JamaicaHFPersonOption);
    }
    $firstPage = HJHelper::GetCookie(JamaicaHFPage);
    if (HJHelper::emptyStr($firstPage))
    {
      $firstPage = "1";
    }
}
function SetCookies($searchOption, $lastName, $firstName, $middleName, $suffix, $prefix, $personOption)
{
	setcookie(JamaicaHFSearchOption,  $searchOption, time() + 60 * 15,'/');
    setcookie(JamaicaHFLastName,  $lastName, time() + 60 * 15,'/');
    setcookie(JamaicaHFFirstName,  $firstName, time() + 60 * 15,'/');
    setcookie(JamaicaHFMiddleName,  $middleName, time() + 60 * 15,'/');
    setcookie(JamaicaHFSuffix,  $suffix, time() + 60 * 15,'/');
    setcookie(JamaicaHFPrefix,  $prefix, time() + 60 * 15,'/');
    setcookie(JamaicaHFPersonOption,  $personOption, time() + 60 * 15,'/');
}
?>
