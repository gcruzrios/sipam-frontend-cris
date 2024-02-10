/** @type { import('@storybook/react').Preview } */
import "../src/index.scss";
import "bootstrap/dist/js/bootstrap";
import { MemoryRouter } from "react-router-dom";

export const decorators = [
  (Story) => (
    <MemoryRouter initialEntries={['/']}>
      <Story />
    </MemoryRouter>
  ),
];

const preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
