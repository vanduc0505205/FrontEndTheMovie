import React from 'react'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import AboutUsImage3 from "@/assets/images/about-us/about-us-image-3.png";
import { accordionData } from "@/config";

const ProjectSoul = () => {
  return (
    <div className='bg-primary-background'>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 py-20  container">
                <div className="w-full h-[580px] rounded-sm overflow-hidden">
                  <img
                    src={AboutUsImage3}
                    alt="Farmer harvesting"
                    className="w-full h-full object-cover "
                  />
                </div>
    
                <div className="">
                  <p className="text-primary-green-300 lg:text-3xl font-semibold mb-2">
                    Con người - Linh hồn của dự án
                  </p>
                  <h2 className="text-primary-green-400 main-title mb-4 leading-tight">
                    Những người gieo mầm tương lai
                  </h2>
    
                  <Accordion
                    type="single"
                    collapsible
                    className="w-full space-y-4"
                    defaultValue="item-0"
                  >
                    {accordionData.map((item, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger
                          className={cn(
                            "px-4 text-2xl font-semibold text-left text-primary-green-400",
                            "data-[state=open]:text-primary-green-200" // màu mới cho tiêu đề khi mở
                          )}
                        >
                          {item.title}
                        </AccordionTrigger>
                        <AccordionContent className="px-4 lg:text-lg text-primary-green-400 leading-relaxed">
                          {item.content}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </div></div>
  )
}

export default ProjectSoul