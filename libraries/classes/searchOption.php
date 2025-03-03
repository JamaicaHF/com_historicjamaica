<?php
defined( '_JEXEC' ) or die( 'Restricted access' );
define("searchAll", 'A');
define("searchLast", 'L');
define("searchSimilar", 'S');
define("searchPartial", 'P');

class SearchOption 
{
public $searchOption;

function __construct($searchOption,$name)
{
	if ($name->AllNamesPartsAreEmpty() ||
	          ($name->LastNameIsEmpty() && strtolower($searchOption) != "partial"))
    {
	    $this->searchOption = searchAll;
    }
    else if ($name->LastNameIsEmpty() || strtolower($searchOption) == "partial")
    {
	    $this->searchOption = searchPartial;
    }
    else if (strtolower($searchOption) == "last" && strlen($name->lastName) != 0)
    {
	    $this->searchOption = searchLast;
    }
    else if (strtolower($searchOption) == "similar")
    {
	    $this->searchOption = searchSimilar;
    }
	else 
	{
	    $this->searchOption = searchAll;
   	}
}
}
?>