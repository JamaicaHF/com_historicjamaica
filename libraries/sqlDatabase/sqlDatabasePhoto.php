<?php
require_once(HJ_COMPONENT_PATH.'libraries/sqlDatabase/sqlDatabase.php');

class sqlDatabasePhoto extends sqlDatabase 
{
    //**********************************************************************************************************************************************
    function getPersonPhotoIDs($personID)
    {
        $queryResult = $this->getPersonPhotos($personID, $numRecords);
        return $this->QueryPhotos($queryResult, $numRecords);
    }
    //**********************************************************************************************************************************************
    function getPersonInfo($personID)
    { 
        $this->SelectAllStatement("person","PersonID",$personID);
        $row = $this->ExecuteQuerySingleResult();
        if ($row == null)
            return "";
        $returnString = $this->addAllPersonFieldsToResultString($personID, $row);
        return $returnString;
    }
    //**********************************************************************************************************************************************
    function getBuildingPhotoIDs($modernRoadID, $StreetNum)
    {
        $returnString = "";
        $this->SelectAllStatement("grandlist", "BuildingRoadValueID", $modernRoadID, "StreetNum", $StreetNum);
        $queryElement = $this->ExecuteQuerySingleResult();
        if ($queryElement == null)
        {
            if ($StreetNum == 0)
            {
                $this->SelectAllStatement("building", "BuildingRoadValueID", $modernRoadID, "BuildingGrandListID", $StreetNum);
     		}
            else
            {
     		    $this->SelectAllStatement("building", "BuildingRoadValueID", $modernRoadID, "StreetNum", $StreetNum);
            }
            $queryElement = $this->ExecuteQuerySingleResult();
        }
        else
        {
            $this->SelectAllStatement("building", "BuildingGrandListID", $queryElement["ID"]);
            $queryElement = $this->ExecuteQuerySingleResult();
        }
        if ($queryElement != null)
        {
            $returnString = $this->getAllPhotosForBuilding($queryElement["BuildingID"], $numPhotos);
        }
        return $returnString;
    }
    //**********************************************************************************************************************************************
    function addAllPersonFieldsToResultString($personID,$row)
    {
        require_once(HJ_COMPONENT_PATH.'libraries/classes/name.php');
        $name = new HJName;
        $name->SetNameFromDataRow($row);
        $returnString = e;
        $returnString.= $this->addField($row["PersonID"],f);
        $returnString.= $this->addField($name->BuildNameFirstNameFirst(),f);
        $returnString.= $this->addField($this->SpouseName($row),f);
        $returnString.= $this->addField($this->PersonName($row["FatherID"]),f);
        $returnString.= $this->addField($this->PersonName($row["MotherID"]),f);
        $returnString.= $this->addField($row["Source"],f); 
        $returnString.= $this->addField($row["PersonDescription"],f); 
        $birthDateInfo = HJHelper::BirthDeathDate("Born", $row["BornDate"], $row["BornPlace"], $row["BornHome"]);
        $DeathDateInfo = HJHelper::BirthDeathDate("Died", $row["DiedDate"], $row["DiedPlace"], $row["DiedHome"]);
        $BuriedDateInfo = HJHelper::BurialDate($row["DiedDate"], $row["BuriedDate"], $row["BuriedPlace"], $row["BuriedStone"]);
        $birthSourceInfo = HJHelper::BirthDeathBurialSource($row["BornSource"], $row["BornBook"], $row["BornPage"]);
        $DeathSourceInfo = HJHelper::BirthDeathBurialSource($row["DiedSource"], $row["DiedBook"], $row["DiedPage"]);
        $BuriedSourceInfo = HJHelper::BirthDeathBurialSource($row["BuriedSource"], $row["BuriedBook"], $row["BuriedPage"]);
        $returnString.= $this->addField($birthDateInfo,f);
        $returnString.= $this->addField($row["BornHome"],f);
        $returnString.= $this->addField($birthSourceInfo,f);
        $returnString.= $this->addField($DeathDateInfo,f);
        $returnString.= $this->addField($row["DiedHome"],f);
        $returnString.= $this->addField($DeathSourceInfo,f);
        $returnString.= $this->addField($BuriedDateInfo,f);
        $returnString.= $this->addField($BuriedSourceInfo,f);
        $SchoolRecords = "";
        $returnString.= $this->addField($this->GetAllSchoolRecords($personID, $SchoolRecords),a).$SchoolRecords.f;
        $buildingsLivedIn = "";
        $returnString.= $this->addField($this->GetAllBuildingLivedIn($personID, $buildingsLivedIn),a).$buildingsLivedIn.f;
        $censusYears = "";
        $returnString.= $this->addField($this->GetAllCensusRecordsForPerson($row, $censusYears),a).$censusYears.f;
		$civilWarInfo = "";
        $returnString.= $this->addField($this->GetCivilWarRecordForPerson($personID, $civilWarInfo),a).$civilWarInfo.f;
        return $returnString.e;
    }
    //**********************************************************************************************************************************************
    function getPhotoInfo($photoNum)
    {
	    if (HJHelper::alphaChar($photoNum[0])) 
		{
		    return $this->GetQRCodeInfo($photoNum);
		}
        $hfPhotoName = HJHelper::hfPhotoName($photoNum);
        $this->SelectAllStatement("photo", "PhotoName", $hfPhotoName);
        $queryElement = $this->ExecuteQuerySingleResult();
        if ($queryElement == null)
        {
            return "";
        }
        $photoID = $this->getElement($queryElement, "PhotoID");
        $photoNotes = $this->getElement($queryElement, "PhotoNotes");
        $strArray = array();
        $strArray[] = $this->GetPhotoSource($queryElement);
        $strArray[] = $this->getElement($queryElement, "PhotoName");
        $this->GetPicturedElements($strArray, "People", $photoID, $this->getElement($queryElement, "NumPicturedPersons"));
        $this->GetPicturedElements($strArray, "Buildings", $photoID, $this->getElement($queryElement, "NumPicturedBuildings"));
        if (strlen($photoNotes) != 0) 
        {
            $strArray[] = "*Notes";
            $strArray[] = $photoNotes;
        }
        $numRecords = HJHelper::numInArray($strArray);
        $returnString = e.$numRecords.e;
        for ($i = 0; $i < $numRecords; $i++)
        {
            $returnString.= $strArray[$i].e;
        }
        return $returnString;
    }
    //**********************************************************************************************************************************************
	function GetQRCodeInfo($qrCode)
	{
        $this->SelectAllStatement("building", "BuildingQRCode", $qrCode);
        $buildingRow = $this->ExecuteQuerySingleResult();
        if ($buildingRow == null)
        {
    		return e.$count.e.$returnString.e;
        }
		$buildingId = $buildingRow["BuildingID"];
		$buildingName = $buildingRow["BuildingName"];
        $BuildingGrandListID = $buildingRow["BuildingGrandListID"];
   		$buildingRoadValueId = $buildingRow["BuildingRoadValueID"];

		if ($BuildingGrandListID == 0)
		{
			$grandlistRow = null;
		}
		else
		{
            $this->SelectAllStatement("grandlist", "ID", $BuildingGrandListID);
            $grandlistRow = $this->ExecuteQuerySingleResult();
		}
        if ($grandlistRow == null)
        {
		    $Address = $this->AddressFromBuilding($buildingRoadValueId);
        }
		else
		{
    		$Address = $grandlistRow["StreetNum"]." ".$grandlistRow["StreetName"];
		}
		if ($qrCode == 'D13')
		{
    		$count = 1;
	        $returnString = "*Number: ".$buildingName;
		}
		else
		{
    		$count = 3;
	        $returnString = "*Number: ".$qrCode;
	        $returnString .= e."*".$Address;
		    $returnString .= e.$buildingName;
		}
		$returnString .= $this->buildingNotes($buildingRow["Notes"], $count);


		$returnString .= $this->GetBuildingNames($buildingRow, $buildingId, $buildingName, $count);
		$returnString .= $this->GetBuildingArticle($buildingRow, $count, $foundNotes2);
		$returnString .= $this->GetBuildingOccupants($buildingId, $count, $foundNotes2);
		$returnString .= $this->GetBuildingOwners($BuildingGrandListID, $buildingRow["NotesCurrentOwner"], $count);

		

		return e.$count.e.$returnString.e;
    }
	//**********************************************************************************************************************************************
	function buildingNotes($notes, &$count)
	{
    	$returnString = "";
		if (HJHelper::emptyStr($notes))
		{
		    return "";
		}
		return "-".$notes;
	}
	//**********************************************************************************************************************************************
	function AddressFromBuilding($buildingRoadValueId)
	{
        $this->SelectAllStatement("modernroadvalue", "ModernRoadValueID", $buildingRoadValueId);
        $modernRoadValueRow = $this->ExecuteQuerySingleResult();
        if ($modernRoadValueRow == null)
        {
		    return "";
        }
   		$Address = $buildingRow["StreetNum"]." ".$modernRoadValueRow["ModernRoadValueValue"];
		return $Address;
	}
    //**********************************************************************************************************************************************
	function GetBuildingNames($buildingRow, $buildingId, $buildingName, &$count)
	{
    	$returnString = "";
		$building1856ValueOrder = 0;
		$building1869ValueOrder = 0;
		$building1856Name = $buildingRow["Building1856Name"];
        if (!HJHelper::emptyStr($building1856Name))
		{
		    $building1856ValueOrder = (int)$buildingRow["BuildingValueOrder1856Name"];
		}
		$building1869Name = $buildingRow["Building1869Name"];
        if (!HJHelper::emptyStr($building1869Name))
		{
		    $building1869ValueOrder = (int)$buildingRow["BuildingValueOrder1869Name"];
		}
        $this->SelectAllStatement("buildingvalue", "BuildingID", $buildingId);
        $this->OrderBy("BuildingValueOrder");
        $buildingTbl = $this->ExecuteQuery();
        if ($buildingTbl == null)
        {
    		return $returnString;
        }

		$previousBuildingOrder = 0;
        foreach ($buildingTbl as $buildingRow)
        {
		    $buildingValue = $buildingRow["BuildingValueValue"];
			$buildingOrder = (int)$buildingRow["BuildingValueOrder"];
			$returnString .= $this->AddSpecialValueIfBetweenNames($building1856ValueOrder, $previousBuildingOrder, $buildingOrder, $building1856Name."(1856 Map)", $buildingRow["Notes1856Name"], $count);
			$returnString .= $this->AddSpecialValueIfBetweenNames($building1869ValueOrder, $previousBuildingOrder, $buildingOrder, $building1869Name."(1869 Map)", $buildingRow["Notes1869Name"], $count);
			if ($buildingValue != $buildingName)
			{
			    $returnString .= $this->AddBuildingValue($buildingValue, $buildingRow["Notes"], $count);
			}
			$previousBuildingOrder = $buildingOrder;
		}
		return $returnString;
	}
    //**********************************************************************************************************************************************
	function AddSpecialValueIfBetweenNames(&$SpecialBuildingOrder, $previousBuildingOrder, $buildingOrder, $buildingValue, $notes, &$count)
	{
	    if ($SpecialBuildingOrder < $previousBuildingOrder || $SpecialBuildingOrder > $buildingOrder)
		{
		    return "";
		}
		$SpecialBuildingOrder = 0;
		return $this->AddBuildingValue($buildingValue, $notes, $count);
	}
    //**********************************************************************************************************************************************
	function AddBuildingValue($buildingValue, $notes, &$count)
	{
	    $count++;
	    $returnString = e.$buildingValue;
		$notes = $this->buildingNotes($notes, $count);
        return $returnString.$notes;
	}
    //**********************************************************************************************************************************************
	function GetBuildingArticle($buildingRow, &$count, &$foundNotes2)
	{
	    $foundNotes2 = false;
        $buildingArchitectureArticleID = $buildingRow["BuildingArchitectureArticleID"];
        $buildingDescriptionArticleID = $buildingRow["BuildingDescriptionArticleID"];
	    $returnString = "";
		if ($buildingArchitectureArticleID != 0)
		{
            $this->SelectAllStatement("article", "ArticleID", $buildingArchitectureArticleID);
            $articleRow = $this->ExecuteQuerySingleResult();
            if ($articleRow != null)
            {
		    	$returnString .= e."*Notes1";
     		    $count++;
    			$returnString .= e.$articleRow["Article"];
         		$count++;
		    }
		}
		if ($buildingDescriptionArticleID != 0)
		{
            $this->SelectAllStatement("article", "ArticleID", $buildingDescriptionArticleID);
            $articleRow = $this->ExecuteQuerySingleResult();
            if ($articleRow != null)
            {
    	        $foundNotes2 = true;
			    $returnString .= e."*Notes2";
     		    $count++;
			    $returnString .= e.$articleRow["Article"];
     		    $count++;
			}
		}
		return $returnString;
	}
    //**********************************************************************************************************************************************
	function GetBuildingOccupants($buildingId, &$count, $foundNotes2)
	{
        $this->SelectAllStatement("buildingoccupant", "BuildingID", $buildingId);
        $this->OrderBy("BuildingValueOrder");
        $buildingOccupantTbl = $this->ExecuteQuery();
		$numRecords = count($buildingOccupantTbl);
        if ($numRecords == 0)
        {
    		return $returnString;
        }
        if ($numRecords < 13)
        {
    		$foundNotes2 = false;
        }
		$returnString .= e."Occupants";
   		$count++;
        foreach ($buildingOccupantTbl as $buildingOccupantRow)
        {
		    $foundOccupantNotes = false;
		    $personId = $buildingOccupantRow["PersonID"];
			$spouseLivedWithId = $buildingOccupantRow["SpouseLivedWithID"];
			$notes = trim($buildingOccupantRow["Notes"]);
			if (!HJHelper::emptyStr($notes))
			{
				$notes = " - ".$notes;
    		    $foundOccupantNotes = true;
			}
            if ($spouseLivedWithId == 0)
			{
         		$personName = $this->GetPersonName($personId, false);
     			$returnString .= e.$personName.$notes;
         		$count++;
			}
			else
			{
         		$personName = $this->GetPersonName($personId, $foundNotes2 || $foundOccupantNotes);
         		$spouseName = $this->GetPersonName($spouseLivedWithId, $foundNotes2 || $foundOccupantNotes);
     			$returnString .= e.$personName." & ".$spouseName.$notes;
        		$count++;
			}
		}
		return $returnString;
	}
    //**********************************************************************************************************************************************
	function GetBuildingOwners($BuildingGrandListID, $buildingOwnerNotes, &$count)
	{
    	$returnString = "";
        $this->SelectAllStatement("grandlist", "ID", $BuildingGrandListID);
        $row = $this->ExecuteQuerySingleResult();
        if ($row == null)
        {
    		return e.$count.e.$returnString.e;
        }
        $Name1 = $this->getElement($row, "Name1");
        $Name2 = $this->getElement($row, "Name2");
		$grandListName = HJHelper::CombineName1AndName2($Name1, $Name2);
        $this->SelectAllStatement("grandlisthistory", "ID", $BuildingGrandListID);
        $this->OrderBy("HistoryYear desc");
        $queryResult = $this->ExecuteQuery();
		$numRecords = count($queryResult);
		if ($numRecords == 0)
		{
      		$returnString .= e."*Current Owner";
          	$count++;
		}
		else
		{
      		$returnString .= e."*Recent Owners";
          	$count++;
		}
  		$returnString .= e.$grandListName." (Current Owner)";
   		//$returnString .= $this->buildingNotes($buildingOwnerNotes, $count);
       	$count++;
        foreach ($queryResult as $queryElement)
        {
            $HistoryYear = $this->getElement($queryElement, "HistoryYear");
            $historyName1 = $this->getElement($queryElement, "Name1");
            $historyName2 = $this->getElement($queryElement, "Name2");
			if ($Name1 != $historyName1 || $Name2 != $historyName2)
			{
     	    	$grandListName = HJHelper::CombineName1AndName2($historyName1, $historyName2)." (Owner Until ".$HistoryYear.")";
      		    $returnString .= e.$grandListName;
           	    $count++;
			}
		}
		return $returnString;
	}
    //**********************************************************************************************************************************************
    function GetPhotoSource($queryElement)
    {
        $source = $this->getElement($queryElement, "PhotoSource");
        if (HJHelper::emptyStr($source) || $source == "HF Collection")
        {
            return "*Jamaica HF Collection";
        }
        else
        {
            return "*".$source." Collection";
        }
    }
    //**********************************************************************************************************************************************
    function GetPicturedElements(&$strArray, $photoType, $photoID, $numPicturedElements)
    {
        if ($numPicturedElements == 0) return;
        $this->GetQueryItems($photoType, $elementTable, $orderField, $elementID_col);
        $this->SelectAllStatement($elementTable, "PhotoID", $photoID);
        $this->OrderBy($orderField);
        $queryResult = $this->ExecuteQuery();
        if ($queryResult == null) return;
        $strArray[] = "*Pictured ".$photoType;
        $i = 0;
        $countRecords = 0;
        foreach ($queryResult as $queryElement)
        {
            $orderNumber = $this->getElement($queryElement, $orderField);
            while ($i < ($orderNumber - 1))
            {
                $strArray[] = "unknown";
                $i++;
            }
            $elementID = $this->getElement($queryElement, $elementID_col);
            $personName = ($photoType == "People") ? $this->GetPersonName($elementID) : $this->GetBuildingName($elementID);
            $strArray[] = (strlen($personName) == 0) ? "unknown" : trim($personName);
            $countRecords++;
            $i++;
        }
        while ($i < $numPicturedElements)
        {
            $strArray[] = "unknown";
            $i++;
        }
    }
    //**********************************************************************************************************************************************
    function getAllGradesForSchoolYear($SchoolYear)
    {
	    list($schoolID, $year) = explode("-", $SchoolYear);
        $this->SelectDistinctStatement("schoolrecord", "distinct Grade", "SchoolID", $schoolID, "Year", $year, "SchoolRecordType", 1);
        $this->OrderBy("Grade");
        $queryResult = $this->ExecuteQuery();
        $numRecords = count($queryResult);
        $returnString = e.$numRecords;
        foreach ($queryResult as $queryElement)
        {
            $grade = $this->getElement($queryElement, "Grade");
    		if (HJHelper::emptyStr($grade))
	    	{
		        $grade = "0";
		    }
            $returnString.=e."Grade ".$grade.d;
        }
        return $returnString;
    }
    //**********************************************************************************************************************************************
    function getSchoolRecordsForSchoolYear($SchoolYear)
    {
		$numRecords1;
		$numRecords2;
	    $returnString1 = $this->getSchoolRecordForTeachersStudents($SchoolYear, 0, $numRecords1);
	    $returnString2 = $this->getSchoolRecordForTeachersStudents($SchoolYear, 1, $numRecords2);
		$totalNumRecords = $numRecords1 + $numRecords2;
        return e.$totalNumRecords.$returnString1.$returnString2;
	}
    //**********************************************************************************************************************************************
    function getSchoolRecordForTeachersStudents($SchoolYear, $schoolRecordType, &$numRecords)
    {
	    list($schoolID, $year, $grade, $personId) = explode("-", $SchoolYear);
		if (HJHelper::emptyStr($grade))
		{
		    $grade = "0";
		}
		if ($grade == "0" && $personId != 0)
		{
		    $grade = $this->GetGradeForSchoolPersonYear($schoolID, $year, $personId, $schoolRecordType);
		}
		$found = false;
		while (!$found)
		{
		    if ($this->TeacherNotPrimarySecondary($schoolRecordType, $grade))
	    	{
                $this->SelectAllStatement("schoolrecord", "SchoolID", $schoolID, "Year", $year, "SchoolRecordType", $schoolRecordType);
                $this->OrderBy("Grade");
		    }
		    else
		    {
                $this->SelectAllStatement("schoolrecord", "SchoolID", $schoolID, "Year", $year, "Grade", $grade, "SchoolRecordType", $schoolRecordType);
                $this->OrderBy("Person");
		    }
            $queryResult = $this->ExecuteQuery();
            $numRecords = count($queryResult);
			if ($numRecords != 0)
			{
			    $found = true;
			}
			else
			{
			    $grade++;
			}
		}
        foreach ($queryResult as $queryElement)
        {
            $person = $this->getElement($queryElement, "Person");
            $personId = $this->getElement($queryElement, "PersonID");
            $bornDate = $this->getElement($queryElement, "BornDate");
            $schoolRecordType = $this->getElement($queryElement, "SchoolRecordType");
            $grade = $this->getElement($queryElement, "Grade");
            $returnString.=e.$schoolID.d.$year.d.$grade.d.$schoolRecordType.d.$person.d.$personId.d;
         }
        return $returnString;
    }
    //**********************************************************************************************************************************************
	function IncrementGrade(&$grade)
	{
	    
	}
    //**********************************************************************************************************************************************
	function TeacherNotPrimarySecondary($schoolRecordType, $grade)
	{
	    if ($grade == "Grammer" || $grade == "Primary")
		{
		    return false;
		}
  		if ($schoolRecordType == 0 || $grade == "0")
		{
		    return true;
		}
		return false;
	}
    //**********************************************************************************************************************************************
	function GetGradeForSchoolPersonYear($schoolID, $year, $personId, $schoolRecordType)
	{
        $this->SelectAllStatement("schoolrecord", "SchoolID", $schoolID, "Year", $year, "PersonID", $personId, "SchoolRecordType", $schoolRecordType);
        $row = $this->ExecuteQuerySingleResult();
        if ($row == null)
        {
            $buildingName = "";
            return "";
        }
        $grade = $row["Grade"];
		return $grade;
	}
    //**********************************************************************************************************************************************
    function getAllCategoryValuesForCategory($categoryID)
    {
        if ($categoryID == 1)
        {
            return $this->Collections();
        }
        else
        {
            return $this->CategoryValues($categoryID);
        }
    }
    //**********************************************************************************************************************************************
    function CategoryValues($categoryID)
    {
        $this->SelectAllStatement("categoryvalue", "CategoryID", $categoryID);
        $queryResult = $this->ExecuteQuery();
        $numRecords = count($queryResult);
        $returnString = e.$numRecords;
        foreach ($queryResult as $queryElement)
        {
            $CateboryValueID = $this->getElement($queryElement, "CategoryValueID");
            $CateboryValueValue = $this->getElement($queryElement, "CategoryValueValue");
            $returnString.=e.$CateboryValueID.d.$CateboryValueValue.d;
        }
        return $returnString;
    }
    //**********************************************************************************************************************************************
    function Collections()
    {
        $queryResult = $this->GetDistinctCollections();
        $numRecords = 0;
        $CollectionNum = 0;
        $returnString = "";
        foreach ($queryResult as $queryElement)
        {
            $CollectionNum++;
            $PhotoSource = $this->getElement($queryElement, "PhotoSource");
            if (!HJHelper::emptyStr($PhotoSource) && !HJHelper::StrContains($PhotoSource, "??"))
            {
                $returnString.=e.$CollectionNum.d.$PhotoSource.d;
                $numRecords++;
            }
        }
        $returnString = e.$numRecords.$returnString;
        return $returnString;
    }
    //**********************************************************************************************************************************************
    function GetDistinctCollections()
    {
        $this->SelectOneNotEqualStatement("photo", "distinct PhotoSource", "PhotoSource", '');
        $this->OrderBy("PhotoSource");
        return $this->ExecuteQuery();
    }
    //**********************************************************************************************************************************************
    function getAllPhotosForCategoryValue($categoryValueID, $categoryID)
    {
        if ($categoryID == 1)
        {
            $value = $this->getPhotosFromCollection($categoryValueID - 1);
        }
        else
        {
            $this->SelectOneStatement("photocategoryvalue", "PhotoID", "CategoryValueId", $categoryValueID);
            $queryResult = $this->ExecuteQuery();
            $numRecords = count($queryResult);
            $returnString = $this->QueryPhotos($queryResult, $numRecords);
            $value = e.$numRecords.e.$returnString.e;
        }
        return $value;
    }
    //**********************************************************************************************************************************************
    function getPhotosFromCollection($indexOfCollection)
    {
        $queryResult = $this->GetDistinctCollections();
        $numRecords = count($queryResult);
        $returnString = "";
        if ($indexOfCollection < $numRecords)
        {
            $queryElement = $queryResult[$indexOfCollection];
            $returnString = $this->PhotosFromCollection($queryElement["PhotoSource"], $numRecords);
        }
        return e.$numRecords.e.$returnString.e;; 
    }
    //**********************************************************************************************************************************************
    function getPersonName($personID, $showShortenedNames=false)
    {
        if ($personID == 0)
        {
            return "unknown";
        }
        $this->SelectAllStatement("person","PersonID",$personID);
        $row = $this->ExecuteQuerySingleResult();
        if ($row == null) return "";
        require_once(HJ_COMPONENT_PATH.'libraries/classes/name.php');
        $name = new HJName;
        $name->SetNameFromDataRow($row);
		if ($showShortenedNames)
		{
            return $name->ShortNameFirstNameFirst();
		}
		else
		{
            return $name->BuildNameFirstNameFirst();
		}
    }
    //**********************************************************************************************************************************************
    function GetQueryItems($photoType, &$elementTable, &$orderField, &$elementID_col)
    {
        if ($photoType == "People")
        {
            $elementTable = "picturedperson";
            $orderField = "PicturedPersonNumber";
            $elementID_col = "PersonID";
        }
        else
        {
            $elementTable = "picturedbuilding";
            $orderField = "PicturedBuildingNumber";
            $elementID_col = "BuildingID";
        }
    }
    //**********************************************************************************************************************************************
    function getAllPhotosForCategory($categoryID)
    {
        if ($categoryID == 0)
        {
            $this->SelectAllStatement("photo");
        }
        else
        {
            //$this->SelectOneStatement("photocategoryvalue", "photo");
            $this->SelectOneStatementJoin("photocategoryvalue", "categoryvalue", "PhotoID", "CategoryValueId", "CategoryID", $categoryID);
            $arrayList = $this->ExecuteQuery();
            //$query = "select PhotoID from photocategoryvalue ".
            //         "join categoryvalue on photocategoryvalue.CategoryValueId = categoryvalue.CategoryValueId and category.CategoryID=".$categoryID;
        }
        $arrayList = $this->ExecuteQuery();
        $returnString = $this->QueryPhotos($arrayList, $numRecords);
        $value = e.$numRecords.e.$returnString.e;
        return $value;
    }
    //**********************************************************************************************************************************************
    function QueryPhotos($arrayList, &$numRecords)
    {
        if ($arrayList == null)
        {
            HJHelper::showMessage("No Photos found");
            HJHelper::backToPreviousPage();
            return "";
        }
        return $this->ReturnPhotoIds($arrayList, $numRecords);
    }
    //**********************************************************************************************************************************************
    function PhotosFromCollection($collector, &$numRecords)
    {
	    $collector = str_replace("'", "''", $collector);
        $this->SelectAllStatement("photo", "PhotoSource", $collector);
        $arrayList = $this->ExecuteQuery();
        return $this->ReturnPhotoIds($arrayList, $numRecords);
    }
    //**********************************************************************************************************************************************
    function ReturnPhotoIds($arrayList, &$numRecords)
    {
        $returnString = "";
        $numRecords = 0;
        foreach ($arrayList as $queryElement)
        {
            $photoID = $this->getElement($queryElement, "PhotoID");
            if (strlen($returnString) != 0)
            {
                $returnString.=e;
            }
            $returnString.=$this->PhotoNameNum($photoID);
            $numRecords++;
        }
        return $returnString;
    }
    //**********************************************************************************************************************************************
}
