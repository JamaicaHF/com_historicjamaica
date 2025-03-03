<?php
defined( '_JEXEC' ) or die( 'Restricted access' );
class HJName 
{
public $lastName;
public $firstName;
public $knownAs;
public $middleName;
public $prefix;
public $suffix;
public $marriedName;
public $sortLastName;

public function Clear()
{
    $lastName = "";
    $firstName = "";
    $knownAs = "";
    $middleName = "";
    $prefix = "";
    $suffix = "";
    $marriedName = "";
    $sortLastName = "";
}

public function SetNameFromDataRow($row)
{
	$this->firstName = $row["FirstName"];
	$this->middleName = $row["MiddleName"];
	$this->lastName = $row["LastName"];
	$this->suffix = $row["Suffix"];
	$this->prefix = $row["Prefix"];
	$this->marriedName = $row["MarriedName"];
	$this->knownAs = $row["KnownAs"];
}
public function SetTestParms()
{
    $this->lastName = "Bruso";
}
public function SetNameFromParms()
{
	if (isset($_GET["firstName"]))
	{
	    $this->firstName = $_GET["firstName"];
	}
	if (isset($_GET["middleName"]))
	{
	    $this->middleName = $_GET["middleName"];
	}
	if (isset($_GET["lastName"]))
	{
        $lName = $_GET["lastName"];
        $this->lastName = str_replace("|","'",$lName);
	}
	if (isset($_GET["suffix"]))
	{
	    $this->suffix = $_GET["suffix"];
	}
	if (isset($_GET["prefix"]))
	{
	    $this->prefix = $_GET["prefix"];
	}
}

public function SetName($firstName, $middleName, $lastName, $prefix, $suffix, $marriedName="", $knownAs="", $sortLastName="")
{
	if (isset($lastName))
	{
    	$this->lastName = $lastName;
	}
	if (isset($firstName))
	{
	    $this->firstName = $firstName;
	}
	if (isset($middleName))
	{
	    $this->middleName = $middleName;
	}
	if (isset($prefix))
	{
	    $this->prefix = $prefix;
	}
	if (isset($suffix))
	{
	    $this->suffix = $suffix;
	}
	if (isset($marriedName))
	{
	    $this->marriedName = $marriedName;
	}
	if (isset($knownAs))
	{
	    $this->knownAs = $knownAs;
	}
	if (isset($sortLastName))
	{
	    $this->sortLastName = $sortLastName;
	}
}

public function BuildNameString($forDetailRecordFistNameFirst)
{
	if ($forDetailRecordFistNameFirst)
	{
		return HJName::BuildNameFirstNameFirst();
	}
	else
	{
		return HJName::BuildNameLastNameFirst();
	}
}
public function ShortNameFirstNameFirst()
{
    $personName = "";
    if (HJHelper::notEmptyStr($this->prefix))
    {
        $personName.=$this->prefix." ";
    }
    if (HJHelper::notEmptyStr($this->firstName))
    {
        $personName.=$this->firstName." ";
    }
    if (HJHelper::notEmptyStr($this->middleName))
    {
        $personName.=$this->middleName[0]." ";
    }
    if (HJHelper::notEmptyStr($this->marriedName))
    {
    }
    else
    if (HJHelper::notEmptyStr($this->lastName))
    {
        $personName.=$this->lastName." ";
    }
    if (HJHelper::notEmptyStr($this->suffix))
    {
        $personName.=$this->suffix;
    }
    return trim($personName);
}
public function BuildNameFirstNameFirst()
{
    $personName = "";
    if (HJHelper::notEmptyStr($this->prefix))
    {
        $personName.=$this->prefix." ";
    }
    if (HJHelper::notEmptyStr($this->firstName))
    {
        $personName.=$this->firstName." ";
    }
    if (HJHelper::notEmptyStr($this->knownAs))
    {
        $personName.="[".$this->knownAs."] ";
    }
    if (HJHelper::notEmptyStr($this->middleName))
    {
        $personName.=$this->middleName." ";
    }
    if (HJHelper::notEmptyStr($this->marriedName))
    {
        if (HJHelper::notEmptyStr($this->lastName))
            $personName.="(".$this->lastName.") ";
        $personName.=$this->marriedName." ";
    }
    else
    if (HJHelper::notEmptyStr($this->lastName))
    {
        $personName.=$this->lastName." ";
    }
    if (HJHelper::notEmptyStr($this->suffix))
    {
        $personName.=$this->suffix;
    }
    return trim($personName);
}
public function BuildNameLastNameFirst()
{
	$personName = "";
	if (HJHelper::notEmptyStr($this->marriedName))
	{
        $personName=$this->marriedName." , ";
	}
    else
    if (HJHelper::notEmptyStr($this->lastName))
    {
        $personName=$this->lastName." ";
        if (HJHelper::notEmptyStr($this->suffix))
        {
            $personName.=$this->suffix;
        }
        $personName.=", ";
    }
    if (HJHelper::notEmptyStr($this->prefix))
    {
        $personName.=$this->prefix." ";
    }
    if (HJHelper::notEmptyStr($this->firstName))
    {
        $personName.=$this->firstName." ";
    }
    if (HJHelper::notEmptyStr($this->knownAs))
    {
        $personName.="[".$this->knownAs."] ";
    }
    if (HJHelper::notEmptyStr($this->middleName))
    {
        $personName.=$this->middleName." ";
    }
    if (HJHelper::notEmptyStr($this->marriedName) && HJHelper::notEmptyStr($this->lastName)) // both married and maiden name
    {
        $personName.="(".$this->lastName.") ";
    }
    return trim($personName);
}

function familyName($personRow, $spouseRow)
{
    if ($personRow == null)
    {
        if ($spouseRow == null)
        {
            return "";
        }
        else
        {
            $personRow = $spouseRow;
            $spouseRow = null;
        }
    }
    $this->SetNameFromDataRow($personRow);
    $personLastName = $this->marriedName;
    if (HJHelper::emptyStr($personLastName))
    {
        if (HJHelper::emptyStr($this->lastName) && $spouseRow != null)
        {
            $personLastName = $spouseRow["LastName"];
        }
        else
        {
            $personLastName = $this->lastName;
        }
        $familyName = $personLastName;
        if (HJHelper::notEmptyStr($this->suffix))
        {
            $familyName.=" ".$this->suffix;
        }
    }
    else
    {
        $familyName = $personLastName;
    }
    $first = $this->PrefixFirstNameMiddleName();
    $familyName.=", ".$first;
    if ($spouseRow != null)
    {
        $this->SetNameFromDataRow($spouseRow);
        $familyName.= " and ";
        $marriedName = $this->marriedName;
        if (HJHelper::emptyStr($marriedName))
        {
            $marriedName = $this->lastName;
        }
        if ($marriedName != $personLastName)
        {
            $familyName.= $marriedName.", ";
        }
        $familyName.= $this->PrefixFirstNameMiddleName();
    }
    return $familyName;
}
function PrefixFirstNameMiddleName()
{
    $name = "";
    if (HJHelper::notEmptyStr($this->prefix))
    {
        $name.=" ".$this->prefix;
    }
    $name.=$this->firstName;
    if (HJHelper::notEmptyStr($this->middleName))
    {
        $name.=" ".$this->middleName;
    }
    return $name;
}
function BuildSortName()
{
    $personName = "";
    if (HJHelper::notEmptyStr($this->sortLastName))
    {
        $lengthOfSortName = strlen($this->sortLastName);
    	if (strlen($this->marriedName) < $lengthOfSortName)
        {
            $personName = $this->lastName;
        }
        else
        {
            $compareName = substr($this->marriedName, 0, $lengthOfSortName);
            if (trim(strtolower($compareName)) == trim(strtolower($this->sortLastName)))
            {
                $personName = $this->marriedName;
            }
            else
            {
                $personName = $this->lastName;
            }
        }
    }
    else
    if (HJHelper::notEmptyStr($this->marriedName))
    {
        $personName.=$this->marriedName;
    }
    else
    {
        $personName.=$this->lastName;
    }
    $personName = ($personName." ".$this->firstName." ".$this->middleName);
    return $personName;
}

public function LastNameIsEmpty()
{
	$returnVal = HJHelper::emptyStr($this->lastName);
	return $returnVal;
}

public function AllNamesPartsAreEmpty()
{
	$returnVal = (HJHelper::emptyStr($this->lastName) && HJHelper::emptyStr($this->firstName) && 
   	        HJHelper::emptyStr($this->middleName) && HJHelper::emptyStr($this->suffix) && 
   	        HJHelper::emptyStr($this->prefix));
	return $returnVal;
}
}
?>
