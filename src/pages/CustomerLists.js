import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/customerlists.css';

function CustomerLists() {
    const [customers, setCustomers] = useState([]);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchCustomers();
    }, [search]);

    const fetchCustomers = async () => {
        try {
            const response = await axios.get(`http://localhost:5001/customers`, { params: { search } });
            setCustomers(response.data);
        } catch (error) {
            console.error('There was an error fetching the customer data!', error);
        }
    };

    const handleSearch = (event) => {
        setSearch(event.target.value);
    };

    const viewCustomer = (customerId, customerName) => {
        navigate(`/appListByCust/${customerId}`, { state: { name: customerName } });
        // Here you could navigate to a detailed view page or modal
    };

    return (
        <div className="app-container">
            <div className="booking-header">
                <h2>CUSTOMER LISTS</h2>
            </div>
            <div className="CustomerLists">
                <div>
                    <input className="srchBtn"
                        type="text"
                        placeholder="Search customers..."
                        value={search}
                        onChange={handleSearch}
                    />
                </div>
                <div className="table-container">
                    <table className="tbleStyle">
                        <thead className="tHeadStyle">
                            <tr>
                                <th style={{ width: '35%' }}>Name</th>
                                <th style={{ width: '35%' }}>Email</th>
                                <th style={{ width: '20%' }}>Phone No</th>
                                <th style={{ width: '10%' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody className="tBodyStyle">
                            {customers.map(customer => (
                                <tr key={customer._id}>
                                    <td>{customer.name}</td>
                                    <td>{customer.email}</td>
                                    <td>{customer.phoneNo}</td>
                                    <td>
                                        <button className="btnView" onClick={() => viewCustomer(customer._id, customer.name)}>View</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default CustomerLists;
