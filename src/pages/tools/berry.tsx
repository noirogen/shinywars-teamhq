import BerrySelector from "../../components/BerrySelector"
import BerryTracker from "../../components/BerryTracker"

export default function BerryAssistant() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Berry Farming Assistant</h2>
	    <BerryTracker />
	    <BerrySelector />
    </div>
  );
}