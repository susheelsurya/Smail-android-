import React, {useContext , useEffect , useState} from 'react' ;
import {ArrowLeft , UserRound , PenLine , ClipboardPen , LogOut , Settings , Sun , Moon , Sparkles } from "lucide-react" ;
import { store } from "./AllPages.js";

const ProfilePage = () => {
  
      const { setPage,
      isDark ,setIsDark ,
      userUid, triggerAlert, setIsLoading ,
      changePage , triggerConfirm , 
      } = useContext(store);

    const [myInfo , setMyInfo] = useState({
      name : "" ,
      nickName : "" , 
      smail : "" ,
    })
  
  useEffect(() => {
  if (window.observeAuthState) {
    window.observeAuthState(async (status) => {
      if (status.loggedIn) {
        const res = await window.getUserDetails(status.uid);
        if (res.success) {
          // Wrap the object in parentheses to return it correctly
          setMyInfo({
            smail: res.data.smail,
            nickName: res.data.nickName,
            name: res.data.name,
          });
        }
      } else {
        // Good practice: clear state if the user logs out
        setMyInfo(null);
      }
    });
  }
}, []);

  const handleLogout =  () => {
        if (triggerConfirm("Are you sure you want to logout?" , async ()=> {
            const result = await window.logoutUser();
            if (result.success) changePage("LoginPage")} ) ) {
            
        }
    };


  
  return (
    <>
      <div className="ProfilePage  App" >
        <div className="UIAHeader" >
          <button className="tpbtn" onClick={()=> changePage("MailHomePage")} >
            <ArrowLeft/>
          </button> 
          <h1>
           Hey  {myInfo.nickName || "Loading..." }
          </h1>
          <button className="profileIcon" onClick={()=> setIsDark(!isDark)} >
              {isDark ?  <Sun /> :  <Moon />}
          </button> 
        </div>
        <div className="UIAContent" >
          <div className="Pro-content" >
          <div className="pro-con" >
            <div className="profileImg animated-border" >
              <div className="inner">
              <UserRound   size={80} strokeWidth={0.5} />
              </div>
            </div>
            
          </div> 
          <div className="optCard" onClick={()=> changePage("EditProfile")} >
            <div>
            <h2>
               Personal  
            </h2>
            <p className="dulltext" >
              edit name , password  etc..
            </p>
            </div>
            <div className="profileIcon" >
              <PenLine/>
            </div> 
          </div> 
          <div className="optCard" onClick={()=> changePage("HelpAndFeedback")} >
            <div>
            <h2>
               help & feedback  
            </h2>
            <p className="dulltext" >
              if you  want help or give  feedback etc..
            </p>
            </div>
            <div className="profileIcon" >
              <ClipboardPen />
            </div> 
          </div> 
          <div className="optCard" onClick={()=> changePage("NotAvailable")} >
            <div>
            <h2>
               Settings   
            </h2>
            <p className="dulltext" >
                More options  to chan...
            </p>
            </div>
            <div className="profileIcon" >
              <Settings />
            </div> 
          </div>
          <div className="optCard" onClick={()=> changePage("GroupMails")} >
            <div>
            <h2>
              New Feature 
            </h2>
            <p className="dulltext" >
               Group Mails
            </p>
            </div>
            <div className="profileIcon" >
              <Sparkles />
            </div> 
          </div>
          </div>
        </div>
        <div className="UIAFooter" >
          <div className="mail-form" >
            <h3>
              {myInfo.smail || "Loading..." }
            </h3>
          </div>
          <div className="singout-con" >
          <h3 className="" onClick={handleLogout} >
            Remove account <LogOut size={12} />
          </h3> 
          </div>
        </div> 
      </div> 
    </>
    
    
  );
  
} 

export default ProfilePage ; 