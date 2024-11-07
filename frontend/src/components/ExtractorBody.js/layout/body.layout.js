import './layout.css'
import React, {useState} from 'react'
import RightLayout from './right.layout'
import LeftLayout from './left.layout'
const Layout = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false)
      const [error, setError] = useState();
      const sendToBackend = async (base64String) => {
        console.log(base64String);
        console.log(process.env.REACT_APP_BASE_API_URL)
        try {
          setLoading(true);
           fetch(`${process.env.REACT_APP_BASE_API_URL}/api/process-image/passport`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: base64String })
          }).then(response => {

            if (!response.ok) {
              setLoading(false)
              setError("Error Processing Image. Please Upload A Valid And Clear Passport Image.")
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Processed image data:', data);
            setData(data.data);
            setLoading(false)
        })
        .catch(error => {
          setLoading(false)
            console.error('Error processing image:', error);
        });

          
          
          console.log('Image sent to backend');
        } catch (error) {
          console.error('Error uploading image:', error);
        }
        
      };
  return (
    <div className='body-layout'>
        <LeftLayout loading={loading} sendToBackend={sendToBackend}/>
        <RightLayout data={data} error={error}/>
    </div>
  )
}

export default Layout