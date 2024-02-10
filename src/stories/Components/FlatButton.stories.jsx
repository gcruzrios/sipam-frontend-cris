import { FlatButton } from '@/Components/Buttons/FlatButton';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket, faCloudArrowDown } from '@fortawesome/free-solid-svg-icons';

const iconExit = <FontAwesomeIcon icon={faArrowRightFromBracket}/>;
const iconSave = <FontAwesomeIcon icon={faCloudArrowDown}/>;

export default {
    title: 'Components/Buttons/FlatButton',
    component: FlatButton,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
        layout: 'centered',
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
    tags: ['autodocs'],
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    argTypes: {
        backgroundColor: { control: 'color' },
    },
};

export const Exit = {
    args: {
        label: 'Exit',
        btnStyle: 'light',
        outline: true,
        icon: iconExit,
        iconPosition: 'end'
    },
};

export const NoIcon = {
    args: {
        label: 'Exit',
        btnStyle: 'light',
        outline: true,
    },
};

export const Large = {
    args: {
        label: 'Large',
        size: 'large',
        btnStyle: 'light',
        outline: true,
    },
};

export const Small = {
    args: {
        label: 'Small',
        size: 'small',
        btnStyle: 'light',
        outline: true,
    },
};

export const Save = {
    args: {
        label: 'Save',
        btnStyle: 'primary',
        outline: false,
        icon: iconSave,
        iconPosition: 'end'
    },
};