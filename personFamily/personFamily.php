<?php
defined( '_JEXEC' ) or die( 'Restricted access' );
function PersonFamily($ReturnAction, $dataFunction, $infoFunction)
{
    if (!isset($_GET["parms"]))
    {	
        HJHelper::returnHome();
    }
    $parms	  = $_GET["parms"];
    $parmArray = explode(",", $parms);
    $personID = isset($parmArray[1]) ? $parmArray[1]: "";
    $RecordText = isset($parmArray[2]) ? $parmArray[2]: "";
    
    $templateFile = HJ_COMPONENT_PATH."personFamily/personFamily.html";
    if(file_exists($templateFile)) 
    {
        $template = implode("", file($templateFile));
    }
    else 
    {
        echo "<b>ERROR:</b> Can't find the template.html file!";
        HJHelper::returnHome();
    }
    $template = str_replace("historicJHSite",HJ_HOSTSERVER,$template);
    $template = str_replace("PersonID",$personID,$template);
    $template = str_replace("PreviousScreen",$ReturnAction,$template);
    $template = str_replace("RecordText",$RecordText,$template);
    echo $template;
}
?>