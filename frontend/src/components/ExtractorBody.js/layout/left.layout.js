import React, {useState} from 'react'
import Loader from '../loader';
import document from "./doc.jpeg"
const LeftLayout = ({loading, sendToBackend}) => {
    
    const [img, setImage] = useState();

    const imageUpload = (e)=>{
        console.log(e.target.files[0])
        const file = e.target.files[0];

        const reader  = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result.split(',')[1]; // Remove `data:image/...` prefix
          // Send this base64String to the backend via API
          setImage(reader.result);
          sendToBackend(base64String);
        };
        
        if (file) reader.readAsDataURL(file);
      };
      
  return (
    <div className='left-layout'>
    <div className='layout-titles'>
    <h3 className='title-name'>Image To Text</h3>
    <p className='title-desc'>Extract all the text from the selected image using the tesseract OCR engine</p>
    </div>
    <div className='input-container'>
      
        <div className='input-box'>
            <div className='input-header'>Input</div>
            <div className='input-body'>
                {img &&
                <img src={img} />}
                  {!img  &&
                <img src={document} />}
                
            </div>
            <div className='input-footer'>
            {loading ?
            <Loader/>
          :
            <input type="file" onChange={imageUpload}/>
}
            </div>
        </div>
    </div>
</div>
  )
}

export default LeftLayout