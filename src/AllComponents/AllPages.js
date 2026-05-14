import React, {
  useState,
  useRef,
  createContext,
  useEffect
} from "react";

import { CircleCheckBig } from "lucide-react";

// Components
import UserInfoA from "./UserInfoA.js";
import UserInfoB from "./UserInfoB.js";
import MailHomePage from "./MailHomePage.js";
import LoginPage from "./LoginPage.js";
import TermsPage from "./Terms&Conditions.js";
import Loading from "./Loading.js";
import WriteMailPage from "../SVGIcons/MailWritePage.js";
import OpenYourMail from "./OpenYourMail.js";
import SentMails from "./SentMails.js";
import BinPage from "./MenuComponents/Bin.js";
import SavedMails from "./MenuComponents/SavedMails.js";
import ScheduledMails from "./MenuComponents/ScheduleMails.js";
import EditProfile from "./EditProfile.js";
import ProfilePage from "./Profile.js";
import HelpAndFeedback from "./HelpAndFeedback.js";
import GroupMails from "./GroupMails.js";
import NotAvailable from "./NotAvailable.js";

export const store = createContext();

const AllPages = () => {

  const [page, setPage] = useState("LoginPage");
  const [toggle, setToggle] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState("password");
  const [mailInfo, setMailInfo] = useState(null);
  const [receiver, setReceiver] = useState("");
  const [message, setMessage] = useState("");
  const [userUid, setUserUid] = useState(null);
  const [agree, setAgree] = useState(false);
  const [isDark, setIsDark] = useState(true);

  const [confirm, setConfirm] = useState({
    show: false,
    msg: "",
    onConfirm: null
  });

  const [alert, setAlert] = useState({
    show: false,
    msg: ""
  });

  const [farwordMail, setFarwordMail] = useState({
    farwordMailText: "",
    body: "",
    isFarword: false,
    from: "",
    name: "",
  });

  const [form, setForm] = useState({
    surName: "",
    name: "",
    nickName: "",
    dOB: "",
    gender: "",
    usage: "",
    smail: "",
    password: ""
  });

  const searchBarRef = useRef();

  // Pages
  const pages = {
    TermsPage: <TermsPage />,
    UserInfoA: <UserInfoA />,
    UserInfoB: <UserInfoB />,
    LoginPage: <LoginPage />,
    HelpAndFeedback: <HelpAndFeedback />,
    GroupMails: <GroupMails />,
    ProfilePage: <ProfilePage />,
    EditProfile: <EditProfile />,
    MailHomePage: <MailHomePage />,
    WriteMailPage: <WriteMailPage />,
    OpenYourMail: <OpenYourMail />,
    SentMails: <SentMails />,
    BinPage: <BinPage />,
    SavedMails: <SavedMails />,
    ScheduledMails: <ScheduledMails />,
    NotAvailable: <NotAvailable />
  };

  // Theme
  useEffect(() => {

    const root = document.documentElement;

    root.style.setProperty(
      "--input-bg",
      isDark ? "#2C2C2C" : "#F1F3F4"
    );

    root.style.setProperty(
      "--Main-Background",
      isDark ? "#0B0D0F" : "#FFFFFF"
    );

    root.style.setProperty(
      "--Surface-Active",
      isDark ? "#171A1D" : "#F1F3F4"
    );

    root.style.setProperty(
      "--Primary-Accent",
      "#0066FF"
    );

    root.style.setProperty(
      "--Text-Primary",
      isDark ? "#E8EAED" : "#202124"
    );

    root.style.setProperty(
      "--Text-Secondary",
      isDark ? "#9AA0A6" : "#5F6368"
    );

  }, [isDark]);

  // Change Page
  const changePage = (pageName) => {
    setPage(pageName);
  };

  // Open Mail
  const openYourMails = (mail, uid) => {

    setMailInfo(mail);

    if (
      !mail.isRead &&
      uid &&
      window.markAsRead
    ) {
      window.markAsRead(uid, mail.id);
    }

    setPage("OpenYourMail");
  };

  // Alert
  const triggerAlert = (msg) => {

    setAlert({
      show: true,
      msg
    });

    setTimeout(() => {
      setAlert({
        show: false,
        msg: ""
      });
    }, 3000);
  };

  // Confirm
  const triggerConfirm = (msg, action) => {
    setConfirm({
      show: true,
      msg,
      onConfirm: action
    });
  };

  const handleConfirmAction = () => {

    if (confirm.onConfirm) {
      confirm.onConfirm();
    }

    setConfirm({
      show: false,
      msg: "",
      onConfirm: null
    });
  };

  const closeConfirm = () => {
    setConfirm({
      show: false,
      msg: "",
      onConfirm: null
    });
  };

  // Mail Dispatcher SAFE
  useEffect(() => {

    if (
      userUid &&
      window.runMailDispatcher
    ) {

      window.runMailDispatcher(userUid);

      const interval = setInterval(() => {

        window.runMailDispatcher(userUid);

      }, 60000);

      return () => clearInterval(interval);
    }

  }, [userUid]);
  
  // ---------------- AUTH CHECK ----------------
  useEffect(() => {
    setIsLoading(true);

    const timer = setInterval(() => {
      if (window.observeAuthState) {
        window.observeAuthState((status) => {
          if (status.loggedIn) {
            setUserUid(status.uid);
            setPage("MailHomePage");
          } else {
            setUserUid(null);
            setPage("LoginPage");
          }
          setIsLoading(false);
        });

        clearInterval(timer);
      }
    }, 100);

    return () => clearInterval(timer);
  }, []);


const uIAHandleChange = (e) => {
  setForm({
    ...form,
    [e.target.name]: e.target.value
  })
}

  return (

    <store.Provider
      value={{

        page,
        setPage,

        agree,
        setAgree,

        form,
        setForm,

        toggle,
        setToggle,

        type,
        setType,

        isLoading,
        setIsLoading,

        isDark,
        setIsDark,

        mailInfo,
        setMailInfo,

        farwordMail,
        setFarwordMail,

        receiver,
        setReceiver,

        message,
        setMessage,

        userUid,
        setUserUid,

        searchBarRef,

        triggerAlert,
        triggerConfirm,
        handleConfirmAction,
        closeConfirm,
        uIAHandleChange ,
        changePage,
        openYourMails
      }}
    >

      <div className="App">

        {isLoading && (
          <Loading fullPage={true} />
        )}

        <div className="main-wrapper">

          <div
            
            className="page-transition"
          >
            {pages[page]}
          </div>

          <div
            className={`neo-alert ${
              alert.show ? "active" : ""
            }`}
          >
            <div className="neo-content">
              <span className="neo-icon">
                <CircleCheckBig />
              </span>

              <p>{alert.msg}</p>
            </div>
          </div>

          {confirm.show && (

            <div className="neo-confirm-overlay active">

              <div className="neo-confirm-box">

                <p>{confirm.msg}</p>

                <div className="neo-confirm-btns">

                  <button
                    className="neo-cancel-btn"
                    onClick={closeConfirm}
                  >
                    Cancel
                  </button>

                  <button
                    className="neo-action-btn"
                    onClick={handleConfirmAction}
                  >
                    Confirm
                  </button>

                </div>

              </div>

            </div>

          )}

        </div>

      </div>

    </store.Provider>
  );
};

export default AllPages;
