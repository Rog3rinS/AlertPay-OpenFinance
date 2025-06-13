// Dentro de store/StoreProvider.jsx

import React, { useState, useEffect } from 'react';
import StoreContext from './context'; // Importa a "frequência de rádio" que você já criou

// Este é o componente "Torre de Rádio"
const StoreProvider = ({ children }) => {
    // Aqui é onde o estado REAL vive e é gerenciado
    const [token, setToken] = useState(null);

     useEffect(() => {
      console.log('%cPROVIDER: O valor do token mudou para:', 'color: green; font-weight: bold;', token);
    }, [token]);

    return (
        // O .Provider transmite na frequência StoreContext
        // O 'value' é a "música" que está sendo transmitida:
        // o token real e a função real para atualizá-lo.
        <StoreContext.Provider value={{
            token,
            setToken,
        }}>
            {children}
        </StoreContext.Provider>
    )
}

export default StoreProvider;