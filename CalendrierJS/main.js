const fs = require('fs');
import data from './data/test.json' assert { type: 'json' };
import typesEvenement from './resources/typeEvenement.json' assert {type: 'json'};
import demandeurs from './resources/demandeur.json' assert {type: 'json'};
import moniteurs from './resources/moniteurs.json' assert {type: 'json'};

// URL pour acceder au resultat des forms : https://docs.google.com/spreadsheets/d/1xMJvX7KZPLax24rcWe2aC76xEAmW4qlRKG-iwH91UF0/gviz/tq?tqx=out:json&tq=select+*&gid=1075595583

/**
 * Les enumeres
 */
const statut = {
    DEMANDE: 'En cours',
    CONFLIT: 'En conflit',
    VALIDE: 'Validé',
    REPONDU: 'Répondu'
};

function findTypeEvenement(strValeur) {
    var typeEvenementRes = { id: "", name: "nom", type: "activite", valeur: "val" };

    typesEvenement.forEach(element => {
        if (element.valeur === strValeur) {
            typeEvenementRes = element;
        }
    });

    return typeEvenementRes;
}

function findTypeEvenementById(idType) {
    var typeEvenementRes = { id: "", name: "nom", type: "activite", valeur: "val" };

    typesEvenement.forEach(element => {
        if (element.id === idType) {
            typeEvenementRes = element;
        }
    });

    return typeEvenementRes;
}

function findTypeEvenementByName(nameType) {
    var typeEvenementRes = { id: "", name: "nom", type: "activite", valeur: "val" };

    typesEvenement.forEach(element => {
        if (element.name === nameType) {
            typeEvenementRes = element;
        }
    });

    return typeEvenementRes;
}

function findDemandeur(strValeur) {
    var demandeurRes = { id: "", name: "nom", numero: "num", valeur: "val" };

    demandeurs.forEach(element => {
        if (element.valeur === strValeur) {
            demandeurRes = element;
        }
    });

    return demandeurRes;
}

function findDemandeurById(idDemandeur) {
    var demandeurRes = { id: "", name: "nom", numero: "num", valeur: "val" };

    demandeurs.forEach(element => {
        if (element.id === idDemandeur) {
            demandeurRes = element;
        }
    });

    return demandeurRes;
}

function findEvenementById(idEvenement) {
    var evenementRes;
    window.evenements.forEach(element => {
        if (element.id === idEvenement) {
            evenementRes = element;
        }
    });

    return evenementRes;
}

function findMoniteurById(idMoniteur) {
    var moniteurRes = { id: "", nom: "", prenom: "", niveau: "" };

    moniteurs.forEach(element => {
        if (element.id === idMoniteur) {
            moniteurRes = element;
        }
    });

    return moniteurRes;
}

function findMoniteurByName(nameMoniteur) {
    var moniteurRes = { id: "", nom: "", prenom: "", niveau: "" };
    nameMoniteur = nameMoniteur.trim();

    moniteurs.forEach(element => {
        var isFound = false;
        if (nameMoniteur.includes("@")) {
            // Cas d'un mail
            var name = nameMoniteur.split("@")[0];
            console.log("mail : ", name);
            if (name.includes(".")) {
                name.split(".").forEach(partName => {
                    if (!isFound && element.nom.toUpperCase().includes(partName.toUpperCase())) {
                        moniteurRes = element;
                        isFound = true;
                    }
                });
            }
            if (name.includes("-")) {
                name.split("-").forEach(partName => {
                    if (!isFound && element.nom.toUpperCase().includes(partName.toUpperCase())) {
                        moniteurRes = element;
                        isFound = true;
                    }
                });
            }
            if (name.includes("_")) {
                name.split("_").forEach(partName => {
                    if (!isFound && element.nom.toUpperCase().includes(partName.toUpperCase())) {
                        moniteurRes = element;
                        isFound = true;
                    }
                });
            }

            if (name.split(" ").length >= 2) {
                name.split(" ").forEach(partName => {
                    if (!isFound && element.nom.includes(partName.toUpperCase())) {
                        moniteurRes = element;
                        isFound = true;
                    }
                });
            } else {
                if (!isFound && element.nom.toUpperCase().includes(name.toUpperCase())) {
                    moniteurRes = element;
                    isFound = true;
                }
            }
        } else {
            // cas d'un nom prenom ou inversement
            if (nameMoniteur.split(" ").length >= 2) {
                nameMoniteur.split(" ").forEach(partName => {
                    if (!isFound && element.nom.includes(partName.toUpperCase())) {
                        moniteurRes = element;
                        isFound = true;
                    }
                });
            } else {
                if (element.nom.toUpperCase().includes(nameMoniteur.toUpperCase())) {
                    moniteurRes = element;
                    isFound = true;
                }
            }
        }
    });

    console.log("Nom Moniteur recherche : ", nameMoniteur, " --> Nom moniteur trouve : ", moniteurRes.nom, " ", moniteurRes.prenom);
    return moniteurRes;
}


function formatDateFromJSON(strDateFromJSON) {
    var pattern = /(\d{2})\/(\d{2})\/(\d{4})/;
    var strResult = strDateFromJSON.replace(pattern, '$3/$2/$1');
    return strResult;
}

function formatDateForInputHTML(strDate) {
    var pattern = /(\d{2})\/(\d{2})\/(\d{4})/;
    var strResult = strDate.replace(pattern, '$3-$2-$1');
    return strResult;
}

function deselectAllLines() {
    var aTr = document.querySelectorAll("tbody tr"), iNb = aTr.length;
    for (var i = 0; i < iNb; i++) {
        aTr[i].removeAttribute("class");
    }
}

function createFormEdit(evenement) {

    console.log("Les dates : ", formatDateForInputHTML(evenement.dateDemande.toLocaleDateString()));
    var str = '<h1>Edition de la demande de ' + findTypeEvenementById(evenement.idType).name + ' par ' + findDemandeurById(evenement.idDemandeur).name + '</h1>'
        //        + '<form method="post" action=\'index.html\'>'
        //        + '<form>'
        + '  <fieldset>'
        + '    <div><label for="dateDemande">Date de la demande : <input id="dateDemande" name="dateDemande" type="date" disabled value="' + formatDateForInputHTML(evenement.dateDemande.toLocaleDateString()) + '"/></label></div>'
        + '    <div><label for="dateDebut">Date de début : <input id="dateDebut" name="dateDebut" type="date" required value="' + formatDateForInputHTML(evenement.dateDebut.toLocaleDateString()) + '"/></label></div>'
        + '    <div><label for="dateFin">Date de fin : <input id="dateFin" name="dateFin" type="date" required value="' + formatDateForInputHTML(evenement.dateFin.toLocaleDateString()) + '"/></label></div>'
        + '  </fieldset>'
        + '  <fieldset>'
        + '    <div><label for="contact">Mail de contact : <input id="contact" name="contact" type="email" required value="' + evenement.contact + '"/></label></div>'
        + '    <div><label for="lieu">Lieu : <input id="lieu" name="lieu" type="text" required value="' + evenement.lieu + '"/></label></div>'
        + '    <div><label for="demandeur">Demandeur : '
        + '      <select id="demandeur" name="demandeur" >'
        + '        <option value="">(select one)</option>';
    var selectStr = '';
    demandeurs.forEach(element => {
        selectStr = selectStr + '<option value="' + element.id + '"' + ((findDemandeurById(evenement.idDemandeur).id === element.id) ? ' selected' : '') + '>' + element.name + '</option>'
    });
    str = str + selectStr
        + '      </select>'
        + '    </label></div>'
        + '    <div><label for="partenaire">Partenaire : '
        + '      <select id="partenaire" name="partenaire" >'
        + '        <option value="">(select one)</option>';
    var selectPartenaireStr = '';
    demandeurs.forEach(element => {
        selectPartenaireStr = selectPartenaireStr + '<option value="' + element.id + '"' + ((findDemandeurById(evenement.idPartenaire).id === element.id) ? ' selected' : '') + '>' + element.name + '</option>'
    });
    str = str + selectPartenaireStr
        + '      </select>'
        + '    </label></div>'
        + '  </fieldset>'
        + '  <fieldset>'
        + '    <div><label for="presidentJury">Président de Jury : '
        + '      <select id="presidentJury" name="presidentJury" >'
        + '        <option value="">(select one)</option>';
    var selectpresidentJuryStr = '';
    moniteurs.forEach(element => {
        selectpresidentJuryStr = selectpresidentJuryStr + '<option value="' + element.id + '"' + ((findMoniteurById(evenement.idPresidentJury).id === element.id) ? ' selected' : '') + '>' + element.nom + ' ' + element.prenom + '</option>'
    });
    str = str + selectpresidentJuryStr
        + '      </select>'
        + '    </label></div>'
        + '    <div><label for="delegueCTR">Délégué CTR : '
        + '      <select id="delegueCTR" name="delegueCTR" >'
        + '        <option value="">(select one)</option>';
    var selectDelegueCTRStr = '';
    moniteurs.forEach(element => {
        selectDelegueCTRStr = selectDelegueCTRStr + '<option value="' + element.id + '"' + ((findMoniteurById(evenement.idDelegueCTR).id === element.id) ? ' selected' : '') + '>' + element.nom + ' ' + element.prenom + '</option>'
    });
    str = str + selectDelegueCTRStr
        + '      </select>'
        + '    </label></div>'
        + '  </fieldset>'
        + '  <button id="validatebutton">Valider</button>'
    //        + '</form>'

    return str;
}

function validateDemande() {
    console.log("Validation de : ", window.evenement.id);
    console.log("Recuperation de la date de demande du formulaire : ", document.getElementById("dateDemande").value);
}

/**
  * Selectionne la ligne via un click sur une des cellules
  * @param Event oEvent
  */
function selecteLigne(oEvent) {
    var sClass = "selectedLigne",
        oTr = oEvent.currentTarget,
        oTds = oTr.cells;
    deselectAllLines();
    if (oTr.classList.contains(sClass)) {
        oTr.classList.remove(sClass);
        document.getElementById("edition").innerHTML = '';
    } else {
        oTr.classList.add(sClass);
        // Construction d'un formulaire
        // Recuperation de l'evenement correspodant à la ligne
        var dateDemande = new Date(formatDateFromJSON(oTds[0].innerText));
        window.evenement = findEvenementById(dateDemande.toISOString() + '-' + findTypeEvenementByName(oTds[1].innerText).id);
        document.getElementById("edition").innerHTML = createFormEdit(window.evenement);
        const button = document.querySelector("button");

        button.addEventListener("click", (event) => {
            console.log(window.evenement);
            validateDemande();
        });
    }

}

/**
  * Initialise/ Supprime  la selection par ligne
  */
function initLigne() {
    var aTr = document.querySelectorAll("tbody.listeDate > tr"), iNb = aTr.length;
    for (var i = 0; i < iNb; i++) {
        aTr[i].removeAttribute("class");
        aTr[i].addEventListener(
            'click', selecteLigne
        );
    }
}

function sauveBDD(evenements) {
    fs.writeFile('./data/BDD.json', JSON.stringify(evenements), err => {
        if (err) {
            throw err;
        }
        console.log('JSON data is saved.');
    });
}

function initBDD() {
    var evenements = new Array();
    var rows = data.table.rows;

    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        var dateDemande = new Date();
        var dateDebut = new Date();
        var dateFin = new Date();
        var typeEvenement = { id: "", name: "nom", type: "activite", valeur: "val" };
        var demandeur = { id: "", name: "nom", numero: "num", valeur: "val" };
        var partenaire = { id: "", name: "nom", numero: "num", valeur: "val" };
        var lieu = '';
        var contact = '';
        var delegueCTR = { id: "", nom: "", prenom: "", niveau: "num" };
        var presidentJury = { id: "", nom: "", prenom: "", niveau: "num" };
        var repCIBPL = { id: "", nom: "", prenom: "", niveau: "num" };
        for (var iVal = 0; iVal < row.c.length; iVal++) {
            var val = row.c[iVal];
            if (val != null) {
                switch (iVal) {
                    case 0: // Date de demande
                        dateDemande = new Date(formatDateFromJSON(val.f));
                        //console.log("Date de demande : ", dateDemande, " (", val.f, ")");
                        break;
                    case 3: // Activite
                        typeEvenement = findTypeEvenement(val.v);
                        break;
                    case 4: // Date de debut
                        dateDebut = new Date(formatDateFromJSON(val.f));
                        break;
                    case 5: // Date de fin
                        dateFin = new Date(formatDateFromJSON(val.f));
                        break;
                    case 6: // Demandeur, Demandeur nouveau et Partenariat
                        if (val.v != null)
                            demandeur = findDemandeur(val.v);
                        break;
                    case 8: // Demandeur, Demandeur nouveau et Partenariat
                        if (val.v != null)
                            partenaire = findDemandeur(val.v);
                        break;
                    case 9: // Lieu, structure support
                        lieu = val.v;
                        break;
                    case 12: // Proposition delegue CTR + mail
                        delegueCTR = findMoniteurByName(val.v);
                        break;
                    case 13: // propsition president jury
                        presidentJury = findMoniteurByName(val.v);
                        break;
                    case 14: // proposition representant CIBPL
                        repCIBPL = findMoniteurByName(val.v);
                        break;
                    case 15:// Mail de contact
                        contact = val.v;
                        break;
                }
            }
        }
        var evenement = {
            id: dateDemande.toISOString() + '-' + typeEvenement.id,
            dateDemande: dateDemande,
            dateDebut: dateDebut,
            dateFin: dateFin,
            idType: typeEvenement.id,
            idDemandeur: demandeur.id,
            idPartenaire: partenaire.id,
            contact: contact,
            lieu: lieu,
            idPresidentJury: presidentJury.id,
            idDelegueCTR: delegueCTR.id,
            idRepCIBPL: repCIBPL.id,
            statut: statut.DEMANDE,
            dateValidation: new Date()
        };
        evenements.push(evenement);
    }
    sauveBDD(evenements);
}

function afficheTableauDe(strTypeEvenement) {
    deselectAllLines();
    document.getElementById("edition").innerHTML = "";
    var evenementRes = new Array();
    if (strTypeEvenement != "Filtre-All") {
        window.evenements.forEach(element => {
            if (findTypeEvenementById(element.idType).type.toUpperCase() === strTypeEvenement.replace("Filtre-", "").toUpperCase()) {
                evenementRes.push(element);
            }
        });
    } else {
        evenementRes = window.evenements;
    }
    document.getElementById("tbody").innerHTML = updateTableau(evenementRes);
    initLigne();
}

function updateTableau(evenements) {
    //Ajout de lignes dans le tableau
    var str = "";
    var date = new Date();
    for (var i = 0; i < evenements.length; i++) {
        var event = evenements[i];
        if (event.dateDebut >= date) {
            str = str + '<tr id="listeEvent">'
                + '<td class="date">' + event.dateDemande.toLocaleDateString() + ' ' + event.dateDemande.toLocaleTimeString() + '</td>'
                + '<td class="typeEvenement">' + findTypeEvenementById(event.idType).name + '</td>'
                + '<td>' + findDemandeurById(event.idDemandeur).name + '</td>'
                + '<td class="date">' + event.dateDebut.toLocaleDateString() + '</td>'
                + '<td class="date">' + event.dateFin.toLocaleDateString() + '</td>'
                + '<td>' + event.lieu + '</td>'
                + '<td>' + findDemandeurById(event.idDemandeur).name + ((event.idPartenaire != '') ? ' avec ' + findDemandeurById(event.idPartenaire).name : '') + '</td>'
                + '<td class="mailAdress">' + event.contact + '</td>'
                + '<td>' + findMoniteurById(event.idPresidentJury).nom + ' ' + findMoniteurById(event.idPresidentJury).prenom + '</td>'
                + '<td>' + findMoniteurById(event.idDelegueCTR).nom + ' ' + findMoniteurById(event.idDelegueCTR).prenom + '</td>'
                + '<td class="date">' + event.dateValidation.toLocaleDateString() + '</td>'
                + '<td class="statut">' + event.statut + '</td>'
                + '</tr>';
        }
    }
    return str;
}

function readBDDFile(strPath) {
    fs.readFile(strPath, (err, data) => {
        if (err) {
            initBDD();
            readBDDFile('./data/BDD.json');
        } else {
            var dateTimeReviver = function (key, value) {
                if (key === 'dateDemande' || key === 'dateDebut' || key === 'dateFin' || key === 'dateValidation') {
                    return new Date(value);
                }
                return value;
            }
            window.evenements = JSON.parse(data.toString(), dateTimeReviver);
            document.getElementById("tbody").innerHTML = updateTableau(window.evenements);
            initLigne();
        }
    });
}

function initFiltre() {
    // Creation des cases
    var str = "";
    var typeDone = new Array();
    typesEvenement.forEach(element => {
        if (!typeDone.includes(element.type)) {
            str = str +
                '<td id="Filtre-' + element.type + '" class="filtre">' + element.type + '</td>';
            typeDone.push(element.type);
        }
    });

    document.getElementById("filtre").innerHTML = str;
    // affectation des evenement de click
    var aTd = document.querySelectorAll("td.filtre"), iNb = aTd.length;
    console.log("Nb TD Filtres : ", iNb);
    for (var i = 0; i < iNb; i++) {
        var strId = aTd[i].getAttribute("id");
        console.log("==> Id TD : ", strId);
        aTd[i].addEventListener(
            'click', (event) => {
                console.log("Evt Td : ", event.currentTarget.getAttribute("id"));
                afficheTableauDe(event.currentTarget.getAttribute("id"));
            }
        );
    }
}

initFiltre();
readBDDFile('./data/BDD.json');
