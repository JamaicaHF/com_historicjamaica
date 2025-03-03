<?php
require_once(HJ_COMPONENT_PATH.'libraries/sqlDatabase/sqlDatabase.php');

class sqlDatabasePersonFamily extends sqlDatabase 
{
    function getPersonFamilyInfo($personID)
    {
        $returnString = e;
        $row = $this->getAllPersonFamilyInfo($personID,$returnString);
        $spouses = $this->getAllSpouses($personID);
        $numSpouses = HJHelper::numInArray($spouses);
        $returnString.=$numSpouses.e;
    	if ($numSpouses == 0)
    	{
    		$spouseID = 0;
            $returnString.=$this->emptyPerson();
            $returnString.=$this->emptyPerson();
    		$returnString.=$this->emptyPerson();
    	}
    	else
    	{
        	for ($i = 0;$i < $numSpouses; $i++)
        	{
    	    	$spouseID = $spouses[$i];
                $this->getAllPersonFamilyInfo($spouseID,$returnString);
    	        $returnString.=$this->children($personID,$spouseID);
        	}
    	}
        $array = explode("|", $returnString);
        $num = count($array) - 2;
        return e.$num.$returnString;
    }
    //**********************************************************************************************************************************************
    function getAllPersonFamilyInfo($personID, &$returnString)
    {
        $row =$this->getPerson($personID);
        $returnString.=$this->personFamilyInfo($row);
        $fatherID = $row["FatherID"];
        $motherID = $row["MotherID"];
        if ($fatherID != 0)
        {
            $row = $this->getPerson($fatherID);
            $returnString.=$this->personFamilyInfo($row);
        }
        else 
        {
            $returnString.=$this->emptyPerson();
        }
        if ($motherID != 0)
        {
            $row = $this->getPerson($motherID);
            $returnString.=$this->personFamilyInfo($row);
        }
        else 
        {
            $returnString.=$this->emptyPerson();
        }
    }
    //**********************************************************************************************************************************************
    function emptyPerson()
    {
    	$num = 0;
        return $num.d.d.d.d.d.e;
    }
    //**********************************************************************************************************************************************
    function personFamilyInfo($row)
    {
    	require_once(HJ_COMPONENT_PATH.'libraries/classes/name.php');
        $name = new HJName;
        $name->SetNameFromDataRow($row);
    	$fullName = $name->BuildNameFirstNameFirst();
    	$birthInfo = HJHelper::BirthDeathDate("Born", $row["BornDate"], $row["BornPlace"], $row["BornHome"]);
    	$DeathInfo = HJHelper::BirthDeathDate("Died", $row["DiedDate"], $row["DiedPlace"], $row["DiedHome"]);
    	$returnString = $row["PersonID"].d.$fullName.d.$birthInfo.d.$DeathInfo.d;
    	$returnString.= $this->HasAdditionalInformation($row).d;
    	$returnString.= $this->getButtonInfo($row["PersonID"]);
    	return $returnString;
    }
    //**********************************************************************************************************************************************
    function getButtonInfo($personID)
    {
    	$numPhotos = 0;
    	$this->getPersonPhotos($personID, $numPhotos);
        $vitalRecordIDs = OnlyNum;
    	$numVitalRecords = $this->GetAllVitalRecordIdsForPerson($personID, $vitalRecordIDs);
    	return $numPhotos.d.$numVitalRecords.e;
    }
    //**********************************************************************************************************************************************
    function HasAdditionalInformation($row)
    {
    	$hasAdditionalInformation = false;
    	if (HJHelper::notEmptyStr($row["PersonDescription"]))
    	{
    		$hasAdditionalInformation = true;
    	}
    	if (HJHelper::notEmptyStr($row["Source"]) && $row["Source"] != "Manual Entry")
    	{
    		$hasAdditionalInformation = true;
    	}
        if (HJHelper::notEmptyStr($row["BurriedDate"]))
    	{
    		$hasAdditionalInformation = true;
    	}
    	if ($this->CheckBirthOrDeathInfo($row, "BornSource", "BornPlace", "BornHome", "BornBook", "BornPage"))
    	{
    		$hasAdditionalInformation = true;
    	}
        if ($this->CheckBirthOrDeathInfo($row, "DiedSource", "DiedPlace", "DiedHome", "DiedBook", "DiedPage"))
    	{
    		$hasAdditionalInformation = true;
    	}
        if ($this->CheckBirthOrDeathInfo($row, "BuriedSource", "BuriedPlace", "BuriedHome", "BuriedBook", "BuriedPage"))
    	{
    		$hasAdditionalInformation = true;
    	}
        $returnStrings = OnlyNum;
        if ($this->GetAllBuildingLivedIn($row["PersonID"], $returnStrings) != 0)
    	{
    		$hasAdditionalInformation = true;
    	}
        if ($this->GetAllCensusRecordsForPerson($row, $returnStrings) != 0)
        {
    		$hasAdditionalInformation = true;
        }
        return $hasAdditionalInformation;
    }
    //**********************************************************************************************************************************************
    function CheckBirthOrDeathInfo($row, $Source, $place, $home, $book, $page)
    {
    	$hasAdditionalInformation = false;
    	if (HJHelper::notEmptyStr($row[$Source]) && $row[$Source] != "Jamaica Vital Records" && $row[$Source] != "From Death Record")
    	{
    		$hasAdditionalInformation = true;
    	}
    	if (HJHelper::notEmptyStr($row[$place]))
    	{
    		$hasAdditionalInformation = true;
    	}
    	if (HJHelper::notEmptyStr($row[$home]))
    	{
    		$hasAdditionalInformation = true;
    	}
    	if (HJHelper::notEmptyStr($row[$book]))
    	{
    		$hasAdditionalInformation = true;
    	}
    	if (HJHelper::notEmptyStr($row[$page]))
    	{
    		$hasAdditionalInformation = true;
    	}
    	return $hasAdditionalInformation;
    }
    //**********************************************************************************************************************************************
    function children($personID,$spouseID)
    {
    	$query = $this->SelectAllStatement("person", "FatherID", $personID, "MotherID", $spouseID);
        $queryResult = $this->ExecuteQuery();
        $numChildren = count($queryResult);
        if ($numChildren == 0)
        {
    	    $this->SelectAllStatement("person", "FatherID", $spouseID, "MotherID", $personID);
            $queryResult = $this->ExecuteQuery();
            $numChildren = count($queryResult);
            if ($numChildren == 0)
            {
            	$zero = 0;
            	$str = $zero.e.$zero.d.e;
            	return $str;
            }
        }
        $str = $numChildren.e;
    	require_once(HJ_COMPONENT_PATH.'libraries/classes/name.php');
        $J = 0;
        foreach ($queryResult as $row)
    	{
    		if ($J != 0) 
            {
                $str.=d;
            }
            $J++;
    		$str.=$row["PersonID"].a;
            $name = new HJName;
            $name->SetNameFromDataRow($row);
    		$str.=$name->BuildNameFirstNameFirst().a;
    		$str.=$row["BornDate"];
    	}
        return $str.e;
    }
    //**********************************************************************************************************************************************
}
