
import Map from './Map';
import Steps from './Steps';
const Planner = () => {
  return (
    <div className='flex flex-row items-center justify-between h-screen'>
    <div>
      <Map />
    </div>
    <div className='self-start'>
    <Steps />
    </div>
    </div>
  )
}

export default Planner
