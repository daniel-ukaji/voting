import MemberNavbar from '@/components/MemberNavbar';
import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNewAuth } from '@/services/NewAuthContext';
import { PacmanLoader } from 'react-spinners';
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from 'next/router';


function Campaign() {
  const [editorHtml, setEditorHtml] = useState('');
  const [empno, setEmpno] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMessage, setIsMessage] = useState('');

  const inputRef = useRef(null);
  const [ReactQuillComponent, setReactQuillComponent] = useState(null);
  const { employeeNumber } = useNewAuth();
  const {code} = useNewAuth();

  const router = useRouter();

  console.log(code);

  console.log(employeeNumber)

  const handleChange = (html) => {
    setEditorHtml(html);
  };

  const handleEmpnoChange = (e) => {
    setEmpno(e.target.value);
  };

  const handleIsMessageChange = (e) => {
    setIsMessage(e.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const openFileInput = () => {
    inputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Show loader while the API request is in progress
    setIsLoading(true);
  
    const url = 'https://virtual.chevroncemcs.com/voting/Campaign';
    const apiKey = code; // Replace with your actual API key or token
  
    const formData = new FormData();
    formData.append('empno', empno);
    if (selectedImage) {
      formData.append('image', selectedImage);
    }
    formData.append('message', isMessage);
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('API Response:', data);
        router.push('/seecampaigns');
      } else {
        console.error('API Request Failed:', response.statusText);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    } finally {
      // Hide the loader when the API request is complete
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    const loadReactQuill = async () => {
      const { default: ReactQuill } = await import('react-quill');
      setReactQuillComponent(() => ReactQuill);
    };
    loadReactQuill();
  }, []);

  return (
    <div>
      <MemberNavbar />
      {isLoading ? ( // Check if isLoading is true
      <div className="fixed top-0 left-0 w-screen h-screen flex flex-col justify-center items-center bg-white opacity-100 z-50">
        <h1 className='font-bold text-xl'>Campaign is uploading...</h1>
        <PacmanLoader size={50} color="#272E3F" />
      </div>
    ) : (
      <div className="mt-20 max-w-6xl mx-auto">
        <h1 className='font-bold text-3xl mt-20 mb-5'>Start your Campaign</h1>
        <div
          className="image-upload-box mb-5 w-1/2"
          onClick={openFileInput}
          style={{
            border: '2px dashed #cccccc',
            borderRadius: '4px',
            padding: '16px',
            textAlign: 'center',
            cursor: 'pointer',
            height: '300px',
          }}
        >
          {selectedImage ? (
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Selected"
              style={{ maxWidth: '100%', maxHeight: '100%' }}
            />          ) : (
            <p className='flex justify-center items-center mt-32'>Click to Select Image</p>
          )}

          <input
            type="file"
            accept="image/*"
            ref={inputRef}
            style={{ display: 'none' }}
            onChange={handleImageChange}
          />
        </div>
        <div className='w-1/2'>
        <Textarea 
          placeholder="Type your campaign message here." 
          style={{ height: '200px'}} 
          type="text"
          value={isMessage}
          onChange={handleIsMessageChange}
        />
        </div>
        {/* {ReactQuillComponent && (
          <ReactQuillComponent
            value={editorHtml}
            onChange={handleChange}
            modules={Campaign.modules}
            style={{ height: '200px', width: '50%' }}
          />
        )} */}
        <div className="mt-10">
          <label>
            Employee Number:
            <Input type="text" value={empno} className="w-1/4" onChange={handleEmpnoChange} />
          </label>
          <Button onClick={handleSubmit} className="mt-5 mb-10">Submit</Button>
        </div>
      </div>
      )}
    </div>
    
  );
}

Campaign.modules = {
  toolbar: [
    [{ header: '1' }, { header: '2' }, { font: [] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['bold', 'italic', 'underline'],
    ['link'],
  ],
};

export default Campaign;
