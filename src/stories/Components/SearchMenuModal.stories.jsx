import {SearchMenuModal} from '@/Components/Modals/SearchMenuModal';


export default {
    title: 'Components/SearchMenu/SearchMenuModal',
    component: SearchMenuModal,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
};

const navigate = console.log;

export const Primary = {
    args: {
        items: [
            {
                name: 'Organizacion Prueba 1',
                identifier: 'asd-123-fgh-456',
                id: '1',
                recordType: 'OBS'

            },
            {
                name: 'Organizacion Prueba 2',
                identifier: 'asd-123-fgh-890',
                id: '2',
                recordType: 'OBS'
            },
            {
                name: 'Persona Pam 1',
                identifier: '789456123',
                id: '1',
                recordType: 'PAM'
            },
            {
                name: 'Persona Pam 2',
                identifier: '789456000',
                id: '3',
                recordType: 'PAM'
            }
        ],
        navigate,
        open: true,
        setOpen: () => {}
    }
};



