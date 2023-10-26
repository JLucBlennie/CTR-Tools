const fs = require('fs');
import data from './data/test.json' assert { type: 'json' };
import typesEvenement from './resources/typeEvenement.json' assert {type: 'json'};
import demandeurs from './resources/demandeur.json' assert {type: 'json'};

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
        + '    <label for="dateDemande">Date de la demande : <input id="dateDemande" name="dateDemande" type="date" disabled value="' + formatDateForInputHTML(evenement.dateDemande.toLocaleDateString()) + '"/></label>'
        + '    <label for="dateDebut">Date de début : <input id="dateDebut" name="dateDebut" type="date" required value="' + formatDateForInputHTML(evenement.dateDebut.toLocaleDateString()) + '"/></label>'
        + '    <label for="dateFin">Date de fin : <input id="dateFin" name="dateFin" type="date" required value="' + formatDateForInputHTML(evenement.dateFin.toLocaleDateString()) + '"/></label>'
        + '    <label for="contact">Mail de contact : <input id="contact" name="contact" type="email" required value="' + evenement.contact + '"/></label>'
        + '    <label for="lieu">Lieu : <input id="lieu" name="lieu" type="text" required value="' + evenement.lieu + '"/></label>'
        + '  </fieldset>'
        + '  <fieldset>'
        + '    <label for="profile-picture">Upload a profile picture: <input id="profile-picture" type="file" name="file" /></label>'
        + '    <label for="age">Input your age (years): <input id="age" type="number" name="age" min="13" max="120" /></label>'
        + '    <label for="referrer">How did you hear about us?'
        + '      <select id="referrer" name="referrer">'
        + '        <option value="">(select one)</option>'
        + '        <option value="1">freeCodeCamp News</option>'
        + '        <option value="2">freeCodeCamp YouTube Channel</option>'
        + '        <option value="3">freeCodeCamp Forum</option>'
        + '        <option value="4">Other</option>'
        + '      </select>'
        + '    </label>'
        + '    <label for="bio">Provide a bio:'
        + '      <textarea id="bio" name="bio" rows="3" cols="30" placeholder="I like coding on the beach..."></textarea>'
        + '    </label>'
        + '  </fieldset>'
        + '  <label for="terms-and-conditions">'
        + '    <input id="terms-and-conditions" type="checkbox" required name="terms-and-conditions" /> I accept the <a href="https://www.freecodecamp.org/news/terms-of-service/">terms and conditions</a>'
        + '  </label>'
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
    var aTr = document.querySelectorAll("tbody tr"), iNb = aTr.length;
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
        var delegueCTR = '';
        var presidentJury = '';
        var repCIBPL = '';
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
                        delegueCTR = val.v;
                        break;
                    case 13: // propsition president jury
                        presidentJury = val.v;
                        break;
                    case 14: // proposition representant CIBPL
                        repCIBPL = val.v;
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
            presidentJury: presidentJury,
            delegueCTR: delegueCTR,
            repCIBPL: repCIBPL,
            statut: statut.DEMANDE,
            dateValidation: new Date()
        };
        evenements.push(evenement);
    }
    sauveBDD(evenements);
}

function updateTableau(evenements) {
    //Ajout de lignes dans le tableau
    var str = "";
    var date = new Date();
    for (var i = 0; i < evenements.length; i++) {
        var event = evenements[i];
        if (event.dateDebut >= date) {
            str = str + '<tr>'
                + '<td class="date">' + event.dateDemande.toLocaleDateString() + ' ' + event.dateDemande.toLocaleTimeString() + '</td>'
                + '<td class="typeEvenement">' + findTypeEvenementById(event.idType).name + '</td>'
                + '<td>' + findDemandeurById(event.idDemandeur).name + '</td>'
                + '<td class="date">' + event.dateDebut.toLocaleDateString() + '</td>'
                + '<td class="date">' + event.dateFin.toLocaleDateString() + '</td>'
                + '<td>' + event.lieu + '</td>'
                + '<td>' + findDemandeurById(event.idDemandeur).name + ((event.idPartenaire != '') ? ' avec ' + findDemandeurById(event.idPartenaire).name : '') + '</td>'
                + '<td class="mailAdress">' + event.contact + '</td>'
                + '<td>' + event.presidentJury + '</td>'
                + '<td>' + event.delegueCTR + '</td>'
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
            document.getElementById("tbody").innerHTML = updateTableau(evenements);
            initLigne();
        }
    });
}

readBDDFile('./data/BDD.json');
