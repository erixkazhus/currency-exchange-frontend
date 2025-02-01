import React, { useState, useEffect } from "react";
import axios from "axios";

const CurrencySelector = () => {
    const [rates, setRates] = useState([]);
    const [currency, setCurrency] = useState("USD");
    const [min, setMin] = useState(null);
    const [max, setMax] = useState(null);
    const [avg, setAvg] = useState(null);
    const [sortDirection, setSortDirection] = useState("desc");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const apiKey = "Your_API_KEY_FROM_https://anyapi.io/";

    useEffect(() => {
        axios
            .get(`http://localhost:8096/api/exchange-rates?apiKey=${apiKey}&target_currency=${currency}&page=${page}`)
            .then((response) => {
                setRates(response.data.rates);
                setMin(response.data.min);
                setMax(response.data.max);
                setAvg(response.data.avg);
                setTotalPages(response.data.last_page);
            })
            .catch((error) => {
                console.error('Error fetching rates:', error);
            });
    }, [currency, page]);
   
    const sortedRates = [...rates].sort((a, b) => {
        const desc = new Date(a.date);
        const asc = new Date(b.date);
        return sortDirection === "desc" ? asc - desc : desc - asc;
    });
    
    const rowsToDisplay = sortedRates.slice(0, 10);

    const toggleSortDirection = () => {
        setSortDirection(sortDirection === "desc" ? "asc" : "desc");
    };

    const changePage = (newPage) => {
        setPage(newPage);
    };

    return (
        <div>            
           <select 
                value={currency} 
                onChange={(e) => setCurrency(e.target.value)} 
                style={{
                    padding: '10px', 
                    backgroundColor: '#f0f0f0', 
                    border: '2px solid #ccc', 
                    borderRadius: '5px', 
                    fontSize: '16px', 
                    cursor: 'pointer'
                }}>
                <option value="USD">USD</option>
                <option value="GBP">GBP</option>
                <option value="AUD">AUD</option>
            </select>
            <h1>1 EUR to {currency} Exchange Rate</h1>

            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button key={index} onClick={() => changePage(index + 1)}>
                        {index + 1}
                    </button>
                ))}
            </div>
            <table style={{ borderCollapse: 'collapse', width: '50%', margin: '0 auto' }}>
                <thead>
                    <tr>
                        <th style={{ border: '3px solid #000000', backgroundColor: 'lightgrey', padding: '8px', textAlign: 'center' }} 
                           onClick={toggleSortDirection}>Date<span style={{ marginLeft: '5px' }}>
                                {sortDirection === "desc" ? "↓" : "↑"}
                            </span>
                        </th>
                        <th style={{ border: '3px solid #000000', backgroundColor: 'lightgrey', padding: '8px', textAlign: 'center' }}>EUR to {currency}
                        </th>
                    </tr>
                </thead>
                <tbody>
                {rowsToDisplay.map((rate) => (
                    <tr key={rate.date + rate.rate}>
                        <td style={{ border: '3px solid #000000', padding: '8px', textAlign: 'center' }}>
                            {rate.date || '-'}
                        </td>
                        <td style={{ border: '3px solid #000000', padding: '8px', textAlign: 'center' }}>
                            {rate.rate ? Number(rate.rate).toFixed(4) : '-'}
                        </td>
                    </tr>
                    ))}                   
                    {rowsToDisplay.length < 10 && Array.from({ length: 10 - rowsToDisplay.length }).map((_, emptyRowIndex) => (
                        <tr key={`empty-row-${emptyRowIndex + 1}`}>
                            <td style={{ border: '3px solid #000000', padding: '8px', textAlign: 'center' }}>-</td>
                            <td style={{ border: '3px solid #000000', padding: '8px', textAlign: 'center' }}>-</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button key={index} onClick={() => changePage(index + 1)}>
                        {index + 1}
                    </button>
                ))}
            </div>
            <div>
                <p>Minimum: {min !== null ? Number(min).toFixed(4) : '-'}</p>
                <p>Maximum: {max !== null ? Number(max).toFixed(4) : '-'}</p>
                <p>Average: {avg !== null ? Number(avg).toFixed(4) : '-'}</p>
            </div>            
        </div>
    );
};

export default CurrencySelector;
