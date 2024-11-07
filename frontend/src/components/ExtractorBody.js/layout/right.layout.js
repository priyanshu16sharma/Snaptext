import React from 'react'

const RightLayout = ({data, error}) => {
  return (
    <div className='right-layout'>
            <div className='output-container'>
                <div className='output-title'>
                    Output
                </div>
                <div className='output-body'>
                    {data &&  Object.keys(data).map((data1)=>{
                      return <div>{data1}:<span contentEditable="true">{" "+ data[data1]}</span></div>})
                    }

                    {
                        error && 
                        <div> {error} </div>
                    }
                    
                </div>
            </div>
        </div>
  )
}

export default RightLayout