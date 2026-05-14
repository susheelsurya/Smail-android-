import React, { useState, useContext } from 'react';
import { store } from "./AllPages.js";
import { ArrowLeft, MessageSquare, HelpCircle, ChevronDown, Send, Mail } from "lucide-react";

const HelpAndFeedback = () => {
    const { changePage , triggerAlert, setIsLoading } = useContext(store);
    const [openFaq, setOpenFaq] = useState(null);
    const [feedback, setFeedback] = useState("");

    const faqs = [
        {
            q: "How to schedule a Smail?",
            a: "Go to 'Compose', write your message, and click the 'Clock' icon to set your preferred time."
        },
        {
            q: "Where can I see deleted mails?",
            a: "All deleted mails are moved to the 'Bin' folder. You can restore them or delete them permanently from there."
        },
        {
            q: "How to create custom labels?",
            a: "Open the sidebar, click on 'Add Label', enter a name, and your new category is ready to use."
        }
    ];

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const handleFeedbackSubmit = () => {
        if (!feedback.trim()) return triggerAlert("Please write something first!");
        
        setIsLoading(true);
        // Simulate an API call
        setTimeout(() => {
            setIsLoading(false);
            triggerAlert("Thank you! Feedback sent. ✨");
            setFeedback("");
        }, 1500);
    };

    return (
        <div className="HelpPage App">
            <div className="UIAHeader">
                <button className="tpbtn" onClick={() => changePage("ProfilePage")}>
                    <ArrowLeft />
                </button>
                <h1>Help & Support</h1>
                <div style={{ width: 40 }}></div> {/* Spacer for symmetry */}
            </div>

            <div className="UIAContent scrollable">
                <div className="help-container">
                    
                    {/* FAQ Section */}
                    <div className="section-title">
                        <HelpCircle size={18} /> <h2>Common Questions</h2>
                    </div>
                    
                    <div className="faq-list">
                        {faqs.map((faq, index) => (
                            <div 
                                key={index} 
                                className={`faq-card ${openFaq === index ? 'active' : ''}`}
                                onClick={() => toggleFaq(index)}
                            >
                                <div className="faq-question">
                                    <span>{faq.q}</span>
                                    <ChevronDown size={18} className="arrow" />
                                </div>
                                {openFaq === index && <div className="faq-answer">{faq.a}</div>}
                            </div>
                        ))}
                    </div>

                    <hr className="neo-divider" />

                    {/* Feedback Section */}
                    <div className="section-title">
                        <MessageSquare size={18} /> <h2>Send Feedback</h2>
                    </div>

                    <div className="feedback-box">
                        <textarea 
                            placeholder="Tell us what we can improve..."
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                        />
                        <button className="neo-send-btn" onClick={handleFeedbackSubmit}>
                            <Send size={16} /> Send Feedback
                        </button>
                    </div>

                    {/* Contact Info */}
                    <div className="contact-card">
                        <Mail size={20} />
                        <div>
                            <h4>Need more help?</h4>
                            <p>Smails@smails.in</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default HelpAndFeedback;
