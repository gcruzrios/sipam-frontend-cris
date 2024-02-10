import Loading from '../../Components/Loading';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Loading',
  component: Loading,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary = {
  args: {
  },
};
