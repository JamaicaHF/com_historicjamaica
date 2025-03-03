<?php
/** 
 * @package     Joomla.Administrator 
 * @subpackage  com_historicjamaica 
 * @copyright   Copyright (C) 2005 - 2016 Open Source Matters, Inc. All rights reserved. 
 * @license     GNU General Public License version 2 or later; see LICENSE.txt 
 */ 
  // No direct access to this file
 defined('_JEXEC') or die('Restricted access'); 
// Get an instance of the controller prefixed by historicjamaica
 $controller = JControllerLegacy::getInstance('historicjamaica'); 
 // Perform the Request task
 $input = JFactory::getApplication()->input;
 $action = $input->get('action'); 	 //$task = JRequest::getCmd('task', 'cpanel');
 DefineGlobalValues();
 ExecuteAction($action);
//**********************************************************************************************************************************************
function ExecuteAction($action)
{
    switch($action)
    {
        case 'Person': 
            require_once( HJ_COMPONENT_PATH.'personFilter/personFilter.php');
            PersonCriteria("DataGridPerson", "person");
            break;
        case 'VitalRecord': 
            require_once( HJ_COMPONENT_PATH.'/personFilter/personFilter.php');
            PersonCriteria("DataGridVitalRecord", "vitalrecord");
            break;
        case 'Maps': 
            //$parms = 'last,bruso';
            //require_once( HJ_COMPONENT_PATH.'dataGrid/dataGrid.php');
            //CollectInformation('DataGridPerson', $parms);
            require_once( HJ_COMPONENT_PATH.'photoViewer/photoViewer.php');
            $value = (isset($_GET["Value"])) ? $_GET["Value"] : 0;
		    require_once(HJ_COMPONENT_PATH."libraries/sqlDatabase/sqlDatabasePhoto.php");
            $db = new sqlDatabasePhoto();
            CallPhotoViewer(Maps(), "Maps", $value, "Maps", $value, 0);
            break;
        case 'School': 
            require_once( HJ_COMPONENT_PATH.'photoViewer/photoViewer.php');
            $personID = (isset($_GET["Page"])) ? $_GET["Page"] : 0;
            $returnID = (isset($_GET["ReturnID"])) ? $_GET["ReturnID"] : 0;
            $returnAction = (isset($_GET["ReturnAction"])) ? $_GET["ReturnAction"] : "ReturnFromInfo";
            $value = (isset($_GET["Value"])) ? GetSchoolValue($_GET["Value"]) : 0;
            CallPhotoViewer(SchoolYears($personID, $returnAction), $returnAction, $returnID, "School", $value,  $personID);
            break;
        case 'Census':
            require_once( HJ_COMPONENT_PATH.'photoViewer/photoViewer.php');
            $page = (isset($_GET["Page"])) ? $_GET["Page"] : 0;
            $returnID = (isset($_GET["ReturnID"])) ? $_GET["ReturnID"] : 0;
            $returnAction = (isset($_GET["ReturnAction"])) ? $_GET["ReturnAction"] : 0;
            $value = (isset($_GET["Value"])) ? $_GET["Value"] : 0;
            CallPhotoViewer(Census(), $returnAction, $returnID, "Census", $value,  $page);
            break;
        case 'Photos':
            require_once( HJ_COMPONENT_PATH.'photoViewer/photoViewer.php');
            $returnAction = (isset($_GET["ReturnAction"])) ? $_GET["ReturnAction"] : 0;
            CallPhotoViewer(Categories(), $returnAction, 0, "Categories", 0, 0);
            break;
        case 'PersonByCensusYear':
            if (isset($_GET["censusYear"]))
            {
                $censusYear = $_GET["censusYear"];
                if (isset($_GET["censusPage"]))
                {
                    $censusPage = $_GET["censusPage"];
                    require_once( HJ_COMPONENT_PATH.'libraries/sqlDatabase/sqlDatabasePerson.php');
                    $db = new sqlDatabasePerson();
                    echo $db->GetPersonCensusRecords($censusYear, $censusPage);
				}
            }
            break;
        case 'CategoryValues':
            if (isset($_GET["CategoryValueID"]))
            {
                $categoryValueID = $_GET["CategoryValueID"];
                if (isset($_GET["CategoryID"]))
                {
                    $categoryID = $_GET["CategoryID"];
                    require_once( HJ_COMPONENT_PATH.'libraries/sqlDatabase/sqlDatabasePhoto.php');
                    $db = new sqlDatabasePhoto();
                    echo $db->getAllPhotosForCategoryValue($categoryValueID, $categoryID);
                }
            }
            else if (isset($_GET["CategoryID"]))
            {
                $categoryID = $_GET["CategoryID"];
                require_once( HJ_COMPONENT_PATH.'libraries/sqlDatabase/sqlDatabasePhoto.php');
                $db = new sqlDatabasePhoto();
                echo $db->getAllPhotosForCategory($categoryID);
            }
            break;
        case 'SchoolInfoValues':
            if (isset($_GET["SchoolYearID"]))
            {
                $schoolYearID = $_GET["SchoolYearID"];
                require_once( HJ_COMPONENT_PATH.'libraries/sqlDatabase/sqlDatabasePhoto.php');
                $db = new sqlDatabasePhoto();
                echo $db->getAllGradesForSchoolYear($schoolYearID);
            }
            break;
        case 'SchoolGradeInfoValues':
            if (isset($_GET["SchoolYearID"]))
            {
                $schoolYearID = $_GET["SchoolYearID"];
                require_once( HJ_COMPONENT_PATH.'libraries/sqlDatabase/sqlDatabasePhoto.php');
                $db = new sqlDatabasePhoto();
                echo $db->getSchoolRecordsForSchoolYear($schoolYearID);
            }
            break;
        case 'CategoryInfoValues':
            if (isset($_GET["categoryID"]))
            {
                $categoryID = $_GET["categoryID"];
                require_once( HJ_COMPONENT_PATH.'libraries/sqlDatabase/sqlDatabasePhoto.php');
                $db = new sqlDatabasePhoto();
                echo $db->getAllCategoryValuesForCategory($categoryID);
            }
            break;
        case 'GetRoads': 
            if (isset($_GET["RoadType"]))
            {
                $roadType = $_GET["RoadType"];
                require_once( HJ_COMPONENT_PATH.'libraries/sqlDatabase/sqlDatabaseBuildings.php');
                $db = new sqlDatabaseBuildings();
                echo $db->GetAllRoads($roadType);
            }
            break;
        case 'BuildingInfo':
            if (isset($_GET["buildingID"]))
            {
                $buildingID = $_GET["buildingID"];
                require_once( HJ_COMPONENT_PATH.'libraries/sqlDatabase/sqlDatabaseBuildings.php');
                $db = new sqlDatabaseBuildings();
                echo $db->GetBuildingInfo($buildingID);
            }
            break;
        case 'BuildingsOnRoad':
            if (isset($_GET["modernRoadID"]))
            {
                $modernRoadID = $_GET["modernRoadID"];
                require_once( HJ_COMPONENT_PATH.'libraries/sqlDatabase/sqlDatabaseBuildings.php');
                $db = new sqlDatabaseBuildings();
                echo $db->GetBuildingByModernRoadID($modernRoadID);
            }
            break;
        case 'MultipleRecordIDs':
            if (isset($_GET["multipleIDs"]))
            {
                $multipleIDs = $_GET["multipleIDs"];
                $parts = explode(';', $multipleIDs);
                require_once( HJ_COMPONENT_PATH.'libraries/sqlDatabase/sqlDatabasePerson.php');
                $db = new sqlDatabasePerson();
                echo $db->GetMultipleIds($parts, $_GET["TableName"], $_GET["SortLastName"]);
            }
            break;
        case 'VitalRecordByID':
            if (isset($_GET["vitalRecordID"]))
            {
                $vitalRecordID = $_GET["vitalRecordID"];
                require_once( HJ_COMPONENT_PATH.'libraries/sqlDatabase/sqlDatabasePerson.php');
                $db = new sqlDatabasePerson();
                echo $db->GetVitalRecordForPerson($vitalRecordID);
            }
            break;
        case 'VitalRecordsByPersonID':
            if (isset($_GET["personID"]))
            {
                $personID = $_GET["personID"];
                require_once( HJ_COMPONENT_PATH.'libraries/sqlDatabase/sqlDatabasePerson.php');
                $db = new sqlDatabasePerson();
                echo $db->GetAllVitalRecordsForPerson($personID);
            }
            break;
        case 'GetPersonInfo': 
            if (isset($_GET["personID"]))
            {
                $personID = $_GET["personID"];
                require_once( HJ_COMPONENT_PATH.'libraries/sqlDatabase/sqlDatabasePhoto.php');
                $db = new sqlDatabasePhoto();
                echo $db->GetPersonInfo($personID);
            }
            break;
        case 'PhotoInfo': 
            if (isset($_GET["photoID"]))
            {
                $photoID = $_GET["photoID"];
                require_once( HJ_COMPONENT_PATH.'libraries/sqlDatabase/sqlDatabasePhoto.php');
                $db = new sqlDatabasePhoto();
                echo $db->getPhotoInfo($photoID);
            }
            break;
        case 'PersonFamilyData': 
            if (isset($_GET["personID"]))
            {
                $personID = $_GET["personID"];
                require_once( HJ_COMPONENT_PATH.'libraries/sqlDatabase/sqlDatabasePersonFamily.php');
                $db = new sqlDatabasePersonFamily();
                $str = $db->getPersonFamilyInfo($personID);
                echo $str;
            }
            break;
        case 'VitalRecordByName': 
            GetData("vitalrecord");
            break;
        case 'PersonByName': 
            GetData("person");
            break;
        case 'CivilWarVeterans': 
            require_once( HJ_COMPONENT_PATH.'libraries/classes/name.php');
            $name = new HJName;
            $name->SetNameFromParms();
            require_once( HJ_COMPONENT_PATH.'libraries/classes/searchOption.php');
            $searchOption = new SearchOption($_GET["searchOption"],$name);
            $personOption = $_GET["personOption"];
            require_once( HJ_COMPONENT_PATH.'libraries/sqlDatabase/sqlDatabasePerson.php');
            $db = new sqlDatabasePerson();
            $str = $db->getCivilWarVeterans($searchOption,$personOption, $name, "personcw");
            echo $str;
            break;
        case 'PersonCensus':
		case 'DataGridCensus':
        case 'DataGridPerson':
        case 'DataGridVitalRecord':
        case 'PersonVitalRecord':
            $parms = (isset($_GET["parms"])) ? $_GET["parms"] : "";
            require_once( HJ_COMPONENT_PATH.'dataGrid/dataGrid.php');
            CollectInformation($action, $parms);
            break;
        case 'DataGridCivilWar': 
            require_once( HJ_COMPONENT_PATH.'dataGrid/dataGrid.php');
            GetCivilWarData();
            break;
        case 'PersonFamily': 
            require_once( HJ_COMPONENT_PATH.'personFamily/personFamily.php');
            PersonFamily("DataGridPerson", "PersonFamilyData", "GetPersonInfo");
            break; 
        case 'PersonFamilyFromCensus': 
            require_once( HJ_COMPONENT_PATH.'personFamily/personFamily.php');
            PersonFamily("DataGridCensus", "PersonFamilyData", "GetPersonInfo");
            break; 
        case 'PersonFamilyFromSchoolRecords': 
            require_once( HJ_COMPONENT_PATH.'personFamily/personFamily.php');
            PersonFamily("School", "PersonFamilyData", "GetPersonInfo");
            break; 
        case 'PersonFamilyFromCivilWar': 
            require_once( HJ_COMPONENT_PATH.'personFamily/personFamily.php');
            PersonFamily("DataGridCivilWar", "PersonFamilyData", "GetPersonInfo");
            break; 
        case 'QRCodePhotoViewer':
            require_once( HJ_COMPONENT_PATH.'photoViewer/photoViewer.php');
            getAllPhotosForQRCode();
            break;
        case 'PhotoViewer':
            require_once( HJ_COMPONENT_PATH.'photoViewer/photoViewer.php');
            PhotoViewer();
            break;
        case 'ModernRoad':
            require_once( HJ_COMPONENT_PATH.'streetViewer/streetViewer.php');
            StreetViewer();
            break;
        case 'Roads':
            require_once( HJ_COMPONENT_PATH.'roads/roads.php');
            Roads();
            break;
        default:
            HJHelper::showMessage("Invalid Action for Component: ".$action);
            break;
    }
}
//**********************************************************************************************************************************************
Function GetSchoolValue($value)
{
    require_once( HJ_COMPONENT_PATH.'libraries/sqlDatabase/sqlDatabasePerson.php');
    $db = new sqlDatabase();
    $schoolGradeYear = $db->GetSchoolId($value);
    return $schoolGradeYear;
}
//**********************************************************************************************************************************************
Function GetData($tableName)
{
    if (isset($_GET["lastName"]))
	{
        require_once( HJ_COMPONENT_PATH.'libraries/classes/name.php');
        $name = new HJName;
        $name->SetNameFromParms();
        require_once( HJ_COMPONENT_PATH.'libraries/classes/searchOption.php');
        $searchOption = new SearchOption($_GET["searchOption"],$name);
        $personOption = $_GET["personOption"];
        require_once( HJ_COMPONENT_PATH.'libraries/sqlDatabase/sqlDatabasePerson.php');
        $db = new sqlDatabasePerson();
        $str = $db->getPeople($searchOption,$personOption, $name, $tableName);
        echo $str;
	}
}
//**********************************************************************************************************************************************
Function Maps()
{
    $returnString = "";
    for ($i = 1; $i <= 19; $i++)
    {
        if ($i != 1)
        {
        	$returnString.="|";
        }
        $num = +900000 + $i;
        $returnString.=$num.';'.MapName($i);
    }    
    return $returnString;
}
//**********************************************************************************************************************************************
function MapName($mapNum) 
{
    switch ($mapNum)
    {
        case 1: return "1869 Beers";
        case 2: return "1869 Beers Village";
        case 3: return "1860 Walling";
        case 4: return "1856 McClellan";
        case 5: return "1856 McClellan Village";
        case 6: return "1821 Whitelaw";
        case 7: return "1796 Whitelaw";
        case 8: return "1884 Gazetteer";
        case 9: return "2007 Town Map";
        case 10: return "2005 Modern Road Map";
        case 11: return "2003 Agency Of Transportation";
        case 12: return "1986 Agency Of Transportation";
        case 13: return "1967 Tax Map";
        case 14: return "2007 Town Contour Map";
        case 15: return "1997 USGS";
        case 16: return "1899-1933 USGS";
        case 17: return "2008 Tax Map";
        case 18: return "1780 Lotting Dewarts";
        case 19: return "1815 Jamaica Village";
        default: return "Unknown Map";
    }
}
//**********************************************************************************************************************************************
function SchoolYears($personId, $returnAction) 
{
    $returnString = "";
	if ($returnAction == "PersonFamily")
	{
	    $personIdForSearch = $personId;
	}
	else
	{
	    $personIdForSearch = 0;
	}
    require_once( HJ_COMPONENT_PATH.'libraries/sqlDatabase/sqlDatabase.php');
    $db = new sqlDatabase();
    $yearRows = $db->GetSchoolRecordForPersonID($personIdForSearch);
	$count = 1;
    foreach ($yearRows as $yearRow)
    {
	    if ($count > 1)
		{
            $returnString.="|";
		}
		$schoolID = $yearRow["SchoolID"];
		$schoolYear = $yearRow["Year"];
        $db->SelectAllStatement("school","SchoolID",$schoolID);
        $schoolRow = $db->ExecuteQuerySingleResult();
        if ($schoolRow == null) 
        {
            $school = "unknown";
        }
        else
        {
            $school = $schoolRow["School"];
        }

        $returnString.=$schoolID."-".$schoolYear.';'.$schoolYear."-".$school;
		$count++;
    }
    return $returnString;
}
//**********************************************************************************************************************************************
function Census() 
{
    $returnString = "";
    for ($i = 1790; $i <= 1950; $i += 10)
    {
        if ($i != 1790)
        {
            $returnString.="|";
        }
        $text = ($i == 1890) ? " No Census" : " Census";
        $returnString.=$i.';'.$i.$text;
    }
    return $returnString;
}
//**********************************************************************************************************************************************
function Categories()
{
    $returnString = "0;All Photos|1;Collections";
    require_once( HJ_COMPONENT_PATH.'libraries/sqlDatabase/sqlDatabase.php');
    $db = new sqlDatabase();
    $categories = $db->GetCategories();
    foreach ($categories as $category)
    {
        $returnString.=e.$category["CategoryID"].';'.$category["CategoryName"];
    }
    return $returnString;
}
//**********************************************************************************************************************************************
function DefineGlobalValues()
{
    $localHostServer = true;
    JLoader::register('HJHelper',JPATH_SITE."/components/com_historicjamaica/libraries/helperClass.php");
    define("HJ_COMPONENT_PATH",HJHelper::changeBackslash(JPATH_SITE."/components/com_historicjamaica/"));
    define("HJ_XTemplate",HJ_COMPONENT_PATH.'libraries/xtemplate.class.php');
    if ($localHostServer)
    {
        //$serverPort = $_SERVER["SERVER_PORT"];
        //if ($serverPort == 80)
        //{
        //    $serverPort = "/JamaicaHF";
        //}
        //define("HJ_HOSTSERVER","http://".$_SERVER["SERVER_NAME"].":".$serverPort);
        define("HJ_HOSTSERVER","http://"."localhost/JamaicaHF.info");
    }
    else
    {
        $server = $_SERVER["SERVER_NAME"];
        //$server .= "/JamaicaHF4.info";
        define("HJ_HOSTSERVER","https://".$server);
        //define("HJ_HOSTSERVER","http://".$_SERVER["SERVER_NAME"]."/JamaicaHF.info");
        //define("HJ_HOSTSERVER","http://".$_SERVER[SERVER_NAME]."/~jamaicah/JamaicaHF.info");
    }
}
?>