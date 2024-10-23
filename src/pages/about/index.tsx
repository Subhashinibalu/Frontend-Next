import Layout from '../../components/Layout';
import { useEffect, useState } from 'react';
import aboutdata from '../../server/client/about';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import getaboutdata from '../../server/client/getabout';
import { redirect } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import protectedroute from '../../protectedroute';
import fileappend from '../../append';
import axios from 'axios';


export default function About({token}) {
  const [data, setData] = useState({
    _id: '',
    abouttitle: '',
    aboutsub: '',
    aboutheading: '',
    aboutlist: [],
    aboutimgdiv: {
      aboutimg1: '',
      aboutinfo: '',
      aboutimg2: '',
    },
    aboutcarddiv: {
      aboutquestion: '',
      aboutanswer: '',
      aboutcards: [],
    },
    deletedAt: null,
  });
  const [loading, setLoading] = useState(false); // Loading state
  const [filevalue, setFileValue] = useState()
  const [aboutimg1, setaboutimg1]=useState('')
  const [aboutimg2, setaboutimg2]=useState('')
const router = useRouter();
  useEffect(() => {
    fetchExistingData();
  }, []);

  const fetchExistingData = async () => {

    try {
      const response = await getaboutdata(token);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const fetchedData = await response.json();

      
      setData(fetchedData.response[0]);
      const word1=fetchedData.response[0].aboutimgdiv.aboutimg1.split('/')
      setaboutimg1(word1[4]||"")
      const word2 =fetchedData.response[0].aboutimgdiv.aboutimg2.split('/')
      setaboutimg2(word2[4]||"")
    } catch (error) {
      console.error('Error fetching existing data:', error);
    }
      
    
  };

  const initialCard = { acardicon: '', acardtitle: '', acardcontent: '' };

 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAboutChange = (index, value) => {
    const updatedList = [...data.aboutlist];
    updatedList[index] = value;
    setData((prevData) => ({
      ...prevData,
      aboutlist: updatedList,
    }));
  };

  const addAbout = (e) => {
    e.preventDefault();
    const updatedList = [...data.aboutlist, '']; // Add an empty string
    setData((prevData) => ({
      ...prevData,
      aboutlist: updatedList,
    }));
  };
  const deleteAbout = (e, index) => {
    e.preventDefault();
    const updatedList = data.aboutlist.filter((_, i) => i !== index); // Remove the specific index
    setData((prevData) => ({
      ...prevData,
      aboutlist: updatedList,
    }));
  };
const addFields = (e) => {
  e.preventDefault();
  const updatedCards = [...data.aboutcarddiv.aboutcards, initialCard]; // Create a new array with the new card
  setData((prevData) => ({
    ...prevData,
    aboutcarddiv: {
      ...prevData.aboutcarddiv,
      aboutcards: updatedCards, // Update the aboutcards field
    },
  }));
};
const deleteFields = (e, index) => {
  e.preventDefault();
  let updatedFields = [...data.aboutcarddiv.aboutcards];
  updatedFields.splice(index, 1)
 
  
  setData((prevData) => ({
    ...prevData,
    aboutcarddiv: {
      ...prevData.aboutcarddiv,
      aboutcards: updatedFields, // Update the aboutcards field
    },
   
  }));
};

 
const handleimgChange = async (field, file) => {
  console.log({ file });
  
  const formData = new FormData();
  formData.append('file', file); // Append the file to FormData
if(field=="aboutimg1"){
  setaboutimg1(file.filename)
}
else{
  setaboutimg2(file.filename)
}
  try {
    const response = await axios.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Ensure the correct header is set
      },
    });
    console.log(file)

console.log(filevalue)
if (response.data ) {
      const url = response.data.blobUrl;
console.log({ url });
      setData((prevData) => ({
        ...prevData,
        aboutimgdiv: {
          ...prevData.aboutimgdiv,
          [field]: url, // Update the aboutimgdiv with the dynamic field name
        },
      }));

      // Handle successful response
      console.log('Upload successful:', response);
    } else {
      console.error('Unexpected response format:', response);
    }
  } catch (error) {
    console.error('Error uploading image:', error.response?.data || error.message);
  }
};





const handleCardChange = (index, field, value) => {
  const updatedCards = [...data.aboutcarddiv.aboutcards]; // Create a copy of the aboutcards array
  updatedCards[index] = {
    ...updatedCards[index], // Spread the existing card properties
    [field]: value, // Update the specific field with the new value
  };

  setData((prevData) => ({
    ...prevData,
    aboutcarddiv: {
      ...prevData.aboutcarddiv,
      aboutcards: updatedCards, // Update the aboutcards array
    },
  }));
};

const onSubmit = async (event) => {
  event.preventDefault();
  setLoading(true); // Start loading

  const payload = {
    abouttitle: data.abouttitle,
    aboutsub: data.aboutsub,
    aboutheading: data.aboutheading,
    aboutlist: data.aboutlist,
    aboutimgdiv: {
      aboutimg1: data.aboutimgdiv.aboutimg1, // Base64 string
      aboutinfo: data.aboutimgdiv.aboutinfo,
      aboutimg2: data.aboutimgdiv.aboutimg2, // Base64 string
    },
    aboutcarddiv: {
      aboutquestion: data.aboutcarddiv.aboutquestion,
      aboutanswer: data.aboutcarddiv.aboutanswer,
      aboutcards: data.aboutcarddiv.aboutcards,
    },
  };

  try {
    
    const response = await aboutdata(payload, token);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    fetchExistingData();
  } catch (error) {
    console.error('Error submitting data:', error);
  } finally {
    setLoading(false); // Stop loading
  }
};


  return (
    <Layout>
      <h1 className='text-center text-3xl font-bold mb-8 font-mono text-primary'>About Us Page Data</h1>
      <div className='w-full'>
        <form onSubmit={onSubmit}>
          <div className='grid grid-cols-2 gap-5 p-4 mb-5'>
            <div>
              <label htmlFor="abouttitle" className="mt-4 block text-sm font-medium leading-6 text-gray-900">Title</label>
              <div className="mt-1">
                <input
                  id="abouttitle"
                  name="abouttitle"
                  type="text"
                  value={data.abouttitle}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label htmlFor="aboutheading" className="mt-4 block text-sm font-medium leading-6 text-gray-900">Heading</label>
              <div className="mt-1">
                <input
                  id="aboutheading"
                  name="aboutheading"
                  type="text"
                  value={data.aboutheading}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div >
          <label htmlFor="aboutsub" className=" mt-9 block text-sm font-medium leading-6 text-gray-900">
              Subheading
            </label>
            <div className="mt-1 ">
              <input
                id="aboutsub"
                name="aboutsub"
                type="text"  
                value={data.aboutsub}            
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              </div>
          </div>
          </div>
          <hr/>

          <div className='grid grid-cols-2 gap-x-5 px-4 mt-10'>
            {data.aboutlist.map((input, index) => (
              <div key={index} className="inline">
                <label htmlFor={`aboutlist[${index}]`} className=" block text-sm font-medium leading-6 text-gray-900">{`About ${index + 1}`}</label>
                <div>
                  <textarea
                    id={`aboutlist[${index}]`}
                    name={`aboutlist[${index}]`}
                    rows={2}
                    value={input}
                    onChange={(e) => handleAboutChange(index, e.target.value)} // Update only the specific index
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
                {index === data.aboutlist.length - 1 && (
                  <button onClick={addAbout} className='inline bg-transparent mt-3 hover:bg-primary text-primary font-semibold hover:text-white py-2 px-4 border border-primary hover:border-white rounded-full h-10 w-32'>
                    Add More
                  </button>
                )}
                {index !== 0 && (
                  <button onClick={(e) => deleteAbout(e, index)} className="bg-primary hover:bg-white hover:text-black float-end mt-4 text-white font-bold py-2 px-4 rounded-full mb-4">
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>

         
        
   
          <div className='grid grid-cols-2 p-4 gap-5'>
    {/* aboutsub*/}


                {/* image div */}
  <div>
  <label htmlFor="aboutimg1" className=" mt-4 block text-sm font-medium leading-6 text-gray-900">
             First Image Source
            </label>
            <div className='focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ring-1 ring-gray-300 rounded-md'>
             
              <input
                id="aboutimg1"
                name="aboutimg1"
                type="file"  
                // value={data.aboutimgdiv.aboutimg1}          
                onChange={(e)=>handleimgChange('aboutimg1',e.target.files[0])}  
                className={aboutimg1?"w-24  rounded-md border-0 py-1.5   text-transparent ":"w-3/4  rounded-md border-0 py-1.5 text-gray-900   "}
                />{aboutimg1}
              </div>
              <label htmlFor="aboutinfo" className=" mt-4 block text-sm font-medium leading-6 text-gray-900">
              Info
            </label>
            <div className="mt-1 ">
              <input
                id="aboutinfo"
                name="aboutinfo"
                type="text"            
                value={data.aboutimgdiv.aboutinfo}
                onChange={(e)=>handleimgChange('aboutinfo',e.target.value)}  
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              </div>
              <label htmlFor="aboutimg2" className=" mt-4 block text-sm font-medium leading-6 text-gray-900">
              Second Image Source
            </label>  
            <div className='focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ring-1 ring-gray-300 rounded-md'> 
              <input
                id="aboutimg2"
                name="aboutimg2"
                type="file"       
                // value={data.aboutimgdiv.aboutimg2}
               
                onChange={(e)=>handleimgChange('aboutimg2',e.target.files[0])}       
                className={aboutimg2?"w-24  rounded-md border-0 py-1.5   text-transparent ":"w-3/4  rounded-md border-0 py-1.5 text-gray-900   "}
                />{aboutimg2}
              </div>
  </div>
  {/* Question and answer */}

  <div>
  <label htmlFor="aboutquestion" className=" mt-4 block text-sm font-medium leading-6 text-gray-900">
            Question
            </label>
            <div className="mt-1 ">
              <input
                id="aboutquestion"
                name="aboutquestion"
                type="text" 
                value={data.aboutcarddiv.aboutquestion}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              </div>
              <label htmlFor="aboutanswer" className=" mt-4 block text-sm font-medium leading-6 text-gray-900">
              Answer
            </label>
            <div className="mt-1 ">
              <input
                id="aboutanswer"
                name="aboutanswer"
                type="text"            
                value={data.aboutcarddiv.aboutanswer}
                onChange={handleChange}  
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              </div>
            
  </div>
  
  {/* aboutcard */}
  {data.aboutcarddiv.aboutcards.map((inputField, index) => (
                
                <div key={index} className="border p-4 rounded-md">
                  <h3 className="font-bold text-lg mb-4">Card {index + 1}</h3>
                  <label htmlFor={`acardicon-${index}`} className="block text-sm font-medium mb-1">Card Icon</label>
                  <input
                    id={`acardicon-${index}`}
                    name={`acardicon-${index}`}
                    type="text"
                    value={inputField.acardicon}
                    onChange={(e) => handleCardChange(index, 'acardicon', e.target.value)}
                    className="block w-full rounded-md border py-1.5"
                  />
                  <label htmlFor={`acardtitle-${index}`} className="block text-sm font-medium mb-1">Card Title</label>
                  <input
                    id={`acardtitle-${index}`}
                    name={`acardtitle-${index}`}
                    type="text"
                    value={inputField.acardtitle}
                    onChange={(e) => handleCardChange(index, 'acardtitle', e.target.value)}
                    className="block w-full rounded-md border py-1.5"
                  />
                  <label htmlFor={`acardcontent-${index}`} className="block text-sm font-medium mb-1">Card Content</label>
                  <input
                    id={`acardcontent-${index}`}
                    name={`acardcontent-${index}`}
                    type="text"
                    value={inputField.acardcontent}
                    onChange={(e) => handleCardChange(index, 'acardcontent', e.target.value)}
                    className="block w-full rounded-md border py-1.5"
                  />
                 {index ==data.aboutcarddiv.aboutcards.length - 1?<button onClick={(e)=>addFields(e)} className='inline bg-transparent hover:bg-primary text-primary font-semibold hover:text-white py-2 px-4 border border-primary mt-4 hover:border-white rounded-full h-10 w-32'>Add More</button>:null}
                {index!=0 && <button onClick={(e)=>deleteFields(e,index)} className="bg-primary hover:bg-white hover:text-black float-end mt-4 text-white font-bold py-2 px-4 rounded-full">Remove</button>}
                </div>
              ))}
</div>

          {/* Rest of your form elements go here... */}

          <button type="submit" className='  bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded w-full my-5' disabled={loading}>
          {loading ? 'Saving Changes...' : 'Submit'}
          </button>
        </form>
      </div>
    </Layout>
  );
}


// getserversidep

export async function getServerSideProps({ req }) {
return protectedroute(req);    
}
