import React, { useContext } from 'react';
import { CircleX, EyeOff, Eye } from "lucide-react";
import { store } from "./AllPages.js";

const LoginPage  = () => {
  
    // using  Contexts 
  let {
    // States 
    setPage ,
    form ,
    setForm ,
    toggle ,
    setToggle ,
    type ,
    setType ,
    // Refs 
    searchBarRef ,
    // Functions
    changePage ,
    triggerAlert ,
    
   // uIAHandleChange ,
   // saveToLocalStorage
    
  } = useContext(store) ;
  

 const uIAHandleChange = (e) => {
  setForm({
    ...form,
    [e.target.name]: e.target.value // ఇది కరెక్ట్ గా ఉంటేనే డేటా సేవ్ అవుతుంది
  });
};



const handleLogin = async (e) => {
  e.preventDefault();
  

  // 2. ఒకవేళ డేటా ఖాళీగా ఉంటే ఇక్కడే ఆపేద్దాం
  if (!form.smail || !form.password) {
    triggerAlert("Please enter both Smail and Password!");
    return;
  }

  setToggle(true);

  // 3. Lowercase & Trim
  const email = form.smail.toLowerCase().trim();
  const password = form.password.trim();

  if (typeof window.loginUserToFirebase === 'function') {
    const result = await window.loginUserToFirebase(email, password);

    if (result.success) {
      //saveToLocalStorage("userUid", result.uid);
      changePage("MailHomePage");
    } else {
      
      // ఒకవేళ పాస్‌వర్డ్ తప్పు అయితే 'auth/wrong-password' అని వస్తుంది
      // యూజర్ లేకపోతే 'auth/user-not-found' అని వస్తుంది
      triggerAlert("Login Error: " + result.error);
    }
  } else {
    triggerAlert("server load failed \n please go back & try to loging " ) ;
  }
};



  
    
  return (
    <>
      <div className="UserInfoA  App" > {/*
        <div className="UIAHeader" >
          <h1>
            Header
          </h1>
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
          
          <form onSubmit={handleLogin} className="UIAForm" >
             
            <input type="text" 
              name="smail"
              placeholder="Smail"
              onChange={uIAHandleChange}

              className="UIAInp"
              /> 
              <div className="pass-con">
            <input type={type} 
              name="password"
              placeholder=" Password"
              onChange={uIAHandleChange}

              className="UIAInp"
              />
              {type === "password" ?
              <EyeOff className="eyeicons" onClick={()=>setType("text")}/> :  <Eye  className="eyeicons" onClick={()=> setType("password")}/>
              }
              </div>
              <div className="woringCon" >
              { !toggle && 
            <p className="UIAW" >
              <CircleX className="woring" size={10} color="red" />
                
            </p>        
            }
            </div>
              <button type="submit" className="UIABtn" >Submit
              </button> 
              <p className="TCp" >
            if you 
            <span  className="text-link" onClick={()=> changePage("NotAvailable")} >
              &nbsp; forget  &nbsp;
            </span>
            yor password or any help
          </p>
          </form>
          
          
          
          
        </div>
        <div className="UIAFooter" >
           <p onClick={()=> setPage("UserInfoA") }>
            I Want to 
            <span className="text-link"> &nbsp;
              create &nbsp;
            </span>
            my Smail 
          </p>
        </div> 
      </div> 
    </>
    
    
  );
  
} 

export default LoginPage ; 