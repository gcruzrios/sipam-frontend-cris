import {SAVE_PRESUPUESTO_ORDINARIO_LIST, SAVE_PRESUPUESTO_EXTRAORDINARIO_LIST, SAVE_MEDICION_UNO_LIST, SAVE_ACTIVOS_POSIBLES_BENEFICIARIOS_LIST } from '@/store/model';

const initialState = {
    listaPresupuestoOrdinario: [],
    listaPresupuestosExtraordinarios: [],
    listaMedicionUno: [],
    listaActivosPosiblesBeneficiarios: [],
};

const InitialPageReducer = (state = initialState, action) => {
    switch (action.type) {
        case SAVE_PRESUPUESTO_ORDINARIO_LIST:
            state = { ...state, listaPresupuestoOrdinario: action.payload };
            break;
        case SAVE_PRESUPUESTO_EXTRAORDINARIO_LIST:
            state = { ...state, listaPresupuestosExtraordinarios: action.payload };
            break;
        case SAVE_MEDICION_UNO_LIST:
            state = { ...state, listaMedicionUno: action.payload };
            break;
        case SAVE_ACTIVOS_POSIBLES_BENEFICIARIOS_LIST:
            state = { ...state, listaActivosPosiblesBeneficiarios: action.payload };
            break;
        default:
            state = { ...state };
            break;
    }
    return state;
};

export default InitialPageReducer;