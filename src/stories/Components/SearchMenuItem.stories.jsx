import {SearchMenuItem} from '@/Components/SearchMenu/SearchMenuItem';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/SearchMenu/SearchMenuItem',
  component: SearchMenuItem,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary = {
  args: {
    name: 'Organizacion Prueba 1',
    identifier: 'asd-123-fgh-456',
    id: '1',
    recordType: 'OBS',
    navigate: console.log
  },
};
