import Head from 'next/head';
import Layout from '../../components/Layout';
import { useEffect, useState } from 'react';
import contactdata from '../../server/client/contact';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import getcontactdata from '../../server/client/getcontact';
import { jwtDecode } from 'jwt-decode';
import protectedroute from '../../protectedroute';

export default function Contact({token}) {
  const [formData, setFormData] = useState({
    _id: '',
    contacttitle: '',
    contactsub1: '',
    contacth: '',
    contactp: ''
  });
  const [loading, setLoading] = useState(false); // Loading state

  useEffect(() => {
    fetchExistingData();
  }, []);

  // Fetch existing data when component mounts
  const fetchExistingData = async () => {
    
    try {
      const response = await getcontactdata(token);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const fetchedData = await response.json();
      
      setFormData(fetchedData.response[0]);
    } catch (error) {
      console.error('Error fetching existing data:', error);
    }
      
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const router = useRouter();
  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // Start loading
   
    try {
      const response = await contactdata(formData, token);
      const data = await response.json();
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
      <h1 className='text-center text-3xl mb-8 font-bold font-mono text-primary'>Contact Us Page Data</h1>
      <div className='w-full'>
        <form className='grid grid-cols-2 gap-5 p-4' onSubmit={handleSubmit}>
          <div>
            <label htmlFor="contacttitle" className="block text-sm font-medium leading-6 text-gray-900">
              Title
            </label>
            <div className="mt-2">
              <input
                id="contacttitle"
                name="contacttitle"
                type="text"
                value={formData.contacttitle}
                onChange={handleChange}
                className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label htmlFor="contactsub1" className="block text-sm font-medium leading-6 text-gray-900">
              Subheading
            </label>
            <div className="mt-2">
              <input
                id="contactsub1"
                name="contactsub1"
                type="text"
                value={formData.contactsub1}
                onChange={handleChange}
                className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label htmlFor="contacth" className="block text-sm font-medium leading-6 text-gray-900">
              Info
            </label>
            <div className="mt-2">
              <input
                id="contacth"
                name="contacth"
                type="text"
                value={formData.contacth}
                onChange={handleChange}
                className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label htmlFor="contactp" className="block text-sm font-medium leading-6 text-gray-900">
              Para
            </label>
            <div className="mt-2">
              <input
                id="contactp"
                name="contactp"
                type="text"
                value={formData.contactp}
                onChange={handleChange}
                className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className='col-span-2'>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded" disabled={loading}>
              {loading ? 'Saving Changes...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}



export async function getServerSideProps({ req }) {
return protectedroute(req);

}