import { SearchField } from '@/Components/Fields/SearchField';

export default {
    title: 'Components/Field/SearchField',
    component: SearchField,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

const registerStub = () => { };

export const Primary = {
    args: {
        id: 'pass',
        labelText: 'Password',
        placeholder: 'password',
        register: registerStub,
        registerField: 'pass',
        required: true,
        value: '',
    },
};

export const SearchOptions = {
    args: {
        placeholder: 'password',
        style: 'primary',
        required: true,
        searchItems: [
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
        navigate: console.log
    },
};