<?php 
defined( '_JEXEC' ) or die( 'Restricted access' );
Function StreetViewer()
{
    if (!isset($_GET["parms"]))
    {	
        HJHelper::returnHome();
    }
    $parms	  = $_GET["parms"];
    $parmArray = explode(",", $parms);
    $modernRoadID = isset($parmArray[1]) ? $parmArray[1]: "";
    require_once( HJ_COMPONENT_PATH.'libraries/sqlDatabase/sqlDatabaseBuildings.php');
    $db = new sqlDatabaseBuildings();
    $modernRoadName = isset($parmArray[2]) ? $parmArray[2]: $db->GetModernRoadName($modernRoadID);


    $templateFile = HJ_COMPONENT_PATH."streetViewer/streetViewer.html";
    if(file_exists($templateFile)) 
        $template = implode("", file($templateFile));
    else 
    {
        echo "<b>ERROR:</b> Can't find the template.html file!";
        exit; 
    }
    $test = HJ_HOSTSERVER;
    $template = str_replace("historicJHSite",HJ_HOSTSERVER,$template);
    $template = str_replace("title",$modernRoadName,$template);
    $template = str_replace("modernRoadID",$modernRoadID,$template);
    echo $template;
}
?>
