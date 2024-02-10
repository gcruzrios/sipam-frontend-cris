import { BlogPreviewCard } from '@/Components/Cards/BlogPreviewCard';
import { loremIpsum } from 'react-lorem-ipsum';

export default {
    title: 'Components/Cards/BlogPreviewCard',
    component: BlogPreviewCard,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

const title1 = loremIpsum({ p: 1 })[0];
const text1 = loremIpsum({ 
    p: 1, 
    avgSentencesPerParagraph: 6, 
    avgWordsPerSentence:10 
})[0];

export const NoImage = {
    args: {
        title: title1,
        text: text1
    },
};

export const WithImage = {
    args: {
        title: title1,
        text: text1,
        imageSrc: 'https://picsum.photos/200/300'
    },
};

