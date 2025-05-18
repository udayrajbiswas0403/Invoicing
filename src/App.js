import React, { useState } from 'react';
import { ScanSearch, FileCheck, FileEdit, Plus, Trash2, X, Upload, Check, FileText, Loader } from 'lucide-react';
import './App.css';
import currencies from './data/currencies';
import countries from './data/countries';
import usStates from './data/us-states';

// Scanner Modal Component
const ScannerModal = ({ onClose, onScanComplete }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingComplete, setProcessingComplete] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const fileInputRef = React.useRef(null);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  // Handle file upload/drop
  const handleDrop = (e) => {
    e.preventDefault();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  // Prevent default behavior for drag events
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Handle clicking the upload area
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  // Simulate processing of scanned invoice
  const handleProcess = () => {
    setIsProcessing(true);
    
    // Mock processing with progress updates
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setProcessingProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setProcessingComplete(true);
        setTimeout(() => {
          onScanComplete({ success: true });
        }, 1000);
      }
    }, 200);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Invoice Scanner</h2>
          <button 
            onClick={onClose}
            className="icon-button"
            disabled={isProcessing && !processingComplete}
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="modal-body">
          {!isProcessing ? (
            <>
              <p className="modal-description">
                Upload an invoice image to automatically extract data. Supported formats: PDF, PNG, JPEG.
              </p>
              
              {/* File Upload Area */}
              <div 
                className="file-upload-area"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={handleUploadClick}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.png,.jpg,.jpeg"
                  className="hidden"
                />
                
                {selectedFile ? (
                  <div className="file-selected">
                    <FileText size={48} className="file-icon" />
                    <p className="file-name">{selectedFile.name}</p>
                    <p className="file-size">
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                ) : (
                  <div className="file-upload-prompt">
                    <Upload size={48} className="upload-icon" />
                    <p className="upload-text">
                      Drag & drop a file here or click to browse
                    </p>
                    <p className="upload-hint">
                      Maximum file size: 10MB
                    </p>
                  </div>
                )}
              </div>
              
              <div className="modal-actions">
                <button
                  onClick={onClose}
                  className="button button-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleProcess}
                  disabled={!selectedFile}
                  className={`button button-primary ${!selectedFile ? 'button-disabled' : ''}`}
                >
                  Process Invoice
                </button>
              </div>
            </>
          ) : (
            <div className="processing-container">
              <div className="processing-content">
                {processingComplete ? (
                  <div className="processing-complete">
                    <div className="icon-container success">
                      <Check size={32} />
                    </div>
                    <h3>Processing Complete</h3>
                    <p>
                      Invoice data extracted successfully!
                    </p>
                  </div>
                ) : (
                  <div className="processing-progress">
                    <div className="spinner-container">
                      <Loader size={32} className="spinner" />
                    </div>
                    <h3>Processing Invoice</h3>
                    <p>
                      Please wait while we extract data from your invoice...
                    </p>
                    
                    {/* Progress Bar */}
                    <div className="progress-bar-container">
                      <div 
                        className="progress-bar-fill"
                        style={{ width: `${processingProgress}%` }}
                      ></div>
                    </div>
                    <p className="progress-percentage">
                      {processingProgress}% Complete
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Export Preview Component
const ExportPreview = ({ 
  invoice, 
  formatAmount,
  calculateSubtotal,
  calculateTax,
  calculateDiscount,
  calculateTotal,
  onClose 
}) => {
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="modal-overlay">
      <div className="preview-container">
        <div className="modal-header">
          <h2>Export Preview</h2>
          <button 
            onClick={onClose}
            className="icon-button"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="preview-body">
          {/* Printable Invoice */}
          <div className="invoice-document print-area">
            {/* Invoice Header */}
            <div className="invoice-header">
              <div className="company-info">
                <h1>{invoice.company.name || 'Your Company'}</h1>
                <div className="company-address">
                  {invoice.company.address || 'Company Address'}
                </div>
                {invoice.company.phone && (
                  <div className="company-contact">
                    Phone: {invoice.company.phone}
                  </div>
                )}
                {invoice.company.email && (
                  <div className="company-contact">
                    Email: {invoice.company.email}
                  </div>
                )}
                {invoice.company.website && (
                  <div className="company-contact">
                    Website: {invoice.company.website}
                  </div>
                )}
                {invoice.company.taxId && (
                  <div className="company-taxid">
                    Tax ID: {invoice.company.taxId}
                  </div>
                )}
              </div>
              
              <div className="invoice-title">
                <div className="title-invoice">INVOICE</div>
                <div className="invoice-details">
                  <div><span className="label">Invoice Number:</span> {invoice.invoiceNumber || 'INV-001'}</div>
                  <div><span className="label">Issue Date:</span> {invoice.issueDate || today}</div>
                  <div><span className="label">Due Date:</span> {invoice.dueDate || today}</div>
                </div>
              </div>
            </div>
            
            {/* Bill To */}
            <div className="bill-to-section">
              <div className="section-label">Bill To:</div>
              <div className="client-name">{invoice.client.name || 'Client Name'}</div>
              <div className="client-address">
                {invoice.client.address || 'Client Address'}
              </div>
              {invoice.client.email && (
                <div className="client-contact">
                  Email: {invoice.client.email}
                </div>
              )}
              {invoice.client.phone && (
                <div className="client-contact">
                  Phone: {invoice.client.phone}
                </div>
              )}
            </div>
            
            {/* Invoice Items */}
            <div className="invoice-items-section">
              <table className="invoice-items-table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={index}>
                      <td>{item.description}</td>
                      <td className="text-right">{item.quantity}</td>
                      <td className="text-right">{formatAmount(item.unitPrice)}</td>
                      <td className="text-right">{formatAmount(item.quantity * item.unitPrice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Invoice Summary */}
            <div className="invoice-summary">
              <div className="summary-item">
                <span>Subtotal:</span>
                <span>{formatAmount(calculateSubtotal())}</span>
              </div>
              <div className="summary-item">
                <span>{invoice.taxType} ({(invoice.taxRate * 100).toFixed(2)}%):</span>
                <span>{formatAmount(calculateTax())}</span>
              </div>
              {invoice.discount > 0 && (
                <div className="summary-item discount">
                  <span>Discount ({invoice.discount}%):</span>
                  <span>-{formatAmount(calculateDiscount())}</span>
                </div>
              )}
              <div className="summary-total">
                <span>Total:</span>
                <span>{formatAmount(calculateTotal())}</span>
              </div>
            </div>
            
            {/* Notes */}
            {invoice.notes && (
              <div className="invoice-notes">
                <div className="notes-label">Notes:</div>
                <div className="notes-text">
                  {invoice.notes}
                </div>
              </div>
            )}
            
            {/* Thank You Message */}
            <div className="thank-you-message">
              Thank you for your business!
            </div>
          </div>
        </div>
        
        {/* Export Actions */}
        <div className="preview-actions">
          <button
            onClick={onClose}
            className="button button-secondary"
          >
            Close
          </button>
          <button
            className="button button-primary"
            onClick={() => window.print()}
          >
            Print / Save PDF
          </button>
        </div>
      </div>
    </div>
  );
};

// InvoiceBuilder Component
const InvoiceBuilder = () => {
  // State for invoice data
  const [invoice, setInvoice] = useState({
    // Company details
    company: {
      name: '',
      address: '',
      phone: '',
      email: '',
      website: '',
      taxId: '',
    },
    // Invoice details
    invoiceNumber: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    currency: 'USD',
    // Client details
    client: {
      name: '',
      address: '',
      email: '',
      phone: '',
      country: 'US',
      state: usStates[0].code,
    },
    // Invoice items
    items: [
      {
        id: Date.now(),
        description: '',
        quantity: 1,
        unitPrice: 0,
        tax: true,
      }
    ],
    // Additional details
    notes: '',
    // Tax details
    taxRate: countries.find(c => c.code === 'US').defaultTaxRate,
    taxType: countries.find(c => c.code === 'US').taxType,
    discount: 0,
  });

  // State for UI controls
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [showExportPreview, setShowExportPreview] = useState(false);
  
  // Handle changes to company details
  const handleCompanyChange = (e) => {
    const { name, value } = e.target;
    setInvoice({
      ...invoice,
      company: {
        ...invoice.company,
        [name]: value
      }
    });
  };

  // Handle changes to invoice details
  const handleInvoiceChange = (e) => {
    const { name, value } = e.target;
    setInvoice({
      ...invoice,
      [name]: value
    });
  };

  // Handle changes to client details
  const handleClientChange = (e) => {
    const { name, value } = e.target;
    setInvoice({
      ...invoice,
      client: {
        ...invoice.client,
        [name]: value
      }
    });
  };

  // Handle change of country
  const handleCountryChange = (e) => {
    const countryCode = e.target.value;
    const selectedCountry = countries.find(c => c.code === countryCode);
    
    setInvoice({
      ...invoice,
      client: {
        ...invoice.client,
        country: countryCode,
        state: selectedCountry.hasStates ? usStates[0].code : '',
      },
      taxRate: selectedCountry.defaultTaxRate,
      taxType: selectedCountry.taxType,
    });
  };

  // Handle change of US state
  const handleStateChange = (e) => {
    const stateCode = e.target.value;
    const selectedState = usStates.find(s => s.code === stateCode);
    
    setInvoice({
      ...invoice,
      client: {
        ...invoice.client,
        state: stateCode,
      },
      taxRate: selectedState.taxRate,
    });
  };

  // Handle currency change
  const handleCurrencyChange = (e) => {
    setInvoice({
      ...invoice,
      currency: e.target.value
    });
  };

  // Handle change in line items
  const handleItemChange = (id, field, value) => {
    setInvoice({
      ...invoice,
      items: invoice.items.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    });
  };

  // Add new line item
  const addItem = () => {
    setInvoice({
      ...invoice,
      items: [
        ...invoice.items,
        {
          id: Date.now(),
          description: '',
          quantity: 1,
          unitPrice: 0,
          tax: true,
        }
      ]
    });
  };

  // Remove line item
  const removeItem = (id) => {
    setInvoice({
      ...invoice,
      items: invoice.items.filter(item => item.id !== id)
    });
  };

  // Handle discount change
  const handleDiscountChange = (e) => {
    setInvoice({
      ...invoice,
      discount: parseFloat(e.target.value) || 0
    });
  };

  // Calculate subtotal
  const calculateSubtotal = () => {
    return invoice.items.reduce((sum, item) => {
      return sum + (item.quantity * item.unitPrice);
    }, 0);
  };

  // Calculate tax amount
  const calculateTax = () => {
    const taxableItems = invoice.items.filter(item => item.tax);
    const taxableAmount = taxableItems.reduce((sum, item) => {
      return sum + (item.quantity * item.unitPrice);
    }, 0);
    
    return taxableAmount * invoice.taxRate;
  };

  // Calculate discount amount
  const calculateDiscount = () => {
    const subtotal = calculateSubtotal();
    return subtotal * (invoice.discount / 100);
  };

  // Calculate total
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax();
    const discount = calculateDiscount();
    
    return subtotal + tax - discount;
  };

  // Format amounts based on selected currency
  const formatAmount = (amount) => {
    const currency = currencies.find(c => c.code === invoice.currency);
    return currency.format(amount);
  };

  // Handle scanner data after scanning
  const handleScanData = (scanData) => {
    // In a real app, we would parse OCR data here
    // For demo, we'll use pre-filled mock data
    setInvoice({
      ...invoice,
      company: {
        name: 'CodeCircuit Technologies',
        address: '123 Tech Drive, Silicon Valley, CA 94123',
        phone: '(555) 123-4567',
        email: 'invoices@codecircuit.com',
        website: 'www.codecircuit.com',
        taxId: 'US-123456789',
      },
      invoiceNumber: 'INV-2023-05001',
      client: {
        name: 'TechNova Inc.',
        address: '456 Innovation Court, Boston, MA 02108',
        email: 'accounts@technova.com',
        phone: '(555) 987-6543',
        country: 'US',
        state: 'MA',
      },
      items: [
        {
          id: Date.now(),
          description: 'Web Development Services',
          quantity: 80,
          unitPrice: 125,
          tax: true,
        },
        {
          id: Date.now() + 1,
          description: 'UI/UX Design',
          quantity: 40,
          unitPrice: 150,
          tax: true,
        },
        {
          id: Date.now() + 2,
          description: 'Server Setup',
          quantity: 1,
          unitPrice: 750,
          tax: true,
        }
      ],
      notes: 'Thank you for your business. Payment is due within 30 days.',
      taxRate: usStates.find(s => s.code === 'MA').taxRate,
      taxType: countries.find(c => c.code === 'US').taxType,
    });
    
    setShowScannerModal(false);
  };

  // Toggle scanner modal
  const toggleScannerModal = () => {
    setShowScannerModal(!showScannerModal);
  };

  // Toggle export preview
  const toggleExportPreview = () => {
    setShowExportPreview(!showExportPreview);
  };

  return (
    <div className="App">
      {showExportPreview ? (
        <ExportPreview 
          invoice={invoice} 
          formatAmount={formatAmount} 
          calculateSubtotal={calculateSubtotal}
          calculateTax={calculateTax}
          calculateDiscount={calculateDiscount}
          calculateTotal={calculateTotal}
          onClose={toggleExportPreview}
        />
      ) : (
        <div className="container">
          {/* Header */}
          <header className="app-header">
            <div className="app-title">
              <div className="app-logo">
                <FileEdit size={24} />
              </div>
              <h1>Invoice Builder</h1>
            </div>
            <div className="header-actions">
              <button
                onClick={toggleScannerModal}
                className="button button-secondary"
              >
                <ScanSearch size={18} />
                <span>Scan Invoice</span>
              </button>
              <button
                onClick={toggleExportPreview}
                className="button button-primary"
              >
                <FileCheck size={18} />
                <span>Export Preview</span>
              </button>
            </div>
          </header>

          <div className="app-content">
            {/* Left Column */}
            <div className="content-column">
              {/* Company Details */}
              <section className="card">
                <div className="card-header">
                  <div className="card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                      <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                  </div>
                  <h2>Company Details</h2>
                </div>
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label className="form-label">Company Name</label>
                    <input
                      type="text"
                      name="name"
                      value={invoice.company.name}
                      onChange={handleCompanyChange}
                      className="form-input"
                      placeholder="Your Company Name"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label className="form-label">Address</label>
                    <textarea
                      name="address"
                      value={invoice.company.address}
                      onChange={handleCompanyChange}
                      className="form-input"
                      placeholder="Company Address"
                      rows={2}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input
                      type="text"
                      name="phone"
                      value={invoice.company.phone}
                      onChange={handleCompanyChange}
                      className="form-input"
                      placeholder="Phone Number"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={invoice.company.email}
                      onChange={handleCompanyChange}
                      className="form-input"
                      placeholder="Email Address"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Website</label>
                    <input
                      type="text"
                      name="website"
                      value={invoice.company.website}
                      onChange={handleCompanyChange}
                      className="form-input"
                      placeholder="Website URL"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tax ID</label>
                    <input
                      type="text"
                      name="taxId"
                      value={invoice.company.taxId}
                      onChange={handleCompanyChange}
                      className="form-input"
                      placeholder="Tax ID / VAT Number"
                    />
                  </div>
                </div>
              </section>

              {/* Invoice Details */}
              <section className="card">
                <div className="card-header">
                  <div className="card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                      <line x1="2" y1="10" x2="22" y2="10"></line>
                    </svg>
                  </div>
                  <h2>Invoice Details</h2>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Invoice Number</label>
                    <input
                      type="text"
                      name="invoiceNumber"
                      value={invoice.invoiceNumber}
                      onChange={handleInvoiceChange}
                      className="form-input"
                      placeholder="INV-001"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Currency</label>
                    <select
                      name="currency"
                      value={invoice.currency}
                      onChange={handleCurrencyChange}
                      className="form-input"
                    >
                      {currencies.map((currency) => (
                        <option key={currency.code} value={currency.code}>
                          {currency.name} ({currency.symbol})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Issue Date</label>
                    <input
                      type="date"
                      name="issueDate"
                      value={invoice.issueDate}
                      onChange={handleInvoiceChange}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Due Date</label>
                    <input
                      type="date"
                      name="dueDate"
                      value={invoice.dueDate}
                      onChange={handleInvoiceChange}
                      className="form-input"
                    />
                  </div>
                </div>
              </section>
              
              {/* Client Details */}
              <section className="card">
                <div className="card-header">
                  <div className="card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                  <h2>Client Details</h2>
                </div>
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label className="form-label">Client Name</label>
                    <input
                      type="text"
                      name="name"
                      value={invoice.client.name}
                      onChange={handleClientChange}
                      className="form-input"
                      placeholder="Client Name"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label className="form-label">Address</label>
                    <textarea
                      name="address"
                      value={invoice.client.address}
                      onChange={handleClientChange}
                      className="form-input"
                      placeholder="Client Address"
                      rows={2}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={invoice.client.email}
                      onChange={handleClientChange}
                      className="form-input"
                      placeholder="Client Email"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input
                      type="text"
                      name="phone"
                      value={invoice.client.phone}
                      onChange={handleClientChange}
                      className="form-input"
                      placeholder="Client Phone"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Country</label>
                    <select
                      name="country"
                      value={invoice.client.country}
                      onChange={handleCountryChange}
                      className="form-input"
                    >
                      {countries.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.name} - {country.taxType}
                        </option>
                      ))}
                    </select>
                  </div>
                  {invoice.client.country === 'US' && (
                    <div className="form-group">
                      <label className="form-label">State</label>
                      <select
                        name="state"
                        value={invoice.client.state}
                        onChange={handleStateChange}
                        className="form-input"
                      >
                        {usStates.map((state) => (
                          <option key={state.code} value={state.code}>
                            {state.name} ({(state.taxRate * 100).toFixed(2)}%)
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* Right Column */}
            <div className="content-column">
              {/* Invoice Items */}
              <section className="card">
                <div className="card-header">
                  <div className="card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="8" y1="6" x2="21" y2="6"></line>
                      <line x1="8" y1="12" x2="21" y2="12"></line>
                      <line x1="8" y1="18" x2="21" y2="18"></line>
                      <line x1="3" y1="6" x2="3.01" y2="6"></line>
                      <line x1="3" y1="12" x2="3.01" y2="12"></line>
                      <line x1="3" y1="18" x2="3.01" y2="18"></line>
                    </svg>
                  </div>
                  <h2>Invoice Items</h2>
                </div>
                <div className="table-container">
                  <table className="items-table">
                    <thead>
                      <tr>
                        <th>Description</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Tax</th>
                        <th>Amount</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.items.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <input
                              type="text"
                              value={item.description}
                              onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                              className="form-input"
                              placeholder="Item description"
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => handleItemChange(item.id, 'quantity', parseInt(e.target.value) || 0)}
                              className="form-input text-right"
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.unitPrice}
                              onChange={(e) => handleItemChange(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                              className="form-input text-right"
                            />
                          </td>
                          <td className="text-center">
                            <input
                              type="checkbox"
                              checked={item.tax}
                              onChange={(e) => handleItemChange(item.id, 'tax', e.target.checked)}
                              className="checkbox"
                            />
                          </td>
                          <td className="text-right font-medium">
                            {formatAmount(item.quantity * item.unitPrice)}
                          </td>
                          <td className="text-right">
                            <button
                              onClick={() => removeItem(item.id)}
                              className="icon-button-small"
                              disabled={invoice.items.length === 1}
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="card-actions">
                  <button
                    onClick={addItem}
                    className="button button-outline"
                  >
                    <Plus size={18} />
                    <span>Add Item</span>
                  </button>
                </div>
              </section>

              {/* Invoice Summary */}
              <section className="card">
                <div className="card-header">
                  <div className="card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="3" y1="12" x2="21" y2="12"></line>
                      <line x1="3" y1="6" x2="16" y2="6"></line>
                      <line x1="3" y1="18" x2="14" y2="18"></line>
                    </svg>
                  </div>
                  <h2>Summary</h2>
                </div>
                <div className="summary-container">
                  <div className="summary-row summary-row-default">
                    <span>Subtotal:</span>
                    <span className="font-medium">{formatAmount(calculateSubtotal())}</span>
                  </div>
                  <div className="summary-row summary-row-highlight">
                    <span>{invoice.taxType} ({(invoice.taxRate * 100).toFixed(2)}%):</span>
                    <span className="font-medium">{formatAmount(calculateTax())}</span>
                  </div>
                  <div className="summary-row summary-row-discount">
                    <label className="discount-label">
                      <span>Discount (%):</span>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={invoice.discount}
                        onChange={handleDiscountChange}
                        className="discount-input"
                      />
                    </label>
                    <span className="discount-amount">-{formatAmount(calculateDiscount())}</span>
                  </div>
                  <div className="summary-row summary-row-total">
                    <span>Total:</span>
                    <span className="total-amount">{formatAmount(calculateTotal())}</span>
                  </div>
                </div>
              </section>

              {/* Notes */}
              <section className="card">
                <div className="card-header">
                  <div className="card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                  </div>
                  <h2>Notes</h2>
                </div>
                <textarea
                  name="notes"
                  value={invoice.notes}
                  onChange={handleInvoiceChange}
                  className="form-input notes-textarea"
                  placeholder="Additional notes or payment instructions..."
                  rows={4}
                />
              </section>
            </div>
          </div>
        </div>
      )}

      {/* Scanner Modal */}
      {showScannerModal && (
        <ScannerModal onClose={toggleScannerModal} onScanComplete={handleScanData} />
      )}
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <InvoiceBuilder />
    </div>
  );
}

export default App;