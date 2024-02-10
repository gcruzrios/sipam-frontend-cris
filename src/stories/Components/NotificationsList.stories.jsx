import {NotificationItemsList} from '@/Components/Modals/NotificationsModal';

export default {
    title: 'Components/NotificationItemsList',
    component: NotificationItemsList,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
};

export const Primary = {
    args: {
        items: [
            {
                text: 'Notification 1'
            },
            {
                text: 'Notification 1'
            }
        ]
    }
};