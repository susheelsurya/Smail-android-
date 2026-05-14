import React from 'react' ;


const Loader = () => {
  
  return (
    <>
          <div className="loader-con" >
          <div className="loader-container">
      <svg className="loader-svg" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="vibrant-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-1)" />
            <stop offset="50%" stopColor="var(--color-2)" />
            <stop offset="100%" stopColor="var(--color-3)" />
          </linearGradient>
        </defs>

        {/* Circle Path */}
        <circle className="circle-path" cx="50" cy="50" r="40" />

        {/* Snake Wave Path */}
        <path 
          className="wave-path" 
          d="M15 50 C 25 35, 30 65, 40 50 C 50 35, 55 65, 65 50 C 75 35, 80 65, 85 50" 
        />
      </svg>
    </div>
        </div>

    </>
    
    
  );
  
} 

export default Loader ; 