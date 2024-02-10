import {NotificationsModal} from '@/Components/Modals/NotificationsModal';


export default {
    title: 'Components/NotificationsModal',
    component: NotificationsModal,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
};

export const Primary = {
    args: {
        items: [
            {
                title: 'Notification Prueba 1',
                subtitle: 'fecha: 12/12/2022'

            },
            {
                title: 'Notification Prueba 2',

            },
            {
                title: 'Notification Prueba 3',

            },
        ],
        open: true,
        setOpen: () => {}
    }
};



