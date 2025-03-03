<?php
require_once(HJ_COMPONENT_PATH.'libraries/sqlDatabase/sqlDatabase.php');

class sqlDatabasePerson extends sqlDatabase 
{
    //**********************************************************************************************************************************************
    function getCivilWarVeterans($searchOption, $personOption, $name, $tableName)
    {
        $totalRecords = 0;
        $sortField = "";
        $sortDirection = ""; 
        $queryArray=null;
        $primaryKeyForDuplicates = $tableName == "vitalrecord" ? "VitalRecordID" : "PersonID"; 
        $this->getCWVeteransRows($queryArray, $name, $primaryKeyForDuplicates);
        $totalRecords = HJHelper::numInArray($queryArray);
        return $this->MoveArrayDataToReturnString($queryArray, $tableName, $totalRecords, true);
	}
    //**********************************************************************************************************************************************
    function getPeople($searchOption, $personOption, $name, $tableName)
    {
        $totalRecords = 0;
        $sortField = "";
        $sortDirection = ""; 
        $queryArray=null;

        $primaryKeyForDuplicates = $tableName == "person" ? "PersonID" : "VitalRecordID"; 
        $returnStr = $this->GetPersonRows($queryArray, $searchOption, true, $tableName, $name, $totalRecords, $sortField, $sortDirection, "FirstName", "MiddleName", "LastName", $primaryKeyForDuplicates);
        //if ($personOption == "PersonParent")
        //{
        //    $this->getPersonRows($queryArray, $searchOption, false, $tableName, $name, $totalRecords, $sortField, $sortDirection, "FatherFirstName", "FatherMiddleName", "FatherLastName", $primaryKeyForDuplicates);
        //    $this->getPersonRows($queryArray, $searchOption, false, $tableName, $name, $totalRecords, $sortField, $sortDirection, "MotherFirstName", "MotherMiddleName", "MotherLastName", $primaryKeyForDuplicates);
        //}
        $this->SortedQueryArray($queryArray, $sortDirection, $totalRecords);
        return $this->MoveArrayDataToReturnString($queryArray, $tableName, $totalRecords, true); 
        //return $this->PersonHeaders($returnStr, 0);
    }
    //**********************************************************************************************************************************************
    function GetPersonCensusRecords($censusYear, $censusPage)
    {
        $key = "Census".$censusYear;
	    if ($censusPage == 0)
		{
            $this->SelectAllNotEqualStatement("person", $key, 0);
		}
		else
		{
            $this->SelectAllStatement("person", $key, $censusPage);
		}
        $this->execQueryIntoArray($queryArray);
        $this->SortedQueryArray($queryArray, "", $totalRecords);
        return  $this->moveArrayDataToReturnString($queryArray, "person", $totalRecords, true);
    }
    //**********************************************************************************************************************************************
    function GetMultipleIds($multipleIDs, $tableName, $sortLastName)
    {
        if ($tableName == "vitalrecord")
        {
            $ID_col = "VitalRecordID";
			return $this->GetMultipleIDsForPerson($tableName, $ID_col, $multipleIDs, $sortLastName);
        }
        else 
        if ($tableName == "personcw")
        {
            $ID_col = "PersonID";
			return $this->GetMultipleIDsForCivilWar($tableName, $ID_col, $multipleIDs, $sortLastName);
        }
        else 
        {
		    $tableName = "person";
            $ID_col = "PersonID";
			return $this->GetMultipleIDsForPerson($tableName, $ID_col, $multipleIDs, $sortLastName);
        }
    }
    //**********************************************************************************************************************************************
    function GetMultipleIDsForPerson($tableName, $ID_col, $multipleIDs, $sortLastName)
    {
            $query = $this->SelectAllMultipleIDs($tableName, $ID_col, $multipleIDs);
            $this->execQueryIntoArray($queryArray, $ID_col, $sortLastName);
            $totalRecords = HJHelper::numInArray($queryArray);
            $sortDirection = ""; 
            $this->SortedQueryArray($queryArray, $sortDirection, $totalRecords);
            $totalRecords = HJHelper::numInArray($queryArray);
		    return $this->MoveArrayDataToReturnString($queryArray, $tableName, $totalRecords, false);
	}
    //**********************************************************************************************************************************************
    function GetMultipleIDsForCivilWar($tableName, $ID_col, $multipleIDs, $sortLastName)
    {
        $query = $this->SelectAllMultipleIDs($tableName, $ID_col, $multipleIDs);
        $this->execQueryIntoArrayPersonCW($queryArray, $ID_col, $sortLastName);
        $totalRecords = HJHelper::numInArray($queryArray);
        return $this->MoveArrayDataToReturnString($queryArray, $tableName, count($queryArray), false);
	}
    //**********************************************************************************************************************************************
    function execQueryIntoArrayPersonCW(&$queryArray, $PrimaryKey="", $sortLastName="")
    {
        require_once(HJ_COMPONENT_PATH.'libraries/classes/name.php');
        $name = new HJName;
        $arrayList = $this->ExecuteQuery();
        foreach ($arrayList as $queryElement)
        {
            if (HJHelper::emptyStr($PrimaryKey) || !$this->isDuplicate($queryArray, $queryElement, $PrimaryKey))
            {
                $name->Clear();
                $firstName = $this->getElement($queryElement, "FirstName");
                $MiddleName =  $this->getElement($queryElement, "MiddleName");
                $LastName =  $this->getElement($queryElement, "LastName");
                $MarriedName =  $this->getElement($queryElement, ""); 
                $name->SetName($firstName, $MiddleName, $LastName, "", "", $MarriedName, "", $sortLastName);
                $sortName = $name->BuildSortName();
                $queryElement["FullName"] = $sortName; 		
                $queryArray[] = $queryElement;
            }
        }
        return;
    }
    //**********************************************************************************************************************************************
    function GetVitalRecordForPerson($vitalRecordID)
    {
        $this->SelectAllStatement("vitalrecord", "VitalRecordID", $vitalRecordID);
        $this->execQueryIntoArray($queryArray);
        if (HJHelper::arrayLen($queryArray)== 0)
        {
            $returnString = e."".e;
        }
        else 
        {
            $name = new HJName;
            $returnString = e.$this->addVitalRecordFieldsToResultString($queryArray[0], $name, true);
        }
        return $returnString;
    }
    //**********************************************************************************************************************************************
    function GetAllVitalRecordsForPerson($personID)
    {
        $this->GetVitalRecordsForPerson($queryArray, $personID, "PersonID");
        $this->GetVitalRecordsForPerson($queryArray, $personID, "FatherID");
        $this->GetVitalRecordsForPerson($queryArray, $personID, "MotherID");
        return $this->MoveArrayDataToReturnString($queryArray, "vitalrecord", count($queryArray), false);
    }
    //**********************************************************************************************************************************************
    function GetVitalRecordsForPerson(&$queryArray, $personID, $personIDCol)
    {
        $this->SelectAllStatement("vitalrecord", $personIDCol, $personID);
    	$this->execQueryIntoArray($queryArray);
    }
    //**********************************************************************************************************************************************
    function MoveArrayDataToReturnString($queryArray, $tableName, $totalRecords, $idsOnly)
    {
        $returnString = $this->AddHeaderNames($totalRecords, $tableName);
        require_once(HJ_COMPONENT_PATH.'libraries/classes/name.php');
        $name = new HJName;
        for ($i = 0; $i < $totalRecords; $i++)
        {
            if ($idsOnly)
            {
                $returnString.=$this->AddIDsToResultString($tableName, $queryArray[$i]);
            }
            else
            {
                $returnString.=$this->AddFieldsToResultString($tableName, $queryArray[$i], $name);
            }
        }
        return $returnString;
    }
    //**********************************************************************************************************************************************
    function AddHeaderNames($totalRecords, $tableName)
    {
        switch ($tableName)
        {
            case "vitalrecord":
                return $this->VitalRecordHeaders($totalRecords);
            case "personcw":
                return $this->CivilWarHeaders($totalRecords);
            default:
                return $this->PersonHeaders($tableName, $totalRecords);
        }
    }
    //**********************************************************************************************************************************************
    function PersonHeaders($tableName, $totalRecords)
    {
        $returnString = e.$totalRecords.d."7".d; // 6 fields plus key field
        $returnString.= $this->AddField("Person",d);
        $returnString.= $this->AddField("Born",d);
        $returnString.= $this->AddField("Died",d);
        $returnString.= $this->AddField("Spouse",d);
        $returnString.= $this->AddField("Father",d);
        $returnString.= $this->AddField("Mother",e);
        return $returnString;
    }
    //**********************************************************************************************************************************************
    function CivilWarHeaders($totalRecords)
    {
        $returnString = e.$totalRecords.d."7".d; // 6 fields plus key field
        $returnString.= $this->AddField("Person",d);
        $returnString.= $this->AddField("Born",d);
        $returnString.= $this->AddField("Died",d);
        $returnString.= $this->AddField("Enlistment",d);
        $returnString.= $this->AddField("Cemetery",d);
        $returnString.= $this->AddField("Battle Site Killed",e);
        return $returnString;
    }
    //**********************************************************************************************************************************************
    function VitalRecordHeaders($totalRecords)
    {
        $returnString = e.$totalRecords.d."10".d; // 6 fields plus key field
        $returnString.= $this->AddField("Record Type",d);
        $returnString.= $this->AddField("Name",d);
        $returnString.= $this->AddField("Partner's Name",d);
        $returnString.= $this->AddField("Father's Name",d);
        $returnString.= $this->AddField("Mother's Name",d);
        $returnString.= $this->AddField("Book",d);
        $returnString.= $this->AddField("Page",d);
        $returnString.= $this->AddField("Date",d);
        $returnString.= $this->AddField("Cemetery/Age",e);
        return $returnString;
    }
    //**********************************************************************************************************************************************
    function AddIDsToResultString($tableName, $row)
    {
        require_once(HJ_COMPONENT_PATH.'libraries/classes/name.php');
        switch ($tableName)
        {
            case "vitalrecord":
                return $this->AddVitalRecordIDsToResultString($row, false);
            default:
                return $this->AddPersonIDsToResultString($row);
        }
    }
    //**********************************************************************************************************************************************
    function AddVitalRecordIDsToResultString($row, $forDetailPage)
    {
        return $this->AddField($row["VitalRecordID"],e);
    }
    //**********************************************************************************************************************************************
    function AddPersonIDsToResultString($row)
    {
        return $this->AddField($row["PersonID"],e);
    }
    //**********************************************************************************************************************************************
    function AddFieldsToResultString($tableName, $row, $name)
    {
        switch ($tableName)
        {
            case "vitalrecord":
                return $this->AddVitalRecordFieldsToResultString($row, $name, false);
            case "personcw":
                return $this->AddCivilFieldsToResultString($row, $tableName);
            default:
                return $this->AddPersonFieldsToResultString($row, $name);
        }
    }
    //**********************************************************************************************************************************************
    function AddCivilFieldsToResultString($row, $tableName)
    {
        $returnString = $this->AddField($row["PersonID"],d);
        $returnString.= $this->AddField($row["FullName"],d);
        $returnString.= $this->AddField($row["BornDate"],d);
        $returnString.= $this->AddField($row["DiedDate"],d);
        $returnString.= $this->AddField($row["EnlistmentDate"],d);
        $returnString.= $this->AddField($row["CemeteryName"],d);
        $returnString.= $this->AddField($row["BattleSiteKilled"],e); // check for only one e at the end of the list
        return $returnString;
    }
    //**********************************************************************************************************************************************
    function AddVitalRecordFieldsToResultString($row, $name, $forDetailPage)
    {
        $returnString = $this->AddField($row["VitalRecordID"],d);
        $returnString.= $this->AddField($this->VitalRecordTypeString($row["VitalRecordType"]),d);
        $name->SetName($row["FirstName"], $row["MiddleName"], $row["LastName"],
                       $row["Prefix"], $row["Suffix"]);
        $returnString.= $this->AddField($name->BuildNameString($forDetailPage),d);
        $name->SetName($row["SpouseFirstName"], $row["SpouseMiddleName"], $row["SpouseLastName"],
                       $row["SpousePrefix"], $row["SpouseSuffix"]);
        $returnString.= $this->AddField($name->BuildNameFirstNameFirst(),d);
        $name->SetName($row["FatherFirstName"], $row["FatherMiddleName"], $row["FatherLastName"],
                       $row["FatherPrefix"], $row["FatherSuffix"]);
        $returnString.= $this->AddField($name->BuildNameFirstNameFirst(),d);
        $name->SetName($row["MotherFirstName"], $row["MotherMiddleName"], $row["MotherLastName"],
                       $row["MotherPrefix"], $row["MotherSuffix"]);
        $returnString.= $this->AddField($name->BuildNameFirstNameFirst(),d);
        $returnString.= $this->AddField($row["Book"],d);
        $returnString.= $this->AddField($row["Page"],d);
        $returnString.= $this->AddField($row["Date"],d);
        $returnString.= $this->AddField($row["DeathInfo"],d);
        $returnString.= $this->AddField($row["BornDate"],d);
        if ($forDetailPage)
        {
            $returnString.= $this->AddField($row["Notes"],d);
            $returnString.=$this->GetSpouseParents($row["SpouseID"]);
        }
        return $returnString.e;
    }
    //**********************************************************************************************************************************************
    function GetSpouseParents($spouseID)
    {
        $returnString = "";
        if ($spouseID != 0)
        {	
            $this->SelectAllStatement("vitalrecord", "VitalRecordID", $spouseID);
            $queryElement = $this->ExecuteQuerySingleResult();
        }
        $queryElement = "";
        $name = new HJName;
        if ($queryElement != null)
        {
            $name->SetName($queryElement["FatherFirstName"], $queryElement["FatherMiddleName"], $queryElement["FatherLastName"],
                          $queryElement["FatherPrefix"], $queryElement["FatherSuffix"]);
        }
        $returnString = $this->AddField($name->BuildNameFirstNameFirst(), d);
        $name->Clear();
        if ($queryElement != null)
        {
            $name->SetName($queryElement["MotherFirstName"], $queryElement["MotherMiddleName"], $queryElement["MotherLastName"],
                               $queryElement["MotherPrefix"], $queryElement["MotherSuffix"]);
        }
        $returnString.= $this->AddField($name->BuildNameFirstNameFirst(), d);
        return $returnString;
    }
    //**********************************************************************************************************************************************
    function VitalRecordTypeString($vitalRecordType)
    {
        switch ($vitalRecordType)
        {
            case 1: return "Birth-Male";	
            case 2: return "Birth-Female";	
            case 3: return "Death-Male";	
            case 4: return "Death-Female";	
            case 5: return "Marriage-Groom";	
            case 6: return "Marriage-Bride";	
            case 7: return "Marriage-Party A";	
            case 8: return "Marriage-Party B";	
            case 9: return "Burial";	
            case 10: return "Cemetery";	
            case 11: return "Cemetery";	
            default: return "";
        }
    }
    //**********************************************************************************************************************************************
    function AddPersonFieldsToResultString($row, $name)
    {
        $name->SetNameFromDataRow($row);
        $returnString = $this->AddField($row["PersonID"],d);
        $returnString.= $this->AddField($name->BuildNameLastNameFirst(),d);
        $returnString.= $this->AddField($row["BornDate"],d);
        $returnString.= $this->AddField($row["DiedDate"],d);
        $returnString.= $this->AddField($this->SpouseName($row),d);
        $returnString.= $this->AddField($this->PersonName($row["FatherID"]),d);
        $returnString.= $this->AddField($this->PersonName($row["MotherID"]),e); // check for only one e at the end of the list
        return $returnString;
    }
    //**********************************************************************************************************************************************
    function getCWVeteransRows(&$queryArray, $name, $primaryKeyForDuplicates)
    {
        $sortLastName = "LastName";
		$firstName =  $name->firstName;
		$middleName =  $name->middleName;
		$lastName = $name->lastName;
		$suffix = $name->suffix;
		$prefix = $name->prefix;
        $this->SelectAllStatement("personcw");
        $this->execQueryIntoArray($queryArray, $primaryKeyForDuplicates, $sortLastName);
	}
    //**********************************************************************************************************************************************
    function getPersonRows(&$queryArray, $searchOption, $bDoCheckMarriedKnownAsNames, $tableName, 
                           $name, &$totalRecords, $sortField, $sortDirection,
                           $firstNameCol, $middleNameCol, $lastNameCol, $primaryKeyForDuplicates)
    {
        if (HJHelper::emptyStr($name->firstName))
        {
            $searchOption->searchOption = searchLast;
        }
        switch($searchOption->searchOption)
        {
            case searchLast: 
                {
                    $this->SearchLastNameStartingWith($queryArray, $bDoCheckMarriedKnownAsNames, $tableName, $name->lastName, $lastNameCol, $primaryKeyForDuplicates);
                    break;
                }
            case searchPartial: 
                {
                    $this->SearchPartialName($queryArray, $bDoCheckMarriedKnownAsNames, $tableName, $name, $firstNameCol, $middleNameCol, $lastNameCol, $primaryKeyForDuplicates);
                    break;
                }
            case searchSimilar: 
                {
                    return $this->PersonExists($queryArray, $bDoCheckMarriedKnownAsNames, $tableName, $lastNameCol, $firstNameCol, $middleNameCol,
                                 $primaryKeyForDuplicates, $name->firstName, $name->middleName, $name->lastName, $name->suffix, $name->prefix, $primaryKeyForDuplicates);
                    break;
                }
        }
    }
    //**********************************************************************************************************************************************
    function personExists(&$queryArray, $bDoCheckMarriedKnownAsNames, $tableName,  
                          $lastName_col, $firstName_col, $middleName_col,
                          $primaryID_col, $firstName, $middleName, $lastName, $suffix, $prefix, $primaryKeyForDuplicates)
    {
        $this->firstNameWithLastAndMaiden($queryArray, $tableName, 
                                   $bDoCheckMarriedKnownAsNames, $lastName_col, $firstName_col, $middleName_col, 
                                   $firstName, $middleName, $lastName, $suffix, $prefix, $primaryKeyForDuplicates);
        if ($bDoCheckMarriedKnownAsNames)
        {
            return $this->firstNameWithLastAndMaiden($queryArray, $tableName, 
                                        $bDoCheckMarriedKnownAsNames, $lastName_col, "KnownAs", $middleName_col, 
                                        $firstName, $middleName, $lastName, $suffix, $prefix, $primaryKeyForDuplicates);
        }
    }
    //**********************************************************************************************************************************************
    function firstNameWithLastAndMaiden(&$queryArray, $tableName, $bDoCheckMarriedKnownAsNames, $lastName_col, $firstName_col, $middleName_col, 
                                         $firstName, $middleName, $lastName, $suffix, $prefix, $primaryKeyForDuplicates)
    {
        if (strlen($lastName) != 0)
        {
            $this->CheckForPerson($queryArray, $tableName, $firstName_col, $middleName_col, $lastName_col, $firstName, 
                            $middleName, $lastName, $suffix, $prefix, $primaryKeyForDuplicates);
            if ($bDoCheckMarriedKnownAsNames)
            {
                $this->CheckForPerson($queryArray, $tableName, $firstName_col, $middleName_col, "MarriedName", $firstName, 
                                $middleName, $lastName, $suffix, $prefix, $primaryKeyForDuplicates);
                if ($tableName == "person")
                {
                    $this->CheckForPerson($queryArray, $tableName, $firstName_col, $middleName_col, "MarriedName2", $firstName, 
                                    $middleName, $lastName, $suffix, $prefix, $primaryKeyForDuplicates);
                    $this->CheckForPerson($queryArray, $tableName, $firstName_col, $middleName_col, "MarriedName3", $firstName, 
                                    $middleName, $lastName, $suffix, $prefix, $primaryKeyForDuplicates);
                }
            }
		return "Test43";
        }
    }
    //**********************************************************************************************************************************************
    function CheckForPerson(&$queryArray, $tableName, $firstName_col, $middleName_col, $lastName_col, 
                             $firstName, $middleName, $lastName, $suffix, $prefix, $primaryKeyForDuplicates)
    {
        $this->getSimilarNames($queryArray, $tableName, $firstName_col, $middleName_col, $lastName_col, 
                         $firstName, $middleName, $lastName, $suffix, $prefix, $primaryKeyForDuplicates);
        $this->getSimilarNames($queryArray, $tableName, $middleName_col, $firstName_col, $lastName_col, 
                         $firstName, $middleName, $lastName, $suffix, $prefix, $primaryKeyForDuplicates);
        $lastNameAlternatives = $this->GetAlternativeSpellings("alternativespellingslastname", $lastName);
        $numAlternatives = HJHelper::numInArray($lastNameAlternatives);
        for ($j = 0; $j < $numAlternatives; ++$j)
        {
            $alternativeLastName = $lastNameAlternatives[$j]["AlternativeSpelling"];
            $this->getSimilarNames($queryArray, $tableName, $firstName_col, $middleName_col, $lastName_col, 
                           $firstName, $middleName, $alternativeLastName, $suffix, $prefix, $primaryKeyForDuplicates);
            $this->getSimilarNames($queryArray, $tableName, $middleName_col, $firstName_col, $lastName_col, 
                             $firstName, $middleName, $alternativeLastName, $suffix, $prefix, $primaryKeyForDuplicates);
        }
        $firstNameAlternatives = $this->GetAlternativeSpellings("alternativespellingsfirstname", $firstName);
        $numAlternatives = HJHelper::numInArray($firstNameAlternatives);
        for ($j = 0; $j < $numAlternatives; ++$j)
        {
            $alternativeFirstName = $firstNameAlternatives[$j]["AlternativeSpelling"];
            $this->getSimilarNames($queryArray, $tableName, $firstName_col, $middleName_col, $lastName_col, 
                          $alternativeFirstName, $middleName, $lastName, $suffix, $prefix, $primaryKeyForDuplicates);
            $this->getSimilarNames($queryArray, $tableName, $middleName_col, $firstName_col, $lastName_col, 
                             $alternativeFirstName, $middleName, $lastName, $suffix, $prefix, $primaryKeyForDuplicates);
        }
		return "Test34";
    }    
    //**********************************************************************************************************************************************
    function getSimilarNames(&$queryArray, $tableName, $firstName_col, $middleName_col, $lastName_col, 
                             $firstName, $middleName, $lastName, $suffix, $prefix, $primaryKeyForDuplicates)
    {
        $sortLastName = "LastName";
        $this->PartialNameSelectCommand($tableName, $firstName_col, $middleName_col, $lastName_col, $firstName,  
                                                      $middleName, $lastName, $suffix, $prefix);
        $this->execQueryIntoArray($queryArray, $primaryKeyForDuplicates, $sortLastName);
        if (strlen($middleName) != 0) // check for no middle name
        {
            $this->PartialNameSelectCommand($tableName, $firstName_col, $middleName_col, $lastName_col, $firstName, "", 
                                              $lastName, $suffix, $prefix);
            $this->execQueryIntoArray($queryArray, $primaryKeyForDuplicates, $sortLastName);
        }
        // check for like first names
        $this->NameWithWildCard($tableName, $lastName_col, $lastName, $middleName_col, $middleName, $firstName_col, $firstName);
        $this->execQueryIntoArray($queryArray, $primaryKeyForDuplicates, $sortLastName);
        if (strlen($suffix) != 0 || strlen($prefix) != 0)
        {
            // check for names without using prefix or suffix
            $this->PartialNameSelectCommand($tableName, $firstName_col, $middleName_col, $lastName_col, $firstName,  
                                                          $middleName, $lastName, "", "");
            $this->execQueryIntoArray($queryArray, $primaryKeyForDuplicates, $sortLastName);
        }
        if (strlen($middleName) > 1)
        {
            // check for middle initial
            $MiddleInitial = $middleName[0];
            $this->PartialNameSelectCommand($tableName, $firstName_col, $middleName_col, $lastName_col, $firstName,  
                                              $MiddleInitial, $lastName, "", "");
            $this->execQueryIntoArray($queryArray, $primaryKeyForDuplicates, $sortLastName);
            $this->NameWithWildCard($tableName, $lastName_col, $lastName, $firstName_col, $firstName, $middleName_col, $middleName);
            $this->execQueryIntoArray($queryArray, $primaryKeyForDuplicates, $sortLastName);
        }
        if (strlen($firstName) != 0 && strlen($middleName) != 0)
        {
            // check for name without middle initial or name
            $this->PartialNameSelectCommand($tableName, $firstName_col, $middleName_col, $lastName_col, $firstName,  
                                              "", $lastName, "", "");
            $this->execQueryIntoArray($queryArray, $primaryKeyForDuplicates, $sortLastName);
        }
	    return "test23";
    }
    //**********************************************************************************************************************************************
    function PartialNameSelectCommand($tableName, $firstName_col, $middleName_col, $lastName_col,  
                                      $firstName, $middleName, $lastName, $suffix, $prefix)
    {
        $this->SelectAllStatement($tableName, $lastName_col, $lastName, $firstName_col, $firstName, $middleName_col,$middleName,
                                  "suffix", $suffix, "prefix",$prefix);
    }
    //**********************************************************************************************************************************************
    function NameWithWildCard($tableName, $lastName_col, $lastName, $equalName_col, $equalName, $likeName_col, $likeName)
    {
        $this->SelectAllStatement($tableName, $lastName_col, $lastName, $equalName_col, $equalName);
        $this->WhereLike($likeName_col, $likeName);
    }
    //**********************************************************************************************************************************************
    function GetAlternativeSpellings($tableName, $name)
    {
        $queryArray;
        $this->GetAlternativeSpellingsForName($queryArray, $tableName, $name);
        $CountAfter = 0;
        $CountBefore = HJHelper::numInArray($queryArray);
        $Counter = 0;  // counter used to be sure the recursive loop will terminate
        while ($CountBefore != $CountAfter && $Counter < 10)
        {
            $CountBefore = HJHelper::numInArray($queryArray);
            for ($j = 0; $j < $CountBefore; ++$j)
            {
                $this->GetAlternativeSpellingsForName($queryArray, $tableName, $queryArray[$j]["AlternativeSpelling"]);
            }
            $CountAfter = HJHelper::numInArray($queryArray);
            $Counter++;
        }
        return $queryArray;
    }
    //**********************************************************************************************************************************************
    function AlternativeFirstNames(&$queryArray, $primaryKeyForDuplicates, $sortLastName,
                                   $tableName, $FirstNameAlternatives, $firstNameCol, $lastNameCol, $lastName)
    {
        $numAlternatives = HJHelper::numInArray($FirstNameAlternatives);
        for ($j = 0; $j < $numAlternatives; ++$j)
        {
            $alternativeName = $FirstNameAlternatives[$j]["AlternativeSpelling"];
            $this->SelectAllStatement($tableName, $lastNameCol, $lastName, $firstNameCol, $alternativeName);
            $this->personOrderByStatement();
            $this->execQueryIntoArray($queryArray, $primaryKeyForDuplicates, $sortLastName);
            //$query = SelectAllStatement($tableName, personOrderByStatement(), 
            //                        $lastNameCol, $lastName, $firstNameCol, $alternativeName);
            //execQueryIntoArray($queryArray, $primaryKeyForDuplicates, $sortLastName);
        }
    }
    //**********************************************************************************************************************************************
    function GetAlternativeSpellingsForName(&$queryArray, $table, $name)
    {
        if (HJHelper::emptyStr($name))
        {
            return;
        }
        $this->SelectOneStatement($table, "NameSpelling2 as AlternativeSpelling", "NameSpelling1", $name);
        $this->execQueryAlternateArray($queryArray);
        $this->SelectOneStatement($table, "NameSpelling1 as AlternativeSpelling", "NameSpelling2", $name);
        $this->execQueryAlternateArray($queryArray);
    }
    //**********************************************************************************************************************************************
    function execQueryAlternateArray(&$queryArray)
    {
        $name = new HJName;
        $arrayList = $this->ExecuteQuery();
        $PrimaryKey = "AlternativeSpelling";
        foreach ($arrayList as $queryElement)
        {
            if (HJHelper::emptyStr($PrimaryKey) || !$this->isDuplicate($queryArray, $queryElement, $PrimaryKey))
            {
                $name->Clear();
                $firstName = $this->getElement($queryElement, "FirstName");
                $MiddleName =  $this->getElement($queryElement, "MiddleName");
                $LastName =  $this->getElement($queryElement, "LastName");
                $MarriedName =  $this->getElement($queryElement, "MarriedName"); 
                $name->SetName($firstName, $MiddleName, $LastName, "", "", $MarriedName, "", $sortLastName);
                $sortName = $name->BuildSortName();
                $queryElement["FullName"] = $sortName; 		
                $queryArray[] = $queryElement;
            }
        }
        return;
    }
    //**********************************************************************************************************************************************
    function SearchLastNameStartingWith(&$queryArray, $bDoCheckMarriedKnownAsNames, $tableName, $lastName, $lastNameCol, $primaryKeyForDuplicates)
    {
        if (strlen($lastName) != 0)
        {
            $this->searchStartingWith($queryArray, $tableName, $lastNameCol, $lastName, $primaryKeyForDuplicates);
            if ($bDoCheckMarriedKnownAsNames)
            {
                $this->searchStartingWith($queryArray, $tableName, "MarriedName", $lastName, $primaryKeyForDuplicates);
                if ($tableName == "person")
                {
                    $this->searchStartingWith($queryArray, $tableName, "MarriedName2", $lastName, $primaryKeyForDuplicates);
                    $this->searchStartingWith($queryArray, $tableName, "MarriedName3", $lastName, $primaryKeyForDuplicates);
                }
            }
        }
    }
    //**********************************************************************************************************************************************
    function searchPartialName(&$queryArray, $bDoCheckMarriedKnownAsNames, $tableName, $name, $firstNameCol, $middleNameCol, $lastNameCol, $primaryKeyForDuplicates)
    {
        $this->searchPartial($queryArray, $tableName, $firstNameCol, $middleNameCol, $lastNameCol, $name, $primaryKeyForDuplicates);
        if ($bDoCheckMarriedKnownAsNames)
        {
            $this->searchPartial($queryArray, $tableName, "KnownAs", $middleNameCol, $lastNameCol, $name, $primaryKeyForDuplicates); 
            $this->searchPartial($queryArray, $tableName, $firstNameCol, $middleNameCol, "MarriedName", $name, $primaryKeyForDuplicates);
            $this->searchPartial($queryArray, $tableName, "KnownAs", $middleNameCol, "MarriedName", $name, $primaryKeyForDuplicates);
            if ($tableName == "person")
            {
                $this->searchPartial($queryArray, $tableName, $firstNameCol, $middleNameCol, "MarriedName2", $name, $primaryKeyForDuplicates);
                $this->searchPartial($queryArray, $tableName, "KnownAs", $middleNameCol, "MarriedName2", $name, $primaryKeyForDuplicates);
                $this->searchPartial($queryArray, $tableName, $firstNameCol, $middleNameCol, "MarriedName3", $name, $primaryKeyForDuplicates);
                $this->searchPartial($queryArray, $tableName, "KnownAs", $middleNameCol, "MarriedName3", $name, $primaryKeyForDuplicates);
            }
        }
    }
    //**********************************************************************************************************************************************
    function searchPartial(&$queryArray, $tableName, $firstName_col, $middleName_col, $lastName_col, 
                                         $name, $primaryKeyForDuplicates)
    {
        $sortLastName = "LastName";
        $this->PartialWithOrWithoutMiddleName($queryArray, $primaryKeyForDuplicates, $sortLastName,
                                       $tableName, $firstName_col, $middleName_col, $lastName_col, $name);
        $LastNameAlternatives = $this->GetAlternativeSpellings("alternativespellingslastname", $name->lastName);
        $firstNameAlternatives =$this-> GetAlternativeSpellings("alternativespellingsfirstname", $name->firstName);
        $this->AlternativeFirstNames($queryArray, $primaryKeyForDuplicates, $sortLastName,
                                                     $tableName, $firstNameAlternatives, $firstName_col, $lastName_col, $name->lastName);
        $numAlternatives = HJHelper::numInArray($LastNameAlternatives);
        for ($j = 0; $j < $numAlternatives; ++$j)
        {
            $alternativeLastName = $LastNameAlternatives[$j]["AlternativeSpelling"];
            $nameWithAlternativeLastName = clone $name;
            $nameWithAlternativeLastName->lastName = $alternativeLastName;
            $this->PartialWithOrWithoutMiddleName($queryArray, $primaryKeyForDuplicates, $sortLastName,
                                                                   $tableName, $firstName_col, $middleName_col, $lastName_col, 
                                                                   $nameWithAlternativeLastName);
            $this->AlternativeFirstNames($queryArray, $primaryKeyForDuplicates, $sortLastName,
                                                         $tableName, $firstNameAlternatives, $firstName_col, $lastName_col, $alternativeLastName);
        }
    }
    //**********************************************************************************************************************************************
    function PartialWithOrWithoutMiddleName(&$queryArray, $primaryKeyForDuplicates, $sortLastName,
                                             $tableName, $firstNameCol, $middleNameCol, $lastNameCol, $name)
    {
        if (HJHelper::emptyStr($name->middleName))
        {
            $this->SelectAllStatement($tableName, $lastNameCol, $name->lastName, $firstNameCol, $name->firstName,
                                                 "Suffix", $name->suffix, "Prefix", $name->prefix);
            $this->execQueryIntoArray($queryArray, $primaryKeyForDuplicates, $sortLastName);
            $this->personOrderByStatement();
            $this->execQueryIntoArray($queryArray, $primaryKeyForDuplicates, $sortLastName);
            //$query = SelectAllStatement($tableName, personOrderByStatement(), 
            //                           $lastNameCol, $name->lastName, $firstNameCol, $name->firstName, 
            //                            "Suffix", $name->suffix, "Prefix", $name->prefix);
            //execQueryIntoArray($queryArray, $primaryKeyForDuplicates, $sortLastName);
        }
        else
        {
            $this->SelectAllStatement($tableName, $lastNameCol, $name->lastName, $firstNameCol, $name->firstName, $middleNameCol, $name->middleName,
                                                 "Suffix", $name->suffix, "Prefix", $name->prefix);
            $this->execQueryIntoArray($queryArray, $primaryKeyForDuplicates, $sortLastName);
            $this->personOrderByStatement();
            $this->execQueryIntoArray($queryArray, $primaryKeyForDuplicates, $sortLastName);
            //$query = SelectAllStatement($tableName, personOrderByStatement(), 
            //                           $lastNameCol, $name->lastName, $firstNameCol, $name->firstName, 
            //                           $middleNameCol, $name->middleName, "Suffix", $name->suffix, "Prefix", $name->prefix);
            //execQueryIntoArray($queryArray, $query, $primaryKeyForDuplicates, $sortLastName);
        }
    }
    //**********************************************************************************************************************************************
    function SearchStartingWith(&$queryArray, $tableName, $lastNameCol, $lastName, $primaryKeyForDuplicates)
    {
        $this->SelectAllStatement($tableName);
        $this->WhereLike($lastNameCol, $lastName);
        $this->OrderBy('LastName');
        $this->execQueryIntoArray($queryArray, $primaryKeyForDuplicates, $lastName);
    }
    //**********************************************************************************************************************************************
    function execQueryIntoArray(&$queryArray, $PrimaryKey="", $sortLastName="")
    {
        require_once(HJ_COMPONENT_PATH.'libraries/classes/name.php');
        $name = new HJName;
        $arrayList = $this->ExecuteQuery();
        foreach ($arrayList as $queryElement)
        {
            if (HJHelper::emptyStr($PrimaryKey) || !$this->isDuplicate($queryArray, $queryElement, $PrimaryKey))
            {
                $name->Clear();
                $firstName = $this->getElement($queryElement, "FirstName");
                $MiddleName =  $this->getElement($queryElement, "MiddleName");
                $LastName =  $this->getElement($queryElement, "LastName");
                $MarriedName =  $this->getElement($queryElement, "MarriedName"); 
                $name->SetName($firstName, $MiddleName, $LastName, "", "", $MarriedName, "", $sortLastName);
                $sortName = $name->BuildSortName();
                $queryElement["FullName"] = $sortName; 		
                $queryArray[] = $queryElement;
            }
        }
        return;
    }
    //**********************************************************************************************************************************************
    function personOrderByStatement()
    {
        $this->OrderBy(LastName);
        $this->OrderBy(FirstName);
        $this->OrderBy(MiddleName);
        $this->OrderBy(Suffix);
        $this->OrderBy(Prefix);
    }
    //**********************************************************************************************************************************************
    function SortedQueryArray(&$queryArray, $sortDirection, &$totalRecords)
    {
        $queryArray = HJHelper::array_sort($queryArray, "FullName", $sortDirection);
        $totalRecords = HJHelper::numInArray($queryArray);
    }
    //**********************************************************************************************************************************************
}
