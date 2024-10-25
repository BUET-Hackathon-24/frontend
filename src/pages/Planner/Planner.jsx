import Map from './Map';
import Steps from './Steps';

const Planner = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className="flex-1">
        <Map />
      </div>
      <div className="w-1/2 h-full overflow-y-auto p-6 border-l">
        <Steps />
      </div>
    </div>
  )
}

export default Planner;