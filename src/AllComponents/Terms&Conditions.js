import React , {useContext , useState} from "react" ;
import {store} from "./AllPages" ;
import { ArrowLeft , CircleX } from "lucide-react" ;


const TermsAndConditions = () => {
  const {
    setPage ,
    agree ,
    setAgree ,
    toggle ,
    setToggle 
  } = useContext(store) ;
  
  
  
  const [checked, setChecked] = useState(false);
  
  const Agree = () => {
  if (checked) {
    setAgree(true);
    setToggle(true);
    setPage("UserInfoA");
  } else {
    setAgree(false);
    setToggle(false);
  }
}
  
  return (
    <div>
      <div className="UIAHeader" >
        {/*
          <button onClick={()=> setPage("UserInfoA") } className="tpbtn" >
            <ArrowLeft />
          </button> 
         */ }
          <h1>
            Smail – Terms & Conditions
          </h1>
          
        </div>  
        <div className="UIAContent">
    <div style={{ padding: "20px", lineHeight: "1.6" }}>
      
      
      <p><strong>Last Updated:</strong> [Add Date]</p>

      <p>
        Welcome to Smail. These Terms & Conditions ("Terms") govern your access 
        to and use of Smail services, including account creation, email 
        sending/receiving, and related features. By creating an account or 
        using Smail, you agree to these Terms.
      </p>

      <h2>1. Acceptance of Terms</h2>
      <p>
        By creating a Smail account, you confirm that you have read, understood, 
        and agreed to these Terms. If you do not agree, please do not create an 
        account or use our services.
      </p>

      <h2>2. User Information & Data Usage</h2>
      <p>
        When you create an account in Smail, you provide personal and 
        account-related information (such as name, email, and other details).
      </p>
      <p><strong>Important Notice:</strong></p>
      <p>Your entered information will be stored in our database.</p>
      <p>
        By using Smail, you acknowledge and accept that this data is stored and 
        processed by us.
      </p>
      <p>
        Our team may access or review stored data when necessary for service 
        improvement, security, or maintenance purposes.
      </p>
      <p>
        If you do not agree with this, please do not create an account.
      </p>

      <h2>3. Service Availability Disclaimer</h2>
      <p>
        Smail is an independent service that is continuously under development.
      </p>
      <p>We do not guarantee uninterrupted or error-free service.</p>
      <p>
        Due to server issues, technical failures, or unforeseen problems, the 
        service may stop working at any time.
      </p>
      <p>
        If any issue occurs due to our system or servers and you are unable to 
        use Smail, we are not responsible for any loss, inconvenience, or damages.
      </p>
      <p>
        We aim to run Smail long-term (ideally lifetime), but we do not guarantee 
        how long the service will be available.
      </p>

      <h2>4. Account Responsibility</h2>
      <p>You are responsible for maintaining the security of your account.</p>
      <p>Do not share your password with others.</p>
      <p>
        Any activity performed using your account is considered your responsibility.
      </p>

      <h2>5. Acceptable Use Policy</h2>
      <p>
        You agree to use Smail only for safe and lawful purposes.
      </p>
      <p><strong>Strictly Prohibited Activities:</strong></p>
      <p>Using Smail for illegal activities</p>
      <p>Sending spam, bulk, or unsolicited emails</p>
      <p>Promoting harmful, abusive, or misleading content</p>
      <p>Using Smail for 18+ or adult content distribution</p>
      <p>Linking or promoting harmful or unsafe websites</p>

      <h2>6. Account Suspension & Deletion</h2>
      <p>
        We reserve the right to take action without prior notice if:
      </p>
      <p>Your account receives multiple reports</p>
      <p>You are involved in spam or harmful activities</p>
      <p>You violate any of these Terms</p>

      <p><strong>Actions may include:</strong></p>
      <p>Temporary suspension</p>
      <p>Permanent deletion of your account and all associated emails</p>
      <p>Use Smail safely and responsibly.</p>

      <h2>7. Spam & Security Notice</h2>
      <p>
        Currently, Smail may not include advanced spam filters.
      </p>
      <p>You may receive unwanted or spam emails.</p>
      <p>
        Please be cautious while opening emails or clicking links.
      </p>
      <p>
        Do not share sensitive information through unknown emails.
      </p>
      <p>
        We recommend using Smail carefully until full security systems are implemented.
      </p>

      <h2>8. Data Loss Disclaimer</h2>
      <p>
        We do not guarantee permanent storage of your emails or data.
      </p>
      <p>
        Data may be lost due to system failures or updates.
      </p>
      <p>
        Users are advised not to rely on Smail for critical or important data storage.
      </p>

      <h2>9. Updates to Terms</h2>
      <p>We may update these Terms at any time.</p>
      <p>
        Continued use of Smail after updates means you accept the new Terms.
      </p>
      <p>
        Users are encouraged to review Terms regularly.
      </p>

      <h2>10. Termination of Service</h2>
      <p>We reserve the right to:</p>
      <p>Stop or shut down Smail at any time</p>
      <p>Modify or remove features without notice</p>
      <p>
        We are not liable for any consequences of such actions.
      </p>

      <h2>11. Limitation of Liability</h2>
      <p>To the maximum extent permitted by law:</p>
      <p>Smail is provided "as is" without warranties</p>
      <p>We are not responsible for any direct or indirect damages</p>
      <p>
        This includes data loss, service interruptions, or misuse
      </p>

      <h2>12. User Consent</h2>
      <p>By creating an account, you clearly agree that:</p>
      <p>Your data will be stored and may be accessed by us</p>
      <p>The service may stop at any time</p>
      <p>Your account can be deleted if rules are violated</p>
      <p>You use Smail at your own risk</p>

      <h2>13. Contact</h2>
      <p>
        For any queries or support, contact: [Add Contact Email]
      </p>

      <h2>Final Note</h2>
      <p>
        Smail is built with the goal of providing a simple and independent email 
        platform. While we aim for long-term service, users must understand the 
        risks involved and use the platform responsibly.
      </p>

      <p><strong>End of Terms & Conditions</strong></p>

    </div>
    </div>
    <div className="UIAFooter" >
          {!toggle && 
          <p className="woring" >
            if you want Smail Read T&C agree & continue 
          </p>
          }
          <button className="TCbtn" onClick={Agree}>
            Agree 
          </button> 
          <div className="UIBRbtn">
            {/*  <input
              ref={checkRef}
              id="checkBox"
              type="checkBox"
              name="confirmation"
              /> */}
              <input
  id="checkBox"
  type="checkbox"
  name="confirmation"
  checked={checked}
  onChange={(e) => setChecked(e.target.checked)}
/>
              <label htmlFor="checkBox" >I Agree 
              </label>
            </div>
        </div>
  </div>
  );
};

export default TermsAndConditions ;
