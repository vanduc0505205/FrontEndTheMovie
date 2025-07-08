import { milestones } from "@/config";

const JourneyFar = () => {
  return (
    <section className="bg-primary-background py-20">
            <div className="container mx-auto px-6">
              <h2 className="text-4xl lg:text-6xl font-bold text-primary-green-400 mb-16">
                Hành trình vươn xa
              </h2>

              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row border-t mb-5 border-primary-green-200 py-6 gap-6"
                >
                  <div className="flex items-center gap-4 w-full md:w-1/3 mb-4 md:mb-0">
                    <img
                      src={milestone.image}
                      alt={`Mốc ${index + 1}`}
                      className="w-14 h-14"
                    />
                    <h3
                      className={`text-4xl font-bold ${
                        index === 0
                          ? "text-primary-green-200"
                          : "text-primary-green-400"
                      }`}
                    >
                      {milestone.title}
                    </h3>
                  </div>
                  <div className="w-full md:w-1/4 lg:w-1/5 px-4 flex items-center">
                    <p
                      className={`text-2xl font-semibold ${
                        index === 0
                          ? "text-primary-green-200"
                          : "text-primary-green-400"
                      }`}
                    >
                      {milestone.subtitle}
                    </p>
                  </div>
                  <div
                    className={`w-full md:flex-1  text-lg px-4 ${
                      index === 0
                        ? "text-primary-green-200"
                        : "text-primary-green-400"
                    }`}
                  >
                    {milestone.description}
                  </div>
                </div>
              ))}
            </div>
          </section>
  )
}

export default JourneyFar