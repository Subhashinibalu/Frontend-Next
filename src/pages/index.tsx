
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import homedata from "../server/client/home";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import gethomedata from "../server/client/gethome";
import { jwtDecode } from "jwt-decode";
import protectedroute from "../protectedroute";
import axios from "axios";
import FormData from 'form-data';
import index from './forget/index';

export default function Home({token}) { 
  
  const [formData, setFormData] = useState({
    _id:'',
    about:{ aboutheading: '',aboutinfo1: '',aboutspan: '',aboutinfo2: '',aboutbutton: '',},             
   ratingImg: '',
   youtube:{ youtubeheading: '',youtubep1: '',youtubep2: '',youtubevideosrc: ''},
   reasons: {reasonheading: '',reasoninfo1: '', reasoninfo2: '',reason: [{reasonimg: '',reasonh4: '',reasoncolor: '',reasonp1: '', reasonp2: '',},],},
   features: {featuresTitle: '',featureslist: [{featurename: '',color: '',logo: '',description: '',lists: [''],featureimg: '',textcolor: '',},],},
   animation: {animeh2: '',animep: '',animeimages1: [{anime1img: '',anime1class: '',},],animeimages2: [{anime2img: '',anime2class: '',},],animeimages3: [{anime3img: '',anime3class: '',},],},
   customerfeedback: {feedbackh1: '',detail: [{ img: '', by: '', who: '', feedback: '' }],},
   signup: {signuph1: '',signupspan: '',signupbtn: '', signupimg: '',},
   faq: {faqh1: '',questions: [{ q: '', a: '' }],},
   start: {starth1: '', starth2: '',starth3: '',startbtn: '',},
     caro: {caroh: '',carospan: '',carop: '',carobtn: '',div1img: [''],div2img: [''],div3img: [''], }, 
                  });
  
 
 const [loading, setLoading] = useState(false); // Loading state
 const [ratingimg,setratingimg] = useState([])
 const [featurelogo, setfeaturelogo] = useState([])
 const [featureimg, setfeatureimg] = useState([])
 const [reasonimg, setreasonimg] = useState([])
 const [anime1img, setanime1img] = useState([])
 const [anime2img, setanime2img] = useState([])
 const [anime3img, setanime3img] = useState([])
 const [feedbackimg, setfeedbackimg] =useState([])
 const [signupimg, setsignupimg] = useState([])
 const [caroimg, setcaroimg] = useState({
  div1img: [],
  div2img: [],
  div3img: []
});
  const router = useRouter();
                 
  useEffect(() => {
      fetchExistingData();
           }, []);
                
  const fetchExistingData = async () => {
       
    try {
      const response = await gethomedata(token);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const fetchedData = await response.json();
      
      setFormData(fetchedData.response[0]);
      fetchedData.response[0].features.featureslist.map((ele)=>{
        const logoname= ele.logo.split('/')
        const imgname= ele.featureimg.split('/')
        setfeaturelogo(prevLogo => [...prevLogo,logoname[4]||""])

        setfeatureimg(prevImg => [...prevImg,imgname[4]||""])

        
      })
      fetchedData.response[0].reasons.reason.map((ele)=>{
        const reasonimg=ele.reasonimg.split('/')
        setreasonimg(prevReasonimg => [...prevReasonimg,reasonimg[4]||""])

      })
      fetchedData.response[0].animation.animeimages1.map((ele)=>{
        const anime1img=ele.anime1img.split('/')
        setanime1img(prevAnime1img => [...prevAnime1img,anime1img[4]||""])
      })
      fetchedData.response[0].animation.animeimages2.map((ele)=>{
        const anime2img=ele.anime2img.split('/')
        setanime2img(prevAnime1img => [...prevAnime1img,anime2img[4]||""])
      })
      fetchedData.response[0].animation.animeimages3.map((ele)=>{
        const anime3img=ele.anime3img.split('/')
        setanime3img(prevAnime1img => [...prevAnime1img,anime3img[4]||""])
      })
      fetchedData.response[0].customerfeedback.detail.map((ele)=>{
        const feedbackimg=ele.img.split('/')
        setfeedbackimg(prevFeedbackimg => [...prevFeedbackimg,feedbackimg[4]||""])
      })
      const signimg=fetchedData.response[0].signup.signupimg.split('/')
      setsignupimg(signimg[4]||"")
      const ratimg=fetchedData.response[0].ratingImg.split('/')
      setratingimg(ratimg[4]||"")
      fetchedData.response[0].caro.div1img.forEach((img) => {
        const caroimgArray = img.split('/');
        setcaroimg(prevCaroimg => ({
          ...prevCaroimg,
          div1img: [...prevCaroimg.div1img, caroimgArray[4] || ""]
        }));
      });
    
      fetchedData.response[0].caro.div2img.forEach((img) => {
        const caroimgArray = img.split('/');
        setcaroimg(prevCaroimg => ({
          ...prevCaroimg,
          div2img: [...prevCaroimg.div2img, caroimgArray[4] || ""]
        }));
      });
    
      fetchedData.response[0].caro.div3img.forEach((img) => {
        const caroimgArray = img.split('/');
        setcaroimg(prevCaroimg => ({
          ...prevCaroimg,
          div3img: [...prevCaroimg.div3img, caroimgArray[4] || ""]
        }));
      });
      //
    } catch (error) {
      console.error('Error fetching existing data:', error);
    }
      
                  };
                  // handle rating img change
 const handleratingimgChange=async(field,file)=>{
  console.log({ file });
  
    const formfileData = new FormData();
    formfileData.append('file', file); // Append the file to FormData
  setratingimg(file.filename)
    try {
      const response = await axios.post('/api/upload', formfileData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Ensure the correct header is set
        },
      });
      if (response.data ) {
        const url = response.data.blobUrl; // No need for await here
        console.log({ url });
  
        // Update the state with the new URL
        setFormData((prevData) => ({
          ...prevData,
          [field]: url, // Update the specified field
        }));
  
        console.log('Data after update:', { ...formData, [field]: url }); // Log updated state
        console.log('Upload successful:', response);
      } else {
        console.error('Unexpected response format:', response);
      }
    } catch (error) {
      console.error('Error uploading image:', error.response?.data || error.message);
    }
   
  
                  }

const handleNestedInputChange = (parentField, childField) => (e) => {
  const { value } = e.target;
  setFormData((prevData) => ({
    ...prevData,
    [parentField]: {
      ...prevData[parentField],
      [childField]: value,
    },
  }));
};
const handleNestedInputimgChange =async (parentField, childField,file)=>  {
  
  const formfileData = new FormData();
  formfileData.append('file', file); // Append the file to FormData
if(parentField=="signup"){
  setsignupimg(file.name)
}
  try {
    const response = await axios.post('/api/upload', formfileData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Ensure the correct header is set
      },
    });
    if (response.data ) {
      const url = response.data.blobUrl; // No need for await here
      console.log({ url });
      setFormData((prevData) => ({
        ...prevData,
        [parentField]: {
          ...prevData[parentField],
          [childField]: url,
        },
      }));
     
      console.log('Data after update:', { ...formData, [childField]: url }); // Log updated state
      console.log('Upload successful:', response);
    } else {
      console.error('Unexpected response format:', response);
    }
  } catch (error) {
    console.error('Error uploading image:', error.response?.data || error.message);
  }
};

const handleFeatureChange = (index, e) => {
  const { name, value } = e.target;

  setFormData((prevData) => {
    const updatedFeaturesList = [...prevData.features.featureslist];
    updatedFeaturesList[index] = {
      ...updatedFeaturesList[index],
      [name]: value,
    };

    return {
      ...prevData,
      features: {
        ...prevData.features,
        featureslist: updatedFeaturesList,
      },
    };
  });
};
const handleFeatureimgChange =async (index, field, file) => {
  console.log({ file });
  
  const formfileData = new FormData();
  formfileData.append('file', file); // Append the file to FormData
  if(field=="logo"){
    featurelogo[index]= file.filename;

  }
  else{
  featureimg[index]= file.filename;
  }
  try {
    const response = await axios.post('/api/upload', formfileData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Ensure the correct header is set
      },
    });

    if (response.data ) {
      const url = response.data.blobUrl; // No need for await here
      console.log({ url });

      // Update the state with the new URL
      setFormData((prevData) => {
        const updatedFeaturesList = [...prevData.features.featureslist];
        
        updatedFeaturesList[index] = {
          ...updatedFeaturesList[index],
          [field]: url, // Use the result from FileReader
        };
        return {
          ...prevData,
          features: {
            ...prevData.features,
            featureslist: updatedFeaturesList,
          },
        };
      });
      

      console.log('Data after update:', { ...formData, [field]: url }); // Log updated state
      console.log('Upload successful:', response);
    } else {
      console.error('Unexpected response format:', response);
    }
  } catch (error) {
    console.error('Error uploading image:', error.response?.data || error.message);
  }
};

const handleCaroImgChange =async (index, imgArray,e) =>{
  e.preventDefault();
  const formfileData = new FormData();
  const file = e.target.files[0];
    formfileData.append('file', file); // Append the file to FormData
  if(imgArray=="div1img"){
    caroimg.div1img[index]= file.filename;
  }
  else if(imgArray=="div2img"){
    caroimg.div2img[index]= file.filename;
  }
  else{
    caroimg.div3img[index]= file.filename;
  }
    try {
      const response = await axios.post('/api/upload', formfileData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Ensure the correct header is set
        },
      });
      if (response.data ) {
        const url = response.data.blobUrl; // No need for await here
        console.log({ url });
        const newData = [...formData.caro[imgArray]];
        newData[index] = url;
        setFormData({ ...formData, caro: { ...formData.caro, [imgArray]: newData } });
 
        console.log('Data after update:', { ...formData, caro: { ...formData.caro, [imgArray]: newData } }); // Log updated state
        console.log('Upload successful:', response);
      } else {
        console.error('Unexpected response format:', response);
      }
    } catch (error) {
      console.error('Error uploading image:', error.response?.data || error.message);
    }
  
};

const addCaroImg = (imgArray) => (e) => {
  e.preventDefault();
  setFormData({ ...formData, caro: { ...formData.caro, [imgArray]: [...formData.caro[imgArray], ''] } });
};

const deleteCaroImg = (index, imgArray) => (e) => {
  e.preventDefault();
  const newData = [...formData.caro[imgArray]];
  newData.splice(index, 1);
  setFormData({ ...formData, caro: { ...formData.caro, [imgArray]: newData } });
};

  const handleAnimeImgChange = async(e, index, imgArray, field) => {
    const file= e.target.files[0];
  
    const formfileData = new FormData();
    formfileData.append('file', file); // Append the file to FormData
    if(field=="anime1img"){
      anime1img[index]= file.filename;
    }
    else if(field=="anime2img"){
      anime2img[index]= file.filename;
    }
    else{
      anime3img[index]= file.filename;
    }
  
    try {
      const response = await axios.post('/api/upload', formfileData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Ensure the correct header is set
        },
      });
      if (response.data ) {
        const url = response.data.blobUrl; // No need for await here
        console.log({ url });
  
        setFormData((prevData) => ({
          ...prevData,
          animation: {
            ...prevData.animation,
            [imgArray]: prevData.animation[imgArray].map((imgObj, idx) => 
              idx === index ? { ...imgObj, [field]: url } : imgObj
            ),
          },
        }));
  
        console.log('Data after update:', { ...formData, [field]: url }); // Log updated state
        console.log('Upload successful:', response);
      } else {
        console.error('Unexpected response format:', response);
      }
    } catch (error) {
      console.error('Error uploading image:', error.response?.data || error.message);
    }

  };
  const handleanimeclasschange = (event, index, imgArray, field) => {
    const value = event.target.value; // Get the input value
    setFormData((prevData) => ({
      ...prevData,
      animation: {
        ...prevData.animation,
        [imgArray]: prevData.animation[imgArray].map((imgObj, idx) => 
          idx === index ? { ...imgObj, [field]: value } : imgObj
        ),
      },
    }));
  };
  

const handleFaqimgChange = async(parentField,childField,index,field,file) => {
   // You might want to check if `e` is defined or if you need it at all.
   console.log({ file });
  
   const formfileData = new FormData();
   formfileData.append('file', file); // Append the file to FormData
   if(parentField=="reasons"){
    reasonimg[index]=file.filename;
   }
   else if(parentField=="customerfeedback"){
    feedbackimg[index]=file.filename;
   }
 
   try {
     const response = await axios.post('/api/upload', formfileData, {
       headers: {
         'Content-Type': 'multipart/form-data', // Ensure the correct header is set
       },
     });
 
     if (response.data) {
       const url = response.data.blobUrl; // No need for await here
       console.log({ url });
 
       // Update the state with the new URL
       const newData = [...formData[parentField][childField]];
       newData[index] = {
         ...newData[index],
         [field]: url,
       };
       setFormData({
         ...formData,
         [parentField]: {
           ...formData[parentField],
           [childField]: newData,
         },
       });
 
       console.log('Data after update:', { ...formData, [field]: url }); // Log updated state
       console.log('Upload successful:', response);
     } else {
       console.error('Unexpected response format:', response);
     }
   } catch (error) {
     console.error('Error uploading image:', error.response?.data || error.message);
   }
  

}
const handleFaqChange = (parentField,childField,index, field)=>(e) => {
  const newData = [...formData[parentField][childField]];
  newData[index] = {
    ...newData[index],
    [field]: e.target.value,
  };
  setFormData({
    ...formData,
    [parentField]: {
      ...formData[parentField],
      [childField]: newData,
    },
  });
}; 
const updateAbout = async (e) => {
  e.preventDefault();
  setLoading(true); // Set loading to true at the start
  try {
    console.log('Updating',formData.ratingImg)
    const { _id, about} = formData; // Destructure the necessary fields
    const response = await homedata(
      { _id, about}, // Include both fields you want to update
      token
    );
    console.log('About updated successfully:', response);
  } catch (error) {
    console.error('Error updating about:', error.response?.data || error.message);
  } finally {
    setLoading(false); // Ensure loading is set to false in both success and error cases
  }
};

const updateRatingimg =async (e)=>{
  e.preventDefault();
  setLoading(true); // Set loading to true at the start
  try {
 
    const { _id, ratingImg} = formData; // Destructure the necessary fields
    const response = await homedata(
      { _id, ratingImg}, // Include both fields you want to update
      token
    );
    console.log('About updated successfully:', response);
  } catch (error) {
    console.error('Error updating about:', error.response?.data || error.message);
  } finally {
    setLoading(false); // Ensure loading is set to false in both success and error cases
  }

}
const updatefeature = async (e) => {
  e.preventDefault();
  setLoading(true); // Set loading to true at the start
  try {
    const { _id, features } = formData; // Extract _id and features
   

    const response = await homedata(
      { _id, features}, // Send only the feature data
      token
    );

    console.log('Feature updated successfully:', response);
  } catch (error) {
    console.error('Error updating feature:', error.response?.data || error.message);
  } finally {
    setLoading(false); // Ensure loading is set to false in both success and error cases
  }
};
const updateyoutube = async (e) => {
  e.preventDefault();
  setLoading(true); // Set loading to true at the start
  try {
    const { _id, youtube } = formData; // Extract _id and features
   

    const response = await homedata(
      { _id, youtube}, // Send only the feature data
      token
    );

    console.log('youtube updated successfully:', response);
  } catch (error) {
    console.error('Error updating youtube:', error.response?.data || error.message);
  } finally {
    setLoading(false); // Ensure loading is set to false in both success and error cases
  }
};
const updatereason = async (e) => {
  e.preventDefault();
  setLoading(true); // Set loading to true at the start
  try {
    const { _id, reasons } = formData; // Extract _id and features
   

    const response = await homedata(
      { _id, reasons}, // Send only the feature data
      token
    );

    console.log('reasons updated successfully:', response);
  } catch (error) {
    console.error('Error updating reasons:', error.response?.data || error.message);
  } finally {
    setLoading(false); // Ensure loading is set to false in both success and error cases
  }
};
const updateanime = async (e) => {
  e.preventDefault();
  setLoading(true); // Set loading to true at the start
  try {
    const { _id, animation } = formData; // Extract _id and features
   

    const response = await homedata(
      { _id, animation}, // Send only the feature data
      token
    );

    console.log('animation updated successfully:', response);
  } catch (error) {
    console.error('Error updating animation:', error.response?.data || error.message);
  } finally {
    setLoading(false); // Ensure loading is set to false in both success and error cases
  }
};
const updatefeed = async (e) => {
  e.preventDefault();
  setLoading(true); // Set loading to true at the start
  try {
    const { _id, customerfeedback } = formData; // Extract _id and features
   

    const response = await homedata(
      { _id, customerfeedback}, // Send only the feature data
      token
    );

    console.log('feedback updated successfully:', response);
  } catch (error) {
    console.error('Error updating feedback:', error.response?.data || error.message);
  } finally {
    setLoading(false); // Ensure loading is set to false in both success and error cases
  }
};
const updatesignup = async (e) => {
  e.preventDefault();
  setLoading(true); // Set loading to true at the start
  try {
    const { _id, signup } = formData; // Extract _id and features
   

    const response = await homedata(
      { _id, signup}, // Send only the feature data
      token
    );

    console.log('signup updated successfully:', response);
  } catch (error) {
    console.error('Error updating signup:', error.response?.data || error.message);
  } finally {
    setLoading(false); // Ensure loading is set to false in both success and error cases
  }
};
const updatefaq = async (e) => {
  e.preventDefault();
  setLoading(true); // Set loading to true at the start
  try {
    const { _id, faq} = formData; // Extract _id and features
   

    const response = await homedata(
      { _id, faq}, // Send only the feature data
      token
    );

    console.log('faq updated successfully:', response);
  } catch (error) {
    console.error('Error updating faq:', error.response?.data || error.message);
  } finally {
    setLoading(false); // Ensure loading is set to false in both success and error cases
  }
};
const updatestart = async (e) => {
  e.preventDefault();
  setLoading(true); // Set loading to true at the start
  try {
    const { _id, start} = formData; // Extract _id and features
   

    const response = await homedata(
      { _id, start}, // Send only the feature data
      token
    );

    console.log('start updated successfully:', response);
  } catch (error) {
    console.error('start updating faq:', error.response?.data || error.message);
  } finally {
    setLoading(false); // Ensure loading is set to false in both success and error cases
  }
};
const updateCaro = async(e)=>{
  e.preventDefault();
  try {
    const _id = formData._id;
    const response = await homedata({_id, caro:formData.caro}, token);

    console.log('Caro updated successfully:', response);
    setLoading(false);
  } catch (error) {
    console.error('Error updating caro:', error.response?.data || error.message);
    setLoading(false);
  }
}
  ///form submission
  const handleSubmit = async (event) => {
 

    event.preventDefault();
    setLoading(true); // Start loading
    const payload = {
      
      about: {
        aboutheading: formData.about.aboutheading,
        aboutinfo1: formData.about.aboutinfo1,
        aboutspan: formData.about.aboutspan,
        aboutinfo2: formData.about.aboutinfo2,
        aboutbutton: formData.about.aboutbutton,
      },
      ratingImg: formData.ratingImg,
      youtube: {
        youtubeheading: formData.youtube.youtubeheading,
        youtubep1: formData.youtube.youtubep1,
        youtubep2: formData.youtube.youtubep2,
        youtubevideosrc: formData.youtube.youtubevideosrc,
      },
      reasons: {
        reasonheading: formData.reasons.reasonheading,
        reasoninfo1: formData.reasons.reasoninfo1,
        reasoninfo2: formData.reasons.reasoninfo2,
        reason: formData.reasons.reason
          .filter(reason => 
            reason.reasonimg !== '' &&
            reason.reasonh4 !== '' &&
            reason.reasoncolor !== '' &&
            reason.reasonp1 !== '' &&
            reason.reasonp2 !== ''
          )
          .map(reason => ({
            reasonimg: reason.reasonimg,
            reasonh4: reason.reasonh4,
            reasoncolor: reason.reasoncolor,
            reasonp1: reason.reasonp1,
            reasonp2: reason.reasonp2,
          })),
      },
      features: {
        featuresTitle: formData.features.featuresTitle,
        featureslist: formData.features.featureslist
          .filter(feature => 
            feature.featurename !== '' &&
            feature.color !== '' &&
            feature.logo !== '' &&
            feature.description !== '' &&
            feature.lists.filter(item => item !== '').length > 0 // Ensure lists is not empty
          )
          .map(feature => ({
            featurename: feature.featurename,
            color: feature.color,
            logo: feature.logo,
            description: feature.description,
            lists: feature.lists.filter(item => item !== ''), // Filter empty list items
            featureimg: feature.featureimg,
            textcolor: feature.textcolor,
          })),
      },
      animation: {
        animeh2: formData.animation.animeh2,
        animep: formData.animation.animep,
        animeimages1: formData.animation.animeimages1
          .filter(image => image.anime1img !== '' && image.anime1class !== '')
          .map(image => ({
            anime1img: image.anime1img,
            anime1class: image.anime1class,
          })),
        animeimages2: formData.animation.animeimages2
          .filter(image => image.anime2img !== '' && image.anime2class !== '')
          .map(image => ({
            anime2img: image.anime2img,
            anime2class: image.anime2class,
          })),
        animeimages3: formData.animation.animeimages3
          .filter(image => image.anime3img !== '' && image.anime3class !== '')
          .map(image => ({
            anime3img: image.anime3img,
            anime3class: image.anime3class,
          })),
      },
      customerfeedback: {
        feedbackh1: formData.customerfeedback.feedbackh1,
        detail: formData.customerfeedback.detail
          .filter(feedback => feedback.img !== '' && feedback.by !== '' && feedback.who !== '' && feedback.feedback !== '')
          .map(feedback => ({
            img: feedback.img,
            by: feedback.by,
            who: feedback.who,
            feedback: feedback.feedback,
          })),
      },
      signup: {
        signuph1: formData.signup.signuph1,
        signupspan: formData.signup.signupspan,
        signupbtn: formData.signup.signupbtn,
        signupimg: formData.signup.signupimg,
      },
      faq: {
        faqh1: formData.faq.faqh1,
        questions: formData.faq.questions
          .filter(q => q.q !== '' && q.a !== '')
          .map(q => ({
            q: q.q,
            a: q.a,
          })),
      },
      start: {
        starth1: formData.start.starth1,
        starth2: formData.start.starth2,
        starth3: formData.start.starth3,
        startbtn: formData.start.startbtn,
      },
      caro: {
        caroh: formData.caro.caroh,
        carospan: formData.caro.carospan,
        carop: formData.caro.carop,
        carobtn: formData.caro.carobtn,
        div1img: formData.caro.div1img.filter(img => img !== ''), // Filter out empty images
        div2img: formData.caro.div2img.filter(img => img !== ''), // Filter out empty images
        div3img: formData.caro.div3img.filter(img => img !== ''), // Filter out empty images
      },
    };
    
    try {
      const response = await homedata(formData, token);
      const data = await response.json();
      fetchExistingData();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setTimeout(()=>{
       
        setLoading(false);
      },1000) }
        
  };
// for feature images
const addFields = (e, index) => {
  e.preventDefault();
  setFormData((prevFormData) => {
    const updatedFeatures = [...prevFormData.features.featureslist];
    updatedFeatures[index].lists.push("");
    return {
      ...prevFormData,
      features: {
        ...prevFormData.features,
        featureslist: updatedFeatures,
      },
    };
  });
};
const deleteFields = (e, i, index) => {
  e.preventDefault();
  setFormData((prevFormData) => {
    const updatedFeatures = [...prevFormData.features.featureslist];
    updatedFeatures[index].lists.splice(i, 1);
    return {
      ...prevFormData,
      features: {
        ...prevFormData.features,
        featureslist: updatedFeatures,
      },
    };
  });
};
//for faq data
const addField = (parentField, childField, e, obj) => {
  e.preventDefault();
  setFormData((prevFormData) => ({
    ...prevFormData,
    [parentField]: {
      ...prevFormData[parentField],
      [childField]: [...prevFormData[parentField][childField], { ...obj }],
    },
  }));
};
const deleteField = (parentField, childField, e, index) => {
  e.preventDefault();
  setFormData((prevFormData) => {
    const newData = [...prevFormData[parentField][childField]];
    newData.splice(index, 1);
    return {
      ...prevFormData,
      [parentField]: {
        ...prevFormData[parentField],
        [childField]: newData,
      },
    };
  });
};



  return (
    <Layout>
      <h1 className='text-center text-3xl mb font-bold mb-8 font-mono text-primary'>Home Page Data</h1>
      <div className="w-full">
<form>
  <div className="grid grid-cols-2 gap-5 p-4 ">
    {/* about */}
<div>
<label htmlFor="aboutheading" className=" mt-4 block text-sm font-medium leading-6 text-gray-900">
              About Heading
            </label>
            <div className="mt-1 ">
              <input
                id="aboutheading" name="aboutheading" type="text" value={formData.about.aboutheading} onChange={handleNestedInputChange('about','aboutheading')}           
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              </div>
              <label htmlFor="aboutinfo1" className=" mt-4 block text-sm font-medium leading-6 text-gray-900">
              Info 1
            </label>
            <div className="mt-1 ">
              <input
                id="aboutinfo1"
                name="aboutinfo1"
                type="text"
                value={formData.about.aboutinfo1} 
                onChange={handleNestedInputChange('about','aboutinfo1')}                               
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              </div>
              <label htmlFor="aboutspan" className=" mt-4 block text-sm font-medium leading-6 text-gray-900">
              Span data
            </label>
            <div className="mt-1 ">
              <input
                id="aboutspan"
                name="aboutspan"
                type="text"
                value={formData.about.aboutspan}              
                onChange={handleNestedInputChange('about','aboutspan')}                  
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              </div>
         
            

</div>
<div>
<label htmlFor="aboutinfo2" className=" mt-4 block text-sm font-medium leading-6 text-gray-900">
              More Info
            </label>
            <div className="mt-1 ">
              <input
                id="aboutinfo2"
                name="aboutinfo2"
                type="text"   
                value={formData.about.aboutinfo2}
                onChange={handleNestedInputChange('about','aboutinfo2')}                            
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              </div>
              <label htmlFor="aboutbutton" className=" mt-4 block text-sm font-medium leading-6 text-gray-900">
              Button Content
            </label>
            <div className="mt-1 ">
              <input
                id="aboutbutton"
                name="aboutbutton"
                value={formData.about.aboutbutton}
                onChange={handleNestedInputChange('about','aboutbutton')} 
                type="text"                              
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              </div>
       
</div>
  
  </div>
  <button onClick={(e)=>updateAbout(e)} className="bg-primary hover:bg-blue-200 hover:text-black w-fit float-end px-4 py-2 text-white p-1 rounded-full">Update</button>
  
<hr className="mx-10 mb-10 mt-16"/>
  <div className="grid grid-cols-2 gap-5 p-4 ">
    <div>
    <label htmlFor="ratingImg" className=" mt-4 block text-sm font-medium leading-6 text-gray-900">
            Rating Image
            </label>
            <div className='focus:ring-2 mt-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ring-1 ring-gray-300 rounded-md'>
             
              <input
                id="ratingImg"
                onChange={(e)=>handleratingimgChange('ratingImg',e.target.files[0])} 
                name="ratingImg"
                type="file"
                // value={formData.ratingImg}
                className={ratingimg?"w-24  rounded-md border-0 py-1.5   text-transparent ":"w-3/4  rounded-md border-0 py-1.5 text-gray-900   "}
                /><span>{ratingimg}</span>
              </div>
    </div>

  </div>
  <button onClick={(e)=>updateRatingimg(e)} className="bg-primary hover:bg-blue-200 hover:text-black w-fit float-end px-4 py-2 text-white p-1 rounded-full">Update</button>
  
  <hr className="mx-10 mb-10 mt-16"/>
  {/* features */}
  <div>
  <div className="grid grid-cols-2 gap-5 p-4">
    <div>
          {/* featuretitle*/}
<label htmlFor="featuretitle" className=" mt-9 block text-sm font-medium leading-6 text-gray-900">
              Feature Title
            </label>
            <div className="mt-1 ">
              <input
                id="featuretitle"
                name="featuretitle"
                value={formData.features.featuresTitle}
             
                onChange={handleNestedInputChange('features', 'featuresTitle')}
                type="text"              
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              </div>
    </div>

</div>
<div className="grid grid-cols-2 gap-5 p-4 ">
  {/* featuretitle */}

{/* features object */}
{formData.features.featureslist.map((input,index)=>{ 
  
  return(<div key={index} className="inline">
      <label htmlFor={`featurename-${index}`} className=" mt-10 block text-sm font-medium leading-6 text-gray-900">
              {`Feature ${index+1}`}
              </label>
              <div className="mt-1 ">
                <input
              
                  name="featurename"
                  type="text"
                  data-idx={index}
                  id={`featurename-${index}`}
                  value={input.featurename}
                  onChange={(e) => handleFeatureChange(index, e)}
                  
                               
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                </div>
                <label htmlFor={`color-${index}`} className=" mt-10 block text-sm font-medium leading-6 text-gray-900">
              {`Text color ${index+1}`}
              </label>
              <div className="mt-1 ">
                <input
                  id={`color-${index}`}
                  name="color"
                  type="text"
                  data-idx={index}
                  value={input.color}
                  onChange={(e) => handleFeatureChange(index, e)}
                            
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                </div>
                <label htmlFor={`logo-${index}`} className=" mt-10 block text-sm font-medium leading-6 text-gray-900">
              {`Logo ${index+1}`}
              </label>
              <div className='focus:ring-2 mt-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ring-1 ring-gray-300 rounded-md'>
             
                <input
                  id={`logo-${index}`} 
                  name="logo"
                  type="file"
                  data-idx={index}
                  // value={input.logo}
                  onChange={(e) => handleFeatureimgChange(index,'logo', e.target.files[0])}
                  className={featurelogo[index]?"w-24  rounded-md border-0 py-1.5   text-transparent ":"w-3/4  rounded-md border-0 py-1.5 text-gray-900   "}
                /><span>{featurelogo[index]}</span>
                </div>
                <label htmlFor={`description-${index}`} className=" mt-10 block text-sm font-medium leading-6 text-gray-900">
              {`Description ${index+1}`}
              </label>
              <div className="mt-1 ">
                <textarea
                  id={`description-${index}`}
                  name="description"
                  rows={2}
                  data-idx={index}
                  value={input.description}
                  onChange={(e) => handleFeatureChange(index, e)}      
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                </div>

{input.lists.map((listItem, listIndex)=>{
  return(<div key={listIndex}>
    <label htmlFor={`list-${index}-${listIndex}`} className=" mt-10 block text-sm font-medium leading-6 text-gray-900">
              {`List Item ${listIndex+1}`}
              </label>
              <div className="mt-1 ">
                <input
                  id={`list-${index}-${listIndex}`}
                  type="text"
                  value={listItem}
                  
                  onChange={(e) => {
                    const updatedFeatures = [...formData.features.featureslist];
                    updatedFeatures[index].lists[listIndex] = e.target.value;
                    setFormData({
                      ...formData,
                      features: {
                        ...formData.features,
                        featureslist: updatedFeatures,
                      },
                    });
                  }}
                  
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                </div>
                {listIndex === input.lists.length - 1 && (
            <button onClick={(e) => addFields(e, index)} className='inline bg-transparent mt-3 hover:bg-primary text-primary font-bold hover:text-white py-2 px-4 border border-primary hover:border-white rounded-full h-fit w-fit p-3'> + </button>
          )}
          {listIndex !== 0 && (
            <button onClick={(e) => deleteFields(e, listIndex, index)} className='inline mt-3 hover:bg-white text-white font-bold hover:text-black py-2 px-4 border border-primary hover:border-black rounded-full h-fit w-fit p-3 float-end bg-primary'>-</button>
          )} </div>)
})}

                
                <label htmlFor={`featureimg-${index}`} className=" mt-10 block text-sm font-medium leading-6 text-gray-900">
              {`Image ${index+1}`}
              </label>
            <div className='focus:ring-2 mt-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ring-1 ring-gray-300 rounded-md'>
             
                <input
                  id={`featureimg-${index}`}
                  name="featureimg"
                  type="file"
                  data-idx={index}
                  // value={input.featureimg}
                  onChange={(e) => handleFeatureimgChange(index,'featureimg', e.target.files[0])} 
                          
                   className={featureimg[index]?"w-24  rounded-md border-0 py-1.5   text-transparent ":"w-3/4  rounded-md border-0 py-1.5 text-gray-900   "}
                /><span>{featureimg[index]}</span>
                </div>
                <label htmlFor={`textcolor-${index}`} className=" mt-10 block text-sm font-medium leading-6 text-gray-900">
              {`List ${index+1} Color`}
              </label>
              <div className="mt-1 ">
                <input
                  id={`textcolor-${index}`}
                  name="textcolor"
                  type="text"
                  data-idx={index}
                  value={input.textcolor}
                  onChange={(e) => handleFeatureChange(index, e)}        
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                </div>
            
           
             {index==formData.features.featureslist.length-1 &&<button onClick={(e)=>addField('features','featureslist',e, {featurename:"",color:"",logo:"",description:"",lists:[""],featureimg:"",textcolor:""})} className='inline bg-transparent mt-3 hover:bg-primary text-primary font-semibold hover:text-white py-2 px-4 border border-primary hover:border-white rounded-full h-10 w-32'>Add More</button>}
           
               {index!=0 && <button onClick={(e)=>deleteField('features','featureslist',e,index)} className="bg-primary hover:bg-white hover:text-black float-end mt-4 text-white font-bold py-2 px-4 rounded-full mb-4">Remove</button>}
             
                 </div>
                 ) 
})}
  
  </div>
  <button onClick={(e)=>updatefeature(e)} className="bg-primary hover:bg-blue-200 mb-10 me-11 hover:text-black w-fit float-end px-4 py-2 text-white p-1 rounded-full">Update</button>
  

  </div>        
  <hr className="m-10"/>
{/* Youtube */}
<div className="grid grid-cols-2 p-4 gap-5">
<div>
<label htmlFor="youtubeheading" className="block text-sm font-medium mt-2 mb-1 leading-6 text-gray-900">
              Youtube Title
            </label>
            <div className=" ">
              <input
                id="youtubeheading"
                name="youtubeheading"
                type="text"
                onChange={handleNestedInputChange('youtube','youtubeheading')}
                value={formData.youtube.youtubeheading}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              </div>
</div>
<div>
<label htmlFor="youtubep1" className="block text-sm font-medium mt-2 mb-1 leading-6 text-gray-900">
              First info
            </label>
            <div className=" ">
              <input
                id="youtubep1" 
                name="youtubep1" 
                type="text"
                onChange={handleNestedInputChange('youtube','youtubep1')}
                value={formData.youtube.youtubep1}               
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              </div>
</div>
<div>
<label htmlFor="youtubep2"  className="block text-sm font-medium mt-2 mb-1 leading-6 text-gray-900">
              Second info
            </label>
            <div className=" ">
              <input
                id="youtubep2"
                name="youtubep2"
                type="text"              
                onChange={handleNestedInputChange('youtube','youtubep2')}
        value={formData.youtube.youtubep2}                 
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              </div>
</div>
<div>
<label htmlFor="youtubevideosrc" className="block text-sm font-medium mt-2 mb-1 leading-6 text-gray-900">
              Video Source
            </label>
            <div className=" ">
              <input
                id="youtubevideosrc"
                name="youtubevideosrc"
                type="text"
                onChange={handleNestedInputChange('youtube','youtubevideosrc')}
                value={formData.youtube.youtubevideosrc} 
              
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              </div>
</div>
    
</div>
<button onClick={(e)=>updateyoutube(e)} className="bg-primary hover:bg-blue-200 mb-10 me-11 hover:text-black w-fit float-end px-4 py-2 text-white p-1 rounded-full">Update</button>
 
<hr className="m-10"/>
{/* Reasons */}
<div className="grid grid-cols-2 gap-4">
  <div>
  <label htmlFor="reasonheading" className=" mt-4 block text-sm font-medium leading-6 text-gray-900">
              Reasons
            </label>
            <div className="mt-1 ">
              <input
                id="reasonheading"
                name="reasonheading"
                value={formData.reasons.reasonheading}
                onChange={handleNestedInputChange('reasons','reasonheading')} 
                type="text"              
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              </div>
  </div>

  <div>

 
  <label htmlFor="reasoninfo1" className=" mt-4 block text-sm font-medium leading-6 text-gray-900">
              Reason Info
            </label>
            <div className="mt-1 ">
              <input
                id="reasoninfo1"
                name="reasoninfo1"
                type="text"
                value={formData.reasons.reasoninfo1}
                onChange={handleNestedInputChange('reasons','reasoninfo1')} 
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              </div>
  </div>

  <div>
  <label htmlFor="reasoninfo2" className=" mt-4 block text-sm font-medium leading-6 text-gray-900">
              Reason info span
            </label>
            <div className="mt-1 ">
              <input
                id="reasoninfo2"
                name="reasoninfo2"
                type="text" 
                value={formData.reasons.reasoninfo2}
                onChange={handleNestedInputChange('reasons','reasoninfo2')}             
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              </div>
  </div>
              
  </div>
  <div className="grid grid-cols-2 gap-5 p-4 ">
  
  {formData.reasons.reason.map((input,index)=>{
  
  
  return(<div key={index} className="inline">
      <label htmlFor={`reasonimg-${index}`} className=" mt-4 block text-sm font-medium leading-6 text-gray-900">
              {`Image ${index+1}`}
              </label>
              <div className='focus:ring-2 mt-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ring-1 ring-gray-300 rounded-md'>
             
           
                <input
                  id={`reasonimg-${index}`}
                  name="reasonimg"
                  type="file"
                  data-idx={index}
                  // value={input.reasonimg}
                  onChange={(e)=>handleFaqimgChange('reasons','reason',index, 'reasonimg',e.target.files[0])}
                               
                  className={reasonimg[index]?"w-24  rounded-md border-0 py-1.5   text-transparent ":"w-3/4  rounded-md border-0 py-1.5 text-gray-900   "}
                  /><span>{reasonimg[index]}</span>
                </div>
                <label htmlFor={`reasonh4-${index}`} className="mt-4  block text-sm font-medium leading-6 text-gray-900">
              {`Reason Name ${index+1}`}
              </label>
              <div className="mt-1 ">
                <input
                  id={`reasonh4-${index}`}
                  name="reasonh4"
                  type="text"
                  data-idx={index}
                  value={input.reasonh4}
                  onChange={handleFaqChange('reasons','reason',index, 'reasonh4')}
                               
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                </div>
                <label htmlFor={`reasoncolor-${index}`} className=" mt-4 block text-sm font-medium leading-6 text-gray-900">
              Text Color
              </label>
              <div className="mt-1 ">
                <input
                  id={`reasoncolor-${index}`} 
                  name="reasoncolor"
                  type="text"
                  data-idx={index}
                  value={input.reasoncolor}
                  onChange={handleFaqChange('reasons','reason',index, 'reasoncolor')}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                </div>
                <label htmlFor={`reasonp1-${index}`}  className=" mt-4 block text-sm font-medium leading-6 text-gray-900">
              Reason 1
              </label>
              <div className="mt-1 ">
                <input
                  id={`reasonp1-${index}`} 
                  name="reasonp1"
                  type="text"
                  data-idx={index}
                  value={input.reasonp1}
                  onChange={handleFaqChange('reasons','reason',index, 'reasonp1')}
                 
                               
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                </div>
                <label htmlFor={`reasonp2-${index}`} className=" mt-4 block text-sm font-medium leading-6 text-gray-900">
              Reason 2
              </label>
              <div className="mt-1 ">
                <textarea
                  id={`reasonp2-${index}`}
                  name="reasonp2"
                  rows={2}
                  data-idx={index}
                  value={input.reasonp2}
                  onChange={handleFaqChange('reasons','reason',index, 'reasonp2')}      
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                </div>
         {index ==formData.reasons.reason.length-1 ? <button onClick={(e)=>addField('reasons','reason',e,{ reasonimg: '', reasonh4: '',reasoncolor:'', reasonp1:'', reasonp2:'' })} className='inline bg-transparent mt-3 hover:bg-primary text-primary font-semibold hover:text-white py-2 px-4 border border-primary hover:border-white rounded-full h-10 w-32'>Add More</button>:null}   
                
             {index!=0 && <button onClick={(e)=>deleteField('reasons','reason',e,index)} className="bg-primary hover:bg-white hover:text-black float-end mt-4 text-white font-bold py-2 px-4 rounded-full mb-4">Remove</button>
 }
           
                   </div>) 
  
})}
 

</div>
<button onClick={(e)=>updatereason(e)} className="bg-primary hover:bg-blue-200 mb-10 me-11 hover:text-black w-fit float-end px-4 py-2 text-white p-1 rounded-full">Update</button>
 
<hr className="m-10"/>
{/* animation */}
<div className="grid grid-cols-2 gap-5 p-4 ">
<div>

              <label htmlFor="animep" className=" mt-4 block text-sm font-medium leading-6 text-gray-900">
              Sub info
            </label>
            <div className="mt-1 ">
              <input
                id="animep"
                name="animep"
                type="text"
                value={formData.animation.animep} // Bind the value from state
                onChange={handleNestedInputChange('animation','animep')}  
              
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              </div>
</div>
<div><label htmlFor="animeh2" className=" mt-4 block text-sm font-medium leading-6 text-gray-900">
              Title
            </label>
            <div className="mt-1 ">
              <input
                id="animeh2"
                name="animeh2"
                type="text"
                value={formData.animation.animeh2} // Bind the value from state
                onChange={handleNestedInputChange('animation','animeh2')}                               
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              </div></div>


{/* anime dynamic image and class */}

{formData.animation.animeimages1.map((input,index)=>{
  
  
  return(<div key={index} className="inline">
      <label htmlFor={`anime1img[${index}]`} className=" mt-10 block text-sm font-medium leading-6 text-gray-900">
              {`1st row Image ${index+1} Source`} 
              </label>
              <div className='focus:ring-2 mt-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ring-1 ring-gray-300 rounded-md'>
                <input
                  id={`anime1img[${index}]`}
                  name={`anime1img[${index}]`}
                  type="file"
                  data-idx={index}
                  // value={formData.animation.animeimages1[index]?.anime1img || ''} // Bind value from state
          onChange={(e) => handleAnimeImgChange(e, index, 'animeimages1', 'anime1img')} 
                
                               
                  className={anime1img[index]?"w-24  rounded-md border-0 py-1.5   text-transparent ":"w-3/4  rounded-md border-0 py-1.5 text-gray-900   "}
                  /><span>{anime1img[index]}</span>
                </div>
                <label htmlFor={`anime1class[${index}]`}  className=" mt-10 block text-sm font-medium leading-6 text-gray-900">
              {`1st row ImageClass ${index+1}`}
              </label>
              <div className="mt-1 ">
                <input
                  id={`anime1class[${index}]`}
                  name={`anime1class[${index}]`}
                  type="text"
                  data-idx={index}
                  value={formData.animation.animeimages1[index]?.anime1class || ''} // Bind value from state
          onChange={(e) => handleanimeclasschange(e, index, 'animeimages1', 'anime1class')} 
                                               
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                </div>
            
{index ==formData.animation.animeimages1.length-1 && <button onClick={(e)=>addField('animation','animeimages1',e,{ anime1img:'',anime1class:''})} className='inline bg-transparent mt-3 hover:bg-primary text-primary font-semibold hover:text-white py-2 px-4 border border-primary hover:border-white rounded-full h-10 w-32'>Add More</button>}           
           {index!=0  && <button onClick={(e)=>deleteField('animation','animeimages1',e,index)} className="bg-primary hover:bg-white hover:text-black float-end mt-4 text-white font-bold py-2 px-4 rounded-full mb-4">Remove</button>}  
           
                   </div>) 
  
})}
{/* anime2img */}
{formData.animation.animeimages2.map((input,index)=>{
  
  
  return(<div key={index} className="inline">
      <label htmlFor={`anime2img[${index}]`} className=" mt-10 block text-sm font-medium leading-6 text-gray-900">
              {`2nd row Image ${index+1} Source`} 
              </label>
              <div className='focus:ring-2 mt-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ring-1 ring-gray-300 rounded-md'>
             
           
                <input
                  id={`anime2img[${index}]`} 
                  name={`anime2img[${index}]`}
                  type="file"
                  data-idx={index}
                  // value={formData.animation.animeimages2[index]?.anime2img || ''} // Bind value from state
                  onChange={(e) => handleAnimeImgChange(e, index, 'animeimages2', 'anime2img')} // Custom handler
                
                               
                  className={anime2img[index]?"w-24  rounded-md border-0 py-1.5   text-transparent ":"w-3/4  rounded-md border-0 py-1.5 text-gray-900   "}
                  /><span>{anime2img[index]}</span>
                </div>
                <label htmlFor={`anime2class[${index}]`} className=" mt-10 block text-sm font-medium leading-6 text-gray-900">
              {`2nd row ImageClass ${index+1}`}
              </label>
              <div className="mt-1 ">
                <input
                  id={`anime2class[${index}]`}
                  name={`anime2class[${index}]`}
                  type="text"
                  data-idx={index}
                  value={formData.animation.animeimages2[index]?.anime2class || ''} // Bind value from state
                  onChange={(e) => handleanimeclasschange(e, index, 'animeimages2', 'anime2class')} // Custom handler
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                </div>
            
                {index ==formData.animation.animeimages2.length-1 && <button onClick={(e)=>addField('animation','animeimages2',e,{ anime2img:'',anime2class:''})} className='inline bg-transparent mt-3 hover:bg-primary text-primary font-semibold hover:text-white py-2 px-4 border border-primary hover:border-white rounded-full h-10 w-32'>Add More</button>}           
           {index!=0  && <button onClick={(e)=>deleteField('animation','animeimages2',e,index)} className="bg-primary hover:bg-white hover:text-black float-end mt-4 text-white font-bold py-2 px-4 rounded-full mb-4">Remove</button>}  
           
              
                    </div>) 
  
})}

{/* anime3 Images */}
{formData.animation.animeimages3.map((input,index)=>{
  
  
  return(<div key={index} className="inline">
      <label htmlFor={`anime3img[${index}]`} className=" mt-10 block text-sm font-medium leading-6 text-gray-900">
              {`3rd row Image ${index+1} Source`} 
              </label>
              <div className='focus:ring-2 mt-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ring-1 ring-gray-300 rounded-md'>
             
           
                <input
                  id={`anime3img[${index}]`} 
                  name={`anime3img[${index}]`} 
                  type="file"
                  data-idx={index}
                  // value={formData.animation.animeimages3[index]?.anime3img || ''} // Bind value from state
          onChange={(e) => handleAnimeImgChange(e, index, 'animeimages3', 'anime3img')} // Custom handler
          className={anime3img[index]?"w-24  rounded-md border-0 py-1.5   text-transparent ":"w-3/4  rounded-md border-0 py-1.5 text-gray-900   "}
          /><span>{anime3img[index]}</span>
                </div>
                <label htmlFor={`anime3class[${index}]`} className=" mt-10 block text-sm font-medium leading-6 text-gray-900">
              {`3rd row ImageClass ${index+1}`}
              </label>
              <div className="mt-1 ">
                <input
                  id={`anime3class[${index}]`}
                  name={`anime3class[${index}]`}
                  type="text"
                  data-idx={index}
                  value={formData.animation.animeimages3[index]?.anime3class || ''} // Bind value from state
          onChange={(e) => handleanimeclasschange(e, index, 'animeimages3', 'anime3class')} // Custom handler
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                </div>
            
                {index ==formData.animation.animeimages3.length-1 && <button onClick={(e)=>addField('animation','animeimages3',e,{ anime3img:'',anime3class:''})} className='inline bg-transparent mt-3 hover:bg-primary text-primary font-semibold hover:text-white py-2 px-4 border border-primary hover:border-white rounded-full h-10 w-32'>Add More</button>}           
           {index!=0  && <button onClick={(e)=>deleteField('animation','animeimages3',e,index)} className="bg-primary hover:bg-white hover:text-black float-end mt-4 text-white font-bold py-2 px-4 rounded-full mb-4">Remove</button>}  
           
                    </div>) 
  
})}
</div>
<button onClick={(e)=>updateanime(e)} className="bg-primary hover:bg-blue-200 mb-10 me-11 hover:text-black w-fit float-end px-4 py-2 text-white p-1 rounded-full">Update</button>
 
<hr className="m-10"/>
{/* feedback */}
<div>
  <div className="grid grid-cols-2 p-4 gap-5">
  <div>
  <label htmlFor="feedbackh1" className=" mt-4 block text-sm font-medium leading-6 text-gray-900">
              Feedback Part Title
            </label>
            <div className="mt-1 ">
              <input
                id="feedbackh1"
                name="feedbackh1"
                type="text" 
                value={formData.customerfeedback.feedbackh1}
    onChange={handleNestedInputChange('customerfeedback', 'feedbackh1')}               
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              </div>
  </div>

  </div>


              {/* feedback array of object */}
<div className="grid grid-cols-2 gap-5 p-4 ">


{formData.customerfeedback.detail.map((input,index)=>{
  
  
  return(<div key={index} className="inline">
      <label htmlFor={`img-${index}`} className=" mt-4 block text-sm font-medium leading-6 text-gray-900">
              {`Image ${index+1}`}
              </label>
              <div className='focus:ring-2 mt-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ring-1 ring-gray-300 rounded-md'>           
                <input
                  id={`img-${index}`} 
                  name="img" 
                  type="file"
                  data-idx={index}
                  // value={input.img}
                  onChange={(e)=>handleFaqimgChange('customerfeedback','detail',index, 'img',e.target.files[0])}
                               
                  className={feedbackimg[index]?"w-24  rounded-md border-0 py-1.5   text-transparent ":"w-3/4  rounded-md border-0 py-1.5 text-gray-900   "}
                  /><span>{feedbackimg[index]}</span>
                </div>
                <label htmlFor={`by-${index}`}  className="mt-4  block text-sm font-medium leading-6 text-gray-900">
             Oraganization Name
              </label>
              <div className="mt-1 ">
                <input
                  id={`by-${index}`} 
                  name="by" 
                  type="text"
                  data-idx={index}
                  value={input.by}
                  onChange={handleFaqChange('customerfeedback','detail',index, 'by')}
                             
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                </div>
                <label htmlFor={`who-${index}`} className=" mt-4 block text-sm font-medium leading-6 text-gray-900">
             Business Type
              </label>
              <div className="mt-1 ">
                <input
                  id={`who-${index}`}
                  name="who"
                  type="text"
                  data-idx={index}
                  value={input.who}
                  onChange={handleFaqChange('customerfeedback','detail',index, 'who')}
                           
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                </div>
                <label htmlFor={`feedback-${index}`} className=" mt-4 block text-sm font-medium leading-6 text-gray-900">
              Feedback
              </label>
              <div className="mt-1 ">
                <textarea
                  id={`feedback-${index}`}
                  name="feedback"
                  rows={2}
                  data-idx={index}
                  value={input.feedback}
                  onChange={handleFaqChange('customerfeedback','detail',index, 'feedback')}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                </div>
             
         {index ==formData.customerfeedback.detail.length-1 ? <button onClick={(e)=>addField('customerfeedback','detail',e,{img:'',by:'',who:'',feedback:''})} className='inline bg-transparent mt-3 hover:bg-primary text-primary font-semibold hover:text-white py-2 px-4 border border-primary hover:border-white rounded-full h-10 w-32'>Add More</button>:null}   
           
                <button onClick={(e)=>deleteField('customerfeedback','detail',e,index)} className="bg-primary hover:bg-white hover:text-black float-end mt-4 text-white font-bold py-2 px-4 rounded-full mb-4">Remove</button>
    </div>) 
  
})}
</div>
</div>
<button onClick={(e)=>updatefeed(e)} className="bg-primary hover:bg-blue-200 mb-10 me-11 hover:text-black w-fit float-end px-4 py-2 text-white p-1 rounded-full">Update</button>
 <hr className="m-10"/>
{/* signup */}
<div className="grid grid-cols-2 p-4 gap-5">
  <div>
  <label htmlFor="signuph1" className="block text-sm font-medium mt-2 leading-6 text-gray-900">
             Signup Part Title
            </label>
            <div className=" ">
              <input
                id="signuph1"
                name="signuph1"
                type="text"
                value={formData.signup.signuph1}
                onChange={handleNestedInputChange('signup','signuph1')}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              </div>
  </div>
  <div>
  <label htmlFor="signupspan" className="block text-sm font-medium mt-2 leading-6 text-gray-900">
              Span data
            </label>
            <div className=" ">
              <input
                id="signupspan"
                name="signupspan"
                type="text"                
                value={formData.signup.signupspan}
        onChange={handleNestedInputChange('signup','signupspan')}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              </div>
  </div>
  <div>
  <label htmlFor="signupbtn" className="block text-sm font-medium mt-2 leading-6 text-gray-900">
              Signup Button Text
            </label>
            <div className=" ">
              <input
                id="signupbtn"
                name="signupbtn"
                type="text"
                value={formData.signup.signupbtn}
                onChange={handleNestedInputChange('signup','signupbtn')}
                
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              </div>
  </div>
  <div>
  <label htmlFor="signupimg" className="block text-sm font-medium mt-2 leading-6 text-gray-900">
              Image
            </label>
            <div className='focus:ring-2 mt-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ring-1 ring-gray-300 rounded-md'>
              <input
                id="signupimg"
                name="signupimg"
                type="file"               
                // value={formData.signup.signupimg}
                onChange={(e)=>handleNestedInputimgChange('signup','signupimg',e.target.files[0])}
                className={signupimg?"w-24  rounded-md border-0 py-1.5   text-transparent ":"w-3/4  rounded-md border-0 py-1.5 text-gray-900   "}
                /><span>{signupimg}</span>
              </div>
  </div>
</div>
<button onClick={(e)=>updatesignup(e)} className="bg-primary hover:bg-blue-200 mb-10 me-11 hover:text-black w-fit float-end px-4 py-2 text-white p-1 rounded-full">Update</button>
 <hr className="m-10"/>
{/* faq */}
<div className="grid grid-cols-2 gap-5 p-4 ">
<div>
  <label htmlFor="faqh1" className="block text-sm font-medium mt-2 leading-6 text-gray-900">
              FAQ PartTitle
            </label>
            <div className=" ">
              <input
                id="faqh1"
                name="faqh1"
                type="text"
                value={formData.faq.faqh1}
                onChange={(e) => setFormData({ ...formData, faq: { ...formData.faq, faqh1: e.target.value } })}
              
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              </div>  
  </div>
</div>
<div className="grid grid-cols-2 gap-5 p-4 ">

{/* array of object faq */}

{formData.faq.questions.map((input,index)=>{
  
  
  return(<div key={index} className="inline">
      <label htmlFor={`q-${index}`} className=" mt-4 block text-sm font-medium leading-6 text-gray-900">
              {`Question ${index+1}`}
              </label>
              <div className="mt-1 ">
                <input
                  id={`q-${index}`}
                  name='q'
                  type="text"
                  data-idx={index}
                  value={input.q}
                  onChange={handleFaqChange('faq','questions',index, 'q')}
                             
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                </div>
                <label htmlFor={`a-${index}`}  className="mt-4  block text-sm font-medium leading-6 text-gray-900">
             {`Answer ${index+1}`}
              </label>
              <div className="mt-1 ">
                <textarea
                  id={`a-${index}`}  
                  name='a'  
                  rows={2}
                  data-idx={index}
                  value={input.a}
              onChange={handleFaqChange('faq','questions',index, 'a')}
                         
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                </div>
           
           
             
         {index ==formData.faq.questions.length-1 ? <button onClick={(e)=>addField('faq','questions',e,{q:'',a:''})} className='inline bg-transparent mt-3 hover:bg-primary text-primary font-semibold hover:text-white py-2 px-4 border border-primary hover:border-white rounded-full h-10 w-32'>Add More</button>:null}   
                
             
           
                <button onClick={(e)=>deleteField('faq','questions',e,index)} className="bg-primary hover:bg-white hover:text-black float-end mt-4 text-white font-bold py-2 px-4 rounded-full mb-4">Remove</button>
    </div>) 
  
})}

</div> 
<button onClick={(e)=>updatefaq(e)} className="bg-primary hover:bg-blue-200 mb-10 me-11 hover:text-black w-fit float-end px-4 py-2 text-white p-1 rounded-full">Update</button>
 <hr className="m-10"/>
{/* start */}
<div className="grid grid-cols-2 p-4 gap-5">
  <div>
  <label htmlFor="starth1" className="block text-sm font-medium mt-2 leading-6 text-gray-900">
           Start Part Title
            </label>
            <div className=" ">
              <input
                id="starth1" 
                name="starth1" 
                type="text"
                value={formData.start.starth1}
                onChange={handleNestedInputChange('start','starth1')}           
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              </div>
  </div>


  <div>
  <label htmlFor="starth2" className="block text-sm font-medium mt-2 leading-6 text-gray-900">
              Subheading1
            </label>
            <div className=" ">
              <input
                id="starth2"
                name="starth2"
                type="text"
                value={formData.start.starth2}
                onChange={handleNestedInputChange('start','starth2')} 
              
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              </div>
  </div>
  <div>
  <label htmlFor="starth3" className="block text-sm font-medium mt-2 leading-6 text-gray-900">
              Subheading2
            </label>
            <div className=" ">
              <input
                id="starth3"
                name="starth3"
                type="text"
                value={formData.start.starth3}
                onChange={handleNestedInputChange('start','starth3')} 
              
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              </div>
  </div>
  <div>
  <label htmlFor="startbtn" className="block text-sm font-medium mt-2 leading-6 text-gray-900">
              Button Text
            </label>
            <div className=" ">
              <input
                id="startbtn"
                name="startbtn"
                type="text"
                value={formData.start.startbtn}
                onChange={handleNestedInputChange('start','startbtn')} 
              
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              </div>
  </div>
</div>
<button onClick={(e)=>updatestart(e)} className="bg-primary hover:bg-blue-200 mb-10 me-11 hover:text-black w-fit float-end px-4 py-2 text-white p-1 rounded-full">Update</button>
 <hr className="m-10"/>

{/* carousel */}
<div className="grid grid-cols-2 p-4 gap-5">

<div>
<label htmlFor="caroh" className=" mt-4 block text-sm font-medium leading-6 text-gray-900">
             Carousel Title
            </label>
            <div className="mt-1 ">
              <input
                id="caroh"
                name="caroh"
                type="text"
                value={formData.caro.caroh}
        onChange={handleNestedInputChange('caro','caroh')}             
                className=" mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 w-full ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              </div>
</div>
<div>
<label htmlFor="carospan" className=" mt-4 block text-sm font-medium leading-6 text-gray-900">
             Carousel Span data
            </label>
            <div className="mt-1 ">
              <input
                id="carospan"
                name="carospan"
                type="text"
                value={formData.caro.carospan}
        onChange={handleNestedInputChange('caro','carospan')} 
                className=" mx-auto w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              </div>
</div>
<div>
<label htmlFor="carop" className=" mt-4 block text-sm font-medium leading-6 text-gray-900">
             Info
            </label>
            <div className="mt-1 ">
              <input
                id="carop"
                name="carop"
                type="text"              
                value={formData.caro.carop}
        onChange={handleNestedInputChange('caro','carop')} 
                className=" mx-auto w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              </div>
</div>
<div>
<label htmlFor="carobtn" className=" mt-4 block text-sm font-medium leading-6 text-gray-900">
             Button Text
            </label>
            <div className="mt-1 ">
              <input
                id="carobtn"
                name="carobtn"
                type="text"   
                value={formData.caro.carobtn}
        onChange={handleNestedInputChange('caro','carobtn')}           
                className=" mx-auto w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              </div>
</div> 


{/* caro3 */}

{['div1img', 'div2img', 'div3img'].map((imgArray, imgIndex) => (
      <div key={imgArray}>
        {formData.caro[imgArray].map((input, index) => (
          <div key={index} className="inline">
            <label htmlFor={`${imgArray}[${index}]`} className="mt-10 block text-sm font-medium leading-6 text-gray-900">{`Image ${index + 1}`}</label>
            <div className='focus:ring-2 mt-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ring-1 ring-gray-300 rounded-md'>
            
            <input
              id={`${imgArray}[${index}]`}
              name={`${imgArray}[${index}]`}
              type="file"
              // value={formData.caro[imgArray][index]}
              onChange={(e)=>handleCaroImgChange(index, imgArray,e)}
              className={caroimg[imgArray][index]?"w-24  rounded-md border-0 py-1.5   text-transparent ":"w-3/4  rounded-md border-0 py-1.5 text-gray-900   "}
              />{caroimg[imgArray][index]}
            </div>
            {index === formData.caro[imgArray].length - 1 && (
              <button onClick={addCaroImg(imgArray)} className='inline bg-transparent mt-3 hover:bg-primary text-primary font-semibold hover:text-white py-2 px-4 border border-primary hover:border-white rounded-full h-10 w-32'>Add More</button>
            )}
            {index > 0 && (
              <button onClick={deleteCaroImg(index, imgArray)} className="bg-blue-200 hover:bg-primary hover:text-white float-end mt-4 text-primary font-bold py-2 px-4 rounded-full mb-4">Remove</button>
            )}
           
            
          </div>
         
        ))}
           </div>
    ))}

  

</div>

<button onClick={(e)=>updateCaro(e)} className="bg-primary hover:bg-blue-200 hover:text-black w-fit float-end text-white px-3 py-5 rounded-full">Update</button>
  
<button type="submit" className="btn btn-primary bg-primary text-white w-full my-5 rounded font-bold px-10 py-2" onClick={handleSubmit} disabled={loading}>
  {loading?'Save Changes...':'Submit'}
</button>
  
  </form>        
      </div>
    </Layout>
  );
}



export async function getServerSideProps({ req }) {
return protectedroute(req);
}