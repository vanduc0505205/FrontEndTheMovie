import ContentContact from "@/components/Contact/ContentContact"
import Hero from "@/components/Contact/Hero"
import { useEffect } from "react";


const Contact = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
    return (
        <div className="min-h-screen bg-background font-['Archivo']">
            <Hero/>
            <ContentContact/>
        </div>
  )
}

export default Contact