<?php
defined( '_JEXEC' ) or die( 'Restricted access' );
//**********************************************************************************************************************************************
function getAllPhotosForQRCode()
{
    $parms	  = $_GET["parms"];
    $parmArray = explode(",", $parms);
    $option = isset($parmArray[0]) ? $parmArray[0]: "";
    $QRCode = isset($parmArray[1]) ? $parmArray[1]: "";

    require_once(HJ_COMPONENT_PATH."libraries/sqlDatabase/sqlDatabasePhoto.php");
    $db = new sqlDatabasePhoto();
    $photos = $db->getAllPhotosForBuildingFromQRCode($QRCode);
    $returnAction = "ModernRoad";
    $roadId = GetRoadId($QRCode);
    CallPhotoViewer($photos, $returnAction, $roadId, "HFPhotos", 0, 0);
}
function GetRoadId($QRCode)
{
    switch ($QRCode[0])
    {
        case 'M': return 92;	
        case 'P': return 66;	
        case 'W': return 83;	
        case 'D': return 84;	
        case 'C': return 113;	
        case 'F': return 163;	
        case 'T': return 224;	
        case 'L': return 232;	
        case 'R': return 235;	
        default: return 92;
    }
}
function PhotoViewer()
{
    if (!isset($_GET["action"]))
    {	
        HJHelper::returnHome();
    }
    $action	 = $_GET["action"];
    $parms	  = $_GET["parms"];
    $parmArray = explode(",", $parms);
    $option = isset($parmArray[0]) ? $parmArray[0]: "";
    $id = isset($parmArray[1]) ? $parmArray[1]: "";
    require_once(HJ_COMPONENT_PATH."libraries/sqlDatabase/sqlDatabasePhoto.php");
    $db = new sqlDatabasePhoto();
    if ($option == "PersonID")
    {
        $photos = $db->getPersonPhotoIDs($id);
        $returnId = isset($parmArray[2]) ? $parmArray[2]: "0";
        $returnAction = "PersonFamily";
    }
    else
    if ($option == "Building")
    {
        $returnId = $id;
        $streetNum = isset($parmArray[2]) ? $parmArray[2]: "0";
        $photos = $db->getBuildingPhotoIDs($id, $streetNum);
        $returnAction = "ModernRoad";
    }
    else
    {
        return;
    }
    CallPhotoViewer($photos, $returnAction, $returnId, "HFPhotos", 0, 0);
}
function CallPhotoViewer($photos, $returnAction, $returnId, $infoTitle, $year, $page)
{
    $templateFile = HJ_COMPONENT_PATH."photoViewer/photoViewer.html";
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
    $template = str_replace("historicJHSite",HJ_HOSTSERVER,$template);
    $template = str_replace("returnAction",$returnAction,$template);
    $template = str_replace("ReturnID",$returnId,$template);
    $template = str_replace("photos",$photos,$template);
    $template = str_replace("infoTitle",$infoTitle,$template);
    $template = str_replace("year",$year,$template);
    $template = str_replace("page",$page,$template);
    echo $template;
}
?>