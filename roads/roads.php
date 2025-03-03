<?php 
defined( '_JEXEC' ) or die( 'Restricted access' );
Function Roads()
{
    $templateFile = HJ_COMPONENT_PATH."roads/roads.html";
    if(file_exists($templateFile)) 
        $template = implode("", file($templateFile));
    else 
    {
        echo "<b>ERROR:</b> Can't find the template.html file!";
        exit; 
    }
    //HJHelper::showMessage($template);
    $template = str_replace("historicJHSite",HJHelper::historicJHSite(),$template);
    echo $template;
}
?>
