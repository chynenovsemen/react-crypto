import React, { useState, useEffect, useContext } from 'react';
import { Table, Spinner } from 'react-bootstrap';
import { apiKey } from '../api';
import { CryptoContext } from '../context/CryptoContext';
import { SET_IS_LOADING, SET_CRYPTO_LIST, SET_ERROR, SET_CRYPTO_TO_DISPLAY } from '../reducers/types';


export default function CryptoTable() {
  const {state, dispatch} = useContext(CryptoContext);
  const {cryptoList, cryptoToDisplay, isLoading, error} = state;
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

        // const logosResponse = await cryptoJson.data.map(async item => await fetch(proxyUrl + logoUrl + queryString + `&id=${item.id}`)),
        //       logosJson = await logosResponse.json();

        dispatch({type: SET_CRYPTO_LIST, payload: [...cryptoJson.data.map(item => item)]});
        dispatch({type: SET_CRYPTO_TO_DISPLAY, payload: [...cryptoJson.data.map(item => item)]});
        // dispatch({type: SET_LOGOS, payload: [...logosJson.data.map(item => item.logo)]});
        dispatch({type: SET_IS_LOADING, payload: false});
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

  const sortBySurfaceValue = (key) => {
    const direction = sortParams.direction === 'asc' ? 'desc' : 'asc';
    const sortedData = [...cryptoList].sort((a, b) => (a[key] > b[key]) ? -1 : (b[key] > a[key]) ? 1 : 0);
    if (direction === 'desc') {
      sortedData.reverse();
    }
    setSortParams({
      column: key,
      direction: direction,
    });
    dispatch({type: SET_CRYPTO_LIST, payload: sortedData});
  }

  const sortByDeepValue = (key) => {
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

  const tableData = cryptoToDisplay.map(item => <tr key={item.id}><td>{item.id}</td><td>{item.name}</td><td>{item.symbol}</td><td>{item.quote.USD.price.toFixed(2)}</td><td>{item.quote.USD.volume_24h.toFixed(2)}</td><td>{item.quote.USD.percent_change_24h.toFixed(2)}%</td></tr>);

  const spinner = <Spinner animation='border' role='status'><span className='sr-only'>Loading...</span></Spinner>;

  return (
    <>
      <Table bordered variant='dark' size='sm' >
        <thead>
          <tr>

          {/* logo to be done here */}

          <th onClick={() => sortBySurfaceValue('id')}>ID</th>

          {/* logo to be done here */}

          <th onClick={() => sortBySurfaceValue('name')}>Name</th>
          <th onClick={() => sortBySurfaceValue('symbol')}>Symbol</th>
          <th onClick={() => sortByDeepValue('price')}>Price, USD</th>
          <th onClick={() => sortByDeepValue('volume_24h')}>Volume/24h</th>
          <th onClick={() => sortByDeepValue('percent_change_24h')}>%/24h</th>
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