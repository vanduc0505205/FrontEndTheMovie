
import Hero from '@/components/LandingPage/Hero'
import FarmingMethod from '@/components/OperatingModel/FarmingMethod'
import Last from '@/components/OperatingModel/Last'
import RealImage from '@/components/OperatingModel/RealImage'
import ReplicationModel from '@/components/OperatingModel/ReplicationModel'

const OperatingModel = () => {
  return (
    <div className='bg-primary-background'>
        <Hero/>
        <FarmingMethod/>
        <ReplicationModel/>
        <RealImage/>
        <Last/>
    </div>
  )
}

export default OperatingModel