import { render, screen } from '@testing-library/react';
import TopLevel from './TopLevel';
import { AuthProvider } from './hooks/useAuth';
import PropTypes from 'prop-types';
import { test } from 'vitest'

test('renders login page at start', async () => {
    //given
    const Routes = () => <>Top Level Works</>;
    const ApplicationProvider = ({children}) => <AuthProvider>{children}</AuthProvider>;
    ApplicationProvider.propTypes = {
        children: PropTypes.any
    };

    //when
    render(<TopLevel Routes={Routes} ApplicationProvider={ApplicationProvider} />);

    //then
    await screen.findByText(/Top Level Works/i);
});
