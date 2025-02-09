import { useState } from "react";
import Select from "react-select";

export default function TrainManagement() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    origin: null,
    destination: null,
    departureDate: "",
    passengers: "",
    train: null,
    coach: null,
    seats: [],
    name: "",
    email: "",
    phone: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const stations = [
    { value: "NYC", label: "New York" },
    { value: "CHI", label: "Chicago" },
    { value: "SF", label: "San Francisco" },
    { value: "LA", label: "Los Angeles" },
  ];

  const availableTrains = [
    { value: "Express 101", label: "Express 101 - $50", price: 50 },
    { value: "Fast Rail 202", label: "Fast Rail 202 - $40", price: 40 },
    { value: "Night Express 303", label: "Night Express 303 - $60", price: 60 },
  ];

  const totalPrice = formData.train ? formData.train.price * formData.passengers : 0;

  const coaches = [
    { value: "A1", label: "Coach A1" },
    { value: "B2", label: "Coach B2" },
    { value: "C3", label: "Coach C3" },
  ];

  const seats = Array.from({ length: 20 }, (_, i) => i + 1);
  const bookedSeats = [5, 12, 20, 33]; // Example booked seats

  const filteredDestinations = stations.filter(
    (station) => !formData.origin || station.value !== formData.origin.value
  );

  const handleSeatSelection = (seat) => {
    if (formData.seats.includes(seat)) {
      setFormData({ ...formData, seats: formData.seats.filter((s) => s !== seat) });
    } else if (formData.seats.length < formData.passengers) {
      setFormData({ ...formData, seats: [...formData.seats, seat] });
    }
  };


  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center text-gray-800">
        🚆 Train Management System
      </h1>

        {/* Step 1: Journey Selection */}
        {step === 1 && (
            <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                <h2 className="text-lg font-semibold">Step 1: Select Your Journey</h2>
                <div className="grid grid-cols-2 gap-4">
                <Select
                    options={stations}
                    placeholder="Select Origin"
                    value={formData.origin}
                    onChange={(selected) =>
                    setFormData({
                        ...formData,
                        origin: selected,
                        destination:
                        formData.destination?.value === selected?.value
                            ? null
                            : formData.destination,
                    })
                    }
                    className="w-full"
                />
                <Select
                    options={filteredDestinations}
                    placeholder="Select Destination"
                    value={formData.destination}
                    onChange={(selected) =>
                    setFormData({ ...formData, destination: selected })
                    }
                    isDisabled={!formData.origin}
                    className="w-full"
                />
                </div>
                <input
                type="date"
                className="p-3 border rounded-lg w-full"
                value={formData.departureDate}
                onChange={(e) =>
                    setFormData({ ...formData, departureDate: e.target.value })
                }
                />
                <input
                type="number"
                min="1"
                max="6"
                className="p-3 border rounded-lg w-full"
                value={formData.passengers}
                onChange={(e) =>
                    setFormData({ ...formData, passengers: Math.max(1, Math.min(6, e.target.value)) })
                }
                placeholder="Number of Passengers (Max 6)"
                />
                <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full"
                onClick={nextStep}
                disabled={!formData.origin || !formData.destination || !formData.departureDate}
                >
                Next: Choose Train
                </button>
            </div>
        )}

      {/* Step 2: Train Selection with Arrival Time */}
      {step === 2 && (
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <h2 className="text-lg font-semibold">Step 2: Select Train</h2>
          <div className="space-y-3">
            {availableTrains.map((train) => (
              <div
                key={train.value}
                className={`p-4 border rounded-lg flex justify-between items-center ${
                  formData.train?.value === train.value ? "border-blue-500 bg-blue-100" : ""
                }`}
                onClick={() => setFormData({ ...formData, train })}
              >
                <span className="font-semibold">{train.label}</span>
                <span className="text-gray-600">Arrives at {train.arrival}</span>
              </div>
            ))}
          </div>
          {formData.train && (
            <p className="text-green-600 font-semibold">
              Ticket Price: ${formData.train.price} per person
            </p>
          )}
          <div className="flex justify-between">
            <button className="bg-gray-500 text-white px-4 py-2 rounded-lg" onClick={prevStep}>
              Back
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              onClick={nextStep}
              disabled={!formData.train}
            >
              Next: Choose Coach
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Coach Selection */}
      {step === 3 && (
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <h2 className="text-lg font-semibold">Step 3: Select Coach</h2>
          <Select
            options={coaches}
            placeholder="Select Coach"
            value={formData.coach}
            onChange={(selected) => setFormData({ ...formData, coach: selected })}
            className="w-full"
          />
          <div className="flex justify-between">
            <button className="bg-gray-500 text-white px-4 py-2 rounded-lg" onClick={prevStep}>
              Back
            </button>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg" onClick={nextStep} disabled={!formData.coach}>
              Next: Choose Seat
            </button>
          </div>
        </div>
      )}

        {/* Step 4: Seat Selection */}
        {step === 4 && (
            <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                <h2 className="text-lg font-semibold">
                Step 4: Select Your Seats ({formData.passengers} required)
                </h2>
                <div className="grid grid-cols-5 gap-3">
                {seats.map((seat) => (
                    <button
                    key={seat}
                    className={`w-12 h-12 rounded-lg text-white font-bold ${
                        bookedSeats.includes(seat)
                        ? "bg-red-500 cursor-not-allowed"
                        : formData.seats.includes(seat)
                        ? "bg-blue-500"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                    disabled={bookedSeats.includes(seat)}
                    onClick={() => handleSeatSelection(seat)}
                    >
                    {seat}
                    </button>
                ))}
                </div>
                <p className="text-gray-600 text-sm">
                    Selected seats: {formData.seats.join(", ") || "None"}
                </p>
                <div className="flex justify-between"> 

                    <button className="bg-gray-500 text-white px-4 py-2 rounded-lg" onClick={prevStep}>
                Back
                    </button>
                    <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                    onClick={nextStep}
                    disabled={formData.seats.length !== formData.passengers}
                    >
                    Next: Passenger Info
                    </button>
                </div>


            </div>
        )}

        {/* Step 5: Passenger Info */}
        {step === 5 && (
            <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                <h2 className="text-lg font-semibold">Step 5: Passenger Information</h2>
                {formData.seats.map((seat, index) => (
                <div key={index} className="space-y-2 p-3 border rounded-lg">
                    <h3 className="font-medium text-gray-700">Passenger {index + 1} (Seat {seat})</h3>
                    <input type="text" placeholder="Full Name" className="p-2 border rounded-lg w-full" />
                    <input type="email" placeholder="Email" className="p-2 border rounded-lg w-full" />
                    <input type="tel" placeholder="Phone Number" className="p-2 border rounded-lg w-full" />
                </div>
                ))}
                <div className="flex justify-between"> 
                    <button className="bg-gray-500 text-white px-4 py-2 rounded-lg" onClick={prevStep}>
                        Back
                    </button>
                    <button 
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                        onClick={nextStep}
                    >
                        Confirm Booking 
                    </button>
                </div>


            </div>
        )}

        {step === 6 && (
            <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <h2 className="text-lg font-semibold">Step 6: Booking Summary</h2>
            <p>🚆 Train: {formData.train?.label}</p>
            <p>📍 Origin: {formData.origin?.label} → {formData.destination?.label}</p>
            <p>📅 Departure: {formData.departureDate}</p>
            <p>🪑 Coach: {formData.coach?.label}, Seat: {formData.seats.join(", ")}</p>
            <p className="text-green-600 font-bold">💰 Total Price: ${totalPrice}</p>
            <div className="flex justify-between"> 
                <button className="bg-gray-500 text-white px-4 py-2 rounded-lg" onClick={prevStep}>
                    Back
                </button>
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                    onClick={nextStep}
                >
                    Make Payment
                </button>
            </div>
            </div>
        )}

        {/* Step 6: Payment */}
            {step === 7 && (
                <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                    <h2 className="text-lg font-semibold">Step 6: Payment Details</h2>
                    <p className="text-gray-600">Total Amount: <span className="font-bold text-green-600">$120.00</span></p>

                    <input
                    type="text"
                    placeholder="Card Number"
                    className="p-2 border rounded-lg w-full"
                    value={formData.cardNumber}
                    onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                    />
                    <div className="grid grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="MM/YY"
                        className="p-2 border rounded-lg w-full"
                        value={formData.expiryDate}
                        onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="CVV"
                        className="p-2 border rounded-lg w-full"
                        value={formData.cvv}
                        onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                    />
                    </div>

                    <button
                    className="bg-green-500 text-white px-4 py-2 rounded-lg w-full"
                    disabled={!formData.cardNumber || !formData.expiryDate || !formData.cvv}
                    onClick={() => alert("Payment Successful! 🎉")}
                    >
                    Pay Now
                    </button>
                </div>
            )}

        {/* Navigation Buttons
            <div className="flex justify-between">
                {step > 1 && (
                    <button
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                    onClick={prevStep}
                    >
                    Back
                    </button>
                )}
            </div> */}
    </div>
  );
}
