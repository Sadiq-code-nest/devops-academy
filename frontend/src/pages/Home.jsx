import Navbar     from '../components/Navbar';
import Hero       from '../components/Hero';
import Outcomes   from '../components/Outcomes';
import Curriculum from '../components/Curriculum';
import Workflow   from '../components/Workflow';
import Projects   from '../components/Projects';
import Instructor from '../components/Instructor';
import Reviews    from '../components/Reviews';
import Pricing    from '../components/Pricing';
import Footer     from '../components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Outcomes />
      <Curriculum />
      <Workflow />
      <Projects />
      <Instructor />
      <Reviews />
      <Pricing />
      <Footer />
      <a href="#pricing" className="sticky-cta" id="stickyCta">
        <span>Enroll Now</span>
        <span className="sticky-arrow">→</span>
      </a>
    </>
  );
}
