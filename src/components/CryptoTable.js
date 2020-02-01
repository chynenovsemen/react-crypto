import React, { useState, useEffect, useContext } from 'react';
import { Table, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { apiKey } from '../api';
import { CryptoContext } from '../context/CryptoContext';
import { SET_CRYPTO_LIST, SET_ERROR } from '../reducers/types';


export default function CryptoTable() {
  const {state, dispatch} = useContext(CryptoContext);
  const {cryptoList, cryptoToDisplay, error} = state;
  const [isLoading, setIsLoading] = useState(true);
  const [sortParams, setSortParams] = useState({column: null, direction: 'asc'});

  useEffect(() => {
    const fetchAssets = async () => {
      const proxyUrl = `https://cors-anywhere.herokuapp.com/`,
            cryptoUrl = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest`,
            // logoUrl = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/info`,
            queryString = `?CMC_PRO_API_KEY=${apiKey}`;

      try {
        const cryptoResponse = await fetch(proxyUrl + cryptoUrl + queryString),
              cryptoJson = await cryptoResponse.json();

        // The fetch below should be modified to overcome response 429 about requests limit

        // const logosResponse = await cryptoJson.data.map(async item => await fetch(proxyUrl + logoUrl + queryString + `&id=${item.id}`)),
        //       logosJson = await logosResponse.json();

        dispatch({type: SET_CRYPTO_LIST, payload: [...cryptoJson.data.map(item => item)]});
        // dispatch({type: SET_LOGOS, payload: [...logosJson.data.map(item => item.logo)]});
        setIsLoading(false);
      } catch {
        dispatch({type: SET_ERROR, paylaod: 'Oopsie! Something went wrong.'});
      }
    }

    fetchAssets();
  }, [dispatch]);

  const renderError = () => {
		if (!error) {
			return;
		}

		return <tr><td colSpan='6' className='error'>{error}</td></tr>;
  }

  const sortByStringValue = (key) => {
    const direction = sortParams.direction === 'asc' ? 'desc' : 'asc';
    const sortedData = [...cryptoList].sort((a, b) => {
      const nameA = a[key].toLowerCase();
      const nameB = b[key].toLowerCase();
      return (nameA > nameB) ? -1 : (nameA < nameB) ? 1 : 0;
    });
    if (direction === 'desc') {
      sortedData.reverse();
    }
    setSortParams({
      column: key,
      direction: direction,
    });
    dispatch({type: SET_CRYPTO_LIST, payload: sortedData});
  }

  const sortByNumberValue = (key) => {
    const direction = sortParams.column ? (sortParams.direction === 'asc' ? 'desc' : 'asc') : 'desc';
    const sortedData = [...cryptoList].sort((a, b) => (a.quote.USD[key] > b.quote.USD[key]) ? -1 : (b.quote.USD[key] > a.quote.USD[key]) ? 1 : 0);
    if (direction === 'desc') {
      sortedData.reverse();
    }
    setSortParams({
      column: key,
      direction: direction,
    });
    dispatch({type: SET_CRYPTO_LIST, payload: sortedData});
  }

  const tableData = cryptoToDisplay.map(item => (
    <tr key={item.id}>
      {/* <td>{item.id}</td> */}
      <td>{item.name}</td>
      <td>{item.symbol}</td>
      <td>${item.quote.USD.price.toFixed(2)}</td>
      <td>${item.quote.USD.volume_24h.toFixed(2)}</td>
      <td>{item.quote.USD.percent_change_24h.toFixed(2)}%</td>
    </tr>
  ));

  const spinner = <Spinner animation='border' role='status'><span className='sr-only'>Loading...</span></Spinner>;

  const up = <FontAwesomeIcon icon={faChevronUp} />;

  const down = <FontAwesomeIcon icon={faChevronDown} />;

  const tableStyles = {
    boxShadow: '0 0 50px rgba(0,0,0,.9)',
  };

  const headerStyles = {
    textAlign: 'center',
  };

  return (
    <>
      <Table bordered variant='dark' style={tableStyles}>
        <thead style={headerStyles}>
          <tr>

          {/* logo to be done here */}

          {/* <th>Logo</th> */}

          {/* logo to be done here */}

          <th onClick={() => sortByStringValue('name')}>
            Name &nbsp;
            {(sortParams.column === 'name' && sortParams.direction === 'asc') ? down : (sortParams.column === 'name' && sortParams.direction === 'desc') ? up : null}
          </th>
          <th onClick={() => sortByStringValue('symbol')}>
            Symbol &nbsp;
            {(sortParams.column === 'symbol' && sortParams.direction === 'asc') ? down : (sortParams.column === 'symbol' && sortParams.direction === 'desc') ? up : null}
          </th>
          <th onClick={() => sortByNumberValue('price')}>
            Price, USD &nbsp;
            {(sortParams.column === 'price' && sortParams.direction === 'asc') ? down : (sortParams.column === 'price' && sortParams.direction === 'desc') ? up : null}
          </th>
          <th onClick={() => sortByNumberValue('volume_24h')}>
            Volume/24h &nbsp;
            {(sortParams.column === 'volume_24h' && sortParams.direction === 'asc') ? down : (sortParams.column === 'volume_24h' && sortParams.direction === 'desc') ? up : null}
          </th>
          <th onClick={() => sortByNumberValue('percent_change_24h')}>
            %/24h &nbsp;
            {(sortParams.column === 'percent_change_24h' && sortParams.direction === 'asc') ? down : (sortParams.column === 'percent_change_24h' && sortParams.direction === 'desc') ? up : null}
          </th>
          </tr>
        </thead>
        <tbody>
          {!isLoading ? tableData : null}
          {renderError()}
        </tbody>
      </Table>
      {isLoading ? spinner : null}
    </>
  )
}