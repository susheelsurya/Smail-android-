import React , {useState , useContext} from 'react' ;
import {store} from "./AllPages" ;
import { CircleX } from "lucide-react" ;

const UserInfoA = () => {
  
  // Use Context
  
  let {
    // States 
    setPage ,
    agree ,
    setAgree ,
    form , 
    setForm ,
    toggle ,
    setToggle ,
    // Functions
    
    uIAHandleChange
    
  } = useContext(store) ;
  
  
  
  
  
  
  
  
 
  const uIASubmit = (e) => {
    e.preventDefault() ; 
    console.log("agree:", agree)
console.log(form) 
    if (form.surName && form.name && form.nickName &&  agree) {
      setPage("UserInfoB") ;
      setToggle(true) ;
    } else {
      setToggle(false) ;
    }
  }

  return (
    <>
      <div className="UserInfoA  App" >
        {/*
        <div className="UIAHeader" >
          <div>
           
            
          </div>
        </div>
        */}
        <div className="UIAContent" >
          
          <div className="logo-con" >
            <div className="img-con" >
            <img src="" alt="M" /> 
            </div>
             <h1>
              Create your Smail
            </h1>
          </div> 
          
        <form onSubmit={uIASubmit} className="UIAForm">
            <input type="text" 
            name="surName"
            placeholder="Surname"
            
            onChange={uIAHandleChange } className="UIAInp" /> 
            <input type="text" 
            name="name"
            placeholder="Name"
            
            onChange={uIAHandleChange}
            className="UIAInp"
            />  
            <input type="text" 
            name="nickName"
            placeholder="Nick Name"
            
            onChange={uIAHandleChange}
            className="UIAInp"
            />
            {! agree && 
            <p className="UIAW" > <CircleX className="woring" size={10} color="red" />
              read T & C Countie  and  Fill Your Names 
              
            </p>
            }
        <button type="submit" className="UIABtn" >Next</button>
        <p className="TCp" >
         Read  &nbsp; <span className="text-link" onClick={()=>
         setPage("TermsPage")
         }> Terms & condition </span>  &nbsp; before   create your account
        </p>
        </form>
        </div>
        <div className="UIAFooter" >
          <p>
          if you  All Ready  Have a Smail &nbsp;
            <span className="text-link" onClick={()=> setPage("LoginPage") } >
              Click me
            </span>  &nbsp;
            & go to login page
          </p>
        </div> 
      </div> 
    </>
    
    
  );
  
} 

export default UserInfoA ; 
