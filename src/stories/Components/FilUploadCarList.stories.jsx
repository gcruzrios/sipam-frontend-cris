import { FileUploadCardList } from '@/Components/Cards/FileUploadCardList';

export default {
    title: 'Components/Cards/FileUploadCardList',
    component: FileUploadCardList,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export const WithItems = {
    args: {
        pendingFileList: [
            {
                fileName: 'Doc 1',
                daysLeft: 2
            },
            {
                fileName: 'Doc 2',
                daysLeft: 7
            },
            {
                fileName: 'Doc 3',
                daysLeft: 15
            }
        ],
    },
};

export const NoItems = {
    args: {
        pendingFileList: []
    }
};