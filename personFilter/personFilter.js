function loadPersonFilter(selectedPersonOption, tableName)
{
	if (tableName == "vitalrecord")
    {
		document.getElementById("PersonFilterTable").style.height="364px";	
		CreatePersonOptionGroup(selectedPersonOption);
		document.getElementById("UserText").style.height="358px";	
    }
	else
	{
    	document.getElementById("PersonFilterTable").style.height="344px";	
		CreatePhotosOnlyGroup();
	}
}
function CreatePhotosOnlyGroup()
{
      var spaceBr= document.createElement('br');
   	  var photosOnly = document.createElement('input');
      photosOnly.setAttribute('ID', 'photosOnlyID');
      photosOnly.setAttribute('type', 'checkbox');
      photosOnly.setAttribute('name', 'photosOnlyName');
      photosOnly.value="photosOnlyValue";
      var labelPhotosOnly = document.createElement('label');
      labelPhotosOnly.for="photosOnlyID";
      labelPhotosOnly.style.width="200px";
      labelPhotosOnly.innerHTML = 'Photos Only';
      document.getElementById('PersonFilterTable').appendChild(spaceBr);
      document.getElementById('PersonFilterTable').appendChild(photosOnly);
      document.getElementById('PersonFilterTable').appendChild(labelPhotosOnly);
}
function CreatePersonOptionGroup(selectedPersonOption)
{
	  var div = document.createElement('div');
	  div.id = "PersonOptionsGroup";
	  div.style.width="300px";
	  div.style.align="center";
      document.getElementById('PersonFilterTable').appendChild(div);

      var personOptionP = document.createElement('input');
      personOptionP.setAttribute('ID', 'personOptionP');
      personOptionP.setAttribute('type', 'radio');
      personOptionP.setAttribute('name', 'personOptions');
      personOptionP.setAttribute('label', 'test');
      personOptionP.value="Person" 
      var labelPersonOptionP = document.createElement('label');
      labelPersonOptionP.innerHTML = 'Search as Person';
      labelPersonOptionP.style.width="200px";

   	  var personOptionPP = document.createElement('input');
      personOptionPP.setAttribute('ID', 'personOptionPP');
      personOptionPP.setAttribute('type', 'radio');
      personOptionPP.setAttribute('name', 'personOptions');
      personOptionPP.value="PersonParent";
      var labelPersonOptionPP = document.createElement('label');
      labelPersonOptionPP.style.width="200px";
      labelPersonOptionPP.innerHTML = 'Search as Person and Parent';

      if (selectedPersonOption == "PersonParent")
      {
  	      personOptionPP.setAttribute('checked', 'checked');
      }
  	  else
      {
  	      personOptionP.setAttribute('checked', 'checked');
      }

      var spaceBr= document.createElement('br');
      document.getElementById('PersonOptionsGroup').appendChild(spaceBr);
      
  	  document.getElementById('PersonOptionsGroup').appendChild(personOptionP);
      document.getElementById('PersonOptionsGroup').appendChild(labelPersonOptionP);

      var spaceBr1= document.createElement('br');
      document.getElementById('PersonOptionsGroup').appendChild(spaceBr1);

      document.getElementById('PersonOptionsGroup').appendChild(personOptionPP);
      document.getElementById('PersonOptionsGroup').appendChild(labelPersonOptionPP);
}
function gotoPersonDatagrid(url,option)
{
	var lastName = document.getElementById("LastName").value;
	if (lastName.length == 0)
	{
	    return;
	}
	lastName = lastName.replace("'","|");
    var parmArray = new Array();
    parmArray[0] = option;
	parmArray[1] = lastName;
	parmArray[2] = document.getElementById("FirstName").value;
	parmArray[3] = document.getElementById("MiddleName").value;
	parmArray[4] = document.getElementById("Suffix").value;
	parmArray[5] = document.getElementById("Prefix").value;
	parmArray[6] = PersonOption();
	url += "&parms=" + parmArray;
	window.open(url, "_self");
}
function PersonOption()
{
	var personOptions = document.getElementsByName("personOptions");
    if (personOptions.length == 2) 
    {
    	if (personOptions[0].checked)
            return personOptions[0].value;
    	else
            return personOptions[1].value;
    }
	var photosOnly = document.getElementById("photosOnlyID");
   	if (photosOnly.checked)
        return "PhotosOnly";
	else
	    return "";
}