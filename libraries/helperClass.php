<?php
defined( '_JEXEC' ) or die( 'Restricted access' );

class HJHelper 
{
static function showMessage($msg)
{
echo '<script type="text/javascript">', 'alert("' . $msg . '")','</script>';
//echo <<<_END
//<script type="text/javascript">
//    alert("$message");
//</script>
//_END;
}

static function historicJHSite()
{
    return HJ_HOSTSERVER."/index.php";
}
static function callbackURL($action, $tab="")
{
    $option = (HJHelper::emptyStr($tab)) ? ""  : '/'.$tab;
    $option .= "?option=com_historicjamaica";
    $action = "&action=".$action;
    $xxxx = HJ_HOSTSERVER;
    return HJ_HOSTSERVER."/index.php".$option.$action;
}
static function returnHome()
{
	$callback = HJ_HOSTSERVER."/index.php";
    header("Location: ".$callback);
}
static function backToPreviousPage()
{
echo <<<_END
	<script type="text/javascript">
    javascript:history.back(-1)
</script>
_END;
}
static function hfPhotoName($photoID)
{
    $photoNum = $photoID + 1000000;
    return "HF".substr($photoNum,1,6);
}
static function alphaChar($char)
{
    return (preg_match('/[a-zA-Z]/', $char));
}
static function changeBackslash($filename)
{
    return preg_replace("/\\\/", "/", $filename);
}
static function arrayLen($array)
{
    if ($array == null)
    {
    	return 0;
	}
	return count($array);
}
static function array_sort($array, $on, $order="")
{
    $new_array = array();
    $sortable_array = array();
 
    if (HJHelper::arrayLen($array) != 0) 
    {
        foreach ($array as $k => $v) 
        {
            if (is_array($v)) 
            {
                foreach ($v as $k2 => $v2) 
                {
                    if ($k2 == $on) 
                    {
                        $sortable_array[$k] = $v2;
                    }
                }
            } 
            else 
            {
                $sortable_array[$k] = $v;
            }
        }
        switch(trim(strtolower($order)))
        {
            case 'desc':
                arsort($sortable_array);
            break;
            default:   
                asort($sortable_array);
            break;
        }
        foreach($sortable_array as $k => $v) 
        {
            $new_array[] = $array[$k];
        }
    }
    return $new_array;
}

static function numInArray(&$queryArray)
{
    return ($queryArray == null) ? 0: count($queryArray);
}

static function GetCookie($cookieName)
{
	if (isset($_COOKIE[$cookieName]))
	{
		return $_COOKIE[$cookieName];
	}
	return "";
}

static function strEqualNoCase($strOne, $strTwo)
{
	return trim(strtolower($strOne)) == trim(strtolower($strTwo));
}
static function StrContains($str, $contains)
{
    if (strpos($str, $contains) !== FALSE)
        return true;
    else
        return false;
}
static function emptyStr($str)
{
    if (!isset($str))
	{
		return true;
	}
    $return = (trim($str)==='');
	return $return;
}
static function notEmptyStr($str)
{
	return (!HJHelper::emptyStr($str));
}
//**********************************************************************************************************************************************
static function YmdToMdy($date)
{
	$year  = substr($date, 0, 4);
	$month = substr($date, 5, 2);
	$day   = substr($date, 8, 2);
	$returnString = "";
	//if ($month.length != 0)
        if (HJHelper::notEmptyStr($month))
	{
		$returnString.= ($month.'/');
	}
	//if ($day.length != 0)
        if (HJHelper::notEmptyStr($day))
	{
		$returnString.= ($day.'/');
	}
	return $returnString.$year;
}
//**********************************************************************************************************************************************
static function BirthDeathBurialSource($source, $book, $page)
{
	$returnString = "";
	if ($source == "Jamaica Vital Records")
	{
		$returnString.=$source.": ";
	}
	else
	if (strlen($source) != 0)
    {
    	$returnString.="Source: ".$source;
    }
    if (strlen($book) != 0)
    {
        $returnString.=" Book ".$book;
        if (strlen($page) != 0)
        {
            $returnString.="-Page ".$page;
        }
    }	
	return $returnString;
}
//**********************************************************************************************************************************************
static function BurialDate($diedDate, $BuriedDate, $place, $stone)
{
	if (strlen($BuriedDate) == 0)
	{
		return "";
	}
	if (strlen($diedDate) == 0) // There is no Died Date, use Buried Date
	{
    	$foundData = true;
    	$returnString.=HJHelper::YmdToMdy($BuriedDate);
	}
	if (strlen($place) != 0)
	{
		$returnString.="Buried in ".$place." Cemetery";
		if (strlen($stone) != 0)
		{
			$returnString.=" lot ".$stone;
		}
	}
	return $returnString;
}
//**********************************************************************************************************************************************
static function BirthDeathDate($text, $date, $place, $home)
{
    $foundData = false;
    $returnString = $text.' ';
    if (HJHelper::notEmptyStr($date))
    {
    	$foundData = true;
    	$returnString.=HJHelper::YmdToMdy($date);
    }
    //if (strlen($place) != 0)
    //{
    	//$foundData = true;
    	//$returnString.=" in ".$place;
    //}
    if ($foundData)
    {
        return $returnString;
    }
    else 
    {
        return "";
    }
}
static function getDomElementByTagName()
{
    $i = 10;
    $dom = new DOMDocument();
    $dom->load("index.php");
    $headers = $dom->getElementsByTagName('div');
    //        foreach ($headers as $header) 
    //        {
    //            foreach ($header->attributes as $attr) 
    //            {
    //                $name = $attr->nodeName;
    //                $value = $attr->nodeValue;
    //            }
    //        }
}
//****************************************************************************************************************************
static function CombineName1AndName2($Name1, $Name2)
{
    if (strlen($Name2) == 0)
        return $Name1;
	$returnString = $Name1;
	$lastName1 = HJHelper::getLastName($Name1);
	$lastName2 = HJHelper::getLastName($Name2);
    if ($lastName1 == $lastName2)
    {
		$Name2 = str_replace($lastName2,"",$Name2);
		$Name2 = trim($Name2);
    }
    if (strlen($Name2) != 0)
    {
	    $firstThreeChars = substr($Name2, 0, 3);
        if (strtolower($firstThreeChars) != "c/o")
		{
            $returnString .= " & \r\n";
		}
        $returnString .= " ".$Name2;
    }
    return $returnString;
}
//****************************************************************************************************************************
static function getLastName($name)
{
    $pos = strpos($name, ",");
    if ($pos === false)
    {
        $pos = strpos($name, " ");
    }
    if ($pos === false)
	{
	    $pos = 0;
	}
	if ($pos > 0)
    {
	    return substr($name, 0, $pos);
	}
    return $name;
}
//****************************************************************************************************************************
static function detectBrowser()
{
    // Attempt to detect the browser type.  Obviously we are only worried about major browsers.
    $userAgent = $_SERVER['HTTP_USER_AGENT'];
    if ((stripos($userAgent, 'MSIE') !== false) && (stripos($userAgent, 'Opera') === false))
    {
        return 'MSIE';
    }
    elseif ((stripos($userAgent, 'Firefox') !== false) && (stripos($userAgent, 'like Firefox') === false))
    {
        return 'Firefox';
    }
    elseif (stripos($userAgent, 'Chrome') !== false)
    {
        return 'Chrome';
    }
    elseif (stripos($userAgent, 'Safari') !== false)
    {
        return 'Safari';
    }
    elseif (stripos($userAgent, 'Opera') !== false)
    {
        return 'Opera';
    }
    return "";
}
//****************************************************************************************************************************
}