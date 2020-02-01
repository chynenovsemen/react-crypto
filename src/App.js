import React, { useReducer } from 'react';
import { CryptoContext } from './context/CryptoContext';
import cryptoReducer from './reducers/cryptoReducer';
import CryptoTable from './components/CryptoTable';
import SearchInput from './components/SearchInput';

export default function App() {
  const initialState = {
    cryptoList: [],
    cryptoToDisplay: [],
    // logos: [],
    error: '',
  };

  const [state, dispatch] = useReducer(cryptoReducer, initialState);

  return (
    <CryptoContext.Provider value={{state, dispatch}}>
      <div className='container'>
        <SearchInput />
        <CryptoTable />
      </div>
    </CryptoContext.Provider>
  );
}
