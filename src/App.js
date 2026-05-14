import { useEffect } from 'react';
import { setupNotifications } from './firebaseNotifications';

import AllPages from "./AllComponents/AllPages.js" ;

const App = () => {

  useEffect(() => {
  setupNotifications();
}, []);

  
  return (
    <>
      <div className="App">
        <AllPages />
      </div>
    </>
    
    
  );
  
} 

export default App ; 
