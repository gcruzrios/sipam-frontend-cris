import React, { useState, createContext } from 'react';


const InjectorsContext = createContext({});

const useInjectors = () => {
    const [injectors, setInjectors] = useState({});

    return {
        injectors,
        setInjectors
    };
};

export function InjectorsProvider({ children }) {
    const injectors = useInjectors();
    return <InjectorsContext.Provider value={injectors}>{children}</InjectorsContext.Provider>;
}

export default function InjectorsConsumer() {
    return React.useContext(InjectorsContext);
}