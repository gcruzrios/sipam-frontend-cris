import { LoginCard } from '@/Components/Cards/LoginCard';
import { LoremIpsum } from 'react-lorem-ipsum';

export default {
    title: 'Components/Cards/LoginCard',
    component: LoginCard,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        size: { 
            control: 'select',
            options: ['medium', 'large']
        },

    },
};

const children = (
    <div className="container-fluid text-center">
        <br />
        <br />
        <LoremIpsum p={2} />
        <br />
        <br />
    </div>
);

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary = {
    args: {
        size: 'medium',
        children
    },
};