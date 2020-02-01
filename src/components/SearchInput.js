import React, { useState, useEffect, useContext } from 'react';
import { InputGroup, FormControl } from 'react-bootstrap';
import { CryptoContext } from '../context/CryptoContext';
import { SET_CRYPTO_TO_DISPLAY } from '../reducers/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

export default function SearchInput() {
  const {state, dispatch} = useContext(CryptoContext);
  const {cryptoList} = state;
  const [searchTag, setSearchTag] = useState('');

  useEffect(() => {
    const cryptoToDisplay = cryptoList.filter(asset => asset.name.toLowerCase().includes(searchTag));
    dispatch({type: SET_CRYPTO_TO_DISPLAY, payload: [...cryptoToDisplay]});
  }, [searchTag, cryptoList, dispatch]);

  const inputStyles = {
    boxShadow: '0 0 50px rgba(0,0,0,.7)',
    borderRadius: '5px'
  };

  return (
    <div>
      <InputGroup size='lg' className='mb-3' style={inputStyles}>
        <InputGroup.Prepend>
          <InputGroup.Text>Search &nbsp;<FontAwesomeIcon icon={faSearch} /></InputGroup.Text>
        </InputGroup.Prepend>
        <FormControl aria-label='Large' aria-describedby='inputGroup-sizing-lg' onChange={e => setSearchTag(e.target.value.toLowerCase())} />
      </InputGroup>
    </div>
  );
}