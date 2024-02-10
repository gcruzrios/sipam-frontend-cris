import {NewDocumentModal} from '@/Components/Modals/NewDocumentModal';

const filetTypes = [
    {
        id: '1',
        value: 'Type 1'
    },
    {
        id: '2',
        value: 'Type 2'
    }
];

export default {
    title: 'Modals/NewDocumentModal',
    component: NewDocumentModal,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
    argTypes: {
        fileTypes: filetTypes
    },
};

export const Primary = {
    args: {
        fileTypes: filetTypes
    },
};