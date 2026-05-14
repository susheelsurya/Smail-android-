import React , {useContext , useState , useEffect } from 'react' ;
import {store} from './AllPages.js';
import { ArrowLeft , CircleX , Eye , EyeOff } from "lucide-react" ;
import TermsPage from "./Terms&Conditions.js" ;



const UserInfoB = () => {
  
  let {
    // States 
    setPage ,
    agree ,
    setAgree ,
    form ,
    setForm ,
    toggle ,
    setToggle ,
    type ,
    setType ,
    // Functions
    uIAHandleChange , 
    triggerAlert ,
    //saveToLocalStorage
    
  } = useContext(store) ;
  
    const [users, setUsers] = useState([]);
    const [woringMsg , setWoringMsg] = useState(" don't leave empty  And read T & C Countie " ) ;
  
  const uIASubmit = async (e) => {
  e.preventDefault();

  // Final smail address format
  const finalSmail = form.smail + "@Smails.in";

  if (form.usage && form.gender && form.dOB && form.smail && form.password && agree) {
    
    // Form data prepare cheyadam
    const userData = { ...form, smail: finalSmail };

    // Firebase Signup Function call
    const result = await window.registerUserToFirebase(userData);

    if (result.success) {
     triggerAlert("Smail Account Created Successfully!");
      setPage("LoginPage");
      window.location.reload();
    } else {
      setWoringMsg(result.error); // Firebase error (e.g., email already exists)
      setToggle(false);
    }
  } else {
    setWoringMsg("Don't leave empty and read T&C");
    setToggle(false);
  }
};

  
  
  useEffect(() => {
    
  }, []);
  
  return (
    <>
      <div className="UserInfoB  App" >
        <div className="UIAHeader" >
          <button onClick={()=> setPage("UserInfoA") } className="tpbtn" >
            <ArrowLeft />
          </button> 
          
          <h1>
            Create your Smail
          </h1>
          <div className="hedding">
          </div>
        </div>
        <div className="UIAContent" >
          
          
          
          <form onSubmit={uIASubmit} className="UIAForm">
            
           
          <div className="UIBCon" >  
            <div className="UIBRbtnC">  
              <div className="UIBRbtn" >
                  <input 
                    id="casual"
                    type="radio"
                    name="usage"
                  value="Casual"
                  checked={form.usage === "Casual"}
                onChange={uIAHandleChange}
              />
              <label htmlFor="casual"> Casual
              </label>
            </div>

            <div className="UIBRbtn" >
              <input
              id="business"
              type="radio"
              name="usage"
              value="Business"
              checked={form.usage === "Business"}
              onChange={uIAHandleChange}
              />
              <label htmlFor="business" >Business</label>
            </div>

            <div className="UIBRbtn">
              <input
              id="child"
              type="radio"
              name="usage"
              value="Child Use"
              checked={form.usage === "Child Use"}
              onChange={uIAHandleChange}
              />
              <label htmlFor="child" >Child Use
              </label>
            </div>
            </div>
            <div className="UIBRbtnC">  
              <div className="UIBRbtn" >
                  <input 
                    id="Male"
                    type="radio"
                    name="gender"
                  value="Male"
                  checked={form.gender === "Male"}
                onChange={uIAHandleChange}
              />
              <label htmlFor="Male">
                Male
              </label>
            </div>

            <div className="UIBRbtn" >
              <input
              id="transgender"
              type="radio"
              name="gender" 
              value="Transgender"
              checked={form.gender === "Transgender"}
              onChange={uIAHandleChange}
              />
              <label htmlFor="transgender" >Transgender</label>
            </div>

            <div className="UIBRbtn">
              <input
              id="female"
              type="radio"
              name="gender"
              value="Female"
              checked={form.gender === "Female"}
              onChange={uIAHandleChange}
              />
              <label htmlFor="female" >Female
              </label>
            </div>
            
          </div>
          
          
            
          
        </div>
        <div className="dobCon">
          <h4>
            Date Of Birth : 
          </h4>
          <input
              type="date"
              id="dobinp"
              name="dOB"
              value={form.dOB}
              min="1900-01-01"
              max="2025-12-31"
              onChange={uIAHandleChange}

              />
            </div>
            <div className="mail-inp-con" >
            <input type="text" 
            
              name="smail"
              placeholder="Smail"
              value={form.smail}
              onChange={uIAHandleChange}

              className="UIAInp"
              /> 
              <div className="sm-inp-leyar" >
                @Smails.in
              </div> 
              </div>
              <div>
            <input type={type} 
              name="password"
              placeholder="Create Password"
              value={form.password}
              onChange={uIAHandleChange}

              className="UIAInp"
              />
               {type === "password" ?
              <EyeOff className="eyeicons" onClick={()=>setType("text")}/> : <Eye className="eyeicons" onClick={()=>setType("password")}/> 
              }
             </div> 
              <div className="woringCon" >
              { !toggle && 
            <p className="UIAW" >
              <CircleX className="woring" size={10} color="red" />
                {woringMsg}  
            </p>        
            }
            </div>
              <button type="submit" className="UIABtn" >Submit
              </button> 
          </form>
        </div>
        <div className="UIAFooter" >
         
          <p>
            read  &nbsp;
            <span className="text-link" onClick={()=> setPage("TermsPage")} >
              
              terms & condition
            </span>  &nbsp;
            is compulsory 
          </p>
        </div> 
      </div> 
    </>
    
    
  );
  
} 

export default UserInfoB ; 