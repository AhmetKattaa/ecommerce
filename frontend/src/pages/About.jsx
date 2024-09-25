import USPSection from './../components/about/USPSection';
import TargetAudience from './../components/about/TargetAudience';
import PainPoints from './../components/about/PainPoints';
import Features from './../components/about/Features';
import Objections from './../components/about/Objections';

const About = () => {
  return (
    <div className="container my-5">
      <h1 className="text-center mb-4" style={{color:"#198754"}}>.About <span style={{color:"#AA1F23"}}>PriFa</span>  Coffee.</h1>
      <img style={{maxWidth:"100%"}} src="https://prifacoffee.com/wp-content/uploads/2024/09/ALL-PHOTO-FOR-LANDING-PAGES-1-2048x701.png" alt="" />
      <p className="text-center text-muted mb-5">
        PriFa Coffee Tablets offer a revolutionary and convenient way to enjoy coffee. 
        Whether you are on a hike, in the office, or simply in need of a quick caffeine 
        boost, PriFa Coffee is your perfect companion.
      </p>
      <USPSection />
      <TargetAudience />
      <PainPoints />
      <Features />
      <Objections />
    </div>
  );
};

export default About;
