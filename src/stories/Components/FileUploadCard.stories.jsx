import {FileUploadCard} from '@/Components/Cards/FileUploadCard';

export default {
    title: 'Components/Cards/FileUploadCard',
    component: FileUploadCard,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export const Primary = {
    args: {
        fileName: 'Document 1',
        daysLeft: 1
    },
};