import { PasswordField } from '@/Components/Fields/PasswordField';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Field/PasswordField',
  component: PasswordField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

const registerStub = () => {};

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary = {
  args: {
    id: 'pass',
    labelText: 'Password',
    placeholder: 'password',
    register: registerStub,
    registerField: 'pass',
    required: true,
  },
};
