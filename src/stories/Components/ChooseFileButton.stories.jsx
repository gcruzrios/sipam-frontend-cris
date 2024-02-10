import {ChooseFileButton} from '@/Components/Buttons/ChooseFileButton';

export default {
    title: 'Components/Buttons/ChooseFileButton',
    component: ChooseFileButton,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};



export const NoFile = {
    args: {
        label: 'Attach File',
        setFileLoaded: console.log
    },
};

export const WithFile = {
    args: {
        label: 'Attach File',
        setFileLoaded: console.log,
        fileLoaded: {
            name: 'file.pdf'
        }
    },
};