interface SeedConceptoDeudores {
    id: number
    name: string
}

interface SeedLineaNegocio {
    id: number
    name: string
}

interface SeedTipoDeuda {
    id: number
    name: string
}
interface SeedMunicipalCode {
    id: string
    name: string
}

interface SeedTipoIdentificacion {
    id: string
    name: string
    description: string
}


interface SeedConceptoPrestadores {
    id: number
    name: string
}

interface SeedConceptoDeterioro {
    id: number
    minDay: number
    maxDay: number
    description: string
}

interface SeedMedicionPosterior {
    id: number
    name: string
}

interface SeedSources {
    name: string,
    nameFather?: string,
    typeSourceId: number,
    active: boolean,

}

interface SeedFrequency {
    name: string
    days: number
}


interface SeedTypeSource {
    id: number
    name: string
}
interface SeedProcess {
    id: number
    name: string
}

interface SeedNodes {

    id: number
    name: string
    description: string
    type: string
    label: string
    status: string
    positionX: number
    positionY: number
    flowId: number
    typeNodeId: number
    active: boolean
}

interface SeedEdges {
    id: number
    name: string
    description: string
    sourceNodeId: number
    targetNodeId: number
    active: boolean
}

interface SeedTypeNode {
    id: number
    name: string,
    description: string

}

interface SeedCatalogScript {
    name: string,
    description: string,
    template: string
}


interface SeedCatalogWorkflow {
    name: string,
    description: string,
    template: string
}



interface SeedData {
    concepto_deudores: SeedConceptoDeudores[],
    linea_negocio: SeedLineaNegocio[],
    tipo_deuda: SeedTipoDeuda[],
    tipo_identificacion: SeedTipoIdentificacion[],
    concepto_prestadores: SeedConceptoPrestadores[],
    concepto_deterioro: SeedConceptoDeterioro[],
    medicion_posterior: SeedMedicionPosterior[],
    sources: SeedSources[],
    frequencies: SeedFrequency[],
    typeSources: SeedTypeSource[],
    process: SeedProcess[],
    nodes: SeedNodes[],
    edges: SeedEdges[],
    typesNode: SeedTypeNode[],
    municipal_codes: SeedMunicipalCode[],
    catalog_scripts: SeedCatalogScript[]
    catalog_workflows: SeedCatalogWorkflow[]
}



export const initialData: SeedData = {
    concepto_deudores: [
        {
            id: 1,
            name: "Plan obligatorio de Salud"
        },
        {
            id: 2,
            name: "Planes adicionales de Salud"
        },
        {
            id: 3,
            name: "Recobros No POS"
        },
        {
            id: 4,
            name: "Reembolsos por incapacidades diferentes a enfermedad general"
        },
        {
            id: 5,
            name: "SOAT y ARL"
        },
        {
            id: 6,
            name: "Reclamaciones (ECAT)"
        },
        {
            id: 7,
            name: "Otros"
        }
    ],
    linea_negocio: [
        {
            id: 1,
            name: "Aseguramiento obligatorio"
        },
        {
            id: 2,
            name: "Aseguramiento voluntario"
        },
        {
            id: 3,
            name: "Prestación de servicios"
        }
    ],
    tipo_deuda: [{
        id: 1,
        name: "Activo no financiero – Anticipo"
    },
    {
        id: 2,
        name: "Instrumento financiero"
    },],
    tipo_identificacion: [{
        id: "NI",
        name: "NIT",
        description: "NIT"
    },
    {
        id: "CC",
        name: "CC",
        description: "Cédula de ciudadanía"
    },
    {
        id: "CE",
        name: "CE",
        description: "Cédula de extranjería"
    },
    {
        id: "PT",
        name: "Permiso de Protección Temporal",
        description: "Permiso de Protección Temporal"
    },
    {
        id: "DE",
        name: "Documento Extranjero",
        description: "Documento Extranjero"
    },
    {
        id: "OT",
        name: "Otra",
        description: "Otra"
    }],
    concepto_prestadores: [
        {
            id: 25,
            name: "OTROS PASIVOS- ANTICIPOS Y AVANCES RECIBIDOS"
        },
        {
            id: 2501,
            name: "OTROS PASIVOS -ANTICIPOS Y AVANCES RECIBIDOS"
        },
        {
            id: 250105,
            name: "GIROS PARA ABONO A CARTERA PENDIENTES DE APLICAR DE UNA ENTIDAD PROMOTORA DE SALUD CONTRIBUTIVO"
        },
        {
            id: 250106,
            name: "GIROS PARA ABONO A CARTERA PENDIENTES DE APLICAR DE UNA ENTIDAD PROMOTORA DE SALUD SUBSIDIADO"
        },
        {
            id: 250107,
            name: "GIROS PARA ABONO A CARTERA PENDIENTES DE APLICAR DE UNA INSTITUCION PRESTADORA DE SALUD"
        },
        {
            id: 250108,
            name: "GIROS PARA ABONO A CARTERA PENDIENTES DE APLICAR DE UNA EMPRESA DE MEDICINA PREPAGADA Y PLANES COMPLEMENTARIOS"
        },
        {
            id: 250109,
            name: "GIROS PARA ABONO A CARTERA PENDIENTES DE APLICAR DE UNA COMPAÑÍA ASEGURADORA SOAT"
        },
        {
            id: 250110,
            name: "GIROS PARA ABONO A CARTERA PENDIENTES DE APLICAR DE UN PARTICULAR PERSONA NATURAL"
        },
        {
            id: 250111,
            name: "GIROS PARA ABONO A CARTERA PENDIENTES DE APLICAR DE UN PARTICULAR PERSONA JURIDICA"
        },
        {
            id: 250112,
            name: "GIROS PARA ABONO A CARTERA PENDIENTES DE APLICAR DEL FONDO DE SOLIDARIDAD Y GARANTIA ECAT"
        },
        {
            id: 250113,
            name: "GIROS PARA ABONO A CARTERA PENDIENTES DE APLICAR DE UNA EMPRESA SOCIAL DEL ESTADO"
        },
        {
            id: 250114,
            name: "GIROS PARA ABONO A CARTERA PENDIENTES DE APLICAR DE UNA ENTIDAD ESPECIAL DE PREVISIÓN SOCIAL"
        },
        {
            id: 250115,
            name: "GIROS PARA ABONO A CARTERA PENDIENTES DE APLICAR DE UNA ADMINISTRADORA DE RIESGOS LABORALES"
        },
        {
            id: 250116,
            name: "GIROS PARA ABONO A CARTERA PENDIENTES DE APLICAR DE POBLACIÓN POBRE NO AFILIADA"
        },
        {
            id: 250117,
            name: "GIROS PARA ABONO A CARTERA PENDIENTES DE APLICAR DE ASEGURADORAS"
        },
        {
            id: 250118,
            name: "GIROS PARA ABONO A CARTERA PENDIENTES DE APLICAR DE ENTIDADES TERRITORIALES"
        },
        {
            id: 250119,
            name: "GIROS PARA ABONO A CARTERA PENDIENTES DE APLICAR DE PRESTADORES SERVICIOS DE AMBULANCIA"
        },
        {
            id: 250120,
            name: "GIROS PARA ABONO A CARTERA PENDIENTES DE APLICAR DE ENTIDADES DEL RÉGIMEN DE EXCEPCIÓN"
        }
    ],

    concepto_deterioro: [
        {
            id: 1,
            minDay: 1,
            maxDay: 30,
            description: "Deterioro Cuentas por cobrar en mora 1-30 días"
        },
        {
            id: 2,
            minDay: 31,
            maxDay: 60,
            description: "Deterioro Cuentas por cobrar en mora 31-60 días"
        },
        {
            id: 3,
            minDay: 61,
            maxDay: 90,
            description: "Deterioro Cuentas por cobrar en mora 61-90 días"
        },
        {
            id: 4,
            minDay: 91,
            maxDay: 180,
            description: "Deterioro Cuentas por cobrar en mora 91-180 días"
        },
        {
            id: 5,
            minDay: 181,
            maxDay: 360,
            description: "Deterioro Cuentas por cobrar en mora 181-360 días"
        },
        {
            id: 6,
            minDay: 360,
            maxDay: 0,
            description: "Deterioro Cuentas por cobrar en mora mayor a 360 días"
        }
    ],

    medicion_posterior: [
        {
            id: 1,
            name: "Precio de la Transacción / Valor Nominal / Costo"
        },
        {
            id: 2,
            name: "Costo Amortizado"
        },
        {
            id: 3,
            name: "Valor Razonable"
        },
        {
            id: 4,
            name: "Valor Razonable con cambios en el OR"
        },
        {
            id: 5,
            name: "Valor Presente Pagos Futuros"
        },
        {
            id: 6,
            name: "No aplica"
        }
    ],

    sources: [
        { name: "ConceptoDeudores", typeSourceId: 1, active: true },
        { name: "ConceptoDeterioro", typeSourceId: 1, active: true },
        { name: "ConceptoPrestador", typeSourceId: 1, active: true },
        { name: "LineaNegocio", typeSourceId: 1, active: true },
        { name: "TipoDeuda", typeSourceId: 1, active: true },
        { name: "TipoIdentificacion", typeSourceId: 1, active: true },
        { name: "MedicionPosterior", typeSourceId: 1, active: true },
        { name: "Balances", typeSourceId: 2, active: true },
        { name: "BalancesDiario", nameFather: "Balances", typeSourceId: 2, active: true },
        { name: "BalancesSemanal", nameFather: "Balances", typeSourceId: 2, active: true },
        { name: "BalancesMensual", nameFather: "Balances", typeSourceId: 2, active: true },
        { name: "BalancesBimestral", nameFather: "Balances", typeSourceId: 2, active: true },
        { name: "BalancesTrimestral", nameFather: "Balances", typeSourceId: 2, active: true },
        { name: "BalancesSemestral", nameFather: "Balances", typeSourceId: 2, active: true },
        { name: "BalancesAnual", nameFather: "Balances", typeSourceId: 2, active: true },
    ],
    frequencies: [
        { name: "Diario", days: 1 },
        { name: "Semanal", days: 7 },
        { name: "Mensual", days: 30 },
        { name: "Bimestral", days: 60 },
        { name: "Trimestral", days: 90 },
        { name: "Semestral", days: 180 },
        { name: "Anual", days: 365 },
    ],
    typeSources: [
        { id: 1, name: 'Fijos' },
        { id: 2, name: 'Transaccionales' },
    ],
    process: [
        { id: 1, name: 'FT001' },
        { id: 2, name: 'FT002' },
        { id: 3, name: 'FT003' },
    ],
    nodes: [
        {
            id: 1,
            name: "File",
            description: "Subir archivo",
            type: "UploadFile",
            label: "File",
            status: "idle",
            positionX: 25,
            positionY: 50,
            active: true,
            flowId: 3,
            typeNodeId: 1
        },
        {
            id: 2,
            name: "Script",
            description: "Cargar scrypt en Python",
            type: "ScriptPython",
            label: "Python Script",
            status: "idle",
            positionX: 300,
            positionY: 50,
            active: true,
            flowId: 3,
            typeNodeId: 2

        },
        {
            id: 3,
            name: "DataTableXML",
            description: "Visualización de Datos",
            type: "DataTableXML",
            label: "XML",
            status: "idle",
            positionX: 650,
            positionY: 150,
            active: true,
            flowId: 3,
            typeNodeId: 3

        },
        {
            id: 4,
            name: "DataTableXLSX",
            description: "Visualización de Datos",
            type: "DataTableXLSX",
            label: "XLSX",
            status: "idle",
            positionX: 650,
            positionY: 0,
            active: true,
            flowId: 3,
            typeNodeId: 4

        }
    ],
    edges: [
        {
            id: 1,
            name: "Union Nodo 1-2",
            description: "Flujo de Datos 1-2",
            sourceNodeId: 1,
            targetNodeId: 2,
            active: true
        },
        {
            id: 2,
            name: "Union Nodo 2-3",
            description: "Flujo de Datos 2-3",
            sourceNodeId: 2,
            targetNodeId: 3,
            active: true
        },
        {
            id: 3,
            name: "Union Nodo 3-4",
            description: "Flujo de Datos 3-4",
            sourceNodeId: 2,
            targetNodeId: 4,
            active: true
        }
    ],
    typesNode: [
        {
            id: 1,
            name: "UploadFile",
            description: "Subir archivo para el procesamiento de datos"
        },
        {
            id: 2,
            name: "ScriptPython",
            description: "Cargar Script de Python"
        },
        {
            id: 3,
            name: "DataTableXML",
            description: "Visualización de datos en DataTable"
        },
        {
            id: 4,
            name: "DataTableXLSX",
            description: "Visualización de datos en XML"
        },
    ],
    municipal_codes: [
        { id: "05001", name: "MEDELLÍN" },
        { id: "05002", name: "ABEJORRAL" },
        { id: "05004", name: "ABRIAQUÍ" },
        { id: "05021", name: "ALEJANDRÍA" },
        { id: "05030", name: "AMAGÁ" },
        { id: "05031", name: "AMALFI" },
        { id: "05034", name: "ANDES" },
        { id: "05036", name: "ANGELÓPOLIS" },
        { id: "05038", name: "ANGOSTURA" },
        { id: "05040", name: "ANORÍ" },
        { id: "05042", name: "SANTAFÉ DE ANTIOQUIA" },
        { id: "05044", name: "ANZA" },
        { id: "05045", name: "APARTADÓ" },
        { id: "05051", name: "ARBOLETES" },
        { id: "05055", name: "ARGELIA" },
        { id: "05059", name: "ARMENIA" },
        { id: "05079", name: "BARBOSA" },
        { id: "05086", name: "BELMIRA" },
        { id: "05088", name: "BELLO" },
        { id: "05091", name: "BETANIA" },
        { id: "05093", name: "BETULIA" },
        { id: "05101", name: "CIUDAD BOLÍVAR" },
        { id: "05107", name: "BRICEÑO" },
        { id: "05113", name: "BURITICÁ" },
        { id: "05120", name: "CÁCERES" },
        { id: "05125", name: "CAICEDO" },
        { id: "05129", name: "CALDAS" },
        { id: "05134", name: "CAMPAMENTO" },
        { id: "05138", name: "CAÑASGORDAS" },
        { id: "05142", name: "CARACOLÍ" },
        { id: "05145", name: "CARAMANTA" },
        { id: "05147", name: "CAREPA" },
        { id: "05148", name: "EL CARMEN DE VIBORAL" },
        { id: "05150", name: "CAROLINA" },
        { id: "05154", name: "CAUCASIA" },
        { id: "05172", name: "CHIGORODÓ" },
        { id: "05190", name: "CISNEROS" },
        { id: "05197", name: "COCORNÁ" },
        { id: "05206", name: "CONCEPCIÓN" },
        { id: "05209", name: "CONCORDIA" },
        { id: "05212", name: "COPACABANA" }
    ],
    catalog_scripts: [
        {
            name: 'FT003',
            description: 'FT003',
            template: 'TODO'
        },
        {
            name: 'FT002',
            description: 'FT002',
            template: 'TODO'
        },
        {
            name: 'FT001',
            description: 'FT001',
            template: 'TODO'
        }
    ],
        catalog_workflows: [
        {
            name: 'FT003',
            description: 'FT003',
            template: 'TODO'
        },
        {
            name: 'FT002',
            description: 'FT002',
            template: 'TODO'
        },
        {
            name: 'FT001',
            description: 'FT001',
            template: 'TODO'
        }
    ]

}