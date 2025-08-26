import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './AdminPage.css';

const AdminPage = () => {
    const [ShopItems, setShopItems] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [editingItem, setEditingItem] = useState(null);

    const fetchShopItems = async () => {
        const { data } = await api.get('/Shop');
        setShopItems(data);
    };

    useEffect(() => {
        fetchShopItems();
    }, []);

    const submitHandler = async (e) => {
        e.preventDefault();
        const ShopItemData = { name, description, price, category, imageUrl };

        if (editingItem) {
            // Update item
            await api.put(`/Shop/${editingItem._id}`, ShopItemData);
        } else {
            // Add new item
            await api.post('/Shop', ShopItemData);
        }
        resetForm();
        fetchShopItems();
    };

    const editHandler = (item) => {
        setEditingItem(item);
        setName(item.name);
        setDescription(item.description);
        setPrice(item.price);
        setCategory(item.category);
        setImageUrl(item.imageUrl);
    };

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            await api.delete(`/Shop/${id}`);
            fetchShopItems();
        }
    };
    
    const resetForm = () => {
        setEditingItem(null);
        setName('');
        setDescription('');
        setPrice('');
        setCategory('');
        setImageUrl('');
    }

    return (
        <div className="admin-page">
            <div className="admin-form-container">
                <h2>{editingItem ? 'Edit Shop Item' : 'Add Shop Item'}</h2>
                <form onSubmit={submitHandler}>
                    {/* Form fields for name, description, price, category, imageUrl */}
                    <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
                    <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required />
                    <input type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} required />
                    <input type="text" placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} required />
                    <input type="text" placeholder="Image URL" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
                    <div className="form-buttons">
                        <button type="submit">{editingItem ? 'Update' : 'Add'}</button>
                        {editingItem && <button type="button" onClick={resetForm}>Cancel</button>}
                    </div>
                </form>
            </div>

            <div className="admin-list-container">
                <h2>Existing Shop Items</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ShopItems.map(item => (
                            <tr key={item._id}>
                                <td>{item.name}</td>
                                <td>{item.category}</td>
                                <td>${item.price.toFixed(2)}</td>
                                <td>
                                    <button className="btn-edit" onClick={() => editHandler(item)}>Edit</button>
                                    <button className="btn-delete" onClick={() => deleteHandler(item._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminPage;