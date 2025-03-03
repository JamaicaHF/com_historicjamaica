<?php
defined( '_JEXEC' ) or die( 'Restricted access' );

defined( '_JEXEC' ) or die( 'Restricted access' );
define("OnlyNum","OnlyNum");
define("cr","<br/>");
define("x","xxxx");
define('d',';');
define('a','@');
define('e','|');
define('f','^');

class sqlDatabase
{
  	protected $_db = null;
    protected $query = null;

    function __construct() 
    {
        $this->_db = JFactory::getDbo();
    }

    function __destruct()
    {
    }
    //****************************************************************************************************************************
    function ExecuteQuery()
    {
        $this->_db->setQuery($this->query);
    		return $this->_db->loadAssocList();
    }
    //****************************************************************************************************************************
    function ExecuteQuerySingleResult()
    {
        $this->_db->setQuery($this->query);
		return $this->_db->loadAssoc();
    }
    //**********************************************************************************************************************************************
    function SelectOneStatement($tableName, $field, $value1_col, $Value1)
    {
        $this->query = $this->_db->getQuery(true)->select($field);
        $this->query->from($tableName);
        $this->Where($value1_col, $Value1);
    }
    //**********************************************************************************************************************************************
    function SelectOneStatementJoin($tableName1, $tableName2, $field, $joinKeyCol, $value1_col, $Value1)
    {
        $this->query = $this->_db->getQuery(true)->select($field);
        $this->query->from($tableName1);
        $joinOn = $tableName1.".".$joinKeyCol." = ".$tableName2.".".$joinKeyCol;
        $innerJoin = $tableName2." ON ".$joinOn;
        $this->query->innerJoin($innerJoin);
        $this->Where($value1_col, $Value1);
    }
    //**********************************************************************************************************************************************
    function SelectOneNotEqualStatement($tableName, $field, $value1_col, $Value1)
    {
        $this->query = $this->_db->getQuery(true)->select($field);
        $this->query->from($tableName);
        $this->Where($value1_col, $Value1,"<>");
    }
    //**********************************************************************************************************************************************
    function SelectDistinctStatement($tableName, $distinctValues, 
                                                 $value1_col="", $Value1="",
                                                 $value2_col="", $Value2="",
                                                 $value3_col="", $Value3="")
    {
        $this->query = $this->_db->getQuery(true)->select($distinctValues);
        $this->query->from($tableName);
        $this->Where($value1_col, $Value1);
        $this->Where($value2_col, $Value2);
        $this->Where($value3_col, $Value3);
    }
    //**********************************************************************************************************************************************
    function SelectAllStatement($tableName, $value1_col="", $Value1="",
                                            $value2_col="", $Value2="",
                                            $value3_col="", $Value3="",
                                            $value4_col="", $Value4="",
                                            $value5_col="", $Value5="")
    {
        $this->query = $this->_db->getQuery(true)->select('*');
        $this->query->from($tableName);
        $this->Where($value1_col, $Value1);
        $this->Where($value2_col, $Value2);
        $this->Where($value3_col, $Value3);
        $this->Where($value4_col, $Value4);
        $this->Where($value5_col, $Value5);
    }
    //**********************************************************************************************************************************************
    function SelectAllNotEqualStatement($tableName, $value1_col="", $Value1="")
    {
        $this->query = $this->_db->getQuery(true)->select('*');
        $this->query->from($tableName);
        $this->Where($value1_col, $Value1, "<>");
    }
    //**********************************************************************************************************************************************
    function Where($value_col, $Value, $equate="=")
    {
        if (HJHelper::notEmptyStr($value_col) && HJHelper::notEmptyStr($Value))
        {
            $where = $value_col." ".$equate." ";
            if ($this->IsNumericValue($value_col, $Value))
            {
                $whereValue = $Value;
            }
            else
            {
                $whereValue = '\''.$Value.'\'';
            }
            $this->query->where($where.$whereValue);
        }
    }
    //**********************************************************************************************************************************************
    function OrderBy($orderBy_col)
    {
        $this->query->order($orderBy_col);
    }
    function IsNumericValue($value_col, $Value)
    {
        if (is_numeric($Value))
        {
            $lower = strtolower($value_col);
            $position = strrpos($lower,"id"); // find last position
            if ($position == false)
            {
                return false;
            }
            $length = strlen($value_col);
            if ($position == $length - 2)
            {
                return true;
            }
            return false;
        }
        else
        {
            return false;
        }
    }
    //**********************************************************************************************************************************************
    function WhereLike($value_col, $Value)
    {
        if (HJHelper::notEmptyStr($value_col))
        {
            $this->query->where($value_col.$this->Like($Value));
        }
    }
    //**********************************************************************************************************************************************
    function Like($value)
    {
        $like = ' LIKE \''.$value.'%\'';
        return $like;
    }
    //**********************************************************************************************************************************************
    function SelectAllMultipleIDs($tableName, $ids_col, $multipleIDs)
    {
        $this->SelectAllStatement($tableName);
        $numValues = count($multipleIDs);
        for ($i = 0; $i < $numValues; $i++)
        {
            $id = $multipleIDs[$i];
            if (HJHelper::notEmptyStr($id))
            {
                if ($i == $numValues - 1)
                {
                    $this->query->where($ids_col." = ".$id);
                }
                else
                {
                    $this->query->where($ids_col." = ".$id, 'OR');
                }
            }	
        }
    }
    //**********************************************************************************************************************************************
    function SpouseName($row)
    {
        $spouseArray = $this->getAllSpouses($row["PersonID"]);
        if (HJHelper::numInArray($spouseArray) == 0)
        {
            return "";
        }
        $returnString = "";
        for ($i = 0; $i < count($spouseArray);$i++)
        {
            if ($i > 0)
            {
                $returnString.="-";
            }
            $returnString.=$this->PersonName($spouseArray[$i]);
        }
        return $returnString;
    }
    //**********************************************************************************************************************************************
    function getPersonPhotos($personID, &$numRecords)
    {
        $this->SelectAllStatement("picturedperson", "PersonID", $personID);
        $queryResult = $this->ExecuteQuery();
        $numRecords = count($queryResult);
        return $queryResult;
    }
    //**********************************************************************************************************************************************
    function GetAllVitalRecordIdsForPerson($personID, &$vitalRecordIds)
    {
        $numVitalRecords = $this->GetVitalRecordIdsForPerson($personID, "PersonID", $vitalRecordIds);
        $numVitalRecords+= $this->GetVitalRecordIdsForPerson($personID, "FatherID", $vitalRecordIds);
        $numVitalRecords+= $this->GetVitalRecordIdsForPerson($personID, "MotherID", $vitalRecordIds);
        return $numVitalRecords;
    }
    //**********************************************************************************************************************************************
    function GetVitalRecordIdsForPerson($personID, $personIDCol, &$vitalRecordIds)
    {
        $this->SelectAllStatement("vitalrecord", $personIDCol, $personID);
        $queryResult = $this->ExecuteQuery();
        if ($vitalRecordIds != OnlyNum)
        {
            foreach ($queryResult as $row)
            {
                $vitalRecordIds.=$this->addField($row["PersonID"],e);
            }
        }
        return count($queryResult);
    }
    //**********************************************************************************************************************************************
    function AddField($field,$delimiter)
    {
        return $field.$delimiter;
    }
    //**********************************************************************************************************************************************
    function GetCivilWarRecordForPerson($personID, &$returnString)
    {
        $this->SelectAllStatement("personcw","PersonID",$personID);
        $personCWRow = $this->ExecuteQuerySingleResult();
        if ($personCWRow == null) 
        {
            $numValues = 0;
        }
        else
        {
            $numValues = 1;
            $returnString.= $this->addField($personCWRow["EnlistmentDate"], a);
            $returnString.= $this->addField($personCWRow["CemeteryName"], a);
            $returnString.= $this->addField($personCWRow["BattleSiteKilled"], a);
            $returnString.= $this->addField($personCWRow["PersonCWID"], a);
            $returnString.= $this->addField($personCWRow["DataMilitary"], a);
            $returnString.= $this->addField($personCWRow["Reference"], a);
        }
        return $numValues;
    }
    //**********************************************************************************************************************************************
    function GetAllCensusRecordsForPerson($row, &$returnString)
    {
        $numCensus = 0;
        for ($i = 1790; $i <= 1950; $i+= 10)
        {
            if ($i != 1890 && $row["Census".$i] != 0)
            {
                $numCensus++;
                if ($returnString != OnlyNum)
                {
                    $returnString.= $this->addField($i, a);
                    $returnString.= $this->addField($row["Census".$i], a);
                }
            }
        }
        return $numCensus;
    }
    //**********************************************************************************************************************************************
    function GetSchoolRecordForPersonID($personId)
    {
        if ($personId == 0)
        {
            $this->SelectOneNotEqualStatement("schoolrecord", "distinct SchoolID, Year", "Year", '');
            $this->OrderBy("Year Desc");
            return $this->ExecuteQuery();
        }
        else
        {
            $returnString = "";
            $returnString = $this->GetAllSchoolRecordYears($personId);
            return $returnString;
        }
    }
    //**********************************************************************************************************************************************
    function GetAllSchoolRecordYears($personID)
    {
        $this->query = $this->_db->getQuery(true)->select('SchoolID, Year');
        $this->query->from("schoolrecord");
        $this->OrderBy("Year");
        $this->Where("PersonID", $personID);
        return $this->ExecuteQuery();
    }
    //**********************************************************************************************************************************************
    function GetAllSchoolRecords($personID, &$returnString)
    {
        $this->SelectAllStatement("schoolrecord","PersonID",$personID);
        $this->OrderBy("SchoolRecordType desc, Grade, SchoolID");
        
        $queryResult = $this->ExecuteQuery();
        if ($queryResult == null)
            return 0;
        if ($returnString != OnlyNum)
        {
            $teacherType = false;
            $prevTeacherType = false; 
            $LowGrade = 99;
            $HighGrade = 0;
            $LowYear = 9999;
            $HighYear = 0;
            $SchoolID = 0;
            $NumSchoolRecords = 1;
            $returnString = "";
            foreach ($queryResult as $row)
            {
                $schoolRecordType = $row["SchoolRecordType"];
                $teacherType = ($schoolRecordType == 0) ? true : false;
                $NewSchoolID = $row["SchoolID"];
                if ($SchoolID == 0)
                {
                    $SchoolID = $NewSchoolID;
                    $prevTeacherType = $teacherType;
                }
                else 
                if ($SchoolID != $NewSchoolID || $prevTeacherType != $teacherType)
                {
                    $NumSchoolRecords++;
                    $returnString.= $this->SchoolGradeStr($SchoolID, $LowYear, $HighYear, $LowGrade, $HighGrade, $prevTeacherType);
                    $SchoolID = $NewSchoolID;
                    $prevTeacherType = $teacherType;
                    $LowGrade = 99;
                    $HighGrade = 0;
                    $LowYear = 9999;
                    $HighYear = 0;
                }
                $Year = $row["Year"];
                if ($LowYear > $Year)
                {
                    $LowYear = $Year;
                }
                if ($HighYear < $Year)
                {
                    $HighYear = $Year;
                }
                $grade = $row["Grade"];
                $this->GetLowHighGrades($grade, $LowGrade, $HighGrade);
            }
            $returnString.= $this->SchoolGradeStr($SchoolID, $LowYear, $HighYear, $LowGrade, $HighGrade, $teacherType);
        }
        return $NumSchoolRecords;
    }
    //**********************************************************************************************************************************************
    function GetLowHighGrades($grade, &$LowGrade, &$HighGrade)
    {
        if ($grade == "Grammer")
        {
            if ($LowGrade == "Primary")
            {
                $HighGrade = "Primary";
            }
            else
            if ($HighGrade != "Primary")
            {
                $HighGrade = "Grammer";
            }
            $LowGrade = "Grammer";
        }
        else
        if ($grade == "Primary")
        {
            if ($HighGrade == "Grammer")
            {
                $LowGrade = "Grammer";
            }
            else
            if ($LowGrade != "Grammer")
            {
                $LowGrade = "Primary";
            }
            $HighGrade = "Primary";
        }
        if ($grade == "")
        {
            $LowGrade = 0;
        }
        else
        if ($LowGrade > $grade)
        {
            $LowGrade = $grade;
        }
        else
        if ($HighGrade < $grade)
        {
            $HighGrade = $grade;
        }
    }
    //**********************************************************************************************************************************************
    function GetSchoolId($schoolGradeYear)
    {
  	    $values = explode(',', $schoolGradeYear, 3);
        if (sizeof($values) < 3)
        {
      	    $values = explode('-', $schoolGradeYear, 3);
            if (sizeof($values) < 3)
            {
                return "";
            }
            return $values[0].",".$values[1].",".$values[2];
        }
        $school = str_replace(" School", "", $values[0]);
        $this->SelectAllStatement("school","School",$school);
        $schoolRow = $this->ExecuteQuerySingleResult();
        if ($schoolRow == null) 
        {
            $schoolID = "unknown";
        }
        else
        {
            $schoolID = $schoolRow["SchoolID"];
        }
        if (sizeof($values) == 2)
        {
            $returnValue = $schoolID.", Grade 0,".$values[1];
        }
        else if (sizeof($values) == 3)
        {
            $returnValue = $schoolID.",".$values[1].",".$values[2];
        }
        else
        {
            $returnValue = "";
        }
        return $returnValue;
    }
    //**********************************************************************************************************************************************
    function SchoolGradeStr($SchoolID, $LowYear, $HighYear, $LowGrade, $HighGrade, $isTeacher)
    {
        $school = "";
        $this->SelectAllStatement("school","SchoolID",$SchoolID);
        $schoolRow = $this->ExecuteQuerySingleResult();
        if ($schoolRow == null) 
        {
            $school = "unknown";
        }
        else
        {
            $school = $schoolRow["School"];
        }
        if ($LowYear == $HighYear)
        {
            if ($isTeacher)
            {
                $Str = $school." School, Teacher, ".$LowYear;
            }
            else
            if ($LowGrade == "0")
            {
                $Str = $school." School, ".$LowYear;
            }
            else
            if ($LowGrade == "Grammer" || $LowGrade == "Primary")
            {
                $Str = $school." School, ".$LowGrade.", ".$LowYear;
            }
            else
            {
                $Str = $school." School, Grade ".$LowGrade.", ".$LowYear;
            }
        }
        else
        {
            if ($isTeacher)
            {
                $Str = $school." School, Teacher, ".$LowYear."-".$HighYear;
            }
            else
            if ($LowGrade == "0")
            {
                $Str = $school." School, ".$LowYear."-".$HighYear;
            }
            else
            if ($LowGrade == $HighGrade)
            {
                if ($LowGrade == "Grammer" || $LowGrade == "Primary")
                {
                    $Str = $school." School, ".$LowGrade.", ".$LowYear."-".$HighYear;
                }
                else
                {
                    $Str = $school." School, Grades".$LowGrade.", ".$LowYear."-".$HighYear;
                }
            }
            else
            {
                if ($LowGrade == "Grammer" || $LowGrade == "Primary")
                {
                    $Str = $school." School, ".$LowGrade."-".$HighGrade.", ".$LowYear."-".$HighYear;
                }
                else
                {
                    $Str = $school." School, Grades ".$LowGrade."-".$HighGrade.", ".$LowYear."-".$HighYear;
                }
            }
        }
        return $this->addField($Str, a);
    }
    //**********************************************************************************************************************************************
    function GetAllBuildingLivedIn($personID, &$returnString)
    {
        $this->SelectAllStatement("buildingoccupant","PersonID",$personID);
        $queryResult = $this->ExecuteQuery();
        if ($queryResult == null)
            return 0;
        if ($returnString != OnlyNum)
        {
            foreach ($queryResult as $row)
            {
                $buildingID = $row["BuildingID"];
                $returnString.= $this->addField($this->GetBuildingName($buildingID), a);
            }
        }
        return count($queryResult);
    }
    //**********************************************************************************************************************************************
    function GetBuildingName($buildingID)
    {
        $this->SelectAllStatement("building","BuildingID",$buildingID);
        $row = $this->ExecuteQuerySingleResult();
        if ($row == null) return "unknown";
        return $row["BuildingName"];
    }
    //**********************************************************************************************************************************************
    function getAllSpouses($personID)
    {
        $this->GetMarriages($spouses, "PersonID", "SpouseID", $personID);
        $this->GetMarriages($spouses, "SpouseID", "PersonID", $personID);
        return $spouses;
    }
    //**********************************************************************************************************************************************
    function PersonName($personID)
    {
        $personRow = $this->getPerson($personID);
        if ($personRow == null)
        {
            return "";
        }
        $spouseName = new HJName;
        $spouseName->SetNameFromDataRow($personRow);
        return $spouseName->BuildNameFirstNameFirst();
    }
    //****************************************************************************************************************************
    public function GetCategories()
    {
        $this->SelectAllStatement('category');
        return $this->ExecuteQuery();
    }
    //****************************************************************************************************************************
    function GetMarriages(&$queryArray,
                            $key_col,
                            $result_col,
                            $personID)
    {
        $this->SelectAllStatement("marriage", $key_col, $personID);
        $arrayList = $this->ExecuteQuery();
        foreach ($arrayList as $queryElement)
        {
            $queryArray[] = $queryElement[$result_col];
        }
    }
    //**********************************************************************************************************************************************
    function getPerson($personID)
    {
        if ($personID == 0)
        {
            return null;
        }
        $this->SelectAllStatement("person", "PersonID", $personID);
        return $this->ExecuteQuerySingleResult();
    }
    //**********************************************************************************************************************************************
    public function GetBuildings()
    {
        $this->_db->getQuery(true)->select('*')->from('building');
        $this->_db->setQuery($this->query);
        $types = $this->_db->loadObjectList('BuildingName');
    }
    //**********************************************************************************************************************************************
    function getAllPhotosForBuildingFromQRCode($QRCode)
    {
        $this->SelectAllStatement("building","BuildingQRCode",$QRCode);
        $queryElement = $this->ExecuteQuerySingleResult();
        $BuildingID = 0;
        if ($queryElement == null)
        {
            $returnString = $this->QRCodeString($QRCode, $numPhotos);
            return $returnString;
        }
        $BuildingID = $this->getElement($queryElement, "BuildingID");
		$numPhotos = 0;
        $photos = $this->getAllPhotosForBuilding($BuildingID, $numPhotos);
        return $photos;
    }
    //**********************************************************************************************************************************************
    function getAllPhotosForBuilding($BuildingID, &$numPhotos)
    {
        $numPhotos = 0;
        $returnString = "";
        if ($BuildingID == 0)
        {
            return "";
        }
        $this->SelectAllStatement("building","BuildingID",$BuildingID);
        $queryElement = $this->ExecuteQuerySingleResult();
        if ($queryElement == null)
            return "";
        $qrcode = $this->getElement($queryElement, "BuildingQRCode");
        if (HJHelper::notEmptyStr($qrcode))
        {
            $returnString = $this->QRCodeString($queryElement, $qrcode, $numPhotos);
        }
        $this->SelectAllStatement("picturedbuilding","BuildingID",$BuildingID);
        $orderField = "PicturedBuildingNumber";
        $this->OrderBy($orderField);
        $queryResult = $this->ExecuteQuery();
        $numPhotos .= count($queryResult);
        foreach ($queryResult as $queryElement)
        {
            if (strlen($returnString) != 0)
            {
                $returnString.=e;
            }
            $returnString.=$this->PhotoNameNum($queryElement["PhotoID"]);
        }
        return $returnString;
    }
    //**********************************************************************************************************************************************
    function QRCodeString($buildingRow, $qrcode, &$numPhotos)
    {    
        $returnString = "";
        $numPhotos = 1;
        $returnString = $qrcode;
        $then1 = $this->getElement($buildingRow, "BuildingThen1");
        $then2 = $this->getElement($buildingRow, "BuildingThen2");
        $now1 = $this->getElement($buildingRow, "BuildingNow1");
        $now2 = $this->getElement($buildingRow, "BuildingNow2");
        $then1Title = $this->getElement($buildingRow, "BuildingThen1Title");
        $then2Title = $this->getElement($buildingRow, "BuildingThen2Title");
        $now1Title = $this->getElement($buildingRow, "BuildingNow1Title");
        $now2Title = $this->getElement($buildingRow, "BuildingNow2Title");
		$returnString .= $this->AddThenNow($then1, "@T", $then1Title);
		$returnString .= $this->AddThenNow($now1,"@N", $now1Title);
		$returnString .= $this->AddThenNow($then2, "@T", $then2Title);
		$returnString .= $this->AddThenNow($now2, "@N", $now2Title);
		$returnString .= e."@Q";
        return $returnString;
    }
    //**********************************************************************************************************************************************
    function AddThenNow($thenNowPhoto, $thenNow, $title)
    {    
        if (HJHelper::notEmptyStr($thenNowPhoto))
		{
            if (HJHelper::emptyStr($title))
			{
			    $title = ($thenNow[1] == 'T') ? "Then" : "Now";
			}
            $photoNum = (int)substr($thenNowPhoto,2,6);
		    return e.$thenNow.f.$photoNum.f.$title;
		}
		return "";
	}
    //**********************************************************************************************************************************************
    function PhotoNameNum($photoID)
    {    
        $this->SelectAllStatement("photo", "PhotoID", $photoID);
        $queryElement = $this->ExecuteQuerySingleResult();
        if ($queryElement == null)
            return "";
        $photoName = $this->getElement($queryElement, "PhotoName");
        return (int)substr($photoName,2,6);
    }
    //**********************************************************************************************************************************************
    function getElement($queryElement, $fieldName)
    {
        if (isset($queryElement[$fieldName]))
        {
            return $queryElement[$fieldName];
        }
        else 
        {
            return "";
        }
    }
    function isDuplicate($queryArray, $queryElement, $PrimaryKey)
    {
        $keyValue = $queryElement[$PrimaryKey];
        $num = HJHelper::numInArray($queryArray);
        for ($j = 0; $j < $num; ++$j)
        {
            $oldKeyValue = $queryArray[$j][$PrimaryKey];
            if ($keyValue == $oldKeyValue)
                return true;
        }
        return false;
    }
}
//**********************************************************************************************************************************************
?>
