import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import Support from '../support/index';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import footerdata from '../../server/client/footer';
import getfooterdata from '../../server/client/getfooter';
import { jwtDecode } from 'jwt-decode';
import protectedroute from '../../protectedroute';
import axios from 'axios';

export default function Footer({token}) {
    const [data, setData] = useState({
        footerlogo: '',
        foooterp1: '',
        footerp2: '',
        footerspan: '',
        products: {
            name: '',
            items: ['']
        },
        company: {
            name: '',
            items: [{ name: '', link: '' }]
        },
        support: {
            name: '',
            items: ['']
        },
        partner: {
            name: '',
            items: ['']
        },
        account: {
            name: '',
            items: [{ name: '', link: '' }]
        }
    });
    
  const [loading, setLoading] = useState(false); // Loading state
  const [logoFilename, setLogoFilename] = useState(''); // State for logo preview
  const router = useRouter();
useEffect(() => {
    fetchExistingData();
  }, []);

  const fetchExistingData = async () => {
  
    try {
        const response = await getfooterdata(token);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
  
        const fetchedData = await response.json();
        
        setData(fetchedData.response[0]);
        const word = fetchedData.response[0].footerlogo.split('/');
        setLogoFilename(word[4]||" ");
      } catch (error) {
        console.error('Error fetching existing data:', error);
      }
        
  };
  const handlelogoChange = async (field, file) => {
    console.log({ file });
  
    const formData = new FormData();
    formData.append('file', file); // Append the file to FormData
    setLogoFilename(file.filename)
  
    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Ensure the correct header is set
        },
      });
  
      if (response.data ) {
        const url = response.data.blobUrl;
        console.log({ url });
  
        // Update the state with the new URL
        setData((prevData) => ({
          ...prevData,
          [field]: url, // Update the specified field
        }));
  
        console.log('Data after update:', { ...data, [field]: url }); // Log updated state
        console.log('Upload successful:', response);
      } else {
        console.error('Unexpected response format:', response);
      }
    } catch (error) {
      console.error('Error uploading image:', error.response?.data || error.message);
    }
  };
  

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
    };

    // Products handling
    const handleProductNameChange = (field) => (e)=>{
        setData({ ...data, [field]: { ...data[field], name: e.target.value } });
    };

    const handleProductItemChange = (index, value,field) => {
        const updatedItems = [...data[field].items];
        updatedItems[index] = value;
        setData({ ...data, [field]: { ...data[field], items: updatedItems } });
    };

    const addProductItem = (field) => {
        setData({ ...data, [field]: { ...data[field], items: [...data[field].items, ''] } });
    };

    const removeProductItem = (index,field) => {
        const updatedItems = data[field].items.filter((_, i) => i !== index);
        setData({ ...data, [field]: { ...data[field], items: updatedItems } });
    };

    // Company handling
    const handleCompanyNameChange = (e,field) => {
        setData({ ...data, [field]: { ...data[field], name: e.target.value } });
    };

    const handleCompanyItemChange = (index, field, value,parentfield) => {
        const updatedItems = [...data[parentfield].items];
        updatedItems[index] = { ...updatedItems[index], [field]: value };
        setData({ ...data, [parentfield]: { ...data[parentfield], items: updatedItems } });
    };

    const addCompanyItem = (field) => {
        setData({ ...data, [field]: { ...data[field], items: [...data[field].items, { name: '', link: '' }] } });
    };

    const removeCompanyItem = (index,field) => {
        const updatedItems = data[field].items.filter((_, i) => i !== index);
        setData({ ...data, [field]: { ...data[field], items: updatedItems } });
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true); // Start loading
        const payload = {
            footerlogo: data.footerlogo,
            foooterp1: data.foooterp1,
            footerp2: data.footerp2,
            footerspan: data.footerspan,
            products: {
              name: data.products.name, // Make sure to include the name property
              items: data.products.items.filter(item => item !== ''), // Ensure no empty items
            },
            company: {
              name: data.company.name, // Make sure to include the name property
              items: data.company.items.filter(item => item.name !== '' && item.link !== ''), // Filter out empty items
            },
            support: {
              name: data.support.name, // Make sure to include the name property
              items: data.support.items.filter(item => item !== ''), // Ensure no empty items
            },
            partner: {
              name: data.partner.name, // Make sure to include the name property
              items: data.partner.items.filter(item => item !== ''), // Ensure no empty items
            },
            account: {
              name: data.account.name, // Make sure to include the name property
              items: data.account.items.filter(item => item.name !== '' && item.link !== ''), // Filter out empty items
            }
          };
          
       
        try {
          const response = await footerdata(payload, token);
          const resdata = await response.json();
          fetchExistingData();
            
        } catch (error) {
          console.error("Error submitting form:", error);
        } finally {
          setTimeout(()=>{
            
            setLoading(false);
            

          },2000)
           // End loading
        }
      };

    return (
        <Layout>
            <div>
            <h1 className='text-center text-3xl font-bold mb-8 font-mono text-primary'>Footer Data</h1>
            <div className="ms-32">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-5 p-4">
                        {/* Footer Logo */}
                        <div>
                            <label htmlFor="footerlogo" className="mt-4 block text-sm font-medium leading-6 text-gray-900">Footer Logo</label>
                           
                            <div className='focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ring-1 ring-gray-300 rounded-md'>
                           <input
                                id="footerlogo"
                                name="footerlogo"
                                type="file"
                                className={logoFilename?"w-24  rounded-md border-0 py-1.5   text-transparent ":"w-3/4  rounded-md border-0 py-1.5 text-gray-900   "}
            //  placeholder={logoFilename}
                                onChange={(e)=>handlelogoChange('footerlogo',e.target.files[0])}
                            /><span>{logoFilename}</span>
                            </div> 
                        </div>

                        {/* Footer P1 */}
                        <div>
                            <label htmlFor="foooterp1" className="mt-4 block text-sm font-medium leading-6 text-gray-900">Footer P1</label>
                            <textarea
                                id="foooterp1"
                                name="foooterp1"
                                rows={2}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                value={data.foooterp1}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Footer P2 */}
                        <div>
                            <label htmlFor="footerp2" className="mt-4 block text-sm font-medium leading-6 text-gray-900">Footer P2</label>
                            <input
                                id="footerp2"
                                name="footerp2"
                                type="text"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                value={data.footerp2}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Footer Span */}
                        <div>
                            <label htmlFor="footerspan" className="mt-4 block text-sm font-medium leading-6 text-gray-900">Footer Span</label>
                            <input
                                id="footerspan"
                                name="footerspan"
                                type="text"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                value={data.footerspan}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <hr className='m-3' />

                    {/* Products Section */}
                    <div className='grid grid-cols-2 gap-5 p-4'>
                        <div>
                            <label htmlFor="products" className="mt-4 block text-sm font-medium leading-6 text-gray-900">Products</label>
                            <label htmlFor="name" className="mt-4 block text-sm font-medium leading-6 text-gray-900">Name</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                value={data.products.name}
                                onChange={handleProductNameChange('products')}
                            />
                            {data.products.items.map((item, index) => (
                                <div key={index}>
                                    <label htmlFor={`item${index}`} className="mt-9 block text-sm font-medium leading-6 text-gray-900">Item {index + 1}</label>
                                    <input
                                        id={`item${index}`}
                                        type="text"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        value={item}
                                        onChange={(e) => handleProductItemChange(index, e.target.value,'products')}
                                    />
                                      {index == data.products.items.length - 1 &&  <button
                                type="button"
                                onClick={()=>addProductItem('products')}
                                                    className='inline bg-transparent mt-3 hover:bg-primary text-primary font-semibold hover:text-white py-2 px-4 border border-primary hover:border-white rounded-full h-10 w-32'
                            >
                                Add More
                            </button>}
                                    {index >0 && (
                                        <button
                                            type="button"
                                            onClick={() => removeProductItem(index,'products')}
                                              className="bg-primary hover:bg-white hover:text-black float-end mt-4 text-white font-bold py-2 px-4 rounded-full mb-4"
                                        >
                                            Remove
                                        </button>
                                    )}
                                  
                                </div>
                            ))}
                           
                        </div>

                        {/* Company Section */}
                        <div>
                            <label htmlFor="company" className="mt-4 block text-sm font-medium leading-6 text-gray-900">Company</label>
                            <label htmlFor="name" className="mt-4 block text-sm font-medium leading-6 text-gray-900">Name</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                value={data.company.name}
                                onChange={(e)=>handleCompanyNameChange(e,'company')}
                            />
                            {data.company.items.map((item, index) => (
                                <div key={index}>
                                    <label htmlFor={`companyItemName${index}`} className="mt-4 block text-sm font-medium leading-6 text-gray-900">Item Name</label>
                                    <input
                                        id={`companyItemName${index}`}
                                        type="text"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        value={item.name}
                                        onChange={(e) => handleCompanyItemChange(index, 'name', e.target.value,'company')}
                                    />
                                    <label htmlFor={`companyItemLink${index}`} className="mt-4 block text-sm font-medium leading-6 text-gray-900">Item Link</label>
                                    <input
                                        id={`companyItemLink${index}`}
                                        type="text"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        value={item.link}
                                        onChange={(e) => handleCompanyItemChange(index, 'link', e.target.value,'company')}
                                    />
                                    {index == data.company.items.length-1 && <button
                                type="button"
                                onClick={()=>addCompanyItem('company')}
                                className='inline bg-transparent mt-3 hover:bg-primary text-primary font-semibold hover:text-white py-2 px-4 border border-primary hover:border-white rounded-full h-10 w-32'
                            >
                                Add More
                            </button>}
                                    {index > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => removeCompanyItem(index,'company')}
                                            className="bg-primary hover:bg-white hover:text-black float-end mt-4 text-white font-bold py-2 px-4 rounded-full mb-4"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            ))}
                           
                        </div>
                        {/* Support */}
                        <div>
                            <label htmlFor="support" className="mt-4 block text-sm font-medium leading-6 text-gray-900">Support</label>
                            <label htmlFor="name" className="mt-4 block text-sm font-medium leading-6 text-gray-900">Name</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                value={data.support.name}
                                onChange={handleProductNameChange('support')}
                            />
                            {data.support.items.map((item, index) => (
                                <div key={index}>
                                    <label htmlFor={`item${index}`} className="mt-9 block text-sm font-medium leading-6 text-gray-900">Item {index + 1}</label>
                                    <input
                                        id={`item${index}`}
                                        type="text"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        value={item}
                                        onChange={(e) => handleProductItemChange(index, e.target.value,'support')}
                                    />
                                      {index == data.support.items.length - 1 &&  <button
                                type="button"
                                onClick={()=>addProductItem('support')}
                                                    className='inline bg-transparent mt-3 hover:bg-primary text-primary font-semibold hover:text-white py-2 px-4 border border-primary hover:border-white rounded-full h-10 w-32'
                            >
                                Add More
                            </button>}
                                    {index >0 && (
                                        <button
                                            type="button"
                                            onClick={() => removeProductItem(index,'support')}
                                              className="bg-primary hover:bg-white hover:text-black float-end mt-4 text-white font-bold py-2 px-4 rounded-full mb-4"
                                        >
                                            Remove
                                        </button>
                                    )}
                                  
                                </div>
                            ))}
                           
                        </div>
                        {/* partner */}
                        <div>
                            <label htmlFor="partner" className="mt-4 block text-sm font-medium leading-6 text-gray-900">Partner</label>
                            <label htmlFor="name" className="mt-4 block text-sm font-medium leading-6 text-gray-900">Name</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                value={data.partner.name}
                                onChange={handleProductNameChange('partner')}
                            />
                            {data.partner.items.map((item, index) => (
                                <div key={index}>
                                    <label htmlFor={`item${index}`} className="mt-9 block text-sm font-medium leading-6 text-gray-900">Item {index + 1}</label>
                                    <input
                                        id={`item${index}`}
                                        type="text"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        value={item}
                                        onChange={(e) => handleProductItemChange(index, e.target.value,'partner')}
                                    />
                                      {index == data.partner.items.length - 1 &&  <button
                                type="button"
                                onClick={()=>addProductItem('partner')}
                                                    className='inline bg-transparent mt-3 hover:bg-primary text-primary font-semibold hover:text-white py-2 px-4 border border-primary hover:border-white rounded-full h-10 w-32'
                            >
                                Add More
                            </button>}
                                    {index >0 && (
                                        <button
                                            type="button"
                                            onClick={() => removeProductItem(index,'partner')}
                                              className="bg-primary hover:bg-white hover:text-black float-end mt-4 text-white font-bold py-2 px-4 rounded-full mb-4"
                                        >
                                            Remove
                                        </button>
                                    )}
                                  
                                </div>
                            ))}
                           
                        </div>
                        {/* account */}
                        <div>
                            <label htmlFor="account" className="mt-4 block text-sm font-medium leading-6 text-gray-900">Account</label>
                            <label htmlFor="name" className="mt-4 block text-sm font-medium leading-6 text-gray-900">Name</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                value={data.account.name}
                                onChange={(e)=>handleCompanyNameChange(e,'account')}
                            />
                            {data.account.items.map((item, index) => (
                                <div key={index}>
                                    <label htmlFor={`accountItemName${index}`} className="mt-4 block text-sm font-medium leading-6 text-gray-900">Item Name</label>
                                    <input
                                        id={`accountItemName${index}`}
                                        type="text"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        value={item.name}
                                        onChange={(e) => handleCompanyItemChange(index, 'name', e.target.value,'account')}
                                    />
                                    <label htmlFor={`accountItemLink${index}`} className="mt-4 block text-sm font-medium leading-6 text-gray-900">Item Link</label>
                                    <input
                                        id={`accountItemLink${index}`}
                                        type="text"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        value={item.link}
                                        onChange={(e) => handleCompanyItemChange(index, 'link', e.target.value,'account')}
                                    />
                                    {index == data.account.items.length-1 && <button
                                type="button"
                                onClick={()=>addCompanyItem('account')}
                                className='inline bg-transparent mt-3 hover:bg-primary text-primary font-semibold hover:text-white py-2 px-4 border border-primary hover:border-white rounded-full h-10 w-32'
                            >
                                Add More
                            </button>}
                                    {index > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => removeCompanyItem(index,'account')}
                                            className="bg-primary hover:bg-white hover:text-black float-end mt-4 text-white font-bold py-2 px-4 rounded-full mb-4"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            ))}
                           
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="p-4">
                        <button
                            type="submit"
                            className="bg-primary text-white font-bold py-2 px-4 rounded w-full my-5" disabled={loading}
                        >
                           {loading ? 'Saving Changes...' : 'Submit'}
                        </button>
                    </div>
                </form>
            </div>
            </div>
         
        </Layout>
    );
}




export async function getServerSideProps({ req, res }) {
return protectedroute(req);
  }