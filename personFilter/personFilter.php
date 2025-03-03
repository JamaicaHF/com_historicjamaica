<?php 
defined( '_JEXEC' ) or die( 'Restricted access' );
Function PersonCriteria($dataGridKind, $tablename)
{
    if (isset($_GET["action"]))
    {
        $action	 = $_GET["action"];
        $parms = (isset($_GET["parms"])) ? $_GET["parms"] : "";
        $parmArray = explode(",", $parms);
        $lastName = isset($parmArray[0]) ? $parmArray[0]: "";
        $lastName = str_replace("|","'",$lastName);
        $firstName = isset($parmArray[1]) ? $parmArray[1]: "";
        $middleName = isset($parmArray[2]) ? $parmArray[2]: "";
        $suffix = isset($parmArray[3]) ? $parmArray[3]: "";
        $prefix = isset($parmArray[4]) ? $parmArray[4]: "";
        $personOptions = isset($parmArray[5]) ? $parmArray[5]: "";
    }
    else 
    {
	    $lastName="";
	    $firstName="";
	    $middleName="";
	    $suffix="";
	    $prefix="";
	    $personOptions="";
    } 
    $callbackURL = HJHelper::callbackURL($dataGridKind, 'people-in-jamaica');
    $templateFile = HJ_COMPONENT_PATH."personFilter/personFilter.html";
    if(file_exists($templateFile)) 
        $template = implode("", file($templateFile));
    else 
    {
        echo "<b>ERROR:</b> Can't find the template.html file!";
        exit; 
    }
    $template = str_replace("PersonLastName",$lastName,$template);
    $template = str_replace("PersonFirstName",$firstName,$template);
    $template = str_replace("PersonMiddleName",$middleName,$template);
    $template = str_replace("PersonPrefix",$suffix,$template);
    $template = str_replace("PersonSuffix",$prefix,$template);
    $template = str_replace("SelectedPersonOption",$personOptions,$template);
    $template = str_replace("TableName",$tablename,$template);
    $template = str_replace("CallbackURL",$callbackURL,$template);
    echo $template;
}
