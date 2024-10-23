import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import supportdata from '../../server/client/support';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import getsupportdata from '../../server/client/getsupport';
import { jwtDecode } from 'jwt-decode';
import protectedroute from '../../protectedroute';

export default function Support({token}) {
  const initialCard = { scardicon: '', scardh5: '', scardp: '', scardbtn: '' };
 
  const initialData = {
    _id:'',
    supporttitle: '',
    supportsub1: '',
    supportsub2: '',
    supporth: '',
    supportdiv1: { div1icon: '', div1title: '', div1text: '', div1btntxt: '' },
    supportdiv2: { div2icon: '', div2title: '', div2text: '', div2btntxt: '' },
    supportquestion: '',
    supportanswer: '',
    supportcard: [],
   whatsapp: { whatsapph: '', whatsappinfo: '', whatsappbtn: '' }
  };
  const [loading, setLoading] = useState(false); // Loading state

  const router = useRouter();
  const [formData, setFormData] = useState(initialData);
  useEffect(() => {
    fetchExistingData();
  }, []);

  const fetchExistingData = async () => {
    
    try {
      const response = await getsupportdata(token);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const fetchedData = await response.json();
      
      setFormData(fetchedData.response[0]);
    } catch (error) {
      console.error('Error fetching existing data:', error);
    }
      
  };
  const addFields = (e) => {
    e.preventDefault();
    
    // Create a new card by copying the existing supportcards and adding the initialCard
    const updatedSupportCards = [...formData.supportcard, initialCard];

    // Update the state with the new support cards array
    setFormData({ ...formData, supportcard: updatedSupportCards });
};


  const deleteFields = (e, index) => {
    e.preventDefault();
    const data = [...formData.supportcard];
    data.splice(index, 1);
    
    setFormData({ ...formData, supportcard: data });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCardChange = (index, field, value) => {
    const newCards = formData.supportcard.map((input, idx) =>
      idx === index ? { ...input, [field]: value } : input
    );
    
    setFormData({ ...formData, supportcard: newCards });
  };

  const handleSubmit =  async (event) => {
    event.preventDefault();
    setLoading(true); // Start loading
    try {
      const response = await supportdata(formData, token);
      const data = await response.json();
      fetchExistingData()
        
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setTimeout(()=>{
       
        setLoading(false);

      },2000)  
  };
  };
  return (
    <Layout>
      <h1 className='text-center text-3xl mb-8 font-bold font-mono text-primary'>Support Page Details</h1>
      <div className='w-full'>
        <form onSubmit={handleSubmit}>
          {/* Static Fields */}
          <div className='grid grid-cols-2 gap-5 p-4'>
            <div>
              <label htmlFor="supporttitle" className="mt-4 block text-sm font-medium leading-6 text-gray-900">Support Title</label>
              <input
                id="supporttitle"
                name="supporttitle"
                type="text"
                value={formData.supporttitle}
                onChange={handleInputChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            <div>
              <label htmlFor="supportsub1" className="mt-4 block text-sm font-medium leading-6 text-gray-900">Subheading 1</label>
              <input
                id="supportsub1"
                name="supportsub1"
                type="text"
                value={formData.supportsub1}
                onChange={handleInputChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            <div>
              <label htmlFor="supportsub2" className="mt-4 block text-sm font-medium leading-6 text-gray-900">Subheading 2</label>
              <input
                id="supportsub2"
                name="supportsub2"
                type="text"
                value={formData.supportsub2}
                onChange={handleInputChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            <div>
              <label htmlFor="supporth" className="mt-4 block text-sm font-medium leading-6 text-gray-900">Help Question</label>
              <input
                id="supporth"
                name="supporth"
                type="text"
                value={formData.supporth}
                onChange={handleInputChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <hr className='m-5' />

          {/* Division 1 Fields */}
          <div className='grid grid-cols-2 gap-5 p-4'>
            <div>
              <label htmlFor="div1icon" className="mt-4 block text-sm font-medium leading-6 text-gray-900">Division 1 Icon</label>
              <input
                id="div1icon"
                name="div1icon"
                type="text"
                value={formData.supportdiv1.div1icon}
                onChange={(e) => setFormData({ ...formData, supportdiv1: { ...formData.supportdiv1, div1icon: e.target.value } })}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            <div>
              <label htmlFor="div1title" className="mt-4 block text-sm font-medium leading-6 text-gray-900">Division 1 Title</label>
              <input
                id="div1title"
                name="div1title"
                type="text"
                value={formData.supportdiv1.div1title}
                onChange={(e) => setFormData({ ...formData, supportdiv1: { ...formData.supportdiv1, div1title: e.target.value } })}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            <div>
              <label htmlFor="div1text" className="mt-4 block text-sm font-medium leading-6 text-gray-900">Division 1 Text</label>
              <input
                id="div1text"
                name="div1text"
                type="text"
                value={formData.supportdiv1.div1text}
                onChange={(e) => setFormData({ ...formData, supportdiv1: { ...formData.supportdiv1, div1text: e.target.value } })}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            <div>
              <label htmlFor="div1btntxt" className="mt-4 block text-sm font-medium leading-6 text-gray-900">Division 1 Button Text</label>
              <input
                id="div1btntxt"
                name="div1btntxt"
                type="text"
                value={formData.supportdiv1.div1btntxt}
                onChange={(e) => setFormData({ ...formData, supportdiv1: { ...formData.supportdiv1, div1btntxt: e.target.value } })}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <hr className='m-5' />

          {/* Division 2 Fields */}
          <div className='grid grid-cols-2 gap-5 p-4'>
            <div>
              <label htmlFor="div2icon" className="mt-4 block text-sm font-medium leading-6 text-gray-900">Division 2 Icon</label>
              <input
                id="div2icon"
                name="div2icon"
                type="text"
                value={formData.supportdiv2.div2icon}
                onChange={(e) => setFormData({ ...formData, supportdiv2: { ...formData.supportdiv2, div2icon: e.target.value } })}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            <div>
              <label htmlFor="div2title" className="mt-4 block text-sm font-medium leading-6 text-gray-900">Division 2 Title</label>
              <input
                id="div2title"
                name="div2title"
                type="text"
                value={formData.supportdiv2.div2title}
                onChange={(e) => setFormData({ ...formData, supportdiv2: { ...formData.supportdiv2, div2title: e.target.value } })}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            <div>
              <label htmlFor="div2text" className="mt-4 block text-sm font-medium leading-6 text-gray-900">Division 2 Text</label>
              <input
                id="div2text"
                name="div2text"
                type="text"
                value={formData.supportdiv2.div2text}
                onChange={(e) => setFormData({ ...formData, supportdiv2: { ...formData.supportdiv2, div2text: e.target.value } })}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            <div>
              <label htmlFor="div2btntxt" className="mt-4 block text-sm font-medium leading-6 text-gray-900">Division 2 Button Text</label>
              <input
                id="div2btntxt"
                name="div2btntxt"
                type="text"
                value={formData.supportdiv2.div2btntxt}
                onChange={(e) => setFormData({ ...formData, supportdiv2: { ...formData.supportdiv2, div2btntxt: e.target.value } })}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <hr className='m-5' />

          {/* Support Question and Answer */}
          <div className='grid grid-cols-2 gap-5 p-4'>
            <div>
              <label htmlFor="supportquestion" className="mt-4 block text-sm font-medium leading-6 text-gray-900">Support Question</label>
              <input
                id="supportquestion"
                name="supportquestion"
                type="text"
                value={formData.supportquestion}
                onChange={handleInputChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            <div>
              <label htmlFor="supportanswer" className="mt-4 block text-sm font-medium leading-6 text-gray-900">Support Answer</label>
              <input
                id="supportanswer"
                name="supportanswer"
                type="text"
                value={formData.supportanswer}
                onChange={handleInputChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <hr className='m-5' />
          <div className='grid grid-cols-2 gap-5 p-4'>
  {/* Support Cards */}
  {formData.supportcard.map((input, index) => (
            <div key={index}>
              {['scardicon', 'scardh5', 'scardp', 'scardbtn'].map((field) => (
                <div key={field}>
                  <label htmlFor={`${field}-${index}`} className="mt-4 block text-sm font-medium leading-6 text-gray-900">{`${field.charAt(0).toUpperCase() + field.slice(1)} ${index + 1}`}</label>
                  <input
                    id={`${field}-${index}`}
                    name={field}
                    type="text"
                    value={input[field]}
                    onChange={(e) => handleCardChange(index, field, e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              ))}
              {index === formData.supportcard.length - 1 && (
                <button onClick={addFields} className='inline bg-transparent mt-3 hover:bg-primary text-primary font-semibold hover:text-white py-2 px-4 border border-primary hover:border-white rounded-full h-10 w-32'>Add More</button>
              )}
              {index !== 0 && (
                <button onClick={(e) => deleteFields(e, index)} className="bg-primary hover:bg-white hover:text-black float-end mt-4 text-white font-bold py-2 px-4 rounded-full">Remove</button>
              )}
            </div>
          ))}
          </div>

        

          {/* Whatsapp Section */}
          <hr className='m-5' />
          <div className='grid grid-cols-2 gap-5 p-4'>
            <div>
              <label htmlFor="whatsapph" className="mt-4 block text-sm font-medium leading-6 text-gray-900">Whatsapp Header</label>
              <input
                id="whatsapph"
                name="whatsapph"
                type="text"
                value={formData.whatsapp.whatsapph}
                onChange={(e) => setFormData({ ...formData, whatsapp: { ...formData.whatsapp, whatsapph: e.target.value } })}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            <div>
              <label htmlFor="whatsappinfo" className="mt-4 block text-sm font-medium leading-6 text-gray-900">Whatsapp Info</label>
              <input
                id="whatsappinfo"
                name="whatsappinfo"
                type="text"
                value={formData.whatsapp.whatsappinfo}
                onChange={(e) => setFormData({ ...formData, whatsapp: { ...formData.whatsapp, whatsappinfo: e.target.value } })}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            <div>
              <label htmlFor="whatsappbtn" className="mt-4 block text-sm font-medium leading-6 text-gray-900">Whatsapp Button Text</label>
              <input
                id="whatsappbtn"
                name="whatsappbtn"
                type="text"
                value={formData.whatsapp.whatsappbtn}
                onChange={(e) => setFormData({ ...formData, whatsapp: { ...formData.whatsapp, whatsappbtn: e.target.value } })}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <button type="submit" className="my-5 bg-primary text-white font-bold py-2 px-4 rounded w-full" disabled={loading}>
          {loading ? 'Saving Changes...' : 'Submit'}
          </button>
        </form>
      </div>
    </Layout>
  );
}



export async function getServerSideProps({ req, res }) {
return protectedroute(req);
}
