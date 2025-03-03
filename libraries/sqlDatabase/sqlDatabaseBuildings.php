<?php
require_once(HJ_COMPONENT_PATH.'libraries/sqlDatabase/sqlDatabase.php');

class sqlDatabaseBuildings extends sqlDatabase 
{
    //**********************************************************************************************************************************************
    function GetAllRoads($roadType)
    {
        $this->SelectAllStatement("modernroadvalue"," Order By ModernRoadValueSection,ModernRoadValueValue ");
        $this->OrderBy(array("ModernRoadValueSection","ModernRoadValueValue"));
        $queryResult = $this->ExecuteQuery();
        $numRoads = 0;
        $returnString = "";
        foreach ($queryResult as $row)
        {
            if ($roadType == "M" || $row["HistoricRoad"] == 'Y')
            {
                $returnString.=$row["ModernRoadValueID"].d.$row["ModernRoadValueSection"].d.$row["ModernRoadValueValue"].e;
                $numRoads++;
            }
        }
        return e.$numRoads.d.$roadType.e.$returnString;
    }
    //**********************************************************************************************************************************************
    function GetModernRoadName($modernRoadID)
    {
        $this->SelectAllStatement("modernroadvalue", "ModernRoadValueID", $modernRoadID);
        $row = $this->ExecuteQuerySingleResult();
        if ($row == null) return "";
        return $row["ModernRoadValueValue"];
    }
    //**********************************************************************************************************************************************
    function GetBuildingByModernRoadID($ModernRoadID)
    {
        $maxAddress = 999999;
        $buildingArray = $this->GetBuildingsNotOnGrandList($ModernRoadID);
        $numBuildings = (HJHelper::arrayLen($buildingArray) == 0) ? 0 : count($buildingArray);
        $this->SelectAllStatement("grandlist", "BuildingRoadValueID", $ModernRoadID);
        $this->OrderBy("StreetNum");
        $queryResult = $this->ExecuteQuery();
        $numRecords = count($queryResult);
        $grandListIndex = 0;
        $buildingIndex = 0;
        $rowIndex = 0;
        $row = ($grandListIndex < $numRecords ) ? $queryResult[$rowIndex] : null;
        $buildingAddress = ($buildingIndex < $numBuildings) ? $buildingArray[$buildingIndex]["StreetNum"] : $maxAddress;
        $grandlistAddress = ($row != null) ? $row["StreetNum"] : $maxAddress;
        $returnString = "";
		$totalRecords = 0;
        while ($grandlistAddress < $maxAddress || $buildingAddress < $maxAddress)
        {
            if ($buildingAddress < $grandlistAddress)
            {
                $buildingID = $buildingArray[$buildingIndex]["BuildingID"];
                $buildingName = $buildingArray[$buildingIndex]["BuildingName"];
                $returnString.= $this->addAllBuildingsToResultString($buildingID, "", $buildingAddress, $buildingName);
                $buildingIndex++;
                $buildingAddress = ($buildingIndex < $numBuildings) ? $buildingArray[$buildingIndex]["StreetNum"] : $maxAddress;
				$totalRecords++;
            }
            else
            {
                $grandListID = $row["ID"];
				if ($grandlistAddress != 0)
				{
                    $buildingID = $this->BuildingIDFromGrandListID($grandListID, $buildingName);
                    $ownerName = $this->CombineName1AndName2($row["Name1"], $row["Name2"]);
                    $returnString.= $this->addAllBuildingsToResultString($buildingID, $ownerName, $grandlistAddress, $buildingName);
    				$totalRecords++;
				}
                $grandListIndex++;
                $rowIndex++;
                $row = ($grandListIndex < $numRecords ) ? $queryResult[$rowIndex] : null;
                $grandlistAddress = ($row != null) ? $row["StreetNum"] : $maxAddress;
            }
        }
        $returnString = e.$totalRecords.e.$returnString;
        return $returnString;
    }
    //**********************************************************************************************************************************************
    function addAllBuildingsToResultString($buildingID, $ownerName, $address, $buildingName)
    {
        if (HJHelper::emptyStr($buildingID))
        {
            $numPhotos = 0;
        }
        else
        {
            $this->getAllPhotosForBuilding($buildingID, $numPhotos);
        }
        $returnString = $this->addField($address,d);
        $returnString.= $this->addField($ownerName, d);
        $returnString.= $this->addField($buildingID,d);
        $returnString.= $this->addField($buildingName,d);
        $returnString.= $this->addField($numPhotos,e);
        return $returnString;
    }
    //****************************************************************************************************************************
    function BuildingIDFromGrandListID($grandListID, &$buildingName)
    {
        $this->SelectAllStatement("building", "BuildingGrandListID", $grandListID);
        $row = $this->ExecuteQuerySingleResult();
        if ($row == null)
        {
            $buildingName = "";
            return "";
        }
        $buildingID = $row["BuildingID"];
        $buildingName = $row["BuildingName"];
        return $buildingID;
    }
    //****************************************************************************************************************************
    function CombineName1AndName2($name1, $name2)
    {
        if (HJHelper::emptyStr($name2))
        {
            return $name1;
        }
        $returnString = $name1;
        $commaLocation = strrpos($name1, ",");
        if ($commaLocation > 0)
        {
            $lastName = substr($name1, 0, $commaLocation);
            if (substr($name2, 0, $commaLocation) == $lastName)
            {
                $replaceString = $lastName.",";
                if ($name2[$commaLocation+1] == ' ')
                {
                    $replaceString.=" ";
                }
                $name2 = str_replace($replaceString, '', $name2);
            }
        }
        if (!HJHelper::emptyStr($name2))
        {
		    $totalLength = strlen($name1) + strlen($name2);
			if ($totalLength < 43)
			{
                if (substr($name2, 0, 3) != "c/o")
                {
                    $returnString.= " &";
                }
                $returnString.= (" ".$name2);
			}
        }
        return $returnString;
    }
    //**********************************************************************************************************************************************
    function GetBuildingsNotOnGrandList($ModernRoadID)
    {
        $this->SelectAllStatement("building","BuildingRoadValueID",$ModernRoadID,"BuildingGrandListID",0);
        $this->OrderBy("StreetNum");
        $queryResult = $this->ExecuteQuery();
        if ($queryResult == null) return null;
        $numRecords = count($queryResult);
        $buildingArray = array($numRecords);
        $i = 0;
        foreach ($queryResult as $row)
        {
            $address = $row["StreetNum"];
            $name = $row["BuildingName"];
            $id = $row["BuildingID"];
            $buildingInfo = array("StreetNum"=>$address,"BuildingName"=>$name,"BuildingID"=>$id);
            $buildingArray[$i] = $buildingInfo;
            $i++;
        }
        return $buildingArray;
    }
    //**********************************************************************************************************************************************
    function GetBuildingInfo($buildingID)
    {
        $returnString = "";
        $buildingRow = $this->GetBuilding($buildingID);
        $countInArray = 0;
        if (HJHelper::notEmptyStr($buildingRow))
        {
            $queryArray=null;
            $this->AddToArray($queryArray, $buildingRow["BuildingName"], $buildingRow["Notes"]);
            $countInArray++;
            $BuildingGrandListID = $buildingRow["BuildingGrandListID"];
            if ($BuildingGrandListID != 0)
            {
                $grandlistRow = $this->GetGrandListValue($BuildingGrandListID);
                if (HJHelper::notEmptyStr($grandlistRow))
                {
                    $owner = $this->CombineName1AndName2($grandlistRow["Name1"], $grandlistRow["Name2"]);
                    $this->AddToArray($queryArray, "Current Owner", x);
                    $countInArray++;
                    $this->AddToArray($queryArray, $owner, $buildingRow["NotesCurrentOwner"]);
                    $countInArray++;
                }
            }
            $this->GetOccupants($queryArray, $countInArray, $buildingID);
            $returnString = $this->SortAndReturnValues($queryArray, $countInArray);
        }
        return $returnString;
    }
    //**********************************************************************************************************************************************
    function SortAndReturnValues($queryArray, $numRecords)
    {
        //	$queryArray = HJHelper::array_sort($queryArray, "FullName", $sortDirection);
        $numRecords = HJHelper::numInArray($queryArray);
        $returnString = e.$numRecords.e;
        for ($i = 0; $i < $numRecords; $i++)
        {
            $element = $queryArray[$i];
            $returnString.= ($element[0].d.$element[1].e);   
        }
        return $returnString;
    }
    //**********************************************************************************************************************************************
    function GetGrandListValue($grandListID)
    {
        $this->SelectAllStatement("grandlist", "ID", $grandListID);
        $queryResult = $this->ExecuteQuerySingleResult();
        if ($queryResult == null)
        {
            return "";
        }
        return $queryResult;
    }
    //**********************************************************************************************************************************************
    function GetBuilding($buildingID)
    {
        $this->SelectAllStatement("building", "BuildingID", $buildingID);
        $queryResult = $this->ExecuteQuerySingleResult();
        if ($queryResult == null)
        {
            return "";
        }
        else
        {
            return $queryResult;
        }
    }
    //**********************************************************************************************************************************************
    function GetOccupants(&$queryArray, &$countInArray, $buildingID)
    {
        $this->SelectAllStatement("buildingoccupant", "BuildingID", $buildingID);
        $this->OrderBy("BuildingValueOrder");
        $queryResult =$this->ExecuteQuery();
        if ($queryResult == null)
            return;
        $this->AddToArray($queryArray, "Building Occupants", x);
        $countInArray++;
        foreach ($queryResult as $personBuildingRow)
        {
            $personRow = $this->getPerson($personBuildingRow["PersonID"]);
            $spouseRow = $this->getPerson($personBuildingRow["SpouseLivedWithID"]);
            require_once(HJ_COMPONENT_PATH.'libraries/classes/name.php');
            $name = new HJName;
            $familyName = $name->familyName($personRow, $spouseRow);
            if (HJHelper::notEmptyStr($familyName))
            {
                $familyName.= $this->occupantString();
                $notes = $personBuildingRow["Notes"];
                $order = $personBuildingRow["BuildingValueorder"];
                $this->AddToArray($queryArray, $familyName, $notes);
                $countInArray++;
            }
        }
    }
    //**********************************************************************************************************************************************
    function occupantString()
    {
        return " (Occupant)";
    }
    //**********************************************************************************************************************************************
    function AddToArray(&$queryArray, $value, $notes)
    {
        array(2);
        $queryElement[0] = $value; 
        $queryElement[1] = $notes; 
        $queryArray[] = $queryElement;
    }
}
