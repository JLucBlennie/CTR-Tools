// Définir les types
export type evenementType = {
    uuid: string;
    dateDemande: Date;
    dateDebut: Date;
    dateFin: Date;
    type: typeEvenement;
    demandeur: Demandeur;
    partenaire: Demandeur;
    mailContact: string;
    lieu: string;
    presidentJury: Moniteur;
    delegueCTR: Moniteur;
    repCIBPL: Moniteur;
    dateValidation: Date;
    organisateur: ClubStructure;
    statut: Status;
};

export type calendrierCTRType = {
    events: evenementType[];
    moniteurs: Moniteur[];
    demandeurs: Demandeur[];
    typeEvenements: typeEvenement[];
    clubStructures: ClubStructure[];
};

export type ClubStructure = {
    uuid: string;
    name: string;
};

export type typeEvenement = {
    uuid: string;
    name: string;
    activite: TypeActivite;
    valeurForms: string;
};

export type Moniteur = {
    uuid: string;
    lastName: string;
    firstName: string;
    niveau: NiveauMoniteur;
};

export type Demandeur = {
    uuid: string;
    name: string;
    numeroStructure: string;
};

export enum NiveauMoniteur {
    MF1 = "MF1",
    MF2 = "MF2",
    IR = "IR",
    IN = "IN",
    TIV = "TIV",
    MFEH1 = "MFEH1",
    MFEH2 = "MFEH2"
};

export enum Status {
    DEMANDE = "Demande",
    CONFLIT = "Conflit",
    VALIDE = "Validé"
}

export enum TypeActivite {
    ALL = "Tout",
    N4_GP = "N4 - GP",
    INITIATEUR = "Initiateur",
    TSI = "TSI",
    MF1 = "MF1",
    MF2 = "MF2",
    TIV = "TIV",
    SECOURISME = "Secourisme",
    HANDISUB = "HandiSub"
};