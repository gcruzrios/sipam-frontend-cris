import {SAVE_PRESUPUESTO_ORDINARIO_LIST, SAVE_PRESUPUESTO_EXTRAORDINARIO_LIST, SAVE_MEDICION_UNO_LIST, SAVE_ACTIVOS_POSIBLES_BENEFICIARIOS_LIST } from '@/store/model';



export const savePresupuestoOrdinario= (presupuestoOrdinario) => {
    return {
        type: SAVE_PRESUPUESTO_ORDINARIO_LIST,
        payload: presupuestoOrdinario
    };
};

export const savePresupuestoExtraordinario = (presupuestoExtraordinario) => {
    return {
        type: SAVE_PRESUPUESTO_EXTRAORDINARIO_LIST,
        payload: presupuestoExtraordinario
    };
};

export const saveMedicionUno= (medicionUno) => {
    return {
        type: SAVE_MEDICION_UNO_LIST,
        payload: medicionUno
    };
};

export const saveactivosPosiblesBenificios = (posiblesBeneficios) => {
    return {
        type: SAVE_ACTIVOS_POSIBLES_BENEFICIARIOS_LIST,
        payload: posiblesBeneficios
    };
};