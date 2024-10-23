import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import navbardata from '../../server/client/navbar';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import getnavbardata from '../../server/client/getnavbar';
import { jwtDecode } from 'jwt-decode';
import protectedroute from '../../protectedroute';
import axios from 'axios';
import { writeFile } from 'fs/promises';
import FormData from 'form-data';
import { Html } from 'next/document';

export default function Navbar({token}) {
  const [data, setData] = useState({
    _id: '',
    logo: '',
    navitems: [''],
    links: [{ name: '', link: '', withlink: [{ name: '', link: '' }] }],
    navButton: ''
  });


  const [loading, setLoading] = useState(false); // Loading state
  const [logoFilename, setLogoFilename] = useState(''); // State for logo preview
  
  const router = useRouter();
useEffect(() => {
    fetchExistingData();
  }, []);

  const fetchExistingData = async () => {
   
    try {
      const response = await getnavbardata(token);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const fetchedData = await response.json();
      
      setData(fetchedData.response[0]);
      const word = fetchedData.response[0].logo.split('/');
      setLogoFilename(word[4]||" ");
    
    } catch (error) {
      console.error('Error fetching existing data:', error);
    }
      
  };
  // Handle changes for logo
  const handleLogoChange = async(field, file) => {
    // Prevent default behavior if this is part of a form submission
    // You might want to check if `e` is defined or if you need it at all.
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
  
 const handleNavButtonChange = (e) => {
    e.preventDefault();
    setData({...data, navButton: e.target.value });
  };
 
  // Handle changes for links
  const handleLinkChange = (index, field, value) => {
    const newLinks = [...data.links];
    newLinks[index][field] = value;
    setData({ ...data, links: newLinks });
  };

  const addLink = (e) => {
    e.preventDefault();
    setData({ ...data, links: [...data.links, { name: '', link: '', withlink: [{ name: '', link: '' }] }] });
  };

  const removeLink = (index,e) => {
    e.preventDefault();
    const newLinks = data.links.filter((_, i) => i !== index);
    setData({ ...data, links: newLinks });
  };

  // Handle changes for withlink items
  const handleWithLinkChange = (linkIndex, withlinkIndex, field, value) => {
    const newLinks = [...data.links];
    newLinks[linkIndex].withlink[withlinkIndex][field] = value;
    setData({ ...data, links: newLinks });
  };

  const addWithLink = (index,e) => {
    e.preventDefault();
    const newLinks = [...data.links];
    newLinks[index].withlink.push({ name: '', link: '' });
    setData({ ...data, links: newLinks });
  };

  const removeWithLink = (linkIndex, withlinkIndex,e) => {
    e.preventDefault();
    const newLinks = [...data.links];
    newLinks[linkIndex].withlink = newLinks[linkIndex].withlink.filter((_, i) => i !== withlinkIndex);
    setData({ ...data, links: newLinks });
  };

 
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // Start loading
    const payload = {
      logo: data.logo || '', // Default to empty string if undefined
      navitems: Array.isArray(data.navitems) ? data.navitems.filter(item => item !== '') : [], // Safeguard
      links: Array.isArray(data.links) 
        ? data.links
            .filter(link => link.name !== '' && link.link !== '') // Filter out empty links
            .map(link => ({
              name: link.name,
              link: link.link,
              withlink: Array.isArray(link.withlink)
                ? link.withlink.filter(withlinkItem => withlinkItem.name !== '' && withlinkItem.link !== '') // Safeguard
                : [], // Default to empty if not an array
            }))
        : [],
      navButton: data.navButton || '' // Default to empty string if undefined
    };
    
   
    try {
      const response = await navbardata(payload, token);
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
console.log(logoFilename);
  return (
    <Layout>
      <div >
      <h1 className='text-center text-3xl font-bold mb-8 font-mono text-primary'>Navbar Data</h1>
      <div className="ms-32  ">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-5 p-4">
            {/* Logo */}
            <div>
              
              <label htmlFor="logo" className="mt-4 block text-sm font-medium leading-6 text-gray-900">
                Logo
              </label>
              <div className='focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ring-1 ring-gray-300 rounded-md'>
              <input
                id="logo"
                name="logo"
                type='file'
                title={logoFilename}             
                className={logoFilename?"w-24  rounded-md border-0 py-1.5   text-transparent ":"w-3/4  rounded-md border-0 py-1.5 text-gray-900   "}
            //  placeholder={logoFilename}
                onChange={(e)=>handleLogoChange('logo',e.target.files[0])}
              /><span>{logoFilename}</span>
              </div>
            
              
            </div>

        
          </div>
          <hr className='m-3'/>

          <div className="grid grid-cols-2 gap-5 p-4">
            {/* Links */}
            {data.links.map((link, index) => (
              <div key={index} className=''>
                <label htmlFor={`name-${index}`} className="mt-4 block text-sm font-medium leading-6 text-gray-900">
                  Name {index + 1}
                </label>
                <input
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  id={`name-${index}`}
                  type="text"
                  value={link.name}
                  onChange={(e) => handleLinkChange(index, 'name', e.target.value)}
                />
                <label htmlFor={`link-${index}`} className="mt-4 block text-sm font-medium leading-6 text-gray-900">
                  Link {index + 1}
                </label>
                <input
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  id={`link-${index}`}
                  type="text"
                  value={link.link}
                  onChange={(e) => handleLinkChange(index, 'link', e.target.value)}
                />

                {/* With Links */}
                {link.withlink.map((withlink, ind) => (
                  <div key={ind}>
                    <label htmlFor={`withlinkname-${index}-${ind}`} className="mt-4 block text-sm font-medium leading-6 text-gray-900">
                      With Link Name {ind + 1}
                    </label>
                    <input
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      id={`withlinkname-${index}-${ind}`}
                      type="text"
                      value={withlink.name}
                      onChange={(e) => handleWithLinkChange(index, ind, 'name', e.target.value)}
                    />
                    <label htmlFor={`withlinklink-${index}-${ind}`} className="mt-4 block text-sm font-medium leading-6 text-gray-900">
                      With Link Link {ind + 1}
                    </label>
                    <input
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      id={`withlinklink-${index}-${ind}`}
                      type="text"
                      value={withlink.link}
                      onChange={(e) => handleWithLinkChange(index, ind, 'link', e.target.value)}
                    />
                    {ind === link.withlink.length - 1 && (
                      <button
                        type="button"
                        onClick={(e) => addWithLink(index,e)}
                        className='inline bg-transparent mt-3 hover:bg-primary text-primary font-semibold hover:text-white py-2 px-4 border border-primary hover:border-white rounded-full h-10 w-fit'
                      >
                        +
                      </button>
                    )}
                    {ind !== 0 && (
                      <button
                        type="button"
                        onClick={(e) => removeWithLink(index, ind,e)}
                        className="bg-primary hover:bg-white hover:text-black float-end mt-4 text-white font-bold py-2 px-4 rounded-full w-fit mb-4"
                      >
                        -
                      </button>
                    )}
                  </div>
                ))}
                {index === data.links.length - 1 && (
                  <button
                    type="button"
                    onClick={addLink}
                    className='inline bg-transparent mt-3 hover:bg-primary text-primary font-semibold hover:text-white py-2 px-4 border border-primary hover:border-white rounded-full h-10 w-32'
                  >
                    Add More 
                  </button>
                )}
                {data.links.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => removeLink(index,e)}
                    className="bg-primary hover:bg-white hover:text-black float-end mt-4 text-white font-bold py-2 px-4 rounded-full mb-4"
                  >
                    Remove Link
                  </button>
                )}
              </div>
            ))}
               <div>
          <label htmlFor="navButton" className="mt-4 block text-sm font-medium leading-6 text-gray-900">
                Nav Button
              </label>
              <input
                id="navButton"
                name="navButton"
                type="text"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={data.navButton}
                onChange={handleNavButtonChange}
              />
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