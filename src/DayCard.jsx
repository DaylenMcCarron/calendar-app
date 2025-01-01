import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdOutlineFitnessCenter, MdOutlineArrowBack } from "react-icons/md";
import GoalCard from "./GoalCard";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import debounce from 'lodash.debounce'; // Import debounce

const DayCard = () => {
  const { date } = useParams();
  const navigate = useNavigate();
  const [productivity, setProductivity] = useState("gray");
  const [expense, setExpense] = useState(0);
  const [income, setIncome] = useState(0);
  const [gym, setGym] = useState(false);
  const [showGoalCard, setShowGoalCard] = useState(false);
  const [monthExpenses, setMonthExpenses] = useState(0);
  const [yearIncome, setYearIncome] = useState(0);
  const [dayNote, setDayNote] = useState("");

  const updateDayNote = useCallback(
    debounce(async (newNote) => {
      const dayRef = doc(db, "calendarDays", `2025-${date.replace('-', '-')}`);
      await updateDoc(dayRef, { dayNote: newNote });
    }, 500), // Adjust the delay (milliseconds) as needed
    [date]
  );

  const handleDayNoteChange = (e) => {
    setDayNote(e.target.value);
    updateDayNote(e.target.value); // Call the debounced function
  };

  // Function to format the date as "Jan 1"
  const formatDate = (dateString) => {
    const [month, day] = dateString.split("-");
    const monthIndex = parseInt(month) - 1;
    if (isNaN(monthIndex) || monthIndex < 0 || monthIndex > 11) {
      console.error("Invalid month:", month);
      return "Invalid Date";
    }
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${monthNames[monthIndex]} ${parseInt(day)}`;
  };

  // Fetch day data from Firebase on load
  useEffect(() => {
    const fetchDayData = async () => {
      const dayRef = doc(db, "calendarDays", `2025-${date.replace('-', '-')}`);
      const daySnap = await getDoc(dayRef);

      if (daySnap.exists()) {
        const data = daySnap.data();
        setProductivity(data.productivity || "gray");
        setExpense(data.expense || 0);
        setIncome(data.income || 0);
        setGym(data.gym || false);
        setDayNote(data.dayNote || "");
      } else {
        // Initialize day in Firebase if not existing
        await setDoc(dayRef, {
          productivity: "gray",
          expense: 0,
          income: 0,
          gym: false,
          dayNote: "",
        });
      }
    };

    fetchDayData();
  }, [date]);

  // Save day data to Firebase on updates
  const updateDayData = async (field, value) => {
    const dayRef = doc(db, "calendarDays", `2025-${date.replace('-', '-')}`);
    const updatedData = { [field]: value };
    await updateDoc(dayRef, updatedData);

    if (field === "productivity") setProductivity(value);
    if (field === "expense") setExpense(value);
    if (field === "income") setIncome(value);
    if (field === "gym") setGym(value);
    if (field === "dayNote") setDayNote(value);
  };

  return (
    <div className="max-w-md sm:max-w-lg md:max-w-xl mx-auto bg-yellow-50 shadow-md rounded-md p-4 sm:p-6 md:p-8 relative font-Cedarville">
      <button
        className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-transparent hover:bg-gray-100 rounded-full p-2 transition-colors duration-200"
        onClick={() => navigate("/")}
      >
        <MdOutlineArrowBack className="text-gray-700 text-lg sm:text-xl md:text-2xl" />
      </button>

      <div className="text-center mb-4 sm:mb-6 md:mb-8 border-b pb-2 sm:pb-3">
        <div className="text-xl sm:text-2xl font-normal text-gray-700">2025</div>
        <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800">{formatDate(date)}</div>
      </div>

      <div className="mb-4 sm:mb-6 md:mb-8">
        <textarea
          className="w-full h-48 sm:h-64 p-2 sm:p-3 md:p-4 bg-yellow-50 border-none focus:ring-0 resize-none font- Cedarville text-xl sm:text-2xl md:text-3xl font-semibold text-blue-700"
          placeholder="💭 What did I do..."
          value={dayNote}
          spellCheck="false"
          onChange={handleDayNoteChange} // Use the new handler
        />
      </div>

      <div className="mb-6 sm:mb-8">
        <div className="font-medium text-gray-700 mb-2 sm:mb-3 text-lg sm:text-xl">Productivity Level</div>
        <div className="flex justify-around items-center">
          <button
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full hover:scale-125 transition-transform duration-200 flex items-center justify-center ${productivity === 'bg-red-400' ? 'bg-red-400 shadow-inner' : 'border-2 border-red-400'}`}
            onClick={() => updateDayData("productivity", "bg-red-400")}
          >
            {productivity === 'bg-red-400' && <span className="text-white text-xs sm:text-sm"></span>}
          </button>
          <button
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full hover:scale-125 transition-transform duration-200 flex items-center justify-center ${productivity === 'bg-slate-300' ? 'bg-slate-300 shadow-inner' : 'border-2 border-slate-300'}`}
            onClick={() => updateDayData("productivity", "bg-slate-300")}
          >
            {productivity === 'bg-slate-300' && <span className="text-gray-700 text-xs sm:text-sm"></span>}
          </button>
          <button
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full hover:scale-125 transition-transform duration-200 flex items-center justify-center ${productivity === 'bg-green-300' ? 'bg-green-300 shadow-inner' : 'border-2 border-green-300'}`}
            onClick={() => updateDayData("productivity", "bg-green-300")}
          >
            {productivity === 'bg-green-300' && <span className="text-white text-xs sm:text-sm"></span>}
          </button>
          <button
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full hover:scale-125 transition-transform duration-200 flex items-center justify-center ${productivity === 'bg-green-500' ? 'bg-green-500 shadow-inner' : 'border-2 border-green-500'}`}
            onClick={() => updateDayData("productivity", "bg-green-500")}
          >
            {productivity === 'bg-green-500' && <span className="text-white text-xs sm:text-sm"></span>}
          </button>
        </div>
        <div className="w-full h-px bg-gray-300 mt-3 sm:mt-4"></div>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 sm:mb-8">
        <div>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center text-gray-500 text-sm sm:text-base">₹</span>
            <input
              type="number"
              value={expense}
              onChange={(e) =>
                updateDayData("expense", Number(e.target.value))
              }
              placeholder="Expense"
              className="w-full py-1 sm:py-2 px-2 sm:px-3 pl-6 border rounded-md focus:ring focus:ring-blue-200 focus:border-blue-300 text-gray-700 text-center bg-red-100 text-sm sm:text-base"
            />
          </div>
        </div>
        <div>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center text-gray-500 text-sm sm:text-base">₹</span>
            <input
              type="number"
              value={income}
              onChange={(e) =>
                updateDayData("income", Number(e.target.value))
              }
              placeholder="Income"
              className="w-full py-1 sm:py-2 px-2 sm:px-3 pl-6 border rounded-md focus:ring focus:ring-blue-200 focus:border-blue-300 text-gray-700 text-center bg-green-100 text-sm sm:text-base"
            />
          </div>
        </div>
        <button
          className={`flex flex-col items-center justify-center p-1 sm:p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200 focus:border-blue-300 text-gray-700 ${gym ? 'bg-blue-500 text-white' : 'bg-gray-100'} text-sm sm:text-base`}
          onClick={() => updateDayData("gym", !gym)}
        >
          {gym ? <MdOutlineFitnessCenter className="inline-block text-lg sm:text-xl" /> : '🏋️'}
        </button>
      </div>

      <button
        className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-transparent hover:scale-125 text-gray-600 font-bold scale-100  rounded focus:outline-none focus:shadow-outline transition-transform duration-200 text-lg sm:text-xl"
        onClick={() => setShowGoalCard(true)}
      >
        📌
      </button>

      {showGoalCard && <GoalCard onClose={() => setShowGoalCard(false)} />}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Cedarville+Cursive&display=swap');
          .font-Cedarville {
            font-family: 'Cedarville Cursive', cursive;
          }
        `}
      </style>
    </div>
  );
};

export default DayCard;