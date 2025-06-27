FT003_COLUMNS_EN = {
    'codigo': 'accountCode',
    'nombre cuenta': 'accountName',
    'tercero': 'thirdParty',
    'saldo inicial': 'openingBalance',
    'debitos': 'debits',
    'creditos': 'credits',
    'saldo final': 'closingBalance',
    'originId': 'originId',
    'frequencyId': 'frequencyId',
    'cutOff_date': 'cutOffDate',
}


FT003_COLUMNS_ES = {
    'accountCode': 'CODIGO',
    'accountName': 'NOMBRE CUENTA',
    'thirdParty': 'TERCERO',
    'openingBalance': 'SALDO INICIAL',
    'debits': 'DEBITOS',
    'credits': 'CREDITOS',
    'closingBalance': 'SALDO FINAL',
    'large': 'LARGO',
}


# Columnas normalizadas y traducidas al inglés
FT003_COLUMNS_PROCESS_EN = [
    "businessLine", "debtorType", "debtorId", "debtorDv", "debtorName",
    "municipalityCode", "debtorConcept", "debtType", "subsequentMeasurement",
    "receivablePendingToFile", "receivableNotDue", "receivablePastDue30Days",
    "receivablePastDue60Days", "receivablePastDue90Days", "receivablePastDue180Days",
    "receivablePastDue360Days", "receivablePastDueMoreThan360Days",
    "impairment30Days", "impairment60Days", "impairment90Days",
    "impairment180Days", "impairment360Days", "impairmentMoreThan360Days",
    "adjustment", "balance"
]

FT003_COLUMNS_PROCESS_ES = [
    "lineaNegocio", "tipoDeudor", "idDeudor", "dvDeudor", "nombreDeudor",
    "codigoMunicipio", "conceptoDeudores", "tipoDeuda", "medicionPosterior",
    "cxcPendientesRadicar", "cxcNoVencidas", "cxcMora30Dias",
    "cxcMora60Dias", "cxcMora90Dias", "cxcMora180Dias",
    "cxcMora360Dias", "cxcMoraMayor360Dias",
    "deterioro30Dias", "deterioro60Dias", "deterioro90Dias",
    "deterioro180Dias", "deterioro360Dias", "deterioroMayor360Dias",
    "ajuste", "saldo"
]