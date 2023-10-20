var Papa;
if (typeof module !== 'undefined' && module.exports) {
    Papa = require('./papaparse.js');
}

/**
 * Les enumeres
 */
const typeEvenement = {
    ExamGP: 'Examen GP',
    SIInit: 'Stage Initial Initiateur',
    ExamInit: 'Examen Initiateur',
    TSI: 'TSI'
};

const demandeurs = {
    CTD22: 'CTD 22 (03 22 00 00)',
    CTD29: 'CTD 29 (03 29 00 00)',
    CTD35: 'CTD 35 (03 35 00 00)',
    CTD44: 'CTD 44 (03 44 00 00)'
};

const statut = {
    DEMANDE: 'En cours',
    CONFLIT: 'En conflit',
    VALIDE: 'Validé',
    REPONDU: 'Répondu'
};

/**
  * Selectionne la ligne et parcours ses cellules
  * @param Event oEvent
  */
function getCelluleLigne(oEvent) {
    var sMg = "",
        /* je récupère l'objtet TR*/
        oTr = oEvent.currentTarget,
        /* je récupère les cellules du TD */
        oTds = oTr.cells,
        iNbTds = oTr.cells.length;
    for (var i = 0; i < iNbTds; i++) {
        sMg += oTds[i].innerText + "\n";
    }//for
    //selecteLigne(oTr);
    //alert(sMg); 
}//fct

/**
  * Selectionne la ligne via un click sur une des cellules
  * @param Event oEvent
  */
function selecteLigne(oEvent) {
    var sClass = "selectedLigne",
        oTr = oEvent.currentTarget;
    // voir classList.toggle
    if (oTr.classList.contains(sClass)) {
        oTr.classList.remove(sClass);
    } else {
        oTr.classList.add(sClass);
    }//else
}//fct

/**
  * Selectionne la ligne via une checkbox
  * @param Event oEvent
  */
function checkboxLigne(oEvent) {
    var sClass = "selectedCheckbox",
        oCheckbox = oEvent.currentTarget,
        //La valeur de la ligne correspond a index du tr dans le tbody du tableau
        iValue = oCheckbox.value,
        //selection du tr
        oTr = document.querySelector("tbody tr:nth-child(" + (Number(iValue) + 1) + ")");
    // voir classList.toggle
    if (oCheckbox.checked == true) {
        oTr.classList.add(sClass);
    } else {
        oTr.classList.remove(sClass);
    }//else
}//fct

/* 
///////////////////////////////////
CONFIG
///////////////////////////////////
*/
var oConfig = {
    bUseCheckbox: false,
    bUseLigne: false
};
/**
  * Assigne le type de sélection 
  * @param Event oEvent
  */
function setConfig(oEvent) {
    var oRadio = oEvent.currentTarget,
        iValue = oRadio.value,
        bSelected = oRadio.checked;
    if (bSelected) {
        if (iValue == 1) {
            //par Checkbox
            if (oConfig.bUseCheckbox == false) {
                initCheckbox(true);
                initLigne(false);
            }
        } else {
            // par ligne
            if (oConfig.bUseCheckbox == true) {
                initCheckbox(false);
                initLigne(true);
            }
        }
    }
}
/**
  * Initialise/ Supprime la selection par ligne avec checkbox
  * @param Boolean bAdd
  */
function initCheckbox(bAdd) {
    var aCheckbox = document.querySelectorAll(".checkbox-select-line"),
        iNbCheckbox = aCheckbox.length;
    oConfig.bUseCheckbox = bAdd;
    for (var i = 0; i < iNbCheckbox; i++) {
        if (oConfig.bUseCheckbox == true) {
            aCheckbox[i].addEventListener(
                'click', checkboxLigne
            );
        } else {
            aCheckbox[i].removeEventListener(
                'click', checkboxLigne
            );
            aCheckbox[i].checked = false;
        }//else
    }//for
}//fct
/**
  * Initialise/ Supprime  la selection par ligne
  * @param Boolean bAdd
  */
function initLigne(bAdd) {
    var aTr = document.querySelectorAll("tbody tr"), iNb = aTr.length;
    oConfig.bUseLigne = bAdd;
    for (var i = 0; i < iNb; i++) {
        aTr[i].removeAttribute("class");
        if (oConfig.bUseLigne == true) {
            aTr[i].addEventListener(
                'click', selecteLigne
            );
        } else {
            aTr[i].removeEventListener(
                'click', selecteLigne
            );
        }//else
    }//for
}//fct

//Ajout de lignes dans le tableau
var str = "";
const date = new Date();
const url = "data/Demande-CR-Questionnaire-Voeux_2021-22.xlsx";
const file = new File(url, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
const workbook = XLSX.read(file);
const worksheet = workbook.Sheets[workbook.SheetNames[2]];
const raw_data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
console.log("JSON Data : ", raw_data);

for (var i = 0; i < 10; i++) {
    str = str + '<tr>'
        + '<td class="selection"><input type="checkbox" id="selection" value="' + i + '" class="checkbox-select-line"></td>'
        + '<td class="date">' + date.toLocaleDateString() + '</td>'
        + '<td class="typeEvenement">' + typeEvenement.ExamGP + '</td>'
        + '<td>' + demandeurs.CTD29 + '</td>'
        + '<td class="date">' + date.toLocaleDateString() + '</td>'
        + '<td class="date">' + date.toLocaleDateString() + '</td>'
        + '<td></td>'
        + '<td>' + demandeurs.CTD29 + '</td>'
        + '<td class="mailAdress"></td>'
        + '<td></td>'
        + '<td></td>'
        + '<td class="date">' + date.toLocaleDateString() + '</td>'
        + '<td class="statut">' + statut.VALIDE + '</td>'
        + '</tr>';
}
document.getElementById("tbody").innerHTML = str;
