import React, { useRef } from 'react'
import emailjs from '@emailjs/browser'
import location from '../assets/img/location.png'
import email from '../assets/img/email.png'
import phone from '../assets/img/phone.png'

export const Contact = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm('service_piogrhm', 'template_shih5ou', form.current, {
        publicKey: '76zEpH9TyConkvOg3',
      })
      .then(
        () => {
          console.log("Gửi thành công!");
        },
        ( error ) => {
          console.log("Lỗi", error.text);
        },
      );
  };
  return (
    <div className = "contact">
      <div class = "container">
        <div class = "form">
          <div class = "contact-info">
            <h3 class = "title">Liên Hệ Với Tôi</h3>
            <p class = "text">
              Nếu bạn có vấn đề cần giải quyết hoặc có câu hỏi muốn hỏi tôi,
              hãy liên hệ với tôi.
            </p>

            <div class = "info">
              <div class = "information">
                <img src = { location } class="icon" alt="" />
                <p>Ho Chi Minh City</p>
              </div>
              <div class = "information">
                <img src = { email } class="icon" alt="" />
                <p>vanphuoc240904@gmail.com</p>
              </div>
              <div class = "information">
                <img src = { phone } class="icon" alt="" />
                <p>+84 853 404407</p>
              </div>
            </div>

            <div class = "social-media">
              <p>Liên Hệ Với Tôi :</p>
              <div class = "social-icons">
                <a href = "https://www.facebook.com/vphuoc.04/">
                  <i class = "fab fa-facebook-f"></i>
                </a>
                <a href = "https://www.youtube.com/@vphuoc.04">
                  <i class = "fa-brands fa-youtube"></i>
                </a>
                <a href = "https://github.com/vphuoc-04">
                  <i class = "fa-brands fa-github"></i>
                </a>
                <a href = "https://www.linkedin.com/in/vphuoc/">
                  <i class = "fab fa-linkedin-in"></i>
                </a>
              </div>
            </div>
          </div>

          <div class = "contact-form">
            <form ref = { form } onSubmit = { sendEmail }>
              <h3 class = "title">Kết Nối</h3>
              <div class = "input-container">
                <input 
                  type = "text" 
                  name = "username" 
                  class = "input" 
                  placeholder = "Username"
                />
              </div>
              <div class = "input-container">
                <input 
                  type = "email" 
                  name = "email" 
                  class = "input"
                  placeholder = "Email"
                />

              </div>
              <div class = "input-container">
                <input 
                  type = "tel" 
                  name = "phone" 
                  class = "input" 
                  placeholder = "Phone"
                />
                
              </div>
              <div class = "input-container textarea">
                <textarea 
                  placeholder = "Message"
                  name = "message" 
                  class = "input">
                </textarea>
              </div>
              <input type = "submit" value = "Gửi" class = "btn" />
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact