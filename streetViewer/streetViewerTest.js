function tableTester() {
    var t = document.createElement("table");
    tb = document.createElement("tbody")
    t.setAttribute("border", "1")
    var tr = document.createElement("tr");
    var td;
    var d;

    d = document.createElement("div")
    textnode1 = document.createTextNode("test1");
    d.appendChild(textnode1);
    d.style.backgroundColor = "red";
    d.style.minHeight = "20px";
    d.style.width = "50px";
    td = document.createElement("td");
    td.appendChild(d)
    tr.appendChild(td);

    d = document.createElement("div")
    textnode2 = document.createTextNode("test2");
    d.appendChild(textnode2);
    d.style.backgroundColor = "green";
    d.style.minHeight = "20px";
    d.style.width = "50px";
    td = document.createElement("td");
    td.appendChild(d)
    tr.appendChild(td);

    tb.appendChild(tr);
    t.appendChild(tb);
    document.getElementById("tableDemonstrator").appendChild(t);

}  
