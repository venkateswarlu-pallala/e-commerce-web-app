import React, { useState, useEffect } from 'react';
import api from '../services/api'; // Ensure this path is correct
import './AdminPage.css'; // The new advanced CSS will apply to this

// --- SVG Icons for a cleaner UI ---
const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M16.7574 2.99667L14.7574 4.99667H5V18.9967H19V9.23937L21 7.23937V19.9967C21 20.5489 20.5523 20.9967 20 20.9967H4C3.44772 20.9967 3 20.5489 3 19.9967V3.99667C3 3.44445 3.44772 2.99667 4 2.99667H16.7574ZM20.4853 2.09717L21.8995 3.51138L12.7071 12.7038L11.2929 11.2896L20.4853 2.09717Z"></path>
  </svg>
);

const DeleteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM9 11V17H11V11H9ZM13 11V17H15V11H13ZM9 4V6H15V4H9Z"></path>
  </svg>
);


const AdminPage = () => {
    const [shopItems, setShopItems] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [editingItem, setEditingItem] = useState(null);

    // --- Data Fetching and Handlers ---
    const fetchShopItems = async () => {
        try {
            // This will now correctly hit your baseURL/shop (e.g., http://localhost:5000/api/shop)
            const { data } = await api.get('/shop');
            setShopItems(data);
        } catch (error) {
            console.error("Failed to fetch shop items:", error);
            // You might want to display an error message to the user here
        }
    };

    useEffect(() => {
        fetchShopItems();
    }, []); // Empty dependency array means this runs once on mount

    const submitHandler = async (e) => {
        e.preventDefault();
        const shopItemData = { name, description, price: parseFloat(price), category, imageUrl };

        try {
            if (editingItem) {
                // CORRECTED: Template literal syntax from ₹{...} to ${...}
                await api.put(`/shop/${editingItem._id}`, shopItemData);
            } else {
                await api.post('/shop', shopItemData);
            }
            resetForm();
            fetchShopItems(); // Refresh the list after adding/updating
        } catch (error) {
            console.error("Failed to save item:", error);
            // Handle error, e.g., show a toast notification
        }
    };

    const editHandler = (item) => {
        setEditingItem(item);
        setName(item.name);
        setDescription(item.description);
        setPrice(item.price); // Price might need to be converted to string for input type="number"
        setCategory(item.category);
        setImageUrl(item.imageUrl);
    };

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                // CORRECTED: Template literal syntax from ₹{...} to ${...}
                await api.delete(`/shop/${id}`);
                fetchShopItems(); // Refresh the list after deleting
            } catch (error) {
                console.error("Failed to delete item:", error);
                // Handle error
            }
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

    // --- JSX with Upgraded Structure and Classes ---
    return (
        <div className="admin-page">
            <div className="admin-panel admin-form-container">
                <h2>{editingItem ? 'Edit Shop Item' : 'Add New Item'}</h2>
                <form onSubmit={submitHandler} className="admin-form">
                    
                    <label htmlFor="name">Name</label>
                    <input id="name" type="text" placeholder="e.g. Modern Chair" value={name} onChange={e => setName(e.target.value)} required />
                    
                    <label htmlFor="description">Description</label>
                    <textarea id="description" rows="4" placeholder="e.g. A stylish and comfortable chair..." value={description} onChange={e => setDescription(e.target.value)} required />
                    
                    <label htmlFor="price">Price</label>
                    {/* Ensure price is a string for the input value */}
                    <input id="price" type="number" placeholder="e.g. 199.99" value={price} onChange={e => setPrice(e.target.value)} required />
                    
                    <label htmlFor="category">Category</label>
                    <input id="category" type="text" placeholder="e.g. Furniture" value={category} onChange={e => setCategory(e.target.value)} required />
                    
                    <label htmlFor="imageUrl">Image URL</label>
                    <input id="imageUrl" type="text" placeholder="e.g. https://..." value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
                    
                    <div className="form-buttons">
                        <button type="submit" className="btn btn-primary">{editingItem ? 'Update Item' : 'Add Item'}</button>
                        {editingItem && <button type="button" onClick={resetForm} className="btn btn-secondary">Cancel</button>}
                    </div>
                </form>
            </div>

            <div className="admin-panel admin-list-container">
                <h2>Existing Shop Items</h2>
                <div className="table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {shopItems.map(item => (
                                <tr key={item._id}>
                                    <td>{item.name}</td>
                                    <td>{item.category}</td>
                                    <td>₹{item.price ? parseFloat(item.price).toFixed(2) : '0.00'}</td> {/* Ensure price is a number before toFixed */}
                                    <td className="table-actions">
                                        <button className="btn-icon btn-edit" onClick={() => editHandler(item)}>
                                            <EditIcon />
                                        </button>
                                        <button className="btn-icon btn-delete" onClick={() => deleteHandler(item._id)}>
                                            <DeleteIcon />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;