import React from 'react'
import aboutMe from '../assets/img/aboutMe.png'
import knowCode from '../assets/img/knowCode.png'
import graduate from '../assets/img/graduate.png'
import goCollege from '../assets/img/goCollege.png'

const About = () => {
  return (
    <div className = "about">
      <div className = "container">
        <div className = "aboutMe">
          <div className = "imgAboutMe">
            <img src = { aboutMe } alt = ""/>
          </div>
          <h1>Xin chào, mình là Đoàn Văn Phước, mình đam mê <br></br> 
          Công Nghệ Thông Tin và mình code rất nhiều.</h1>
        </div>
        <div className = "knowCode">
          <div className = "imgKnowCode">
            <img src = { knowCode } alt = ""/>
          </div>
          <h1>Thời điểm học cấp 2, mình đã biết đến lập trình <br></br> khá tình cờ,
          khoảnh khắc đó mình đã quyết <br></br> định sẽ theo đuổi ngành Công Nghệ Thông Tin.</h1>
        </div>
        <div className = "graduate">
          <div className = "imgGraduate">
            <img src = { graduate } alt = ""/>
          </div>
          <h1>Và rồi ngày này cũng tới, mùa thi kết thúc thời 
          học <br></br> sinh, mình đã cố gắng hết sức và tốt nghiệp,
          thời học <br></br> sinh đã khép lại, nhường chỗ cho thời sinh viên.</h1>
        </div>
        <div className = "goCollege">
          <div className = "imgGoCollege">
            <img src = { goCollege } alt = ""/>
          </div>
          <h1>Đến với đại học, mình đã gặp nhiều điều mới mẻ,<br></br> nhiều những
          người bạn mới và đặc biệt nhất là <br></br> những bài học đầu tiên về 
          Công Nghệ Thông Tin.</h1>
        </div>
      </div>
    </div>
  )
}

export default About